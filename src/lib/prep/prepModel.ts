/**
 * Phone prep — LessonData → the guided evening prep.
 *
 * The phone prep is not the five tools shrunk to a phone. It is a ~17 minute
 * sequence in which the teacher commits to something (an answer, a prediction,
 * a spoken move) before Premo shows its own. This module decides WHAT each step
 * shows; the components in src/components/prep only decide how. Pure, no React,
 * so the selection rules can be tested on their own (npm run check:prep).
 *
 * The rules below come from a five-reviewer comparison with Premo's Social
 * Studies prep (docs/PHONE-PREP-ASSESSMENT.md). The ones easiest to lose:
 *
 *   1. "Do it as a student" is a STUDENT task from the lesson's close, never the
 *      rigor check. The rigor check is a yes/no question about students.
 *   2. Crux focus means the crux and what feeds it — but only the feeder's
 *      failures, the ones that would leave the crux nothing to work on.
 *   3. Commit-before-reveal: the concrete scene shows BEFORE the teacher speaks;
 *      criteria check what a move protects and never contain the model wording.
 *   4. What is rehearsed is what goes to class: the In-class card reuses the
 *      rehearsed say lines verbatim.
 *   5. Show what the lesson data already has before asking generation for more:
 *      the mathematical purpose, the crux setup, listen-for questions, frames.
 */

import type {
  Activity,
  DecisionScenario,
  KeyVocabularyTerm,
  LessonData,
  MlrRef,
  ScenarioType,
  SentenceFrame,
  TeacherMove,
  ThinkingPattern,
} from '../types.ts';
import { bandLevels, type ProficiencyBand } from '../eld/types.ts';

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

export type StepKey = 'orient' | 'student' | 'predict' | 'rehearse' | 'adjust' | 'carry';

export interface PrepStep {
  key: StepKey;
  name: string;
  minutes: number;
  /** Which of the five tools the step draws on — shown so the Library is findable. */
  tool: string;
  /** What the teacher does. Shown as "You read", "You write"... */
  verb: string;
  lede: string;
  /** Steps that centre on the crux get the crux chip. */
  crux: boolean;
}

/** Prep budget the clock is measured against. */
export const PREP_BUDGET_MINUTES = 20;

/** Most scenarios rehearsed aloud in one sitting. Premo's design settles on six. */
export const MAX_REHEARSAL = 6;

/**
 * Per-activity rehearsal quotas. The crux gets most of the six. The feeder gets
 * only failures that would starve the crux. A high-language-demand activity
 * after the crux is in the pool BECAUSE of its language demand, so it gets one
 * place and that place goes to a language scenario when there is one.
 */
const REHEARSAL_QUOTA: Record<FocusRole, number> = { crux: 3, feeder: 2, after: 1 };

/** Scenario types that are failures — the ones a feeder can pass on to the crux. */
const FAILURE_TYPES: ScenarioType[] = ['common-error', 'partial-understanding', 'productive-struggle'];

// ---------------------------------------------------------------------------
// Model types
// ---------------------------------------------------------------------------

export type FocusRole = 'crux' | 'feeder' | 'after';

export interface PrepActivity {
  id: string;
  /** "Warm-Up", "Activity 1"... or the id when the title carries no slot. */
  label: string;
  title: string;
  role: Activity['function'];
  /** Start offset from the top of class, "0:10". Null when durations can't be read. */
  start: string | null;
  minutes: number | null;
  isCrux: boolean;
  focus: FocusRole | null;
  demand: Activity['language_demand'];
  /** One observation to watch for, for the Orient timeline. */
  watchFor: string | null;
  /** What the teacher has to prepare for this activity, from the routine selector. */
  prep: string | null;
  /** How the language works in this activity, from the ELSF layer. */
  language: {
    receptive: string;
    productive: string;
    interactive: string;
    bridge: string;
    homeLanguage: string | null;
  } | null;
  source: Activity;
}

export type PatternKind = 'error' | 'almost' | 'build' | 'stretch' | 'lang';

export interface PrepPattern {
  activityId: string;
  kind: PatternKind;
  kindLabel: string;
  /** The generator's own frequency claim, in its words, so Most/Some/Few can be checked against it. */
  frequencyLabel: string;
  label: string;
  description: string;
  move: string;
  mll: boolean;
  mlr?: MlrRef;
}

export interface BandMove {
  band: ProficiencyBand;
  say: string | null;
  move: string;
  nonverbal: string | null;
  avoid: string | null;
}

export interface PrepScenario {
  /** Stable within a lesson: "<activity>:<index in decision_guide>". */
  id: string;
  activityId: string;
  focus: FocusRole;
  type: ScenarioType;
  typeLabel: string;
  /** The category, as a heading. */
  notice: string;
  /** The concrete moment. Shown BEFORE the teacher speaks — it is what they are responding to. */
  scene: string;
  mll: boolean;
  /** Present for whole-class scenarios. */
  flat: (TeacherMove & { say: string | null }) | null;
  /** Present for MLL scenarios: one move per planning band, all bands. */
  byBand: BandMove[] | null;
  /** What to check a spoken response against. Never contains the model wording. */
  criteria: string[];
  mlr?: MlrRef;
}

export interface InClassLine {
  see: string;
  /** Verbatim from rehearsal. Band-labelled when the move differs by level. */
  say: { label: string | null; text: string }[];
  avoid: string | null;
}

export interface PrepModel {
  heading: string;
  /** "6.2.1" style code for the app bar. */
  code: string;
  totalTime: string;
  destination: string;
  /** The mathematical idea the lesson exists for. Correct where the rigor check may not be. */
  idea: string;
  arc: string;
  activities: PrepActivity[];
  crux: PrepActivity | null;
  steps: PrepStep[];
  estimateMinutes: number;
  proof: {
    /** How the lesson closes, verbatim. Written to the teacher; the student question is inside it. */
    closing: string | null;
    /** Lesson-level look-fors a written or spoken answer can actually show. */
    lookFors: string[];
  };
  patterns: PrepPattern[];
  /** Questions to listen for at the crux — observable, and in the room's words. */
  listenFor: string[];
  scenarios: PrepScenario[];
  rigorCheck: string;
  cuts: { id: string; text: string }[];
  neverCut: { text: string; mlr?: MlrRef }[];
  supports: Record<ProficiencyBand, { text: string; mlr?: MlrRef }>;
  /** Crux frames and what each band does and is reaching for at the crux. */
  language: {
    frames: SentenceFrame[];
    vocabulary: KeyVocabularyTerm[];
    profile: Partial<Record<ProficiencyBand, { does: string; reaching: string }>>;
  };
  setup: {
    crux: string | null;
    checklist: string[];
  };
  inClass: {
    /** The first thing to ask at the crux, verbatim. */
    ask: string | null;
    setup: string | null;
    lines: InClassLine[];
  };
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

// Same badge wording as the Thinking tool, except language-math. "Language
// barrier" framed the lesson's own target language ("for every two squares
// there is one triangle") as a deficit; the app's friction label is neutral.
const PATTERN_KIND: Record<ThinkingPattern['type'], [PatternKind, string]> = {
  misconception: ['error', 'Common error'],
  partial: ['almost', 'Almost there'],
  'on-track': ['build', 'Build on this'],
  extension: ['stretch', 'Ready to stretch'],
  'language-math': ['lang', 'Language + math'],
};

// The generator's frequency, unchanged. The Thinking tool's planning labels
// ("Plan for this") stamped error language onto on-track patterns and made the
// teacher's Most/Some/Few prediction impossible to check.
const FREQUENCY_LABEL: Record<ThinkingPattern['frequency'], string> = {
  'most students': 'Most students',
  'some students': 'Some students',
  'watch for this': 'A few students',
};

// Same wording as the Moves tool.
const SCENARIO_LABEL: Record<ScenarioType, string> = {
  'common-error': 'Common error',
  'productive-insight': 'Productive insight',
  'on-track': 'On track',
  'partial-understanding': 'Partial understanding',
  'productive-struggle': 'Productive struggle',
};

// Rehearsal favours the moments most likely to derail the crux.
const SCENARIO_PRIORITY: ScenarioType[] = [
  'common-error',
  'partial-understanding',
  'productive-struggle',
  'productive-insight',
  'on-track',
];

const PATTERN_PRIORITY: ThinkingPattern['type'][] = [
  'misconception',
  'partial',
  'language-math',
  'extension',
  'on-track',
];

/** A band is named by the WIDA levels it covers, never by its key. See eld/types.ts. */
export function bandLabel(band: ProficiencyBand): string {
  const levels = bandLevels(band);
  return `Levels ${levels[0]}–${levels[levels.length - 1]}`;
}

export const BANDS: readonly ProficiencyBand[] = ['emerging', 'developing', 'expanding'];

// Look-fors about building a display can't be shown in a written or spoken
// answer, so they are left out of "Do it as a student".
const NOT_SHOWABLE_IN_AN_ANSWER = /\b(display|poster|visual|arrange|construct|build|chart paper)/i;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** "~10 min", "15 minutes", "10-12 min" → 10 / 15 / 10. Null when unreadable. */
export function parseMinutes(duration: string | undefined | null): number | null {
  if (!duration) return null;
  const m = /(\d+)/.exec(duration);
  return m ? Number(m[1]) : null;
}

export function clock(minutes: number): string {
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
}

function activityLabel(a: Pick<Activity, 'id' | 'title'>): string {
  const m = a.title.match(/^(Warm-Up|Activity\s+\d+|Lesson Synthesis|Cool-Down|Synthesis)/i);
  return m ? m[1] : a.id;
}

function firstSentence(text: string): string {
  const t = text.trim();
  const m = /^(.+?[.!?])(\s|$)/.exec(t);
  return (m ? m[1] : t).trim();
}

function present(s: string | null | undefined): s is string {
  return typeof s === 'string' && s.trim().length > 0;
}

function dedupe(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of items) {
    const key = raw.trim().toLowerCase().replace(/[.\s]+$/, '');
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(raw.trim());
  }
  return out;
}

/** Say lines are spoken: show them in quotation marks, once. */
export function quoted(s: string | null | undefined): string | null {
  if (!present(s)) return null;
  const t = s.trim();
  if (/^["“'‘]/.test(t) && /["”'’]$/.test(t)) return t.replace(/^['‘]/, '“').replace(/['’]$/, '”').replace(/^"/, '“').replace(/"$/, '”');
  return `“${t}”`;
}

// ---------------------------------------------------------------------------
// Focus: the crux, what feeds it, and demanding work after it
// ---------------------------------------------------------------------------

/**
 * The crux is the activity flagged `is_crux`; failing that, the first whose
 * role is Crux; failing that, none — and the prep says so rather than guessing.
 */
export function findCruxIndex(activities: Activity[]): number {
  const flagged = activities.findIndex((a) => a.is_crux);
  if (flagged >= 0) return flagged;
  return activities.findIndex((a) => a.function === 'Crux');
}

export function focusRoles(activities: Activity[]): (FocusRole | null)[] {
  const crux = findCruxIndex(activities);
  return activities.map((a, i) => {
    if (crux < 0) return null;
    if (i === crux) return 'crux';
    if (i === crux - 1) return 'feeder';
    if (i > crux && a.language_demand === 'high') return 'after';
    return null;
  });
}

// ---------------------------------------------------------------------------
// Rehearsal
// ---------------------------------------------------------------------------

/**
 * What to check a spoken move against. Premo's Social Studies checks are
 * authored; DSST's lessons carry no criteria, so these are fixed checks keyed
 * to the scenario type — what a good move PROTECTS, never what it says — plus
 * every distinct avoid line the lesson gives. An earlier version copied the
 * move's first sentence, which checked logistics and leaked the model answer.
 */
export function criteriaFor(s: DecisionScenario, bands: readonly ProficiencyBand[]): string[] {
  const out: string[] = [];
  if (FAILURE_TYPES.includes(s.scenario_type)) {
    out.push('Sent them back to the evidence (the objects, the counts, the words) with a question');
    out.push(
      s.scenario_type === 'productive-struggle'
        ? 'Kept the struggle: offered a support, not the answer'
        : 'Left the fixing to the student',
    );
  } else {
    out.push('Made their idea visible to others instead of only praising it');
    out.push('Pushed it one step further, toward the crux idea');
  }
  if (s.is_mll || !s.flat_move?.move) out.push('Kept the same task for every level; only the language support changed');
  out.push(...avoidLines(s, bands).map((a) => `Steered clear of: ${lowerFirst(firstSentence(a))}`));
  return out;
}

function avoidLines(s: DecisionScenario, bands: readonly ProficiencyBand[]): string[] {
  if (s.flat_move && present(s.flat_move.move)) return present(s.flat_move.avoid) ? [s.flat_move.avoid] : [];
  if (!s.proficiency_moves) return [];
  const use = bands.length ? bands : BANDS;
  return dedupe(use.map((b) => s.proficiency_moves![b]?.avoid).filter(present));
}

function lowerFirst(s: string): string {
  return /^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s;
}

function hasUsableMove(s: DecisionScenario): boolean {
  if (s.flat_move && present(s.flat_move.move)) return true;
  return !!s.proficiency_moves && BANDS.some((b) => present(s.proficiency_moves![b]?.move));
}

function eligible(s: DecisionScenario, focus: FocusRole): boolean {
  if (!hasUsableMove(s)) return false;
  // A feeder's insights don't threaten the crux; its failures do.
  if (focus === 'feeder') return FAILURE_TYPES.includes(s.scenario_type);
  return true;
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

const STEP_BASE: Omit<PrepStep, 'lede'>[] = [
  { key: 'orient', name: 'Orient', minutes: 2, tool: 'Quick Read', verb: 'Read', crux: false },
  { key: 'student', name: 'Do it as a student', minutes: 3, tool: 'Pathway · Synthesis', verb: 'Write', crux: false },
  { key: 'predict', name: 'Predict the crux', minutes: 3, tool: 'Thinking', verb: 'Write', crux: true },
  { key: 'rehearse', name: 'Rehearse', minutes: 6, tool: 'Moves', verb: 'Say aloud', crux: true },
  { key: 'adjust', name: 'Adjust', minutes: 2, tool: 'Adapt', verb: 'Pick', crux: false },
  { key: 'carry', name: 'Carry it', minutes: 1, tool: 'Quick Read', verb: 'Share', crux: false },
];

/**
 * @param bands the class ELD profile. Shapes the criteria and the In-class
 *              lines; the components filter supports by band themselves.
 */
export function buildPrepModel(lesson: LessonData, bands: readonly ProficiencyBand[] = []): PrepModel {
  const acts = lesson.activities ?? [];
  const roles = focusRoles(acts);
  const cruxIdx = findCruxIndex(acts);
  const useBands = bands.length ? BANDS.filter((b) => bands.includes(b)) : BANDS;

  const tilesById = new Map((lesson.wristband?.activities ?? []).map((w) => [w.activity_id, w]));
  const selById = new Map((lesson.selection?.activities ?? []).map((s) => [s.activity_id, s]));
  const elsfById = new Map((lesson.elsf_inference?.activities ?? []).map((e) => [e.activity_id, e]));
  const thinkById = new Map((lesson.anticipated_thinking?.activities ?? []).map((t) => [t.activity_id, t]));

  // Timeline: start offsets accumulate only while every duration is readable.
  let t = 0;
  let timed = true;
  const activities: PrepActivity[] = acts.map((a, i) => {
    const minutes = parseMinutes(a.duration);
    const start = timed ? clock(t) : null;
    if (minutes == null) timed = false;
    else t += minutes;
    const tile = tilesById.get(a.id)?.tiles?.[0];
    const e = elsfById.get(a.id);
    return {
      id: a.id,
      label: activityLabel(a),
      title: a.title,
      role: a.function,
      start,
      minutes,
      isCrux: i === cruxIdx,
      focus: roles[i],
      demand: a.language_demand,
      watchFor: tile?.observation_short ?? a.friction_points?.[0]?.description ?? null,
      prep: selById.get(a.id)?.teacher_prep ?? null,
      language: e
        ? {
            receptive: e.language_demands.receptive,
            productive: e.language_demands.productive,
            interactive: e.language_demands.interactive,
            bridge: e.language_demands.everyday_to_academic_bridge,
            homeLanguage: e.functional_language?.l1_bridge ?? null,
          }
        : null,
      source: a,
    };
  });
  const crux = cruxIdx >= 0 ? activities[cruxIdx] : null;
  const focusOf = (id: string) => activities.find((a) => a.id === id)?.focus ?? null;
  const order = (id: string) => activities.findIndex((a) => a.id === id);

  // --- Step 2: a student task from the lesson's close ---
  const g = lesson.adaptation_guardrails;
  const proof = {
    closing: lesson.lesson_synthesis?.prompt || null,
    lookFors: dedupe([...(lesson.wristband?.top_signals ?? []), ...(crux?.source.success_signals ?? [])])
      .filter((s) => !NOT_SHOWABLE_IN_AN_ANSWER.test(s))
      .slice(0, 4),
  };

  // --- Step 3: patterns at the crux and the activity that feeds it ---
  // MLL-specific patterns stay IN. DSST's generation tags patterns MLL-specific
  // when language is part of the cause, not when only MLLs show them — the
  // sample lesson's main crux misconception ("most students") carries the tag.
  const patterns: PrepPattern[] = [];
  for (const ta of lesson.anticipated_thinking?.activities ?? []) {
    const f = focusOf(ta.activity_id);
    if (f !== 'crux' && f !== 'feeder') continue;
    for (const p of ta.patterns ?? []) {
      const [kind, kindLabel] = PATTERN_KIND[p.type] ?? PATTERN_KIND['on-track'];
      patterns.push({
        activityId: ta.activity_id,
        kind,
        kindLabel,
        frequencyLabel: FREQUENCY_LABEL[p.frequency] ?? '',
        label: p.label,
        description: p.description,
        move: p.move,
        mll: p.is_mll_specific,
        mlr: p.mlr,
      });
    }
  }
  // Crux first: the teacher has just predicted the crux, so its patterns are
  // the answer. The activity that sets it up follows.
  const cruxFirst = (id: string) => (focusOf(id) === 'crux' ? 0 : 1);
  patterns.sort(
    (a, b) =>
      cruxFirst(a.activityId) - cruxFirst(b.activityId) ||
      PATTERN_PRIORITY.indexOf(rawType(a.kind)) - PATTERN_PRIORITY.indexOf(rawType(b.kind)),
  );
  const listenFor = crux ? thinkById.get(crux.id)?.questions_to_listen_for ?? [] : [];

  // --- Step 4: scenarios to rehearse ---
  const candidates: PrepScenario[] = [];
  for (const da of lesson.decision_guide?.activities ?? []) {
    const f = focusOf(da.activity_id);
    if (!f) continue;
    const ranked = (da.scenarios ?? [])
      .map((s, idx) => ({ s, idx }))
      .filter(({ s }) => eligible(s, f))
      .sort(
        (a, b) =>
          // After the crux, the place goes to a language scenario first.
          (f === 'after' ? Number(b.s.is_mll) - Number(a.s.is_mll) : 0) ||
          SCENARIO_PRIORITY.indexOf(a.s.scenario_type) - SCENARIO_PRIORITY.indexOf(b.s.scenario_type),
      )
      .slice(0, REHEARSAL_QUOTA[f]);
    for (const { s, idx } of ranked) {
      const flatOk = !!s.flat_move && present(s.flat_move.move);
      candidates.push({
        id: `${da.activity_id}:${idx}`,
        activityId: da.activity_id,
        focus: f,
        type: s.scenario_type,
        typeLabel: SCENARIO_LABEL[s.scenario_type] ?? 'Common error',
        notice: s.label,
        scene: s.interpretation,
        mll: s.is_mll,
        flat: flatOk ? { ...s.flat_move!, say: quoted(s.flat_move!.say) } : null,
        byBand:
          !flatOk && s.proficiency_moves
            ? BANDS.map((b) => {
                const m = s.proficiency_moves![b];
                return {
                  band: b,
                  say: quoted(m?.say),
                  move: m?.move ?? '',
                  nonverbal: present(m?.nonverbal) ? m!.nonverbal : null,
                  avoid: present(m?.avoid) ? m!.avoid : null,
                };
              })
            : null,
        criteria: criteriaFor(s, bands),
        mlr: s.mlr,
      });
    }
  }
  // Over the cap, the crux keeps its places first, then the feeder.
  const rank: Record<FocusRole, number> = { crux: 0, feeder: 1, after: 2 };
  const scenarios = [...candidates]
    .sort((a, b) => rank[a.focus] - rank[b.focus])
    .slice(0, MAX_REHEARSAL)
    .sort(
      (a, b) =>
        order(a.activityId) - order(b.activityId) ||
        SCENARIO_PRIORITY.indexOf(a.type) - SCENARIO_PRIORITY.indexOf(b.type),
    );

  // --- Step 5 ---
  const cuts = (g?.safe_to_change ?? []).map((text, i) => ({ id: `cut-${i}`, text }));
  const neverCut = (g?.do_not_remove ?? []).map((d) => ({ text: d.text, mlr: d.mlr }));
  const supports = {
    emerging: g?.by_proficiency?.emerging ?? { text: '' },
    developing: g?.by_proficiency?.developing ?? { text: '' },
    expanding: g?.by_proficiency?.expanding ?? { text: '' },
  };
  const profile: PrepModel['language']['profile'] = {};
  for (const p of (crux && elsfById.get(crux.id)?.learner_profile) || []) {
    profile[p.band] = { does: p.sentence_does, reaching: p.sentence_reaching };
  }
  const language = {
    frames: (crux && thinkById.get(crux.id)?.sentence_frames) || [],
    vocabulary: lesson.key_vocabulary ?? [],
    profile,
  };

  // --- Setup and the In-class card ---
  const setup = { crux: crux?.prep ?? null, checklist: lesson.wristband?.preflight ?? [] };
  const lines: InClassLine[] = scenarios
    .filter((s) => s.focus === 'crux')
    .slice(0, 3)
    .map((s) => {
      if (s.flat) return { see: s.notice, say: s.flat.say ? [{ label: null, text: s.flat.say }] : [], avoid: s.flat.avoid || null };
      const shown = (s.byBand ?? []).filter((m) => useBands.includes(m.band) && m.say);
      return {
        see: s.notice,
        say: shown.map((m) => ({ label: bandLabel(m.band), text: m.say! })),
        avoid: shown.find((m) => m.avoid)?.avoid ?? null,
      };
    })
    .filter((l) => l.say.length > 0);
  const inClass = { ask: listenFor[0] ?? null, setup: setup.crux, lines };

  // --- Steps, with ledes that name this lesson's crux ---
  const cruxName = crux ? activityName(crux) : 'the crux';
  const feeder = activities.find((a) => a.focus === 'feeder');
  const atCrux = scenarios.filter((s) => s.focus === 'crux').length;
  const ledes: Record<StepKey, string> = {
    orient: 'The destination, the idea underneath it, and one thing to watch for in each activity. Tap any activity for detail.',
    student:
      'Answer the question the lesson closes on, the way a strong student would. Where it gets hard for you is where it gets hard for them.',
    predict: `${cruxName} is the crux${feeder ? `, and ${activityName(feeder)} sets it up` : ''}. Predict what your students will do before Premo shows its patterns.`,
    rehearse: `${scenarios.length} moments: ${atCrux} at the crux${scenarios.length > atCrux ? ', the rest where it can go wrong before or after' : ''}. Read the moment, say your move out loud, then check it.`,
    adjust: 'Only if you need it. Pick what to change for this class. The idea the lesson exists for stays pinned.',
    carry: 'Your prep, packaged for tomorrow and for your coach.',
  };
  const steps = STEP_BASE.map((s) => ({
    ...s,
    minutes: s.key === 'rehearse' ? Math.max(2, scenarios.length) : s.minutes,
    lede: ledes[s.key],
  }));

  const m = lesson.meta;
  return {
    heading: m.lesson_title,
    code: [m.grade, m.unit, m.lesson_number].filter(present).join('.'),
    totalTime: m.total_time,
    destination: lesson.destination,
    idea: g?.mathematical_purpose ?? '',
    arc: lesson.wristband?.arc_one_line || lesson.arc_statement,
    activities,
    crux,
    steps,
    estimateMinutes: steps.reduce((n, s) => n + s.minutes, 0),
    proof,
    patterns,
    listenFor,
    scenarios,
    rigorCheck: g?.rigor_check ?? '',
    cuts,
    neverCut,
    supports,
    language,
    setup,
    inClass,
  };
}

function rawType(kind: PatternKind): ThinkingPattern['type'] {
  return (Object.keys(PATTERN_KIND) as ThinkingPattern['type'][]).find((k) => PATTERN_KIND[k][0] === kind)!;
}

/** "Activity 2 (2.3)" when the title carries a slot, else the title: “The Teacher’s Collection” (1.2). */
export function activityName(a: Pick<PrepActivity, 'id' | 'label' | 'title'>): string {
  if (a.label !== a.id) return `${a.label} (${a.id})`;
  return `“${a.title}” (${a.id})`;
}
