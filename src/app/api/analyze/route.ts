import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { LESSON_ANALYSIS_PROMPT, COHERENCE_EDITOR_PROMPT } from '@/lib/prompts';
import { LessonData } from '@/lib/types';

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

function normalizeLesson(raw: Partial<LessonData>): LessonData {
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
      friction_points: a.friction_points ?? [],
      success_signals: a.success_signals ?? [],
      teacher_moves: a.teacher_moves ?? [],
      causal_link: a.causal_link ?? null,
      extension: a.extension ?? null,
    })),
    adaptation_guardrails: {
      mathematical_purpose: raw.adaptation_guardrails?.mathematical_purpose ?? '',
      safe_to_change: raw.adaptation_guardrails?.safe_to_change ?? [],
      do_not_remove: raw.adaptation_guardrails?.do_not_remove ?? [],
      rigor_check: raw.adaptation_guardrails?.rigor_check ?? '',
      by_proficiency: {
        entering: raw.adaptation_guardrails?.by_proficiency?.entering ?? '',
        developing: raw.adaptation_guardrails?.by_proficiency?.developing ?? '',
        bridging: raw.adaptation_guardrails?.by_proficiency?.bridging ?? '',
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
        })),
        sentence_frames: a.sentence_frames ?? [],
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
        })),
      })),
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
- meta, arc_statement, destination, key_vocabulary, activities, adaptation_guardrails, anticipated_thinking, decision_guide

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

    let parsed: Partial<LessonData>;
    try {
      const json = extractJSON(textBlock.text);
      parsed = JSON.parse(json) as Partial<LessonData>;
    } catch (err) {
      console.error('JSON parse error:', err);
      return NextResponse.json(
        { error: 'Something went wrong. Try uploading again.' },
        { status: 500 }
      );
    }

    // NOTE: The Coherence Editor second pass is intentionally disabled.
    // It was timing out 100% of production uploads because regenerating
    // the full ~15K-token JSON exceeds Haiku's output capacity in any
    // reasonable budget. Code preserved in git history; will be redesigned
    // to flag issues rather than rewrite the full JSON (see Option B in
    // the May 26 update notes).

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
