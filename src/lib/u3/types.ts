/**
 * Content model for the Unit 3 rebuild (IM 6–8 Math, Grade 6 Unit 3, CC BY).
 *
 * DRAFT for Robert's sign-off, 2026-10-23. See docs/CONTENT-STRUCTURE-NOTE.md
 * for why it is shaped this way.
 *
 * One file per lesson, content/u3/lessons/6.3.<n>.json, in two layers:
 *
 *   im     What IM's teacher materials say, copied. Every string marked
 *          `Verbatim` must appear in content/u3/source/ word for word, and the
 *          checker enforces it. Nothing here is Premo's wording.
 *   premo  Premo's layer: what IM does not write. The crux, the testable
 *          object, rehearsal moments, level-specific ways into IM's routines,
 *          the prediction, the glance card. Draft until a person reviews it.
 *
 * A third owner, `dsst`, is reserved for the district's adaptations.
 *
 * The phone prep reads a lesson through an adapter, so the screens built on
 * the earlier model keep working. Nothing here is generated at upload time.
 */

import type { MlrNumber } from '../mlrs';
import type { ProficiencyBand } from '../eld/types';

export const U3_SCHEMA_VERSION = 1;

/** A string that must appear in the IM source exactly. The checker enforces it. */
export type Verbatim = string;

export type Owner = 'im' | 'premo' | 'dsst';

// ---------------------------------------------------------------------------
// Shared vocabularies, all IM's
// ---------------------------------------------------------------------------

/** IM's lesson slots. Every lesson is built from these, in this order. */
export type Slot = 'warm-up' | 'activity' | 'optional' | 'cool-down';

/**
 * IM's eight task purposes (course guide, Design Principles). IM does not
 * label activities with them; the activity narrative states the purpose,
 * usually in its first sentence. So the purpose is Premo's reading, and
 * `purposeEvidence` quotes the sentence it was read from.
 */
export type TaskPurpose =
  | 'new-context'
  | 'new-concept'
  | 'new-representation'
  | 'formalize-definition'
  | 'resolve-mistakes'
  | 'practice-language'
  | 'mastery'
  | 'application';

/** Where an English-learner support sits in the activity. */
export type Phase = 'launch' | 'work' | 'synthesis';

export type LanguageDomain = 'speaking' | 'listening' | 'writing' | 'reading' | 'conversing' | 'representing';

/** The four design principles IM tags each English-learner support with. */
export type EllPrinciple = 'support-sense-making' | 'optimize-output' | 'cultivate-conversation' | 'maximize-meta-awareness';

/** The language uses IM's progression names for a lesson. */
export type LanguageUse =
  | 'interpret'
  | 'explain'
  | 'justify'
  | 'describe'
  | 'compare'
  | 'critique'
  | 'generalize'
  | 'represent';

// ---------------------------------------------------------------------------
// Routines: one catalog, content/routines.json, IM's definitions verbatim
// ---------------------------------------------------------------------------

export type RoutineKind = 'warm-up' | 'launch' | 'partner' | 'discussion' | 'mlr';

export interface Routine {
  /** IM's name, exactly as the guide writes it: "Think Pair Share", "MLR3: Clarify, Critique, Correct". */
  name: string;
  mlr?: MlrNumber;
  kind: RoutineKind;
  what: Verbatim;
  where?: Verbatim;
  why?: Verbatim;
  /** Lines IM gives the teacher inside the definition. */
  lines: Verbatim[];
  /**
   * How the routine typically breaks down in a room. Premo's reading of IM's
   * definition, each tied to the sentence it comes from.
   */
  breakdowns: { see: string; from: Verbatim }[];
  /** IM says to demonstrate it with a partner the first few times. */
  demoFirstTimes: boolean;
}

// ---------------------------------------------------------------------------
// The unit
// ---------------------------------------------------------------------------

export interface Unit {
  schemaVersion: number;
  code: '6.3';
  title: string;
  /** IM's sections, in order, with the lessons each holds. */
  sections: { title: string; lessons: string[] }[];
  /** Lessons built so far. The rest show as "not built yet". */
  built: string[];
  narrative: Verbatim[];
  /** IM's progression of disciplinary language, by use. */
  languageProgression: { use: LanguageUse; items: { text: Verbatim; lessons: string[] }[] }[];
  /** IM's terminology table. */
  terminology: Record<string, { receptive: string[]; productive: string[] }>;
  /** The unit's last sentence on language, not tied to one lesson. */
  languageAlso: Verbatim[];
  lessonTitles: Record<string, string>;
  readinessCheck: { item: number; firstIn: string; note: Verbatim[]; move: Verbatim; task: Verbatim[]; answers: Verbatim }[];
  materials: string[];
  sources: string[];
}

// ---------------------------------------------------------------------------
// The lesson: IM's layer
// ---------------------------------------------------------------------------

export interface EllSupport {
  /** The routine IM names in the support. */
  routine: string;
  phase: Phase;
  domains: LanguageDomain[];
  principles: EllPrinciple[];
  text: Verbatim;
}

export interface AccessSupport {
  /** "Representation", "Engagement", "Action and Expression". */
  area: string;
  title: string;
  text: Verbatim;
  /** "Memory", "Organization", "Visual-spatial processing"… */
  supports: string[];
}

export interface ImActivity {
  /** "7.2". */
  id: string;
  slot: Slot;
  title: string;
  minutes: number;
  /** Null for warm-ups and cool-downs: IM's eight purposes describe classroom activities. */
  purpose: TaskPurpose | null;
  purposeEvidence: Verbatim | null;
  /** Routines as IM lists them for this activity. Names from the catalog. */
  routines: string[];
  /** True when IM lists Anticipate, Monitor, Select, Sequence, Connect. */
  fivePractices: boolean;
  alignment: { buildingOn: string[]; addressing: string[]; buildingTowards: string[] };
  narrative: Verbatim[];
  launch: Verbatim[];
  task: Verbatim[];
  /** IM's student response, from the Teacher Guide. Null where IM gives none. */
  response: Verbatim[] | null;
  misconceptions: Verbatim[];
  synthesis: Verbatim[];
  extension: { task: Verbatim[]; response: Verbatim[] | null } | null;
  ell: EllSupport[];
  access: AccessSupport[];
}

export interface ImLesson {
  /** "6.3.7". Matches the file name. */
  code: string;
  title: string;
  section: string;
  goals: { text: Verbatim; modes: ('orally' | 'in writing' | 'other representations')[] }[];
  targets: Verbatim[];
  narrative: Verbatim[];
  materials: string[];
  preparation: Verbatim[];
  activities: ImActivity[];
  lessonSynthesis: Verbatim[];
  /** Task and response come from the Teacher Guide; null until transcribed. */
  coolDown: { id: string | null; title: string | null; minutes: number | null; task: Verbatim[] | null; response: Verbatim[] | null };
  /** IM's standards for the lesson as a whole. */
  standards: { buildingOn: string[]; addressing: string[]; buildingTowards: string[] };
  summary: Verbatim[];
  /** From the unit's terminology table, for this lesson. */
  vocabulary: { receptive: string[]; productive: string[] };
  /** The language uses the unit progression names this lesson for. */
  languageUses: LanguageUse[];
  sources: string[];
}

// ---------------------------------------------------------------------------
// The lesson: Premo's layer
// ---------------------------------------------------------------------------

/** Did IM anticipate this, or is it Premo's? For a line, `im` means verbatim. */
export type From = 'im' | 'premo';

export type MomentKind =
  | 'student-thinking'
  /** IM's own anticipated misconception. */
  | 'im-misconception'
  /** The activity's routine breaking down, from the routine catalog. */
  | 'routine-breakdown'
  /** Five Practices: which work to show, and in what order. */
  | 'which-work-first'
  /** The teacher's own impulse to confirm or rescue. */
  | 'teacher-move'
  | 'language'
  /** Running the crux's language routine: a short run sheet from IM's English-learner support. */
  | 'run-routine';

export interface Moment {
  id: string;
  activityId: string;
  kind: MomentKind;
  /** A moment you could film. Shown before the teacher responds. */
  see: string;
  /** What is going on underneath. Shown after. */
  means: string;
  /** Words to say aloud, about ten words. Required unless `byBand` is given. */
  say?: string;
  /** Language moments: a way into IM's routine for each WIDA band. Same question, different way in. */
  byBand?: Record<ProficiencyBand, { say: string; move: string; nonverbal?: string }>;
  /** The IM routine this moment runs inside, for language and routine moments. */
  routine?: string;
  dont: string;
  from: From;
  /** Where the `say` words come from. `im` = verbatim and checked. */
  sayFrom: From;
  /** The IM text this moment rests on, verbatim. Required when `from` is `im`. */
  evidence?: Verbatim;
  rehearse?: boolean;
  /** For 'run-routine': the routine's steps for this lesson, in order, with minutes where IM gives them. */
  runSheet?: { step: string; minutes?: number }[];
  /** Three checks of what a good response protects. Never the model wording. */
  criteria?: string[];
  /** On a "building towards" activity, short-of-standard work is not an error. */
  notAnError?: boolean;
}

export interface Pattern {
  activityId: string;
  type: 'error' | 'almost' | 'build' | 'stretch' | 'language';
  /** The student's words, or what appears on paper. */
  says: string;
  why: string;
  /** What it shows the student can already do. */
  shows: string;
  from: From;
  evidence?: Verbatim;
}

export interface PremoLesson {
  /** 'draft' until a person has checked it against the IM layer. */
  status: 'draft' | 'reviewed';
  /** For the reviewer. Never shown to teachers. */
  reviewNotes: string[];
  /** The activity the lesson exists for. Premo's judgment; `cruxWhy` says on what evidence. */
  crux: string;
  cruxWhy: string;
  /** The thing students make before or at the crux that the crux tests, named once and reused. */
  object: { name: string; what: string };
  /** One or two plain sentences, from IM's goals. */
  goal: string;
  /** A yes/no question a teacher asks of any change. */
  rigorCheck: string;
  /** One thing to watch for per activity, for Orient. */
  watchFor: Record<string, string>;
  moments: Moment[];
  patterns: Pattern[];
  predict: {
    context: string;
    question: string;
    countQuestion: string;
    countUnit: string;
    tell: string;
    activityIds: string[];
  };
  /**
   * The crux's English-learner support, made usable per WIDA band. Built on
   * IM's support for the crux activity: same routine, same phase.
   */
  cruxLanguage: {
    routine: string;
    phase: Phase;
    produceToday: string[];
    /**
     * Per band: the way in, a frame, and what a student at that level already does and is
     * reaching for with THIS lesson's language. Premo's reading; WIDA's own descriptors are
     * not lesson-specific.
     */
    byBand: Record<
      ProficiencyBand,
      {
        entry: string;
        frame?: string;
        does?: string;
        reaching?: string;
        /**
         * The one extra step a student at the band's higher level (2, 4 or 6) takes. The
         * level-tier rule (src/lib/prep/levelTiers.ts) fades the scaffolds; this line says what
         * the student adds, which no rule can know.
         */
        stretch?: string;
      }
    >;
  };
  /** What a teacher may cut, with what it protects. Mastery and optional activities first. */
  cuts: { activityId: string; note: string }[];
  neverCut: string[];
  inClass: { launch: string; launchFrom: From; momentIds: string[]; sequence?: string[] };
  /** What to make, print or post. IM's preparation plus anything Premo's supports need. */
  beforeClass: string[];
}

export interface U3Lesson {
  schemaVersion: number;
  im: ImLesson;
  premo: PremoLesson;
}
