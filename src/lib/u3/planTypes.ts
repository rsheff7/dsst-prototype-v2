/**
 * The planning view's content for one lesson: content/u3/plan/<code>.json.
 *
 * The planning view follows DSST's Lesson Intellectual Preparation Protocol
 * (IPP): understand the end goal, unpack the content language objective (CLO),
 * do the cool-down, then work through each chosen activity, with the language
 * layer at the crux. See docs/PLANNING-VIEW-REQUIREMENTS.md.
 *
 * It sits beside the lesson's IM and Premo layers and adds to them; the reviewed
 * prep (/u3/<code>) reads none of it, so that version keeps working unchanged.
 *
 * Every string is Premo's unless its field says Verbatim (IM's words, checked).
 */
import type { Verbatim } from './types';
import type { ProficiencyBand } from '../eld/types';

/** DSST's priority routines at the crux (requirements D1). */
export type SynthesisMlr = 'MLR1: Stronger and Clearer Each Time' | 'MLR2: Collect and Display';

export interface PlanActivity {
  /** IM's activity id, "7.3". */
  id: string;
  /** a. Do the math: the strategies and representations to expect, more than one right way. */
  strategies: string[];
  /** b. Barriers block access to the CLO (words, prior knowledge); misconceptions arise on the way to the idea. */
  barriers: string[];
  misconceptions: string[];
  /** c. Plan the response: back-pocket questions, one line each. */
  backPocket: string[];
  /** Premo moments (premo.moments ids) to rehearse aloud for this activity, in order. */
  momentIds: string[];
  /** d. How students work, and what to monitor and track. */
  grouping: string;
  monitor: string;
}

export interface PlanCrux {
  /** e. Three Reads (MLR 6) to launch the crux, one entry per read. */
  threeReads: { focus: string; say: string; listenFor: string }[];
  /** f. Release with a frame (MLR 8). */
  release: {
    /** The language success criteria, named as students are released. */
    successCriteria: string;
    /** What the teacher says at release, about ten words. */
    say: string;
    /** One or two moments of student talk practice, such as a turn-and-talk. */
    talkMoments: string[];
    /**
     * The frame by band, and the extra step at the band's higher level. Shown under the
     * level-tier rule (src/lib/prep/levelTiers.ts) for the levels the teacher picks.
     */
    byBand: Record<ProficiencyBand, { frame: string; stretch: string }>;
  };
  /** g. Synthesize with MLR 1 or MLR 2. */
  synthesis: {
    routine: SynthesisMlr;
    /** The routine's steps for this activity, in order. */
    steps: string[];
    /** The question students answer in CLO language. */
    prompt: string;
    /** What a student answer in CLO language sounds like. */
    sounds: string;
  };
}

export interface PlanLesson {
  status: 'draft' | 'reviewed';
  reviewNotes: string[];
  /** Step 1. Where the lesson sits in the unit's story, and how it builds on the last lesson. */
  story: string;
  previous: string;
  /** Step 2. The content language objective. */
  clo: {
    /** IM's learning goal the CLO starts from, verbatim. */
    imGoal: Verbatim;
    /** The language use: explain, justify, compare… */
    function: string;
    /** The sentence construction students produce. */
    form: string;
    /** The CLO in one sentence, as a teacher would post it. */
    statement: string;
    /** Terms that must be precise, and words that can stay informal today. */
    precise: string[];
    informal: string[];
    /** What a strong student sentence sounds like at the crux. */
    exemplar: string;
    /** The cool-down look-for that checks the CLO. */
    lookFor: string;
  };
  activities: PlanActivity[];
  crux: PlanCrux;
  /** Step 7. What to prepare, and what can go if time runs short, under the planning view's routines (D1). */
  beforeClass: string[];
  cuts: { activityId: string; note: string }[];
  /** Step 6. IM's lesson synthesis, planned. */
  lessonSynthesis: { desired: string; anticipated: string[]; backPocket: string };
}
