/**
 * Deterministic MLR assignment.
 *
 * Which routines an activity uses is a mapping, not a judgement call, and it was
 * the least stable thing the model produced. Across 10 runs of the same lesson
 * on 2026-08-19 the crux activity drew [3,8], [2,8], [7,8], [1,8], and [8] —
 * five different answers to a question with one right answer. For a tool whose
 * premise is that teachers build a recognizable repertoire across lessons, that
 * is the most damaging variance in the pipeline: the same lesson taught by two
 * teachers in the same PLC recommends different routines.
 *
 * So we compute it. Same rule as src/lib/eld/kluFromElsf.ts — do not build a
 * second demand classifier, and never call a model for something a table can
 * answer. This is a pure function of the anchor, and the anchor is the stable
 * part of the pipeline (activity ids and crux marker held at 1 distinct value
 * across 10 runs).
 *
 * Assignment runs BEFORE the parallel passes and is injected into their prompts,
 * so `why_here`, the wristband chips, and the friction-point anchors all argue
 * for the same routines instead of each pass picking its own.
 *
 * The pairings below are pedagogy, not code, and are meant to be tuned by
 * someone who runs IM PD rather than by a developer.
 */

import { MlrNumber } from './mlrs';
import { kluFromElsf } from './eld/kluFromElsf';
import type { KLU } from './eld/types';

export interface AnchorActivity {
  id: string;
  title?: string;
  function?: string;
  language_demand?: string;
  learning_target?: string;
}

export type MlrPair = [MlrNumber, MlrNumber];

// Primary pairing by Key Language Use. First entry is the lead routine — the one
// that carries the activity's dominant language work; second is the support.
//
//   Argue    -> 3 Critique, Correct, and Clarify + 7 Compare and Connect
//   Explain  -> 1 Stronger and Clearer Each Time + 8 Discussion Supports
//   Inform   -> 2 Collect and Display            + 8 Discussion Supports
//   Narrate  -> 6 Three Reads                    + 8 Discussion Supports
const BY_KLU: Record<KLU, MlrPair> = {
  Argue: [3, 7],
  Explain: [1, 8],
  Inform: [2, 8],
  Narrate: [6, 8],
};

// The activity's role in the arc overrides the support routine. A Setup activity
// is where students' own language first surfaces (Collect and Display); a
// Synthesis is where representations get lined up against each other (Compare
// and Connect); an Application is where a first draft gets revised (Stronger and
// Clearer). Crux keeps whatever the KLU pairing chose — the crux is defined by
// its mathematics, not by its position.
const BY_FUNCTION: Record<string, MlrNumber> = {
  Setup: 2,
  Application: 1,
  Synthesis: 7,
};

/**
 * Assign exactly two distinct MLRs to an activity. Pure and total: the same
 * anchor activity always yields the same pair, and every input yields a pair.
 */
export function selectMlrs(activity: AnchorActivity): MlrPair {
  // The KLU bridge scans ELSF's language_functions. At anchor time we do not
  // have those yet, so we scan the two anchor fields that describe the same
  // thing in the same vocabulary: what students are asked to do.
  const signals = [activity.learning_target ?? '', activity.title ?? ''].filter(Boolean);
  const klu = kluFromElsf(signals);

  const [lead, support] = BY_KLU[klu];

  const byFunction = BY_FUNCTION[activity.function ?? ''];
  let second: MlrNumber = byFunction ?? support;

  // A high language demand always earns Discussion Supports — it is the routine
  // that makes any of the others survivable for a student still building English.
  if (activity.language_demand === 'high') second = 8;

  // Never return a duplicate pair. Fall back to the KLU's support, then to 8,
  // then to 7 — a fixed order, so the tie-break is deterministic too.
  if (second === lead) {
    second = support !== lead ? support : lead === 8 ? 7 : 8;
  }

  return [lead, second];
}

export type MlrPlan = Record<string, MlrPair>;

export function buildMlrPlan(activities: AnchorActivity[]): MlrPlan {
  const plan: MlrPlan = {};
  for (const activity of activities) {
    if (activity?.id) plan[activity.id] = selectMlrs(activity);
  }
  return plan;
}

/**
 * The directive appended to every downstream pass prompt, so each pass argues
 * for the assigned routines rather than choosing its own.
 */
export function describeMlrPlan(plan: MlrPlan, nameOf: (n: MlrNumber) => string): string {
  const lines = Object.entries(plan).map(
    ([id, [a, b]]) => `- ${id}: MLR ${a} (${nameOf(a)}) and MLR ${b} (${nameOf(b)})`,
  );
  return `MLR ASSIGNMENT — FIXED. These routines were assigned for this lesson. Use EXACTLY these, and no others, wherever you reference an MLR for that activity. Do not substitute a routine you would have picked instead; write the reasoning for the one assigned.

${lines.join('\n')}`;
}

/* ------------------------------------------------------------------ */
/*  Enforcement                                                        */
/* ------------------------------------------------------------------ */
//
// The prompt directive is the primary mechanism — a pass that knows its
// assignment writes coherent reasoning for it. This is the backstop for when a
// pass ignores it, so the guarantee is structural rather than probabilistic.
//
// Where an out-of-plan routine is snapped inside mlr_inference, the surrounding
// `why_here` prose was written about the routine the model chose, so it can end
// up arguing for a routine by the wrong name. That is a real cost, accepted
// because a wrong-but-consistent label beats a different answer every run — and
// deviations are counted so we can see how often it actually happens.

import type { LessonData, MlrRef } from './types';
import { MLRS } from './mlrs';

const refFor = (n: MlrNumber): MlrRef => ({ number: n, name: MLRS[n].name });

export interface MlrEnforcementResult {
  lesson: LessonData;
  deviations: number;
}

export function enforceMlrPlan(lesson: LessonData, plan: MlrPlan): MlrEnforcementResult {
  let deviations = 0;

  // Snap a single ref if the activity has a plan and the ref falls outside it.
  const snap = (activityId: string, mlr: MlrRef | undefined): MlrRef | undefined => {
    const pair = plan[activityId];
    if (!pair || !mlr) return mlr;
    if (pair.includes(mlr.number)) return mlr;
    deviations++;
    return refFor(pair[0]);
  };

  for (const activity of lesson.activities ?? []) {
    for (const fp of activity.friction_points ?? []) {
      if (fp.mlr) fp.mlr = snap(activity.id, fp.mlr)!;
    }
    for (const tm of activity.teacher_moves ?? []) {
      if (tm.mlr) tm.mlr = snap(activity.id, tm.mlr)!;
    }
  }

  for (const a of lesson.mlr_inference?.activities ?? []) {
    const pair = plan[a.activity_id];
    if (!pair) continue;
    const returned = (a.mlrs ?? []).map((m) => m.number);
    if (returned.length !== pair.length || returned.some((n) => !pair.includes(n))) deviations++;
    a.mlrs = pair.map((n, i) => ({
      number: n,
      name: MLRS[n].name,
      // Keep the model's reasoning positionally where it already matches;
      // otherwise carry whatever prose it wrote for that slot.
      why_here: a.mlrs?.[i]?.why_here ?? a.mlrs?.[0]?.why_here ?? '',
    }));
  }

  for (const a of lesson.anticipated_thinking?.activities ?? []) {
    for (const p of a.patterns ?? []) if (p.mlr) p.mlr = snap(a.activity_id, p.mlr)!;
    for (const f of a.sentence_frames ?? []) if (f.mlr) f.mlr = snap(a.activity_id, f.mlr)!;
  }

  for (const a of lesson.decision_guide?.activities ?? []) {
    for (const s of a.scenarios ?? []) if (s.mlr) s.mlr = snap(a.activity_id, s.mlr)!;
  }

  for (const a of lesson.wristband?.activities ?? []) {
    for (const t of a.tiles ?? []) if (t.mlr) t.mlr = snap(a.activity_id, t.mlr)!;
  }

  // The legend should list exactly the routines this lesson actually uses.
  const used = [...new Set(Object.values(plan).flat())].sort((x, y) => x - y);
  const existing = new Map((lesson.wristband?.mlr_legend ?? []).map((e) => [e.mlr.number, e]));
  if (lesson.wristband) {
    lesson.wristband.mlr_legend = used.map(
      (n) => existing.get(n) ?? { mlr: refFor(n), one_line_cue: MLRS[n].definition ?? '' },
    );
  }

  return { lesson, deviations };
}
