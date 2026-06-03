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

// Two-pass generation needs more than the default 300s. Vercel Pro allows up
// to 800s on serverless functions; 600s leaves headroom for two ~240s Anthropic
// calls plus pdf-parse, normalization, and the error path.
export const maxDuration = 600;

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
    const client = new Anthropic({ timeout: 200_000, maxRetries: 0 });

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
  - Exactly ONE activity has is_crux: true — the activity that does the central mathematical work, typically not the warm-up or cool-down
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

For each activity in mlr_inference, produce { activity_id, language_work, mlrs: [{ number, name, why_here }] }. Select 1-2 MLRs per activity. why_here is 1-2 sentences explaining why THIS routine fits THIS activity, referencing the specific student behavior or prompt.

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

    const buildPassDMessage = (anchorJson: string) =>
      `Analyze this math lesson. This is PASS D (decisions + wristband) of FOUR PARALLEL passes after the anchor. Passes A (structure), B (MLR + ELSF inference), and C (anticipated thinking) are running in parallel.

Return a single JSON object with EXACTLY these top-level fields (and no others):
- decision_guide { activities: [{ activity_id, scenarios }] }
- wristband { arc_one_line, preflight, top_signals, top_frictions, activities: [{ activity_id, tiles, synthesis_short }], mlr_legend, lesson_synthesis_short }

decision_guide.activities and wristband.activities MUST each cover EVERY activity from the anchor.

decision_guide MUST include a mix of scenario types: 1-2 common-error, 1 productive-insight, 1 on-track, 1 productive-struggle or partial-understanding across the lesson. Total ~10-12 scenarios.

For MLL scenarios (is_mll: true), proficiency_moves MUST have emerging/developing/expanding all populated. Emerging.nonverbal MUST be a concrete physical action. For non-MLL scenarios, use flat_move and set proficiency_moves: null.

Every MLL scenario MUST be anchored to a specific MLR. Every wristband tile with friction_type 'language' or 'language-math' MUST anchor to an MLR.

wristband.activities each get 2-3 tiles MAXIMUM.
wristband.mlr_legend lists the 2-3 routines this lesson runs on most heavily.
EXACTLY ONE wristband tile across the whole lesson has is_crux_moment: true, on the activity the anchor marked is_crux: true.

wristband.synthesis_short per activity is the in-class compression of the activity's close — 10-18 words, verb-first, lesson-specific. NEVER generic. Must name a specific student work or question. Tied to the learning_target in the anchor.
wristband.lesson_synthesis_short is the in-class compression of the lesson close — 12-22 words, verb-first, lesson-specific. NEVER generic. Tied to the destination in the anchor.

${makeAlignmentBlock(anchorJson)}

Write in plain language a first-year teacher could read at 9pm the night before teaching. No academic jargon.

${concisionRules}

Lesson text:
${truncatedText}`;

    type PassResult =
      | { ok: true; parsed: Partial<LessonData> & Record<string, unknown> }
      | { ok: false; response: NextResponse };

    async function runPass(
      passName: string,
      userMessage: string,
      max_tokens: number,
    ): Promise<PassResult> {
      try {
        log(`calling Anthropic — pass ${passName}`);
        const message = await client.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens,
          system: composeSystemPrompt(),
          messages: [{ role: 'user', content: userMessage }],
        });
        log(`Pass ${passName} returned`, {
          stop_reason: message.stop_reason,
          output_tokens: message.usage?.output_tokens,
        });

        const block = message.content.find((b) => b.type === 'text');
        if (!block || block.type !== 'text') {
          console.error(`[analyze] Pass ${passName}: no text block. stop_reason:`, message.stop_reason);
          return {
            ok: false,
            response: NextResponse.json(
              { error: `Pass ${passName} returned no text (stop_reason: ${message.stop_reason}).` },
              { status: 502 },
            ),
          };
        }

        if (message.stop_reason === 'max_tokens') {
          const outputTokens = message.usage?.output_tokens ?? '?';
          console.error(
            `[analyze] Pass ${passName} truncated at ${outputTokens} tokens. Last 300 chars:`,
            block.text.slice(-300),
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
          const parsed = JSON.parse(extractJSON(block.text)) as Partial<LessonData> &
            Record<string, unknown>;
          return { ok: true, parsed };
        } catch (err) {
          console.error(`[analyze] Pass ${passName} JSON parse error:`, err);
          console.error(`[analyze] Pass ${passName} last 500 chars:`, block.text.slice(-500));
          return {
            ok: false,
            response: NextResponse.json(
              {
                error: `Pass ${passName} returned text that was not valid JSON (stop_reason: ${message.stop_reason}). Try uploading again — this is usually transient.`,
              },
              { status: 502 },
            ),
          };
        }
      } catch (err) {
        console.error(`[analyze] Pass ${passName} Anthropic call failed:`, err);
        const apiErr = err as { status?: number; message?: string; error?: { message?: string } };
        const detail = apiErr?.error?.message ?? apiErr?.message ?? 'Unknown Anthropic error';
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
              { error: 'Anthropic rejected the API key (401). The deployment key is invalid or expired.' },
              { status: 502 },
            ),
          };
        }
        if (apiErr?.status === 429) {
          return {
            ok: false,
            response: NextResponse.json(
              { error: `Anthropic rate limit hit on Pass ${passName}. Wait a minute and try again.` },
              { status: 502 },
            ),
          };
        }
        return {
          ok: false,
          response: NextResponse.json(
            { error: `Anthropic API error on Pass ${passName}: ${detail}` },
            { status: 502 },
          ),
        };
      }
    }

    log('starting anchor pass (Pass 0)');
    const resAnchor = await runPass('0 (anchor)', passAnchorMessage, 2000);
    if (!resAnchor.ok) return resAnchor.response;
    const anchorJson = JSON.stringify(resAnchor.parsed, null, 2);
    log('anchor returned', { anchor_size_chars: anchorJson.length });

    log('starting 4 parallel passes given anchor');
    const [resA, resB, resC, resD] = await Promise.all([
      runPass('A (structure)', buildPassAMessage(anchorJson), 8000),
      runPass('B (MLR + ELSF inference)', buildPassBMessage(anchorJson), 6000),
      runPass('C (anticipated thinking)', buildPassCMessage_Thinking(anchorJson), 6000),
      runPass('D (decisions + wristband)', buildPassDMessage(anchorJson), 8000),
    ]);
    log('all 4 passes settled');

    // First failure wins — return its error message.
    if (!resA.ok) return resA.response;
    if (!resB.ok) return resB.response;
    if (!resC.ok) return resC.response;
    if (!resD.ok) return resD.response;

    // Merge. Each pass owns a disjoint set of top-level fields.
    // - Anchor produces: meta, destination, activities (skeleton).
    // - Pass A produces: arc_statement, key_vocabulary, activities (FULL),
    //   adaptation_guardrails, lesson_synthesis.
    // - Pass B produces: mlr_inference, elsf_inference.
    // - Pass C produces: anticipated_thinking.
    // - Pass D produces: decision_guide, wristband.
    //
    // On overlap, Pass A's activities (full) beat the anchor's skeleton; the
    // anchor's meta + destination win since they were the alignment source of
    // truth that A built on top of.
    const parsed = {
      ...resD.parsed,
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
