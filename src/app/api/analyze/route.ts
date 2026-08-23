import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

import { createLLMClient, LLMClient, LLMResponse } from '@/lib/llm-client';
import { PRODUCTION_SYSTEM_PROMPT } from '@/lib/prompts/production-prompt';
import { MODEL_PRESETS, ThinkingLevel } from '@/lib/model-presets';
import { PASS_SCHEMAS } from '@/lib/passSchemas';
import {
  buildMlrPlan,
  describeMlrPlan,
  enforceMlrPlan,
  needsStandingSupports,
  type AnchorActivity,
} from '@/lib/mlrSelection';
import { extractLessonTargets } from '@/lib/learningTargets';
import { describeCalibration, calibrationFingerprint } from '@/lib/widaCalibration';
import { selectionFingerprint } from '@/lib/mlrSelection';
import {
  PIPELINE_VERSION,
  lessonCacheKey,
  readCachedLesson,
  writeCachedLesson,
  isCacheEnabled,
  cacheKeyBasis,
} from '@/lib/lessonCache';
import { telemetry } from '@/lib/telemetry';
import {
  LessonData,
  MlrRef,
  ActivityTeacherMove,
  SentenceFrame,
  DoNotRemoveItem,
  ProficiencyAdaptation,
  DecisionScenario,
} from '@/lib/types';
import { isValidMlrNumber, MLRS, MlrNumber } from '@/lib/mlrs';
import { isValidELSFGuidelineNumber, ELSFGuidelineNumber } from '@/lib/elsf';

// Two-pass generation needs more than the default 300s. Vercel Pro allows up
// to 800s on serverless functions; 600s leaves headroom for two ~240s Anthropic
// calls plus pdf-parse, normalization, and the error path.
export const maxDuration = 300;

const MAX_PDF_CHARS = 12000;

/**
 * Register for the learner profile — the Discourse / Sentence / Word-Phrase
 * chart a teacher reads beside the move. The lookup it replaces read like a
 * spec: "states one fact about a mathematical object at a time", sitting
 * directly beneath guidance that named blue cubes.
 */
const LEARNER_PROFILE_REGISTER = `LEARNER PROFILE — REGISTER.

Write each learner_profile entry in the language of THIS lesson. "Names one category ('blue') without pairing it with the count" belongs here; "states one fact about a mathematical object at a time" does not — that would read the same in any lesson.

Describe what the student DOES and what they are reaching for next. Never what they lack, fail to do, or cannot manage. A student at an early band is not a student with something missing; they are a student doing real mathematical thinking with the language they currently have.

Use no coercive or mechanical verbs. A frame is offered, not forced. A teacher invites, notices, and makes room; a student produces, tries, and reaches. Do not write that anything is elicited from, extracted from, drilled into, or required of a student.

The teacher reading this is deciding how to respond to a person. Write it so it honours that.`;

function extractJSON(text: string): string {
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();
  let depth = 0;
  let start = -1;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{') {
      if (start === -1) start = i;
      depth++;
    } else if (text[i] === '}') {
      depth--;
      if (depth === 0 && start !== -1) return text.slice(start, i + 1);
    }
  }
  return text.trim();
}

function normalizeMlr(raw: unknown): MlrRef | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const r = raw as { number?: unknown; name?: unknown };
  if (!isValidMlrNumber(r.number)) return undefined;
  const number = r.number as MlrNumber;
  return { number, name: typeof r.name === 'string' && r.name ? r.name : MLRS[number].name };
}

function normalizeTextItem(raw: unknown, textKey: string): { text: string; mlr?: MlrRef } | null {
  if (typeof raw === 'string') return { text: raw };
  if (raw && typeof raw === 'object') {
    const r = raw as Record<string, unknown>;
    const text = r[textKey];
    if (typeof text !== 'string') return null;
    const mlr = normalizeMlr(r.mlr);
    return mlr ? { text, mlr } : { text };
  }
  return null;
}

function normalizeTeacherMoves(raw: unknown): ActivityTeacherMove[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => normalizeTextItem(item, 'text'))
    .filter((x): x is { text: string; mlr?: MlrRef } => x !== null)
    .map((x) => ({ text: x.text, ...(x.mlr ? { mlr: x.mlr } : {}) }));
}

function normalizeFrames(raw: unknown): SentenceFrame[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (typeof item === 'string') return { frame: item };
      if (item && typeof item === 'object') {
        const r = item as Record<string, unknown>;
        const frame = typeof r.frame === 'string' ? r.frame : null;
        if (!frame) return null;
        const mlr = normalizeMlr(r.mlr);
        return mlr ? { frame, mlr } : { frame };
      }
      return null;
    })
    .filter((x): x is SentenceFrame => x !== null);
}

function normalizeDoNotRemove(raw: unknown): DoNotRemoveItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => normalizeTextItem(item, 'text'))
    .filter((x): x is { text: string; mlr?: MlrRef } => x !== null)
    .map((x) => ({ text: x.text, ...(x.mlr ? { mlr: x.mlr } : {}) }));
}

// Accepts both ELSF (emerging/developing/expanding) and legacy IM/WIDA
// (entering/developing/bridging) labels for proficiency_moves. Returns the
// ELSF-labeled object the schema expects.
function normalizeProficiencyMoves(raw: unknown): unknown {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const emerging = r.emerging ?? r.entering;
  const developing = r.developing;
  const expanding = r.expanding ?? r.bridging;
  if (!emerging && !developing && !expanding) return null;
  return { emerging, developing, expanding };
}

function normalizeELSFGuidelinesApplied(raw: unknown): ELSFGuidelineNumber[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((n): n is ELSFGuidelineNumber => isValidELSFGuidelineNumber(n));
}

// Strict enum validation: if the model emits a string outside the allowed set,
// snap to the fallback. Without this, downstream LOOKUP[invalidValue].field
// throws and crashes the React tree. The fallback is chosen to be safe — the
// least dangerous interpretation if the model misnames the field.
function oneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  if (typeof value === 'string' && (allowed as readonly string[]).includes(value)) {
    return value as T;
  }
  return fallback;
}

const ACTIVITY_FUNCTIONS = ['Setup', 'Crux', 'Application', 'Synthesis'] as const;
const LANGUAGE_DEMANDS = ['low', 'medium', 'high'] as const;
const FRICTION_TYPES = ['math', 'language', 'language-math'] as const;
const PATTERN_TYPES = [
  'on-track',
  'misconception',
  'partial',
  'extension',
  'language-math',
] as const;
const PATTERN_FREQUENCIES = [
  'most students',
  'some students',
  'watch for this',
] as const;
const SCENARIO_TYPES = [
  'common-error',
  'productive-insight',
  'on-track',
  'partial-understanding',
  'productive-struggle',
] as const;

function normalizeProficiency(raw: unknown): ProficiencyAdaptation {
  if (typeof raw === 'string') return { text: raw };
  if (raw && typeof raw === 'object') {
    const r = raw as Record<string, unknown>;
    const text = typeof r.text === 'string' ? r.text : '';
    const mlr = normalizeMlr(r.mlr);
    return mlr ? { text, mlr } : { text };
  }
  return { text: '' };
}

// Pass D emits decision_guide as a FLAT scenarios[] array, each scenario tagging
// its own activity_id. That shape exists because the nested
// activities[] -> scenarios[] form pushed the response schema past the
// Interactions API's complexity ceiling (see src/lib/passSchemas.ts). We re-nest
// here so everything downstream — types, components, saved .dsst files — keeps
// the grouped shape it has always had.
//
// Accepts either shape: already-grouped input passes through untouched, so
// existing lesson files and any unconstrained/Claude output still normalize.
type RawScenario = Partial<DecisionScenario> & { activity_id?: string };
type RawDecisionGuide = {
  activities?: { activity_id?: string; scenarios?: RawScenario[] }[];
  scenarios?: RawScenario[];
};

// Gemini writes the activity number into the title ("1.1 What Kind and How
// Many?"), while the UI composes its own label as `${id} ${slot}` — so the
// number renders twice: "1.1 1.1 What Kind and How Many?". The label helpers in
// activityLabel.ts were built for the earlier "Warm-Up:" / "Activity 1:"
// convention and have no colon to split on here. Normalize the title instead of
// teaching every render site about the other convention.
function stripLeadingId(id: string, title: string): string {
  if (!id || !title) return title;
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // (?![0-9]) so id "1.1" does not eat into a title that starts "1.11".
  const stripped = title.replace(
    new RegExp(`^\\s*${escaped}(?![0-9])\\s*[:.)\\-\u2013\u2014]?\\s*`, 'i'),
    '',
  );
  // Never strip the whole title away — a title that is only the id is worse
  // than a redundant one.
  return stripped.trim().length ? stripped.trim() : title;
}

function regroupScenarios(
  guide: RawDecisionGuide | undefined,
): { activity_id?: string; scenarios?: RawScenario[] }[] {
  if (guide?.activities?.length) return guide.activities;
  if (!guide?.scenarios?.length) return [];

  // Preserve first-seen activity order rather than sorting — the anchor's
  // ordering is the lesson's ordering.
  const grouped = new Map<string, RawScenario[]>();
  for (const scenario of guide.scenarios) {
    const id = scenario.activity_id ?? '';
    if (!grouped.has(id)) grouped.set(id, []);
    grouped.get(id)!.push(scenario);
  }
  return [...grouped].map(([activity_id, scenarios]) => ({ activity_id, scenarios }));
}

function normalizeLesson(raw: Partial<LessonData> & Record<string, unknown>): LessonData {
  const rawProf = (raw.adaptation_guardrails?.by_proficiency ?? {}) as Record<string, unknown>;
  return {
    meta: {
      grade: raw.meta?.grade ?? '',
      unit: raw.meta?.unit ?? '',
      lesson_number: raw.meta?.lesson_number ?? '',
      lesson_title: raw.meta?.lesson_title ?? 'Lesson',
      total_time: raw.meta?.total_time ?? '',
    },
    arc_statement: raw.arc_statement ?? '',
    destination: raw.destination ?? '',
    key_vocabulary: raw.key_vocabulary ?? [],
    activities: (raw.activities ?? []).map((a) => ({
      id: a.id ?? '',
      title: stripLeadingId(a.id ?? '', a.title ?? ''),
      function: oneOf(a.function, ACTIVITY_FUNCTIONS, 'Application'),
      duration: a.duration ?? '',
      grouping: a.grouping ?? '',
      language_demand: oneOf(a.language_demand, LANGUAGE_DEMANDS, 'low'),
      function_summary: a.function_summary ?? '',
      learning_target: a.learning_target ?? '',
      synthesis_prompt: a.synthesis_prompt ?? '',
      is_crux: a.is_crux ?? false,
      friction_points: (a.friction_points ?? []).map((fp) => ({
        description: fp.description ?? '',
        type: oneOf(fp.type, FRICTION_TYPES, 'math'),
        ...(normalizeMlr((fp as { mlr?: unknown }).mlr)
          ? { mlr: normalizeMlr((fp as { mlr?: unknown }).mlr)! }
          : {}),
      })),
      success_signals: a.success_signals ?? [],
      teacher_moves: normalizeTeacherMoves(a.teacher_moves),
      causal_link: a.causal_link ?? null,
      extension: a.extension ?? null,
    })),
    adaptation_guardrails: {
      mathematical_purpose: raw.adaptation_guardrails?.mathematical_purpose ?? '',
      safe_to_change: raw.adaptation_guardrails?.safe_to_change ?? [],
      do_not_remove: normalizeDoNotRemove(raw.adaptation_guardrails?.do_not_remove),
      rigor_check: raw.adaptation_guardrails?.rigor_check ?? '',
      by_proficiency: {
        // Accept both ELSF labels (preferred) and legacy IM/WIDA labels for defense
        emerging: normalizeProficiency(rawProf.emerging ?? rawProf.entering),
        developing: normalizeProficiency(rawProf.developing),
        expanding: normalizeProficiency(rawProf.expanding ?? rawProf.bridging),
      },
    },
    anticipated_thinking: {
      orientation: raw.anticipated_thinking?.orientation ?? '',
      activities: (raw.anticipated_thinking?.activities ?? []).map((a) => ({
        activity_id: a.activity_id ?? '',
        patterns: (a.patterns ?? []).map((p) => ({
          label: p.label ?? '',
          frequency: oneOf(p.frequency, PATTERN_FREQUENCIES, 'some students'),
          type: oneOf(p.type, PATTERN_TYPES, 'on-track'),
          description: p.description ?? '',
          move: p.move ?? '',
          is_mll_specific: p.is_mll_specific ?? false,
          ...(normalizeMlr((p as { mlr?: unknown }).mlr)
            ? { mlr: normalizeMlr((p as { mlr?: unknown }).mlr)! }
            : {}),
        })),
        sentence_frames: normalizeFrames(a.sentence_frames),
        questions_to_listen_for: a.questions_to_listen_for ?? [],
      })),
    },
    decision_guide: {
      activities: regroupScenarios(raw.decision_guide as RawDecisionGuide | undefined).map((a) => ({
        activity_id: a.activity_id ?? '',
        scenarios: (a.scenarios ?? []).map((s) => ({
          scenario_type: oneOf(s.scenario_type, SCENARIO_TYPES, 'common-error'),
          label: s.label ?? '',
          interpretation: s.interpretation ?? '',
          is_mll: s.is_mll ?? false,
          flat_move: s.flat_move ?? null,
          // Non-MLL scenarios carry flat_move and nothing else. The prompt says
          // so, but constrained decoding fills every declared property and the
          // schema cannot express "null" (type unions are rejected on this API
          // surface), so the model returns proficiency_moves on all scenarios.
          // Enforce the rule here instead of hoping it is sampled correctly.
          proficiency_moves: (s.is_mll
            ? normalizeProficiencyMoves(s.proficiency_moves)
            : null) as DecisionScenario['proficiency_moves'],
          mll_framework_note: s.mll_framework_note ?? null,
          proficiency_divergence_note:
            (s as { proficiency_divergence_note?: string | null }).proficiency_divergence_note ?? null,
          ...(normalizeMlr((s as { mlr?: unknown }).mlr)
            ? { mlr: normalizeMlr((s as { mlr?: unknown }).mlr)! }
            : {}),
        })),
      })),
    },
    elsf_inference: {
      activities: ((raw as { elsf_inference?: { activities?: unknown[] } }).elsf_inference?.activities ?? [])
        .map((rawA) => {
          const a = rawA as Record<string, unknown>;
          const ld = (a.language_demands ?? {}) as Record<string, unknown>;
          const fl = (a.functional_language ?? {}) as Record<string, unknown>;
          // normalizeLesson rebuilds elsf_inference field by field, so anything
          // not copied here is silently dropped — as learner_profile was, and
          // the anchor blob before it. A band survives on its discourse pair
          // alone; the UI falls back per cell for anything blank, because
          // requiring all six discarded whole profiles over one empty string.
          const rawProfile = Array.isArray(a.learner_profile) ? a.learner_profile : [];
          const learner_profile = rawProfile
            .map((rawBand) => {
              const b = rawBand as Record<string, unknown>;
              const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
              const entry = {
                band: oneOf(b.band, ['emerging', 'developing', 'expanding'] as const, 'emerging'),
                discourse_does: str(b.discourse_does),
                discourse_reaching: str(b.discourse_reaching),
                sentence_does: str(b.sentence_does),
                sentence_reaching: str(b.sentence_reaching),
                word_does: str(b.word_does),
                word_reaching: str(b.word_reaching),
              };
              return entry.discourse_does && entry.discourse_reaching ? entry : null;
            })
            .filter((b): b is NonNullable<typeof b> => b !== null);

          return {
            activity_id: typeof a.activity_id === 'string' ? a.activity_id : '',
            ...(learner_profile.length ? { learner_profile } : {}),
            language_demands: {
              receptive: typeof ld.receptive === 'string' ? ld.receptive : '',
              productive: typeof ld.productive === 'string' ? ld.productive : '',
              interactive: typeof ld.interactive === 'string' ? ld.interactive : '',
              everyday_to_academic_bridge:
                typeof ld.everyday_to_academic_bridge === 'string' ? ld.everyday_to_academic_bridge : '',
              elsf_guidelines_applied: normalizeELSFGuidelinesApplied(ld.elsf_guidelines_applied),
            },
            functional_language: {
              language_functions: Array.isArray(fl.language_functions)
                ? (fl.language_functions as unknown[]).filter((s): s is string => typeof s === 'string')
                : [],
              example_phrases: Array.isArray(fl.example_phrases)
                ? (fl.example_phrases as unknown[]).filter((s): s is string => typeof s === 'string')
                : [],
              l1_bridge: typeof fl.l1_bridge === 'string' ? fl.l1_bridge : null,
              elsf_guidelines_applied: normalizeELSFGuidelinesApplied(fl.elsf_guidelines_applied),
            },
          };
        }),
    },
    mlr_inference: {
      activities: (raw.mlr_inference?.activities ?? []).map((a) => ({
        activity_id: a.activity_id ?? '',
        language_work: a.language_work ?? '',
        mlrs: (a.mlrs ?? [])
          .filter((m) => isValidMlrNumber(m.number))
          .map((m) => ({
            number: m.number,
            name: m.name || MLRS[m.number].name,
            why_here: m.why_here ?? '',
          })),
      })),
    },
    wristband: {
      arc_one_line: raw.wristband?.arc_one_line ?? '',
      preflight: raw.wristband?.preflight ?? [],
      top_signals: raw.wristband?.top_signals ?? [],
      top_frictions: raw.wristband?.top_frictions ?? [],
      activities: (raw.wristband?.activities ?? []).map((a) => ({
        activity_id: a.activity_id ?? '',
        tiles: (a.tiles ?? []).map((t) => ({
          observation_short: t.observation_short ?? '',
          friction_type: oneOf(t.friction_type, FRICTION_TYPES, 'math'),
          move_short: t.move_short ?? '',
          ...(t.avoid_short ? { avoid_short: t.avoid_short } : {}),
          ...(t.is_crux_moment ? { is_crux_moment: true } : {}),
          ...(t.has_proficiency_variants ? { has_proficiency_variants: true } : {}),
          ...(t.glyph_observation ? { glyph_observation: t.glyph_observation } : {}),
          ...(t.glyph_move ? { glyph_move: t.glyph_move } : {}),
          ...(normalizeMlr((t as { mlr?: unknown }).mlr)
            ? { mlr: normalizeMlr((t as { mlr?: unknown }).mlr)! }
            : {}),
        })),
        synthesis_short:
          (a as { synthesis_short?: string }).synthesis_short ?? '',
      })),
      mlr_legend: (raw.wristband?.mlr_legend ?? [])
        .map((e) => {
          const mlr = normalizeMlr(e.mlr);
          if (!mlr) return null;
          return { mlr, one_line_cue: e.one_line_cue ?? '' };
        })
        .filter((x): x is { mlr: MlrRef; one_line_cue: string } => x !== null),
      lesson_synthesis_short: raw.wristband?.lesson_synthesis_short ?? '',
    },
    lesson_synthesis: {
      prompt:
        (raw as { lesson_synthesis?: { prompt?: string } }).lesson_synthesis?.prompt ?? '',
      builds_on: Array.isArray(
        (raw as { lesson_synthesis?: { builds_on?: unknown } }).lesson_synthesis?.builds_on,
      )
        ? (
            (raw as { lesson_synthesis: { builds_on: unknown[] } }).lesson_synthesis.builds_on
          ).filter((s): s is string => typeof s === 'string')
        : [],
    },
  };
}

export async function POST(req: NextRequest) {
  const pipelineStart = Date.now();
  const t0 = Date.now();
  const log = (msg: string, extra?: Record<string, unknown>) => {
    console.log(`[analyze +${Date.now() - t0}ms] ${msg}`, extra ?? '');
  };

  try {
    // Model is chosen at deploy time via the DSST_MODEL_PRESET env var
    // (Vercel dashboard for deploys; .env.local for local runs).
    const profile = 'math-lesson-analysis';
    const presetId = process.env.DSST_MODEL_PRESET ?? 'claude-sonnet';

    // Resolve preset to provider + model + default thinking
    const preset = MODEL_PRESETS[presetId];
    if (!preset) {
      console.error(`[analyze] Unknown preset: "${presetId}". Valid: ${Object.keys(MODEL_PRESETS).join(', ')}`);
      return NextResponse.json(
        { error: `Unknown model preset: "${presetId}". Valid presets: ${Object.keys(MODEL_PRESETS).join(', ')}.` },
        { status: 400 },
      );
    }

    // Thinking comes from DSST_THINKING_LEVEL when set to a valid value;
    // otherwise the preset's own default applies.
    const envThinking = process.env.DSST_THINKING_LEVEL;
    const thinkingLevel: ThinkingLevel =
      envThinking && ['minimal', 'low', 'medium', 'high', 'off'].includes(envThinking)
        ? (envThinking as ThinkingLevel)
        : preset.defaultThinking;
    // Validate API key for the resolved provider
    if (preset.provider === 'anthropic' && !process.env.ANTHROPIC_API_KEY) {
      console.error('[analyze] ANTHROPIC_API_KEY not set on this deployment');
      return NextResponse.json(
        {
          error:
            'Server is missing the Anthropic API key. The deployment needs ANTHROPIC_API_KEY set (Vercel → Project → Settings → Environment Variables, scope: Preview + Production).',
        },
        { status: 500 },
      );
    }
    if (preset.provider === 'gemini' && !process.env.GEMINI_API_KEY) {
      console.error('[analyze] GEMINI_API_KEY not set on this deployment');
      return NextResponse.json(
        {
          error:
            'Server is missing the Gemini API key. The deployment needs GEMINI_API_KEY set.',
        },
        { status: 500 },
      );
    }

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (err) {
      console.error('[analyze] formData parse failed:', err);
      return NextResponse.json(
        { error: 'Could not parse the upload. The file may be too large or corrupted.' },
        { status: 400 },
      );
    }

    const file = formData.get('pdf') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }
    log('received file', { name: file.name, size: file.size });
    
// Telemetry: inject run_id and run config into every event.
    // DSST_RUN_ID env var sets the benchmark run identifier.
    const runId = process.env.DSST_RUN_ID || null;
    if (runId) {
      telemetry.setRunId(runId);
    }

    const runConfig: Record<string, unknown> = {
      provider: preset.provider,
      model: preset.model,
      thinking: thinkingLevel,
      profile,
    };

    telemetry.logPipelineStart(file.name, file.size, runConfig);

    const buffer = Buffer.from(await file.arrayBuffer());

    let pdfText: string;
    const pdfParseStart = Date.now();
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse/lib/pdf-parse.js');
      const data = await pdfParse(buffer);
      pdfText = data.text;
      const pdfDuration = Date.now() - pdfParseStart;
      log('pdf parsed', { chars: pdfText.length, duration_ms: pdfDuration });
      telemetry.logPdfExtractionComplete(pdfDuration, pdfText.length);
    } catch (err) {
      console.error('[analyze] pdf-parse failed:', err);
      return NextResponse.json(
        {
          error:
            'Could not read this PDF. It may be a scan (image-only) or use an unsupported encoding. Re-export as a text-based PDF and try again.',
        },
        { status: 400 },
      );
    }

    if (!pdfText || pdfText.trim().length < 100) {
      return NextResponse.json(
        {
          error: `The PDF parsed to only ${pdfText?.trim().length ?? 0} characters of text — likely a scanned/image PDF. Try a text-based PDF.`,
        },
        { status: 400 },
      );
    }

    const truncatedText =
      pdfText.length > MAX_PDF_CHARS ? pdfText.slice(0, MAX_PDF_CHARS) : pdfText;

    // ANCHOR + 3-PARALLEL architecture. Pass 0 (anchor) runs first and
    // produces a small skeleton: meta, destination, and a canonical activity
    // list (id, title, learning_target, function, is_crux). Then Passes A, B,
    // C run in parallel given the anchor, so they align on the same activity
    // IDs/titles/crux marker. Each downstream pass produces a disjoint slice
    // of the final schema.
    //
    // Total wall time: ~30-40s (anchor) + max(A, B, C) ~120-150s = ~180s = 3 min.
    //
    // Per-call client timeout 200s gives margin over typical wall times and
    // stays well under the 600s function maxDuration.
    // Cache lookup happens before any model call: a hit costs one blob read and
    // returns the identical plan a previous upload produced. See lessonCache.ts
    // for why identity-keyed caching is the mechanism rather than an
    // optimization.
    // IM publishes the lesson's learning targets and they are in the student
    // pages we receive. Read them verbatim rather than asking the model to
    // restate them: outcome drives routine selection, so the outcome has to be
    // the most stable thing in the pipeline — and a model paraphrase came back
    // 8-9 distinct across ten runs of one PDF.
    const lessonTargets = extractLessonTargets(pdfText);
    log('published learning targets', {
      found: lessonTargets.targets.length,
      explicit: lessonTargets.explicit,
    });

    // Everything that shapes the output goes into the key: the prompt, the pass
    // schemas, and the selection tables. Edit any of them and stored lessons
    // stop being served, with no version bump to remember.
    const logicFingerprint = createHash('sha256')
      .update(PRODUCTION_SYSTEM_PROMPT)
      .update(JSON.stringify(PASS_SCHEMAS))
      .update(selectionFingerprint())
      .update(calibrationFingerprint())
      .digest('hex')
      .slice(0, 16);
    const cacheKey = lessonCacheKey(truncatedText, preset.model, logicFingerprint);
    // ?fresh=1 bypasses the cache entirely — read and write. Needed to measure
    // run-to-run behaviour, which a cache hit would otherwise hide behind a
    // byte-identical copy. Never set by the app itself.
    //
    // Gated behind an env flag: unguarded, anyone could force a full five-pass
    // regeneration on every request, which is both a cost and a load vector.
    // Set DSST_ALLOW_CACHE_BYPASS=true on measurement deployments only.
    const bypassAllowed = process.env.DSST_ALLOW_CACHE_BYPASS === 'true';
    const bypassCache = bypassAllowed && searchParams.get('fresh') === '1';
    if (!bypassAllowed && searchParams.get('fresh') === '1') {
      log('cache bypass requested but not enabled on this deployment');
    }
    if (isCacheEnabled() && !bypassCache) {
      const cached = await readCachedLesson(cacheKey);
      if (cached) {
        log('cache hit', { cacheKey });
        telemetry.logPipelineComplete(Date.now() - pipelineStart, 0);
        return NextResponse.json({
          ...cached,
          provenance: { ...cached.provenance, served_from_cache: true },
        });
      }
      log('cache miss', { cacheKey, basis: cacheKeyBasis(pdfText) });
    }

    const llm = createLLMClient(preset.provider, preset.model, preset.defaultThinking);

    const concisionRules = `OUTPUT FORMAT — MANDATORY:
- Begin your response immediately with the opening brace { of the JSON object.
- End with the closing brace }.
- No preamble, no commentary, no markdown fences (do NOT wrap in \`\`\`json).

CONCISION — STRICT:
- Keep every string short and concrete. No throat-clearing, no restating what other fields already say.
- Long descriptive fields cap at ~3 sentences. Move and interpretation fields cap at ~2 sentences. observation_short, move_short, glyph_observation, glyph_move stay at their stated word caps.`;

    // The anchor JSON is produced by Pass 0 (sequentially, before A/B/C) and
    // is embedded into each parallel pass's user message as the source of
    // truth for activity IDs, titles, learning targets, and crux marker.
    // This string is templated by the runner — each pass message references
    // ${anchorJson} which is substituted in at call time.
    const makeAlignmentBlock = (anchorJson: string) =>
      `ANCHOR — SOURCE OF TRUTH FOR ALIGNMENT:
A prior pass produced the following anchor. Every activity_id you emit MUST match an id in this anchor's activities array. Every activity referenced in any block (mlr_inference, elsf_inference, anticipated_thinking, decision_guide, wristband) MUST cover EVERY activity in the anchor. The activity marked is_crux: true in the anchor is THE crux for this lesson — use it consistently.

${anchorJson}`;

    const passAnchorMessage = `Analyze this math lesson. This is PASS 0 (anchor) of a four-pass analysis. Your output will be passed to three parallel downstream passes as the source of truth for activity alignment. Keep it short and structural — just enough for the downstream passes to align on.

Return a single JSON object with EXACTLY these top-level fields (and no others):
- meta { grade, unit, lesson_number, lesson_title, total_time }
- destination — 1-2 sentences naming what students should understand by end of lesson
- activities — array of activity SKELETONS, each with EXACTLY: { id, title, function (Setup | Crux | Application | Synthesis), duration, grouping, language_demand (low | medium | high), learning_target, is_crux (boolean) }
  - Use the activity numbering as it appears in the lesson document (typically "1.1", "1.2", "1.3" — but use whatever the source uses)
  - title MUST be verbatim from the document (e.g., "Warm-Up: What Kind and How Many?", "Activity 1: The Teacher's Collection")
  - Exactly ONE activity has is_crux: true. The crux is the moment where the lesson succeeds or fails on the teacher's facilitation. Identify it from the published learning target and the lesson's scaffolding design, in this order: (1) it is where the learning target is first GENUINELY ATTEMPTED — not introduced, not rehearsed, not practised afterwards; (2) the scaffolding is at its thinnest there — students meet the new idea with less support than the earlier activities gave them; (3) what the teacher does in the moment — what they notice, what they ask, what they let pass — decides whether students reach the target. It is never the warm-up. It is NOT simply the longest or hardest activity: an activity students can grind through on their own is not the crux, while a short activity that collapses without the right teacher move is. Exactly ONE activity per lesson.
  - learning_target is 1 sentence in "Students ___" voice, concrete and observable

Be FAST. This anchor is the cheap pass. Each field is one short string except activities which is an array of small objects. No prose, no commentary.

${concisionRules}

Lesson text:
${truncatedText}`;

    // The downstream parallel passes (A, B, C) are built as functions of the
    // anchor JSON. We can't construct them until Pass 0 returns.
    const buildPassAMessage = (anchorJson: string) =>
      `Analyze this math lesson. This is PASS A (structure) of THREE PARALLEL passes after the anchor. Passes B (thinking + inference) and C (decisions + wristband) are running in parallel.

Return a single JSON object with EXACTLY these top-level fields (and no others):
- arc_statement — a short narrative paragraph (3-4 sentences)
- key_vocabulary — array of { term, definition }
- activities — each is a FULL activity object per the system prompt schema (id, title, function, duration, grouping, language_demand, function_summary, learning_target, synthesis_prompt, is_crux, friction_points, success_signals, teacher_moves, causal_link, extension). The ids, titles, functions, durations, groupings, language_demands, learning_targets, and is_crux flags MUST match the anchor exactly.
- adaptation_guardrails (full per the system prompt schema)
- lesson_synthesis { prompt, builds_on }

Every activity MUST include a synthesis_prompt that points back to the activity's learning_target in lesson-specific language. The lesson_synthesis block MUST consolidate activity-level syntheses toward the destination from the anchor. NEVER use generic reminders like "have students share what they learned" or "reflect on the learning target."

${makeAlignmentBlock(anchorJson)}

Write in plain language a first-year teacher could read at 9pm the night before teaching. No academic jargon.

${concisionRules}

Lesson text:
${truncatedText}`;

    const buildPassBMessage = (anchorJson: string) =>
      `Analyze this math lesson. This is PASS B (MLR + ELSF inference) of FOUR PARALLEL passes after the anchor. Passes A (structure), C (anticipated thinking), and D (decisions + wristband) are running in parallel.

Return a single JSON object with EXACTLY these top-level fields (and no others):
- mlr_inference (this MUST be the first field)
- elsf_inference (this MUST be the second field)

mlr_inference.activities and elsf_inference.activities MUST each cover EVERY activity from the anchor.

For each activity in mlr_inference, produce { activity_id, language_work, mlrs: [{ number, name, why_here }] }. Select EXACTLY 2 MLRs per activity — the assignment above tells you which. why_here is 1-2 sentences explaining why THIS routine fits THIS activity, referencing the specific student behavior or prompt.

For each activity in elsf_inference, produce both:
- language_demands { receptive, productive, interactive, everyday_to_academic_bridge, elsf_guidelines_applied }
- functional_language { language_functions, example_phrases, l1_bridge, elsf_guidelines_applied }

${makeAlignmentBlock(anchorJson)}

Write in plain language a first-year teacher could read at 9pm the night before teaching. No academic jargon.

${concisionRules}

Lesson text:
${truncatedText}`;

    const buildPassCMessage_Thinking = (anchorJson: string) =>
      `Analyze this math lesson. This is PASS C (anticipated thinking) of FOUR PARALLEL passes after the anchor. Passes A (structure), B (MLR + ELSF inference), and D (decisions + wristband) are running in parallel.

Return a single JSON object with EXACTLY these top-level fields (and no others):
- anticipated_thinking { orientation, activities: [{ activity_id, patterns, sentence_frames, questions_to_listen_for }] }

anticipated_thinking.orientation is 2 sentences orienting the teacher to the dominant pattern of student thinking for THIS lesson. Asset-based. Name what students will bring AND where their thinking will most likely take work.

anticipated_thinking.activities MUST cover EVERY activity from the anchor. Each activity has:
- 3-4 patterns. Each pattern: { label, frequency (most students | some students | watch for this), type (on-track | misconception | partial | extension | language-math), description, move, is_mll_specific (boolean), mlr (when is_mll_specific is true) }. The move text MUST be specific — for MLL patterns it MUST walk through the named routine's actual steps for THIS specific pattern, not generic advice.
- 2-3 sentence_frames. Each is { frame, mlr (optional) }.
- 2-3 questions_to_listen_for (strings).

${makeAlignmentBlock(anchorJson)}

Write in plain language a first-year teacher could read at 9pm the night before teaching. No academic jargon.

${concisionRules}

Lesson text:
${truncatedText}`;

    const buildPassD1Message = (anchorJson: string) =>
      `Analyze this math lesson. This is PASS D1 (decision guide) of FIVE PARALLEL passes after the anchor. Passes A (structure), B (MLR + ELSF inference), C (anticipated thinking), and D2 (wristband) are running in parallel.

Return a single JSON object with EXACTLY these top-level fields (and no others):
- decision_guide { scenarios: [{ activity_id, ...scenario fields }] } — a FLAT array. Every scenario names the activity it belongs to via activity_id; do NOT group them under an activities array.

The activity_ids across decision_guide.scenarios MUST cover EVERY activity from the anchor.

decision_guide MUST include a mix of scenario types: 1-2 common-error, 1 productive-insight, 1 on-track, 1 productive-struggle or partial-understanding across the lesson. Total ~10-12 scenarios.

AT LEAST 3 scenarios across the lesson MUST carry is_mll: true, and the crux activity MUST have at least one of them. This is not a quota to fill with weak entries — a multilingual learner meets a distinct difficulty at nearly every moment of a mathematics lesson, and if fewer than three surfaced you have not looked hard enough. Nothing else in this tool speaks to that teacher: when no scenario is marked, the entire multilingual-learner surface disappears from the lesson.

For MLL scenarios (is_mll: true), proficiency_moves MUST have emerging/developing/expanding all populated. Emerging.nonverbal MUST be a concrete physical action. For non-MLL scenarios, use flat_move and set proficiency_moves: null.

Every MLL scenario MUST be anchored to a specific MLR.

${anchorJson}

Lesson text:
${truncatedText}`;

    const buildPassD2Message = (anchorJson: string) =>
      `Analyze this math lesson. This is PASS D2 (wristband) of FIVE PARALLEL passes after the anchor. Passes A (structure), B (MLR + ELSF inference), C (anticipated thinking), and D1 (decision guide) are running in parallel.

Return a single JSON object with EXACTLY these top-level fields (and no others):
- wristband { arc_one_line, preflight, top_signals, top_frictions, activities: [{ activity_id, tiles, synthesis_short }], mlr_legend, lesson_synthesis_short }

wristband.activities MUST cover EVERY activity from the anchor.

EVERY wristband tile MUST carry an mlr. The chip at the point of need is the thing this view exists for; a tile without one is incomplete.

${anchorJson}

Lesson text:
${truncatedText}`;

    type PassResult =
      | { ok: true; parsed: Partial<LessonData> & Record<string, unknown>; resp: LLMResponse }
      | { ok: false; response: NextResponse; retryable?: boolean };

    /**
     * One automatic retry when a pass returns text that will not parse.
     *
     * Constrained decoding removed this as a category — 0 failures in ten runs
     * where the previous build failed 2 in ten — but 0/10 was never the same as
     * never, and a teacher hit it in production on an uncached lesson. A bad
     * response is independent of the next one, so retrying once converts a
     * visible error into an extra ~30s on a rare request.
     *
     * Deliberately narrow: only a parse failure retries. An auth error, a rate
     * limit, or a token-limit truncation will fail again the same way, and
     * retrying those just doubles the delay before the same message.
     */
    async function runPass(
      passName: string,
      userMessage: string,
      maxTokens: number,
      thinkingLevel?: ThinkingLevel,
      responseSchema?: unknown,
      /**
       * Optional shape check on a successfully parsed pass — a reason string
       * when the result is structurally wrong, null when fine.
       *
       * Schemas cannot express every floor: minItems had to come off
       * decision_guide.scenarios to get that pass under the Interactions API's
       * complexity ceiling. Without this, one run in eight returned a decision
       * guide with a single scenario where the lesson wants eleven.
       */
      validate?: (parsed: Partial<LessonData> & Record<string, unknown>) => string | null,
    ): Promise<PassResult> {
      const first = await runPassOnce(passName, userMessage, maxTokens, thinkingLevel, responseSchema);
      const firstShape = first.ok && validate ? validate(first.parsed) : null;
      if (first.ok && !firstShape) return first;
      if (!first.ok && !first.retryable) return first;

      if (firstShape) {
        log(`Pass ${passName} returned a usable but wrong-shaped result — retrying once`, {
          reason: firstShape,
        });
        telemetry.logInferenceError(passName, 'bad_shape_retry', firstShape, 0);
        const retried = await runPassOnce(passName, userMessage, maxTokens, thinkingLevel, responseSchema);
        // Keep whichever is better rather than trusting the retry blindly: a
        // second bad result should not replace a merely imperfect first one.
        if (retried.ok && !validate?.(retried.parsed)) {
          log(`Pass ${passName} shape fixed on retry`);
          return retried;
        }
        log(`Pass ${passName} still wrong-shaped after retry — keeping the first`);
        return first;
      }

      log(`Pass ${passName} returned unparseable JSON — retrying once`);
      telemetry.logInferenceError(passName, 'invalid_json_retry', 'retrying after parse failure', 0);
      const second = await runPassOnce(passName, userMessage, maxTokens, thinkingLevel, responseSchema);
      if (second.ok) log(`Pass ${passName} succeeded on retry`);
      return second;
    }

    async function runPassOnce(
      passName: string,
      userMessage: string,
      maxTokens: number,
      thinkingLevel?: ThinkingLevel,
      responseSchema?: unknown,
    ): Promise<PassResult> {
      const passStart = Date.now();
      telemetry.logInferenceStart(passName, passName);
      try {
        log(`calling ${preset.provider} — pass ${passName}`);
        const resp = await llm.run(
          PRODUCTION_SYSTEM_PROMPT,
          userMessage,
          maxTokens,
          thinkingLevel,
          responseSchema,
        );
        const passDuration = Date.now() - passStart;
        log(`Pass ${passName} returned`, {
          stop_reason: resp.stopReason,
          output_tokens: resp.outputTokens,
          duration_ms: passDuration,
        });
        telemetry.logInferenceComplete(
          runId,
          passName,
          passDuration,
          resp.inputTokens,
          resp.outputTokens,
          { stop_reason: resp.stopReason, ...(resp.thinkingTokens !== undefined && { thinking_tokens: resp.thinkingTokens }) },
        );

        if (!resp.text) {
          console.error(`[analyze] Pass ${passName}: no text. stop_reason:`, resp.stopReason);
          return {
            ok: false,
            response: NextResponse.json(
              { error: `Pass ${passName} returned no text (stop_reason: ${resp.stopReason}).` },
              { status: 502 },
            ),
          };
        }

        const hitTokenLimit = resp.stopReason === 'max_tokens' || resp.stopReason === 'max-tokens';
        if (hitTokenLimit) {
          const outputTokens = resp.outputTokens ?? '?';
          console.error(
            `[analyze] Pass ${passName} truncated at ${outputTokens} tokens. Last 300 chars:`,
            resp.text.slice(-300),
          );
          return {
            ok: false,
            response: NextResponse.json(
              {
                error: `Pass ${passName} was truncated at ${outputTokens} tokens — that pass needs a larger budget. Contact the developer.`,
              },
              { status: 502 },
            ),
          };
        }

        try {
          const extracted = extractJSON(resp.text);
          const parsed = JSON.parse(extracted) as Partial<LessonData> &
            Record<string, unknown>;
          return { ok: true, parsed, resp };
        } catch (err) {
          const extracted = extractJSON(resp.text);
          console.error(`[analyze] Pass ${passName} JSON parse error:`, err);
          console.error(`[analyze] Pass ${passName} extracted JSON (first 500 chars):`, extracted.slice(0, 500));
          console.error(`[analyze] Pass ${passName} extracted JSON (last 500 chars):`, extracted.slice(-500));
          console.error(`[analyze] Pass ${passName} raw text length:`, resp.text.length);
          console.error(`[analyze] Pass ${passName} extracted length:`, extracted.length);
          return {
            ok: false,
            retryable: true,
            response: NextResponse.json(
              {
                error: `Pass ${passName} returned text that was not valid JSON (stop_reason: ${resp.stopReason}). Try uploading again — this is usually transient.`,
              },
              { status: 502 },
            ),
          };
        }
      } catch (err) {
        const passDuration = Date.now() - passStart;
        console.error(`[analyze] Pass ${passName} API call failed:`, err);
        const apiErr = err as { status?: number; message?: string; error?: { message?: string } };
        const detail = apiErr?.error?.message ?? apiErr?.message ?? 'Unknown API error';

        // Categorize the error for telemetry
        let errorCategory = 'unknown';
        if (/timeout|timed out|aborted/i.test(detail)) {
          errorCategory = 'timeout';
        } else if (apiErr?.status === 401) {
          errorCategory = 'authentication';
        } else if (apiErr?.status === 429) {
          errorCategory = 'rate_limit';
        } else if (apiErr?.status === 408) {
          errorCategory = 'timeout';
        } else if (apiErr?.status && apiErr.status >= 500) {
          errorCategory = 'server_error';
        } else if (apiErr?.status === 400) {
          errorCategory = 'bad_request';
        }

        telemetry.logInferenceError(passName, errorCategory, detail, passDuration);

        const isTimeout = /timeout|timed out|aborted/i.test(detail) || apiErr?.status === 408;
        if (isTimeout) {
          return {
            ok: false,
            response: NextResponse.json(
              { error: `Pass ${passName} took longer than 200s. The lesson is unusually long for this pass.` },
              { status: 504 },
            ),
          };
        }
        if (apiErr?.status === 401) {
          return {
            ok: false,
            response: NextResponse.json(
              { error: `${preset.provider} rejected the API key (401). The deployment key is invalid or expired.` },
              { status: 502 },
            ),
          };
        }
        if (apiErr?.status === 429) {
          return {
            ok: false,
            response: NextResponse.json(
              { error: `${preset.provider} rate limit hit on Pass ${passName}. Wait a minute and try again.` },
              { status: 502 },
            ),
          };
        }
        return {
          ok: false,
          response: NextResponse.json(
            { error: `${preset.provider} API error on Pass ${passName}: ${detail}` },
            { status: 502 },
          ),
        };
      }
    }

log('starting anchor pass (Pass 0)');

    // Thinking: use the resolved level from query param or preset default.
    // Cap all passes at MAX_TOKENS when set — useful for benchmarks.
    const maxTokensCap = process.env.MAX_TOKENS ? Number(process.env.MAX_TOKENS) : 32000;

// The anchor writes each activity's outcome against the PUBLISHED targets
    // rather than inventing a goal, and classifies it into outcome_type — the
    // enum that actually selects the routine.
    const anchorMessage = lessonTargets.targets.length
      ? `${passAnchorMessage}

The lesson's PUBLISHED learning targets, verbatim from this document:
${lessonTargets.targets.map((t) => `  - ${t}`).join('\n')}

Every activity_outcome you write MUST restate one of these in that activity's terms. Do not invent a different goal for the lesson.`
      : passAnchorMessage;

    const resAnchor = await runPass('0 (anchor)', anchorMessage, maxTokensCap, thinkingLevel, PASS_SCHEMAS.anchor);
    if (!resAnchor.ok) return resAnchor.response;
    const anchorJson = JSON.stringify(resAnchor.parsed, null, 2);
    log('anchor returned', { anchor_size_chars: anchorJson.length });

    // Which MLRs an activity uses is computed, not generated — see
    // src/lib/mlrSelection.ts. Deriving it from the anchor means every parallel
    // pass argues for the same routines instead of each picking its own, which
    // was the largest remaining source of run-to-run difference.
    const anchorActivities = (resAnchor.parsed.activities ?? []) as AnchorActivity[];
    const mlrPlan = buildMlrPlan(anchorActivities);
    const anchorWithPlan = `${anchorJson}\n\n${describeMlrPlan(
      mlrPlan,
      (n) => MLRS[n].name,
      lessonTargets.targets,
    )}`;

    // An unclassified activity means Pass 0 skipped the job and the routine is a
    // fallback guess rather than a selection. Worth seeing in the logs.
    const unclassified = anchorActivities.filter((a) => !a.outcome_type).map((a) => a.id);
    if (unclassified.length) {
      console.warn('[analyze] activities with no outcome_type:', unclassified.join(', '));
    }
    // The WIDA descriptors go INTO generation rather than being rendered as the
    // output. The model writes the move for this scenario at each band; the
    // lookup only says what a learner at that band can produce.
    const widaCalibration = describeCalibration(anchorActivities);

    log('mlr plan', {
      plan: Object.fromEntries(
        Object.entries(mlrPlan).map(([id, r]) => [id, r.second ? [r.lead, r.second] : [r.lead]]),
      ),
      standing_supports: needsStandingSupports(anchorActivities),
      unclassified,
    });

    log('starting parallel passes');
    const [resA, resB, resC, resD1, resD2] = await Promise.all([
runPass('A (structure)', buildPassAMessage(anchorWithPlan), maxTokensCap, thinkingLevel, PASS_SCHEMAS.A),
      runPass(
        'B (MLR + ELSF inference)',
        `${buildPassBMessage(anchorWithPlan)}\n\n${widaCalibration}\n\n${LEARNER_PROFILE_REGISTER}`,
        maxTokensCap,
        thinkingLevel,
        PASS_SCHEMAS.B,
      ),
      runPass('C (anticipated thinking)', buildPassCMessage_Thinking(anchorWithPlan), maxTokensCap, thinkingLevel, PASS_SCHEMAS.C),
      runPass(
        'D1 (decision guide)',
        `${buildPassD1Message(anchorWithPlan)}\n\n${widaCalibration}`,
        maxTokensCap,
        thinkingLevel,
        PASS_SCHEMAS.D1,
        (parsed) => {
          const scenarios = (parsed as { decision_guide?: { scenarios?: unknown[] } }).decision_guide
            ?.scenarios;
          if (!Array.isArray(scenarios)) return 'decision_guide.scenarios missing';
          if (scenarios.length < 8) return `only ${scenarios.length} scenarios`;
          const mll = scenarios.filter((x) => (x as { is_mll?: boolean }).is_mll).length;
          // Below three, the multilingual-learner surface all but vanishes.
          if (mll < 3) return `only ${mll} MLL scenarios`;
          return null;
        },
      ),
      runPass('D2 (wristband)', buildPassD2Message(anchorWithPlan), maxTokensCap, thinkingLevel, PASS_SCHEMAS.D2),
    ]);
    log('all 5 passes settled');

    // First failure wins — return its error message.
    if (!resA.ok) return resA.response;
    if (!resB.ok) return resB.response;
    if (!resC.ok) return resC.response;
    if (!resD1.ok) return resD1.response;
    if (!resD2.ok) return resD2.response;

    // Merge. Each pass owns a disjoint set of top-level fields.
    // - Anchor produces: meta, destination, activities (skeleton).
    // - Pass A produces: arc_statement, key_vocabulary, activities (FULL),
    //   adaptation_guardrails, lesson_synthesis.
    // - Pass B produces: mlr_inference, elsf_inference.
    // - Pass C produces: anticipated_thinking.
    // - Pass D1 produces: decision_guide. Pass D2 produces: wristband.
    //   D was split in two because the combined response schema exceeded the
    //   Interactions API's complexity ceiling; see src/lib/passSchemas.ts.
    //
    // On overlap, Pass A's activities (full) beat the anchor's skeleton; the
    // anchor's meta + destination win since they were the alignment source of
    // truth that A built on top of.
    const parsed = {
      ...resD2.parsed,
      ...resD1.parsed,
      ...resC.parsed,
      ...resB.parsed,
      ...resA.parsed,
      // Re-apply anchor's meta + destination LAST so they win over anything
      // A accidentally emitted. The anchor's `activities` skeleton is
      // intentionally NOT re-applied — Pass A's full activities array wins.
      ...(resAnchor.parsed.meta ? { meta: resAnchor.parsed.meta } : {}),
      ...(resAnchor.parsed.destination
        ? { destination: resAnchor.parsed.destination }
        : {}),
    } as Partial<LessonData> & Record<string, unknown>;
    log('merged anchor + 4 passes');

    const lesson = normalizeLesson(parsed);
    log('normalized lesson');

    // Backstop for a pass that ignored the assignment.
    const { deviations } = enforceMlrPlan(lesson, mlrPlan);

    // Record what the selector decided and why, so the choice can be inspected
    // directly instead of reverse-engineered from the routines downstream.
    lesson.selection = {
      lesson_targets: lessonTargets.targets,
      targets_published: lessonTargets.explicit,
      standing_supports: needsStandingSupports(anchorActivities),
      activities: anchorActivities.map((a) => ({
        activity_id: a.id,
        activity_outcome: a.activity_outcome ?? '',
        outcome_type: a.outcome_type ?? '(unclassified)',
        resolved_outcome_type: mlrPlan[a.id]?.resolved_outcome_type ?? '',
        affordances: {
          flawed_sample_provided: a.flawed_sample_provided ?? false,
          error_harvestable: a.error_harvestable ?? false,
          splittable_materials: a.splittable_materials ?? false,
          student_products_differ: a.student_products_differ ?? false,
          public_share_step: a.public_share_step ?? false,
          frames_already_printed: a.frames_already_printed ?? false,
          context_word_count: a.context_word_count ?? 0,
        },
        function: a.function ?? '',
        lead: mlrPlan[a.id]?.lead ?? 0,
        second: mlrPlan[a.id]?.second ?? null,
        because: mlrPlan[a.id]?.because ?? '',
        teacher_prep: mlrPlan[a.id]?.teacher_prep ?? null,
      })),
    };
    if (deviations > 0) log('mlr plan deviations snapped', { deviations });

    // The raw anchor response used to be attached here for the Gemini-vs-Claude
    // comparison. It shipped ~20KB of debug text to the browser and was baked
    // into every exported .dsst. Token counts now live in telemetry, which is
    // where benchmark data belongs.
    
    // Provenance: until now a generated lesson carried no record of what made
    // it, so a .dsst file could not be attributed after the fact — and the
    // provider is switchable by env var.
    const stamped = {
      ...lesson,
      provenance: {
        pipeline_version: `${PIPELINE_VERSION}+${logicFingerprint}`,
        cache_key: cacheKey,
        provider: preset.provider,
        model: preset.model,
        thinking: thinkingLevel,
        generated_at: new Date().toISOString(),
        served_from_cache: false,
      },
    };
    if (!bypassCache) {
      await writeCachedLesson(cacheKey, stamped);

      // Read back what is actually stored and return THAT.
      //
      // When a lesson is not yet cached, every request arriving during the ~30s
      // generation is a miss, so each one generates its own copy. Writes are
      // first-wins, so only one is kept — but without this, the losers would
      // return the copy they generated and never stored, and three teachers
      // uploading the same lesson at once would see three different plans. That
      // happened in testing.
      //
      // One extra read converges everyone on the stored artifact. If the read
      // fails we fall through to our own copy, which is the old behaviour.
      const stored = await readCachedLesson(cacheKey);
      if (stored) {
        const fromOtherRequest = stored.provenance?.generated_at !== stamped.provenance.generated_at;
        if (fromOtherRequest) log('another request stored this lesson first — returning theirs');
        telemetry.logPipelineComplete(Date.now() - pipelineStart, 5);
        return NextResponse.json({
          ...stored,
          provenance: { ...stored.provenance, served_from_cache: fromOtherRequest },
        });
      }
    }

    const totalDuration = Date.now() - pipelineStart;
    telemetry.logPipelineComplete(totalDuration, 4);
    
    
    
    return NextResponse.json(stamped);
  } catch (err) {
    const totalDuration = Date.now() - pipelineStart;
    console.error('[analyze] Unexpected error:', err);
    const msg = err instanceof Error ? err.message : String(err);
    telemetry.logPipelineError('unexpected', msg, totalDuration);
    return NextResponse.json(
      { error: `Unexpected server error: ${msg}` },
      { status: 500 },
    );
  }
}
