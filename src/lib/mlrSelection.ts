/**
 * Outcome-first MLR selection.
 *
 * The rule this encodes: *outcome drives the choice of strategy*. You decide
 * what students must be able to do, and that decides the routine. It is how you
 * would coach a teacher, and it is backward design — the routine is a means,
 * never the starting point.
 *
 * WHAT THIS REPLACES. The first version keyed on a keyword scan of a
 * model-written learning target. Three things were wrong with it, all measured:
 * four of the eight routines could never be emitted at all; MLR 8 landed on 81%
 * of activities because a two-slot type forced a filler; and the scan read model
 * prose, so the same lesson produced different routines on different runs (G7 U6
 * L22 activity 22.2 drew [3,1] and [1,8] on two runs of one PDF).
 *
 * WHAT MAKES THIS STABLE. Selection reads two inputs, both enums:
 *
 *   outcome_type — the language work the activity's outcome demands
 *   function     — the activity's role in the lesson arc
 *
 * Neither is prose. The activity's outcome is still written by the model and is
 * what the teacher reads, but it does not decide anything: the model classifies
 * it into `outcome_type`, and the classification selects. In this pipeline enum
 * fields have held at a single distinct value across ten runs of a PDF while
 * free text came back 8-9 distinct.
 *
 * The published lesson target — extracted verbatim by learningTargets.ts, never
 * paraphrased — is the fixed reference the activity outcome must restate.
 *
 * FEASIBILITY IS NOT A VETO. Where the outcome calls for a routine the printed
 * materials do not supply (MLR 3 needs a flawed sample; MLR 4 needs splittable
 * materials), the routine still wins and the recommendation carries the one
 * sentence of prep that makes it runnable. A missing precondition is a prep
 * instruction, not a reason to recommend something weaker.
 *
 * MLR 8 IS NOT A SLOT. Discussion Supports is a bundle of teacher moves with no
 * student obligation and no artifact — a teacher can believe they ran it while
 * nothing in the room changed. It is a lesson-level standing support here, and
 * an activity may return a single routine. One routine run properly beats two
 * chips a teacher glances past.
 *
 * The tables below are pedagogy. They are meant to be argued with by someone who
 * runs IM PD, and changing a row should not require understanding the code.
 */

import type { MlrNumber } from './mlrs.ts';

/**
 * The language work an outcome demands. This — not the wording of the outcome —
 * is what selects a routine. Pass 0 classifies each activity into exactly one.
 */
export type OutcomeType =
  /** Students must say or write a precise formulation of an idea. */
  | 'formulate_precisely'
  /** Students must judge whether something is correct and defend the judgement. */
  | 'justify_or_evaluate'
  /** Students must relate two or more strategies or representations. */
  | 'connect_representations'
  /** Students must make sense of a situation or problem before solving it. */
  | 'interpret_situation'
  /** Students must convey information precisely to someone who cannot see it. */
  | 'communicate_precisely'
  /** Students must state a generalisation in their own written words. */
  | 'generalize_in_writing';

export const OUTCOME_TYPES: readonly OutcomeType[] = [
  'formulate_precisely',
  'justify_or_evaluate',
  'connect_representations',
  'interpret_situation',
  'communicate_precisely',
  'generalize_in_writing',
] as const;

export type ActivityRole = 'Setup' | 'Crux' | 'Application' | 'Synthesis';

/** What the activity's printed materials already provide. */
export interface ActivityAffordances {
  /** A wrong answer or flawed sample is printed in the student materials. */
  flawed_sample_provided?: boolean;
  /** A pause or circulate step lets the teacher capture a real student error. */
  error_harvestable?: boolean;
  /** Materials divide so neither partner can complete the task alone. */
  splittable_materials?: boolean;
  /** Students produce visibly different work from one another. */
  student_products_differ?: boolean;
  /** The task ends in a public share or display. */
  public_share_step?: boolean;
  /** Sentence frames are already printed for the student. */
  frames_already_printed?: boolean;
  /** Word count of contextual prose the student must read. */
  context_word_count?: number;
}

export interface AnchorActivity extends ActivityAffordances {
  id: string;
  title?: string;
  function?: string;
  /** The activity's outcome, in words, restating the published lesson target. */
  activity_outcome?: string;
  /** The classification of that outcome. Drives selection. */
  outcome_type?: OutcomeType;
}

export interface MlrRecommendation {
  /** The routine the outcome calls for. */
  lead: MlrNumber;
  /** A second routine only when the outcome genuinely needs two. */
  second: MlrNumber | null;
  /** Why this routine serves this outcome, in one line, for the teacher. */
  because: string;
  /** The one thing to prepare, when the materials do not already supply it. */
  teacher_prep: string | null;
}

/* ------------------------------------------------------------------ */
/*  Outcome -> routine                                                 */
/* ------------------------------------------------------------------ */
//
// Read as: given what students must be able to do, and where in the arc they do
// it, which routine develops that. A second entry appears only where the outcome
// genuinely needs two routines to be reached.

interface Choice {
  lead: MlrNumber;
  second?: MlrNumber;
  because: string;
}

const BY_OUTCOME: Record<
  OutcomeType,
  Partial<Record<ActivityRole, Choice>> & { default: Choice }
> = {
  // Say or write it precisely. Early, the informal wording has to surface before
  // it can be sharpened; at the crux the precise form is first attempted and the
  // predictable error is worth making public; later it gets revised.
  formulate_precisely: {
    Setup: {
      lead: 2,
      because:
        'Students are producing the informal wording this lesson will make precise — capture it now so the class can refine and reuse it.',
    },
    Crux: {
      lead: 3,
      second: 1,
      because:
        'This is where the precise form is first attempted, so the characteristic error is worth surfacing and correcting together before it sets.',
    },
    Application: {
      lead: 1,
      because:
        'Students already hold a formulation; the work now is making it clearer for a reader who cannot see their thinking.',
    },
    default: {
      lead: 1,
      because:
        'Students hold an idea worth sharpening, and a second draft is the shortest route to precision.',
    },
  },

  // Judge and defend. A flawed sample is the whole routine.
  justify_or_evaluate: {
    Setup: {
      lead: 3,
      second: 2,
      because:
        'Judging what is wrong is the outcome, and the informal reasons students give are worth posting beside the formal ones.',
    },
    default: {
      lead: 3,
      because:
        'The outcome is deciding whether something is correct and saying why — improving a flawed sample together is that work.',
    },
  },

  // Relate strategies or representations. Needs more than one thing to relate.
  connect_representations: {
    default: {
      lead: 7,
      second: 1,
      because:
        'The outcome is seeing what two approaches share, which only happens when they are put side by side and the connection is named.',
    },
  },

  // Make sense of the situation before solving.
  interpret_situation: {
    Setup: {
      lead: 5,
      because:
        'Students meet the situation before any question is attached, so the question they generate is one they already understand.',
    },
    default: {
      lead: 6,
      because:
        'The demand is getting through the text before the mathematics starts; reading it three times for three purposes separates those.',
    },
  },

  // Precision for a partner who cannot see what you hold.
  communicate_precisely: {
    default: {
      lead: 4,
      because:
        'Precision is the mathematical point here — a partner who cannot see your card can only act on exactly what you say.',
    },
  },

  // State the generalisation in writing.
  generalize_in_writing: {
    default: {
      lead: 1,
      second: 7,
      because:
        'A generalisation gets sharper by being drafted, read by someone else, and rewritten.',
    },
  },
};

/* ------------------------------------------------------------------ */
/*  Feasibility -> prep instruction                                    */
/* ------------------------------------------------------------------ */
//
// What each routine needs in front of it, and what to tell the teacher when the
// materials do not already supply it. The outcome still chooses the routine —
// this only decides whether a prep line rides along.

interface PrepRule {
  satisfied: (a: AnchorActivity) => boolean;
  /** What to prepare when the materials do not supply the precondition. */
  prep: string;
  /**
   * Where preparing it is not realistic for a teacher in their first three
   * years, the routine steps aside instead.
   *
   * The distinction is prep COST, not prep existence. "Copy one wrong answer off
   * a student's page" is a minute's work and MLR 3 keeps its slot. "Author and
   * cut a card set so the task splits between partners" is not something a
   * novice does the night before, so MLR 4 yields to the next routine that
   * serves the same outcome. Recommending a routine nobody can run is worse than
   * recommending the second-best one.
   */
  substitute?: (a: AnchorActivity) => Choice;
}

const PREP: Partial<Record<MlrNumber, PrepRule>> = {
  3: {
    satisfied: (a) => Boolean(a.flawed_sample_provided),
    prep: 'No wrong answer is printed — capture one from the room. While students work, copy a typical error onto the board anonymously and have the class repair it.',
  },
  4: {
    satisfied: (a) => Boolean(a.splittable_materials),
    prep: 'Split the materials so neither partner can finish alone, and set the rule that partners describe rather than show. If it stalls, let them show each other — it becomes an ordinary matching task.',
    substitute: (a) =>
      a.student_products_differ || a.public_share_step
        ? {
            lead: 7,
            second: 1,
            because:
              'Students hold different work, so the precision comes from putting two of those pieces side by side and naming what they share — the materials here do not divide between partners.',
          }
        : {
            lead: 1,
            because:
              'The wording is what carries the meaning, and a second draft read by someone else is the way to sharpen it without materials that split between partners.',
          },
  },
  7: {
    satisfied: (a) => Boolean(a.student_products_differ || a.public_share_step),
    prep: 'Choose which two pieces of student work go up before the share — one of each approach. Comparing unselected work is a gallery walk with no payoff.',
  },
  2: {
    satisfied: (a) => !a.frames_already_printed,
    prep: 'Frames are already printed for students, so display the language they actually produce rather than the frames themselves.',
  },
  6: {
    satisfied: (a) => (a.context_word_count ?? 0) >= 40,
    prep: 'There is little text to read here — keep this to a single focused read unless the context is genuinely dense.',
  },
};

/* ------------------------------------------------------------------ */
/*  Selection                                                          */
/* ------------------------------------------------------------------ */

const isRole = (v: string | undefined): v is ActivityRole =>
  v === 'Setup' || v === 'Crux' || v === 'Application' || v === 'Synthesis';

/**
 * Recommend the routine(s) an activity's outcome calls for.
 *
 * Pure and total: same activity in, same recommendation out, and every input
 * yields something. A missing `outcome_type` falls back to `formulate_precisely`,
 * the most common demand in a mathematics lesson — callers should log that,
 * because it means Pass 0 did not classify the activity.
 */
/**
 * Where the printed materials give decisive evidence about the language work,
 * that evidence wins over the model's classification.
 *
 * This exists because a published learning target sometimes underdetermines the
 * answer. IM's "use various strategies to write an equivalent expression" says
 * what students do with mathematics and nothing about what they do with
 * language, and the classifier read one such activity three different ways
 * across eight runs. Adding guidance to the prompt made it worse — it
 * destabilised decisions it was not aimed at, including which activity is the
 * crux — so resolution happens here, in code, off inputs that measured
 * perfectly stable: 8/8 agreement on every affordance on every activity.
 *
 * Only two signals override, and both are facts about the page, not pedagogy.
 */
function resolveFromMaterials(activity: AnchorActivity, stated: OutcomeType): OutcomeType {
  // Content that divides between partners means the wording has to carry the
  // meaning. Corroboration required: if students already hold DIFFERENT work,
  // the point is comparing it, not bridging an information gap.
  //
  // The guard is not decoration. A single boolean is not a safe trigger — on
  // G6 U2 L1 activity 1.3, splittable_materials came back true once in eight
  // runs, and a bare override turned that one flip into a different routine.
  // Requiring two signals to agree absorbs a rare misread instead of amplifying
  // it, and 1.3 reports student_products_differ 8/8, so the guard holds.
  if (activity.splittable_materials && !activity.student_products_differ) {
    return 'communicate_precisely';
  }

  // Something incorrect is printed for students to find: the work is judging it.
  if (activity.flawed_sample_provided) return 'justify_or_evaluate';

  return stated;
}

export function recommendMlrs(activity: AnchorActivity): MlrRecommendation {
  const stated: OutcomeType = activity.outcome_type ?? 'formulate_precisely';
  const outcome: OutcomeType = resolveFromMaterials(activity, stated);
  const role = isRole(activity.function) ? activity.function : undefined;

  const table = BY_OUTCOME[outcome];
  const choice = (role && table[role]) || table.default;

  const rule = PREP[choice.lead];
  const unmet = rule ? !rule.satisfied(activity) : false;

  // Where the precondition is unmet AND preparing it is unrealistic, take the
  // substitute rather than recommending something the teacher cannot run.
  const final = unmet && rule?.substitute ? rule.substitute(activity) : choice;
  const finalRule = PREP[final.lead];
  const finalUnmet = finalRule ? !finalRule.satisfied(activity) : false;

  return {
    lead: final.lead,
    second: final.second ?? null,
    because: final.because,
    teacher_prep: finalUnmet && !finalRule?.substitute ? (finalRule?.prep ?? null) : null,
  };
}

/**
 * A stable digest of the selection tables. Folded into the cache key so that
 * changing a pairing, a rationale, or a prep line invalidates stored lessons
 * automatically.
 *
 * Manual version bumping failed twice: selection behaviour changed three times
 * under one PIPELINE_VERSION string, and a lesson generated by the older logic
 * kept being served. A human step that must fire on every edit is not a
 * safeguard.
 */
export function selectionFingerprint(): string {
  const preps = Object.entries(PREP)
    .map(([n, rule]) => `${n}:${rule?.prep ?? ''}:${rule?.substitute ? 'sub' : 'nosub'}`)
    .join('|');
  return JSON.stringify(BY_OUTCOME) + '||' + preps;
}

export type MlrPlan = Record<string, MlrRecommendation>;

export function buildMlrPlan(activities: AnchorActivity[]): MlrPlan {
  const plan: MlrPlan = {};
  for (const activity of activities) {
    if (activity?.id) plan[activity.id] = recommendMlrs(activity);
  }
  return plan;
}

/**
 * True when the lesson carries enough language load that Discussion Supports
 * should stand behind all of it. MLR 8 is surfaced this way rather than
 * consuming an activity's slot.
 */
export function needsStandingSupports(activities: AnchorActivity[]): boolean {
  return activities.some(
    (a) =>
      a.outcome_type === 'communicate_precisely' ||
      a.outcome_type === 'formulate_precisely' ||
      (a.context_word_count ?? 0) >= 40,
  );
}

/** The routines a plan uses, in order, for the wristband legend. */
export function routinesUsed(plan: MlrPlan): MlrNumber[] {
  const used = new Set<MlrNumber>();
  for (const rec of Object.values(plan)) {
    used.add(rec.lead);
    if (rec.second) used.add(rec.second);
  }
  return [...used].sort((a, b) => a - b);
}

/** Every routine assigned to one activity, lead first. */
export function routinesFor(rec: MlrRecommendation): MlrNumber[] {
  return rec.second ? [rec.lead, rec.second] : [rec.lead];
}

/**
 * The directive injected into every downstream pass, so each pass argues for the
 * routines the outcome selected rather than choosing its own.
 */
export function describeMlrPlan(
  plan: MlrPlan,
  nameOf: (n: MlrNumber) => string,
  lessonTargets: string[] = [],
): string {
  const lines = Object.entries(plan).map(([id, rec]) => {
    const routines = rec.second
      ? `MLR ${rec.lead} (${nameOf(rec.lead)}) then MLR ${rec.second} (${nameOf(rec.second)})`
      : `MLR ${rec.lead} (${nameOf(rec.lead)}) — this activity needs one routine, not two`;
    const prep = rec.teacher_prep ? `\n    PREP: ${rec.teacher_prep}` : '';
    return `- ${id}: ${routines}\n    WHY: ${rec.because}${prep}`;
  });

  const targets = lessonTargets.length
    ? `The lesson's published learning targets, verbatim from the source document:\n${lessonTargets
        .map((t) => `  - ${t}`)
        .join('\n')}\n\nEvery activity outcome must restate one of these in that activity's terms.\n\n`
    : '';

  return `${targets}MLR ASSIGNMENT — FIXED, and selected from each activity's outcome. Use EXACTLY these and no others wherever you reference an MLR for that activity. Do not substitute a routine you would have chosen; write the reasoning for the one assigned and tie it to the outcome. Where an activity has one routine, do not invent a second.

${lines.join('\n')}`;
}

/* ------------------------------------------------------------------ */
/*  Enforcement                                                        */
/* ------------------------------------------------------------------ */
//
// The prompt directive is the primary mechanism — a pass that knows its
// assignment writes coherent reasoning for it. This is the backstop for a pass
// that ignores it, so the guarantee is structural rather than probabilistic.
//
// Where an out-of-plan routine is snapped inside mlr_inference, the surrounding
// `why_here` prose was written about a different routine and can end up arguing
// for one by the wrong name. That cost is accepted because a wrong-but-consistent
// label beats a different answer every run, and deviations are counted so we can
// see how often it actually happens.

import type { LessonData, MlrRef } from './types.ts';
import { MLRS } from './mlrs.ts';

const refFor = (n: MlrNumber): MlrRef => ({ number: n, name: MLRS[n].name });

export interface MlrEnforcementResult {
  lesson: LessonData;
  deviations: number;
}

export function enforceMlrPlan(lesson: LessonData, plan: MlrPlan): MlrEnforcementResult {
  let deviations = 0;

  const snap = (activityId: string, mlr: MlrRef | undefined): MlrRef | undefined => {
    const rec = plan[activityId];
    if (!rec || !mlr) return mlr;
    if (routinesFor(rec).includes(mlr.number)) return mlr;
    deviations++;
    return refFor(rec.lead);
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
    const rec = plan[a.activity_id];
    if (!rec) continue;
    const assigned = routinesFor(rec);
    const returned = (a.mlrs ?? []).map((m) => m.number);
    if (returned.length !== assigned.length || returned.some((n) => !assigned.includes(n))) {
      deviations++;
    }
    a.mlrs = assigned.map((n, i) => ({
      number: n,
      name: MLRS[n].name,
      why_here: a.mlrs?.[i]?.why_here ?? a.mlrs?.[0]?.why_here ?? rec.because,
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

  // The legend lists exactly the routines this lesson uses.
  const used = routinesUsed(plan);
  const existing = new Map((lesson.wristband?.mlr_legend ?? []).map((e) => [e.mlr.number, e]));
  if (lesson.wristband) {
    lesson.wristband.mlr_legend = used.map(
      (n) => existing.get(n) ?? { mlr: refFor(n), one_line_cue: MLRS[n].definition ?? '' },
    );
  }

  return { lesson, deviations };
}
