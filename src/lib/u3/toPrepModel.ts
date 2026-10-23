/**
 * A Unit 3 lesson (IM layer + Premo layer) as the PrepModel the phone prep
 * screens already render. The screens stay as they are; only where content
 * comes from changes.
 *
 * What maps to what:
 *   Orient        IM's slots and minutes, Premo's watch-for, IM's lesson narrative
 *   Do it         IM's cool-down, IM's student response, IM's learning targets as look-fors
 *   Predict       Premo's prediction and patterns
 *   Rehearse      Premo's six rehearsed moments, in the author's order
 *   Adjust        Premo's cuts and never-cuts, the crux's language support (inside IM's routine),
 *                 IM's terminology for the lesson
 *   In class      Premo's launch, three rehearsed lines, IM's share order
 */
import type { BandMove, PatternKind, PrepActivity, PrepModel, PrepPattern, PrepScenario, PrepStep, StepKey } from '../prep/prepModel';
import { BANDS, bandLabel, quoted } from '../prep/prepModel';
import type { ProficiencyBand } from '../eld/types';
import type { ImActivity, Moment, MomentKind, U3Lesson } from './types';

const SLOT_LABEL: Record<ImActivity['slot'], string> = {
  'warm-up': 'Warm-up',
  activity: 'Activity',
  optional: 'Optional',
  'cool-down': 'Cool-down',
};

// Plain words: a teacher reading at 9 pm doesn't need IM's or Premo's category names.
const KIND_LABEL: Record<MomentKind, string> = {
  'student-thinking': 'Student thinking',
  'im-misconception': 'A common mistake',
  'routine-breakdown': 'When the routine slips',
  'which-work-first': 'Who shares first',
  'teacher-move': 'Your move',
  language: 'Language',
};

const PATTERN_KIND: Record<string, [PatternKind, string]> = {
  error: ['error', 'Common error'],
  almost: ['almost', 'Almost there'],
  build: ['build', 'Build on this'],
  stretch: ['stretch', 'Ready to stretch'],
  language: ['lang', 'Language + math'],
};

const clock = (min: number) => `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}`;
const words = (...parts: (string | null | undefined)[]) =>
  parts
    .filter(Boolean)
    .join(' ')
    .replace(/\\\(|\\\)/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
// Same reading-load estimate as the generated prep: a tired adult on a phone,
// plus the writing or speaking each step asks for.
const READ_WPM = 180;
const DOING: Record<StepKey, number> = { orient: 0, student: 2, predict: 1, rehearse: 0, adjust: 0, carry: 0.5 };

export function u3ToPrepModel(lesson: U3Lesson, bands: readonly ProficiencyBand[] = []): PrepModel {
  const { im, premo } = lesson;
  const useBands = bands.length ? BANDS.filter((b) => bands.includes(b)) : BANDS;
  const cruxIdx = im.activities.findIndex((a) => a.id === premo.crux);

  // Timeline: IM's slots in IM's order, the cool-down last.
  let t = 0;
  const activities: PrepActivity[] = [];
  im.activities.forEach((a, i) => {
    activities.push({
      id: a.id,
      // Named by id and title; the slot shows as the pill. Optional has its own pill.
      label: a.id,
      title: a.title,
      role: a.slot === 'optional' ? '' : SLOT_LABEL[a.slot],
      start: clock(t),
      minutes: a.minutes,
      isCrux: a.id === premo.crux,
      // Only a real activity "sets up the crux"; a warm-up just comes first.
      focus: a.id === premo.crux ? 'crux' : i === cruxIdx - 1 && a.slot === 'activity' ? 'feeder' : null,
      demand: 'medium',
      watchFor: premo.watchFor[a.id] ?? null,
      optional: a.slot === 'optional',
      prep: null,
      language: null,
      source: null,
      im: a,
    });
    t += a.minutes;
  });
  if (im.coolDown.id) {
    activities.push({
      id: im.coolDown.id,
      label: im.coolDown.id,
      title: im.coolDown.title ?? 'Cool-down',
      role: 'Cool-down',
      start: clock(t),
      minutes: im.coolDown.minutes,
      isCrux: false,
      focus: null,
      demand: 'medium',
      watchFor: null,
      optional: false,
      prep: null,
      language: null,
      source: null,
    });
    t += im.coolDown.minutes ?? 0;
  }
  const required = im.activities.filter((a) => a.slot !== 'optional').reduce((n, a) => n + a.minutes, 0) + (im.coolDown.minutes ?? 0);
  const optionalMin = im.activities.filter((a) => a.slot === 'optional').reduce((n, a) => n + a.minutes, 0);
  const crux = activities.find((a) => a.isCrux) ?? null;
  const focusOf = (id: string): PrepScenario['focus'] => (id === premo.crux ? 'crux' : im.activities.findIndex((a) => a.id === id) < cruxIdx ? 'feeder' : 'after');

  // Rehearsal: the six moments the author marked, in the author's order.
  const toScenario = (m: Moment): PrepScenario => ({
    id: m.id,
    activityId: m.activityId,
    focus: focusOf(m.activityId),
    type: m.kind === 'im-misconception' ? 'common-error' : m.kind === 'language' ? 'productive-struggle' : 'partial-understanding',
    typeLabel: KIND_LABEL[m.kind],
    notice: m.see,
    scene: '',
    means: m.means,
    source: m.from === 'im' ? 'lesson' : 'premo',
    mll: m.kind === 'language',
    flat: m.byBand ? null : { move: '', say: quoted(m.say), nonverbal: null, avoid: m.dont },
    byBand: m.byBand
      ? BANDS.map(
          (b): BandMove => ({
            band: b,
            say: quoted(m.byBand![b].say),
            move: m.byBand![b].move,
            nonverbal: m.byBand![b].nonverbal ?? null,
            avoid: m.dont,
          }),
        )
      : null,
    criteria: m.criteria ?? [],
  });
  const scenarios = premo.moments.filter((m) => m.rehearse).map(toScenario);

  const patterns: PrepPattern[] = premo.patterns.map((p) => {
    const [kind, kindLabel] = PATTERN_KIND[p.type] ?? PATTERN_KIND.build;
    return {
      activityId: p.activityId,
      kind,
      kindLabel,
      frequencyLabel: '',
      label: p.says,
      description: `${p.why} ${p.shows}`,
      move: '',
      mll: p.type === 'language',
    };
  });

  const cruxIm = im.activities.find((a) => a.id === premo.crux);
  const lines = premo.inClass.momentIds
    .map((id) => scenarios.find((x) => x.id === id))
    .filter((x): x is PrepScenario => !!x)
    .map((x) =>
      x.flat
        ? { see: x.notice, say: x.flat.say ? [{ label: null, text: x.flat.say }] : [], avoid: x.flat.avoid }
        : {
            see: x.notice,
            say: (x.byBand ?? []).filter((b) => useBands.includes(b.band) && b.say).map((b) => ({ label: bandLabel(b.band), text: b.say! })),
            avoid: x.byBand?.[0]?.avoid ?? null,
          },
    );

  const cuts = premo.cuts.map((c, i) => {
    const a = im.activities.find((x) => x.id === c.activityId);
    return { id: `cut-${i}`, text: `${c.activityId} ${a?.title ?? ''}: ${c.note}` };
  });
  const supports = Object.fromEntries(
    BANDS.map((b) => {
      const s = premo.cruxLanguage.byBand[b];
      return [b, { text: s.frame ? `${s.entry} Frame: “${s.frame}”` : s.entry }];
    }),
  ) as PrepModel['supports'];
  // The words to produce are the lesson's own choice (cruxLanguage.produceToday); the unit
  // table lists words for the whole lesson, some of which the crux never uses.
  const produce = premo.cruxLanguage.produceToday;
  const vocabulary = [
    ...produce.map((term) => ({ term, definition: 'students say or write it today' })),
    ...im.vocabulary.receptive.filter((t) => !produce.includes(t)).map((term) => ({ term, definition: 'students need to understand it today' })),
  ];

  const coolDown = im.coolDown.task
    ? { title: im.coolDown.title ?? 'Cool-down', task: im.coolDown.task, strongAnswer: im.coolDown.response ?? [], lookFors: im.targets, draft: false }
    : null;

  const cruxName = crux ? `${crux.title} (${crux.id})` : 'the crux';
  const shown: Record<StepKey, number> = {
    orient: words(premo.goal, im.narrative[0], ...activities.flatMap((a) => [a.title, a.watchFor])),
    student: coolDown ? words(...coolDown.task, ...coolDown.strongAnswer, ...coolDown.lookFors) : 0,
    predict: words(premo.predict.context, ...patterns.flatMap((p) => [p.label, p.description])),
    rehearse: scenarios.reduce(
      (n, sc) =>
        n +
        words(sc.notice, sc.means, ...sc.criteria, sc.flat?.say, sc.flat?.avoid) +
        (sc.byBand ?? []).filter((b) => useBands.includes(b.band)).reduce((k, b) => k + words(b.say, b.nonverbal), 0),
      0,
    ),
    adjust: words(premo.goal, premo.rigorCheck, ...cuts.map((c) => c.text), ...premo.neverCut, ...useBands.map((b) => supports[b].text)),
    carry: words(...premo.beforeClass),
  };
  const ledes: Record<StepKey, string> = {
    orient: 'What the lesson is for, the activities in IM’s order, and one thing to watch for in each. Tap any activity for IM’s notes.',
    student: 'Do IM’s cool-down the way a strong student would. Where it gets hard for you is where it gets hard for them.',
    predict: `${cruxName} is the crux. Predict what your students will do before Premo shows its patterns.`,
    rehearse: `${scenarios.length} moments, in the order the lesson runs. Read the moment, say your move out loud, then check it.`,
    adjust: 'Only if you need it. What can go if you run short, what never goes, and the language support at the crux.',
    carry: 'Your prep, packaged for tomorrow and for your coach.',
  };
  const base: Omit<PrepStep, 'minutes' | 'lede'>[] = [
    { key: 'orient', name: 'Orient', tool: 'The lesson', verb: 'Read', crux: false },
    { key: 'student', name: 'Do it as a student', tool: 'Cool-down', verb: 'Write', crux: false },
    { key: 'predict', name: 'Predict the crux', tool: 'Thinking', verb: 'Write', crux: true },
    { key: 'rehearse', name: 'Rehearse', tool: 'Moves', verb: 'Say aloud', crux: true },
    { key: 'adjust', name: 'Adjust', tool: 'Adapt', verb: 'Pick', crux: false },
    { key: 'carry', name: 'Carry it', tool: 'Glance card', verb: 'Share', crux: false },
  ];
  const steps: PrepStep[] = base.map((s) => ({
    ...s,
    minutes: Math.max(1, Math.round(shown[s.key] / READ_WPM + DOING[s.key] + (s.key === 'rehearse' ? scenarios.length * 0.5 : 0))),
    lede: ledes[s.key],
  }));

  return {
    heading: im.title,
    authored: { status: premo.status, source: im.sources[0] ?? null },
    predict: premo.predict,
    predictTask: cruxIm?.task ?? [],
    code: im.code,
    gradeUnit: 'Grade 6 · Unit 3',
    totalTime: optionalMin ? `${required}–${required + optionalMin} min` : `${required} min`,
    destination: premo.goal,
    idea: premo.goal,
    // IM's narrative, without the practice-standard tags (MP2, MP7) a teacher can't use at 9 pm.
    arc: (im.narrative[0] ?? '').replace(/\s*\(MP\d(?:,\s*MP\d)*\)/g, ''),
    activities,
    crux,
    steps,
    estimateMinutes: steps.reduce((n, s) => n + s.minutes, 0),
    proof: { closing: im.lessonSynthesis.join(' '), parts: null, coolDown, lookFors: coolDown?.lookFors ?? [] },
    patterns,
    listenFor: [],
    scenarios,
    rigorCheck: premo.rigorCheck,
    cuts,
    neverCut: premo.neverCut.map((text) => ({ text })),
    supports,
    language: {
      frames: [],
      vocabulary,
      profile: {},
      routineNote: `These sit inside the lesson’s own ${premo.cruxLanguage.routine.replace(/^MLR ?\d:\s*/, '')} routine, ${
        premo.cruxLanguage.phase === 'launch' ? 'at the start of the activity' : premo.cruxLanguage.phase === 'synthesis' ? 'in the class discussion at the end' : 'while students work'
      }.`,
    },
    // Premo's list already covers IM's preparation in plain words; showing both repeated items.
    setup: { crux: null, checklist: premo.beforeClass.length ? premo.beforeClass : im.preparation },
    inClass: { launch: quoted(premo.inClass.launch), ask: null, setup: null, lines, sequence: premo.inClass.sequence },
  };
}

/** Which IM support the crux's language work sits inside, for the Adjust step. */
export function cruxSupport(lesson: U3Lesson) {
  const a = lesson.im.activities.find((x) => x.id === lesson.premo.crux);
  return a?.ell.find((e) => e.routine.replace(/[^0-9]/g, '').slice(0, 1) === lesson.premo.cruxLanguage.routine.replace(/[^0-9]/g, '').slice(0, 1)) ?? null;
}
