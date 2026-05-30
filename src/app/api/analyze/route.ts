import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { LESSON_ANALYSIS_PROMPT } from '@/lib/prompts';
import {
  LessonData,
  MlrRef,
  ActivityTeacherMove,
  SentenceFrame,
  DoNotRemoveItem,
  ProficiencyAdaptation,
} from '@/lib/types';
import { isValidMlrNumber, MLRS, MlrNumber } from '@/lib/mlrs';

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
      function: a.function ?? 'Application',
      duration: a.duration ?? '',
      grouping: a.grouping ?? '',
      language_demand: a.language_demand ?? 'low',
      function_summary: a.function_summary ?? '',
      is_crux: a.is_crux ?? false,
      friction_points: (a.friction_points ?? []).map((fp) => ({
        description: fp.description ?? '',
        type: fp.type ?? 'math',
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
        entering: normalizeProficiency(rawProf.entering),
        developing: normalizeProficiency(rawProf.developing),
        bridging: normalizeProficiency(rawProf.bridging),
      },
    },
    anticipated_thinking: {
      orientation: raw.anticipated_thinking?.orientation ?? '',
      activities: (raw.anticipated_thinking?.activities ?? []).map((a) => ({
        activity_id: a.activity_id ?? '',
        patterns: (a.patterns ?? []).map((p) => ({
          label: p.label ?? '',
          frequency: p.frequency ?? 'some students',
          type: p.type ?? 'on-track',
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
          scenario_type: s.scenario_type ?? 'common-error',
          label: s.label ?? '',
          interpretation: s.interpretation ?? '',
          is_mll: s.is_mll ?? false,
          flat_move: s.flat_move ?? null,
          proficiency_moves: s.proficiency_moves ?? null,
          mll_framework_note: s.mll_framework_note ?? null,
          proficiency_divergence_note:
            (s as { proficiency_divergence_note?: string | null }).proficiency_divergence_note ?? null,
          ...(normalizeMlr((s as { mlr?: unknown }).mlr)
            ? { mlr: normalizeMlr((s as { mlr?: unknown }).mlr)! }
            : {}),
        })),
      })),
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
      top_signals: raw.wristband?.top_signals ?? [],
      top_frictions: raw.wristband?.top_frictions ?? [],
      activities: (raw.wristband?.activities ?? []).map((a) => ({
        activity_id: a.activity_id ?? '',
        tiles: (a.tiles ?? []).map((t) => ({
          observation_short: t.observation_short ?? '',
          friction_type: t.friction_type ?? 'math',
          move_short: t.move_short ?? '',
          ...(normalizeMlr((t as { mlr?: unknown }).mlr)
            ? { mlr: normalizeMlr((t as { mlr?: unknown }).mlr)! }
            : {}),
        })),
      })),
      mlr_legend: (raw.wristband?.mlr_legend ?? [])
        .map((e) => {
          const mlr = normalizeMlr(e.mlr);
          if (!mlr) return null;
          return { mlr, one_line_cue: e.one_line_cue ?? '' };
        })
        .filter((x): x is { mlr: MlrRef; one_line_cue: string } => x !== null),
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('pdf') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let pdfText: string;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse/lib/pdf-parse.js');
      const data = await pdfParse(buffer);
      pdfText = data.text;
    } catch {
      return NextResponse.json(
        { error: 'Could not read this PDF. Try a text-based PDF rather than a scan.' },
        { status: 400 }
      );
    }

    if (!pdfText || pdfText.trim().length < 100) {
      return NextResponse.json(
        { error: 'Could not read this PDF. Try a text-based PDF rather than a scan.' },
        { status: 400 }
      );
    }

    const truncatedText =
      pdfText.length > MAX_PDF_CHARS ? pdfText.slice(0, MAX_PDF_CHARS) : pdfText;

    const userMessage = `Analyze this math lesson and return the full JSON described in your system prompt.

You MUST produce ALL top-level sections, fully populated for every activity in the lesson:
- meta, arc_statement, destination, key_vocabulary, activities, adaptation_guardrails, anticipated_thinking, decision_guide, mlr_inference, wristband

The mlr_inference block MUST appear first in your output. Subsequent fields must be consistent with what mlr_inference says about each activity.

Across the decision_guide, the scenarios MUST include a mix of types — not just common-error. At minimum: 1-2 common-error, 1 productive-insight, 1 on-track, and 1 productive-struggle or partial-understanding across the lesson.

Write in plain language a first-year teacher could read at 9pm the night before teaching. No academic jargon.

Lesson text:
${truncatedText}`;

    const client = new Anthropic();

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 16000,
      system: LESSON_ANALYSIS_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      console.error('No text block. stop_reason:', message.stop_reason);
      return NextResponse.json(
        { error: 'Something went wrong. Try uploading again.' },
        { status: 500 }
      );
    }

    let parsed: Partial<LessonData> & Record<string, unknown>;
    try {
      const json = extractJSON(textBlock.text);
      parsed = JSON.parse(json) as Partial<LessonData> & Record<string, unknown>;
    } catch (err) {
      console.error('JSON parse error:', err);
      return NextResponse.json(
        { error: 'Something went wrong. Try uploading again.' },
        { status: 500 }
      );
    }

    const lesson = normalizeLesson(parsed);
    return NextResponse.json(lesson);
  } catch (err) {
    console.error('Analyze route error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Try uploading again.' },
      { status: 500 }
    );
  }
}
