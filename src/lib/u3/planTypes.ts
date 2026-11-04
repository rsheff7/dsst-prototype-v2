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
  /** Checks for a moment whose Premo layer has none: three short things a good response does, first person. */
  momentCriteria?: Record<string, string[]>;
  /** When this activity leans on an earlier one the teacher may not have chosen (e.g. 7.3 reuses 7.2's table). */
  dependsOn?: { activityId: string; note: string };
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
    byBand: Record<
      ProficiencyBand,
      {
        /** Keeps the lesson's comparison or reason at every level; fewer words, never less math. */
        frame: string;
        stretch: string;
        /** A way in without words for this task (point, gesture, show on the table). */
        nonverbal: string;
      }
    >;
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

/**
 * One rehearsal card, written so it stands on its own: where we are in the lesson, what's
 * in front of the teacher, one plain question, and the aim, then the model and the checks.
 * See docs/REHEARSAL-CARD-SPEC.md. No student names: "a student", "Pair A".
 */
export interface RehearsalCard {
  id: string;
  /** IM's activity; the card shows when the teacher chose that activity. */
  activityId: string;
  /** math: the task, fillable · rounds: one card in short rounds (Three Reads) · levels: one round per WIDA level picked. */
  kind: 'math' | 'moment' | 'rounds' | 'levels' | 'release' | 'synthesis';
  /**
   * The card's type, which sets the guidance it must carry (docs/REHEARSAL-GUIDANCE-RULE.md):
   * task · routine · send (send to work) · student (student moment) · language (language moment) · decision.
   */
  type: 'task' | 'routine' | 'send' | 'student' | 'language' | 'decision';
  /** A plain verb phrase: "Choose who shares first". No routine names or ids. */
  name: string;
  /** The IM routine the card runs, for its tappable label. */
  routine?: string;
  /** A card about how students say it, not only the answer. */
  language?: boolean;
  /** "About N minutes into Activity X.Y." then what just happened and what's on the board. */
  where: string;
  /** What's in front of the teacher: lines as IM writes them (tables as "| a | b"). */
  show?: string[];
  /** The student's words or work, in a sentence. */
  student?: string;
  ask: string;
  /** What the student ends up doing, 15 words or fewer, never the words to say. */
  aim: string;
  /** For 'rounds': each round's own question and aim (the model comes from crux.threeReads). */
  rounds?: { ask: string; aim: string }[];
  /** Model wording to say (the app quotes these), and plain notes after it. */
  say?: string[];
  notes?: string[];
  /** "Did yours do these?": three, past tense. */
  checks: string[];
  // Guidance, by the rule. What's going on and Avoid default to the Premo moment's means and dont.
  /** A strong student answer in the language goal's form. */
  sounds?: string;
  goingOn?: string;
  avoid?: string;
  /** The next question if the first move doesn't land. Never the answer. */
  ifNot?: string;
  /** The purpose of this routine or choice, here. IM's reason where IM gives one. */
  why?: string;
  /** The routine's steps for this activity. */
  runIt?: string[];
  /** The Premo moment this card rehearses (its means and dont, and by-level says for 'levels'). */
  momentId?: string;
  /** When an earlier activity the card leans on wasn't chosen: what's shown, said and checked instead. */
  ifSkipped?: { activityId: string; show?: string[]; say?: string[]; checks?: string[] };
  /** For a 'levels' card whose moment isn't at release: the frame each band uses here (else the release frames). */
  levelFrames?: Partial<Record<ProficiencyBand, string>>;
  /** With `levelFrames`: this moment's way in without words, per band, when the Premo moment has none for that band. */
  levelNonverbal?: Partial<Record<ProficiencyBand, string>>;
  /** A different "where" line when an earlier activity was chosen. */
  whereIfChosen?: { activityId: string; where: string };
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
    /**
     * The CLO as it goes on the board, for students and visitors: two lines, "We will…",
     * 20 words or fewer each, no task numbers. The form ("Say it like this") is part of it.
     */
    board: { content: string; language: string };
    /** IM's mode, in students' words: "out loud", or "out loud and in writing". */
    mode: string;
    /** Terms that must be precise, and words that can stay informal today. */
    precise: string[];
    informal: string[];
    /** What a strong student sentence sounds like at the crux. */
    exemplar: string;
    /** The cool-down look-for that checks the CLO. */
    lookFor: string;
    /**
     * What goes on the wall: the goal in students' words ("We will…") and a parallel
     * example in the CLO's form with new numbers, so the poster doesn't give away the crux.
     */
    posted: { sentence: string };
    /** How students use the objective in class: four scripted moments. */
    use: { launch: string; release: string; synthesis: string; coolDown: string };
    /** Where IM's unit language progression names a different verb than the lesson's goal. */
    progressionNote?: string;
  };
  activities: PlanActivity[];
  crux: PlanCrux;
  /** The rehearsal, card by card (docs/REHEARSAL-CARD-SPEC.md). Lessons without it use the earlier cards. */
  rehearsal?: RehearsalCard[];
  /** Step 7. What to prepare, and what can go if time runs short, under the planning view's routines (D1). */
  beforeClass: string[];
  cuts: { activityId: string; note: string }[];
  /**
   * Step 6. IM's lesson synthesis is a teacher summary, not a discussion: say the lesson's
   * ideas, point to where students used them, then one quick check in the language goal
   * before the cool-down (requirements D5).
   */
  lessonSynthesis: {
    /** The ideas to say aloud, one sentence each, in plain words with the lesson's numbers. */
    ideas: string[];
    /** Where to point: the crux's synthesis chart, or the final activity if it is taught. */
    pointTo: string;
    /** One question students answer in the language goal's form, and what that sounds like. Not the cool-down's own task. */
    check: { question: string; sounds: string };
  };
}
