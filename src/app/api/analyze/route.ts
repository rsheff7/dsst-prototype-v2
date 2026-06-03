import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { composeSystemPrompt } from '@/lib/prompts';
import {
  LessonData,
  MlrRef,
  ActivityTeacherMove,
  SentenceFrame,
  DoNotRemoveItem,
  ProficiencyAdaptation,
} from '@/lib/types';
import { isValidMlrNumber, MLRS, MlrNumber } from '@/lib/mlrs';
import { isValidELSFGuidelineNumber, ELSFGuidelineNumber } from '@/lib/elsf';

export const maxDuration = 300;

const MAX_PDF_CHARS = 12000;

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
      title: a.title ?? '',
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
      activities: (raw.decision_guide?.activities ?? []).map((a) => ({
        activity_id: a.activity_id ?? '',
        scenarios: (a.scenarios ?? []).map((s) => ({
          scenario_type: oneOf(s.scenario_type, SCENARIO_TYPES, 'common-error'),
          label: s.label ?? '',
          interpretation: s.interpretation ?? '',
          is_mll: s.is_mll ?? false,
          flat_move: s.flat_move ?? null,
          proficiency_moves: normalizeProficiencyMoves(s.proficiency_moves) as typeof s.proficiency_moves,
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
          return {
            activity_id: typeof a.activity_id === 'string' ? a.activity_id : '',
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
  const t0 = Date.now();
  const log = (msg: string, extra?: Record<string, unknown>) => {
    console.log(`[analyze +${Date.now() - t0}ms] ${msg}`, extra ?? '');
  };

  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[analyze] ANTHROPIC_API_KEY not set on this deployment');
      return NextResponse.json(
        {
          error:
            'Server is missing the Anthropic API key. The deployment needs ANTHROPIC_API_KEY set (Vercel → Project → Settings → Environment Variables, scope: Preview + Production).',
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

    const buffer = Buffer.from(await file.arrayBuffer());

    let pdfText: string;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse/lib/pdf-parse.js');
      const data = await pdfParse(buffer);
      pdfText = data.text;
      log('pdf parsed', { chars: pdfText.length });
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

    const userMessage = `Analyze this math lesson and return the full JSON described in your system prompt.

You MUST produce ALL top-level sections, fully populated for every activity in the lesson:
- meta, arc_statement, destination, key_vocabulary, activities, adaptation_guardrails, anticipated_thinking, decision_guide, mlr_inference, wristband, lesson_synthesis

The mlr_inference block MUST appear first in your output. Subsequent fields must be consistent with what mlr_inference says about each activity.

Across the decision_guide, the scenarios MUST include a mix of types — not just common-error. At minimum: 1-2 common-error, 1 productive-insight, 1 on-track, and 1 productive-struggle or partial-understanding across the lesson.

Every activity MUST include a synthesis_prompt that points back to that activity's learning_target in lesson-specific language. The lesson_synthesis block MUST consolidate the activity-level syntheses toward the destination. The wristband MUST include synthesis_short per activity and lesson_synthesis_short. NEVER use generic reminders like "have students share what they learned" or "reflect on the learning target" in any synthesis field.

Write in plain language a first-year teacher could read at 9pm the night before teaching. No academic jargon.

OUTPUT FORMAT — MANDATORY:
- Begin your response immediately with the opening brace { of the JSON object.
- End with the closing brace }.
- No preamble, no commentary, no markdown fences (do NOT wrap in \`\`\`json).

CONCISION — STRICT:
- Total output MUST fit in 16000 tokens. Truncated JSON cannot be used.
- Keep every string short and concrete. No throat-clearing, no restating what other fields already say.
- Long descriptive fields (function_summary, arc_statement) cap at ~3 sentences. Move descriptions cap at ~2 sentences. Interpretation fields cap at ~2 sentences. observation_short, move_short, glyph_observation, glyph_move stay at their stated word caps.
- If you find yourself approaching the budget, drop redundant scenarios from decision_guide before truncating any required field. Required fields MUST be present.

Lesson text:
${truncatedText}`;

    // Bounded timeout so we return our own JSON error before Vercel kills the
    // function at 300s (which yields a generic HTML "Internal Server Error" page).
    // 270s leaves margin for pdf-parse, the normalizer, and the error path itself.
    // maxRetries: 0 prevents silent retries from compounding wall time.
    const client = new Anthropic({ timeout: 270_000, maxRetries: 0 });

    let message;
    try {
      log('calling Anthropic');
      // 16000 — raised from 12000 after a real IM lesson truncated. At Sonnet
      // 4.6's ~50-60 tok/sec this can take 260-320s and approach the 270s
      // client timeout for very dense lessons; the prompt now enforces strict
      // concision to give the budget margin. If a real lesson still truncates
      // or times out at this ceiling, the route needs splitting into two
      // passes (structure pass + reasoning pass).
      message = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 16000,
        system: composeSystemPrompt(),
        messages: [{ role: 'user', content: userMessage }],
      });
      log('Anthropic returned', { stop_reason: message.stop_reason });
    } catch (err) {
      console.error('[analyze] Anthropic call failed:', err);
      const apiErr = err as { status?: number; message?: string; error?: { message?: string } };
      const detail =
        apiErr?.error?.message ?? apiErr?.message ?? 'Unknown Anthropic error';
      const isTimeout =
        /timeout|timed out|aborted/i.test(detail) || apiErr?.status === 408;
      if (isTimeout) {
        return NextResponse.json(
          {
            error:
              'The analysis took longer than the server allows (270s). This lesson is unusually long. Try uploading a shorter excerpt or a single-activity PDF.',
          },
          { status: 504 },
        );
      }
      if (apiErr?.status === 401) {
        return NextResponse.json(
          { error: 'Anthropic rejected the API key (401). The deployment key is invalid or expired.' },
          { status: 502 },
        );
      }
      if (apiErr?.status === 429) {
        return NextResponse.json(
          { error: 'Anthropic rate limit hit. Wait a minute and try again.' },
          { status: 502 },
        );
      }
      return NextResponse.json(
        { error: `Anthropic API error: ${detail}` },
        { status: 502 },
      );
    }

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      console.error('[analyze] No text block returned. stop_reason:', message.stop_reason);
      return NextResponse.json(
        {
          error: `Model returned no text (stop_reason: ${message.stop_reason}). Likely hit max_tokens — the lesson may be too long.`,
        },
        { status: 502 },
      );
    }

    // If the model hit max_tokens, the JSON is truncated. Report that directly
    // instead of letting the JSON parser fail with a generic "not valid JSON"
    // — the fix for truncation is different from the fix for malformed JSON.
    if (message.stop_reason === 'max_tokens') {
      const outputTokens = message.usage?.output_tokens ?? '?';
      console.error(
        `[analyze] Output truncated at max_tokens (${outputTokens} tokens). Last 300 chars:`,
        textBlock.text.slice(-300),
      );
      return NextResponse.json(
        {
          error: `Output was truncated at ${outputTokens} tokens — this lesson is too dense for the current budget. Try uploading a single-activity excerpt, or contact the developer to raise the token limit.`,
        },
        { status: 502 },
      );
    }

    let parsed: Partial<LessonData> & Record<string, unknown>;
    try {
      const json = extractJSON(textBlock.text);
      parsed = JSON.parse(json) as Partial<LessonData> & Record<string, unknown>;
    } catch (err) {
      console.error('[analyze] JSON parse error:', err);
      console.error(
        '[analyze] stop_reason:', message.stop_reason,
        'output_tokens:', message.usage?.output_tokens,
      );
      console.error(
        '[analyze] First 500 chars of model output:',
        textBlock.text.slice(0, 500),
      );
      console.error(
        '[analyze] Last 500 chars of model output:',
        textBlock.text.slice(-500),
      );
      return NextResponse.json(
        {
          error: `The model returned text that was not valid JSON (stop_reason: ${message.stop_reason}). Try uploading again — this is usually transient.`,
        },
        { status: 502 },
      );
    }

    const lesson = normalizeLesson(parsed);
    log('normalized lesson');
    return NextResponse.json(lesson);
  } catch (err) {
    console.error('[analyze] Unexpected error:', err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Unexpected server error: ${msg}` },
      { status: 500 },
    );
  }
}
