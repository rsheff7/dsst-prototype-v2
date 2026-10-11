/**
 * Gate for the phone prep model.
 *
 * Run with: npm run check:prep
 *
 * What is being defended is scope, because it was gotten wrong once
 * (docs/PHONE-PREP-MAPPING.md): "Do it as a student" must test the whole
 * lesson, and "crux focus" must include the activity that feeds the crux.
 * Both are easy to quietly narrow back to the crux alone.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  buildPrepModel,
  criteriaFor,
  findCruxIndex,
  focusRoles,
  parseMinutes,
  metaNumber,
  splitClosing,
  MAX_REHEARSAL,
} from './prepModel.ts';
import type { Activity, DecisionScenario, LessonData } from '../types.ts';
import { DRAFT_COOL_DOWNS } from './draftCoolDowns.ts';

// demoLesson.ts is a JSON object literal with a type cast on the end. Parsing
// it as data keeps this test off the app's module graph.
function loadDemo(): LessonData {
  const src = readFileSync(fileURLToPath(new URL('../demoLesson.ts', import.meta.url)), 'utf8');
  const body = src.slice(src.indexOf('= {') + 2, src.lastIndexOf('} as unknown') + 1);
  return JSON.parse(body) as LessonData;
}

function act(id: string, over: Partial<Activity> = {}): Activity {
  return {
    id,
    title: `Activity ${id}`,
    function: 'Setup',
    duration: '~10 min',
    grouping: 'Pairs',
    language_demand: 'low',
    function_summary: '',
    learning_target: `target ${id}`,
    synthesis_prompt: '',
    is_crux: false,
    friction_points: [],
    success_signals: [`signal ${id}`],
    teacher_moves: [],
    causal_link: null,
    extension: null,
    ...over,
  };
}

function scenario(type: DecisionScenario['scenario_type'], label: string): DecisionScenario {
  return {
    scenario_type: type,
    label,
    interpretation: `why ${label}`,
    is_mll: false,
    flat_move: { move: `Do ${label}. Then more.`, say: `"Say ${label}"`, nonverbal: null, avoid: `Fixing ${label} for them.` },
    proficiency_moves: null,
    mll_framework_note: null,
  };
}

test('parseMinutes reads the durations generation writes', () => {
  assert.equal(parseMinutes('~10 min'), 10);
  assert.equal(parseMinutes('15 minutes'), 15);
  assert.equal(parseMinutes('10-12 min'), 10);
  assert.equal(parseMinutes(''), null);
  assert.equal(parseMinutes('varies'), null);
});

test('crux: flag wins, role is the fallback, none is reported as none', () => {
  assert.equal(findCruxIndex([act('1'), act('2', { is_crux: true }), act('3', { function: 'Crux' })]), 1);
  assert.equal(findCruxIndex([act('1'), act('2', { function: 'Crux' })]), 1);
  assert.equal(findCruxIndex([act('1'), act('2')]), -1);
});

test('focus is the crux, the activity before it, and high-demand work after it', () => {
  const roles = focusRoles([
    act('1'),
    act('2'),
    act('3', { is_crux: true }),
    act('4', { language_demand: 'medium' }),
    act('5', { language_demand: 'high' }),
  ]);
  assert.deepEqual(roles, [null, 'feeder', 'crux', null, 'after']);
});

test('a crux in first position has no feeder', () => {
  assert.deepEqual(focusRoles([act('1', { is_crux: true }), act('2')]), ['crux', null]);
});

test('criteria check what a move protects and never contain the model wording', () => {
  const s = scenario('common-error', 'x');
  const c = criteriaFor(s, []);
  assert.ok(c.some((line) => /Left the fixing to the student/.test(line)));
  assert.ok(c.includes('Steered clear of: fixing x for them.'));
  for (const line of c) {
    assert.ok(!line.includes('Say x'), 'the say line is the reveal, not a criterion');
    assert.ok(!line.includes('Do x'), 'the move is the reveal, not a criterion');
  }
});

test('MLL criteria keep the task the same and carry every distinct avoid line', () => {
  const at = (avoid: string) => ({ move: 'Point.', say: '"Look."', nonverbal: null, avoid });
  const s: DecisionScenario = {
    ...scenario('common-error', 'y'),
    is_mll: true,
    flat_move: { move: '', say: null, nonverbal: null, avoid: '' },
    proficiency_moves: { emerging: at('Over-explaining.'), developing: at('Stating the rule for them.'), expanding: at('Over-explaining.') },
  };
  const c = criteriaFor(s, []);
  assert.ok(c.includes('Kept the same task for every level; only the language support changed'));
  assert.ok(c.includes('Steered clear of: over-explaining.'));
  assert.ok(c.includes('Steered clear of: stating the rule for them.'));
  assert.equal(c.filter((l) => /over-explaining/.test(l)).length, 1, 'avoid lines are deduped');
  for (const line of c) assert.ok(!/emerging|developing|expanding/i.test(line), `band key leaked: ${line}`);
});

test('the sample lesson: step 2 is a student task from the close, never the rigor check', () => {
  const lesson = loadDemo();
  const m = buildPrepModel(lesson);
  assert.equal(m.crux?.id, '1.2');
  assert.equal(m.proof.closing, lesson.lesson_synthesis.prompt);
  assert.ok(!JSON.stringify(m.proof).includes(lesson.adaptation_guardrails.rigor_check));
  assert.ok(m.proof.lookFors.length > 0);
  for (const lf of m.proof.lookFors) assert.ok(!/display|poster|visual/i.test(lf), `unshowable look-for: ${lf}`);
  // The idea underneath is shown, from the guardrails.
  assert.equal(m.idea, lesson.adaptation_guardrails.mathematical_purpose);
});

test('the sample lesson: predict and rehearse reach the activity that feeds the crux', () => {
  const m = buildPrepModel(loadDemo());
  const patternActs = new Set(m.patterns.map((p) => p.activityId));
  assert.ok(patternActs.has('1.2') && patternActs.has('1.1'), `patterns from ${[...patternActs]}`);
  // The crux's main misconception is tagged MLL-specific in DSST data; it must
  // still lead Predict.
  assert.equal(m.patterns[0].activityId, '1.2');
  assert.equal(m.patterns[0].kind, 'error');
  const rehearseActs = new Set(m.scenarios.map((s) => s.activityId));
  assert.ok(rehearseActs.has('1.2') && rehearseActs.has('1.1'), `scenarios from ${[...rehearseActs]}`);
  assert.ok(m.scenarios.length <= MAX_REHEARSAL);
  // The feeder contributes only failures; its insights don't threaten the crux.
  for (const s of m.scenarios.filter((x) => x.focus === 'feeder')) {
    assert.ok(['common-error', 'partial-understanding', 'productive-struggle'].includes(s.type), s.type);
  }
  // 1.3 is in the pool for its language demand, so its place goes to a language scenario.
  const after = m.scenarios.filter((x) => x.activityId === '1.3');
  assert.equal(after.length, 1);
  assert.ok(after[0].mll);
  // Patterns use the generator's frequency, so an on-track pattern isn't told to "plan for this".
  assert.ok(m.patterns.every((p) => !/plan for this/i.test(p.frequencyLabel)));
});

test('the sample lesson: timeline, adjust and in-class card fill from lesson data', () => {
  const m = buildPrepModel(loadDemo());
  assert.deepEqual(
    m.activities.map((a) => a.start),
    ['0:00', '0:10', '0:25'],
  );
  assert.ok(m.activities.every((a) => a.watchFor));
  assert.ok(m.cuts.length > 0 && m.neverCut.length > 0 && m.rigorCheck);
  assert.ok(m.scenarios.every((s) => s.criteria.length > 0), 'every rehearsed scenario has something to check');
  // Setup the lesson already names is surfaced.
  assert.match(m.setup.crux ?? '', /capture one from the room/);
  assert.ok(m.setup.checklist.length > 0);
  assert.ok(m.language.frames.length > 0 && m.language.profile.developing);
  assert.ok(m.listenFor.length > 0 && m.inClass.ask === m.listenFor[0]);
});

test('the sample lesson: what is rehearsed is what goes to class', () => {
  const m = buildPrepModel(loadDemo(), ['emerging', 'developing']);
  assert.ok(m.inClass.lines.length > 0 && m.inClass.lines.length <= 3);
  const rehearsedSays = new Set(
    m.scenarios.flatMap((s) => [s.flat?.say, ...(s.byBand ?? []).map((b) => b.say)]).filter(Boolean),
  );
  for (const line of m.inClass.lines) {
    for (const say of line.say) assert.ok(rehearsedSays.has(say.text), `not rehearsed: ${say.text}`);
  }
  // Only the class's levels go on the card.
  assert.ok(m.inClass.lines.every((l) => l.say.every((x) => x.label !== 'Levels 5–6')));
});

test('over the cap, the crux keeps its places', () => {
  const acts = [act('1'), act('2', { is_crux: true }), act('3', { language_demand: 'high' })];
  const many = (id: string) => ({
    activity_id: id,
    scenarios: ['common-error', 'partial-understanding', 'productive-struggle', 'on-track'].map((t, i) =>
      scenario(t as DecisionScenario['scenario_type'], `${id}-${i}`),
    ),
  });
  const lesson = {
    ...loadDemo(),
    activities: acts,
    decision_guide: { activities: [many('1'), many('2'), many('3')] },
  } as LessonData;
  const m = buildPrepModel(lesson);
  const count = (id: string) => m.scenarios.filter((s) => s.activityId === id).length;
  assert.equal(count('2'), 3);
  assert.equal(count('1'), 2);
  assert.equal(count('3'), 1);
  // Lesson order, so rehearsal walks the class period forward.
  assert.deepEqual(
    m.scenarios.map((s) => s.activityId),
    ['1', '1', '2', '2', '2', '3'],
  );
  // Within an activity, the moments most likely to derail come first.
  assert.equal(m.scenarios.find((s) => s.activityId === '2')?.type, 'common-error');
});

test('lesson codes read the same whichever form the analysis wrote', () => {
  assert.equal(metaNumber('Grade 7'), '7');
  assert.equal(metaNumber('Lesson 22'), '22');
  assert.equal(metaNumber('6'), '6');
  const lesson = loadDemo();
  lesson.meta = { ...lesson.meta, grade: 'Grade 7', unit: 'Unit 6', lesson_number: 'Lesson 22' };
  const m = buildPrepModel(lesson);
  assert.equal(m.code, '7.6.22');
  assert.equal(m.gradeUnit, 'Grade 7 · Unit 6');
});

test('a placeholder move is not something to rehearse', () => {
  const lesson = loadDemo();
  for (const a of lesson.decision_guide.activities)
    for (const s of a.scenarios) {
      s.flat_move = { move: 'n/a', say: 'n/a', avoid: 'n/a' } as DecisionScenario['flat_move'];
      s.proficiency_moves = null;
    }
  const m = buildPrepModel(lesson);
  assert.equal(m.scenarios.length, 0);
  assert.equal(m.inClass.lines.length, 0);
});

test('the close gives up its question and holds the rest back', () => {
  const p = splitClosing(
    "Synthesize the lesson by displaying 6(2x - 1) + 4(2x - 1) on the board and asking: 'How do we rewrite this with fewer terms?' Guide students to 10(2x - 1).",
  );
  assert.ok(p);
  assert.equal(p.question, 'How do we rewrite this with fewer terms?');
  assert.equal(p.setup, 'Synthesize the lesson by displaying 6(2x - 1) + 4(2x - 1) on the board.');
  assert.equal(p.after, 'Guide students to 10(2x - 1).');
  assert.ok(!p.setup.includes('10(2x - 1)') && !p.question.includes('10(2x - 1)'));
  // Unquoted questions too; and no question means no split.
  assert.equal(splitClosing('Display both mixtures. Ask: Why does doubling keep the shade?')?.question, 'Why does doubling keep the shade?');
  assert.equal(splitClosing('Ask students to name the multiplier, and emphasize the definition.'), null);
});

test('the time a prep claims follows what it shows', () => {
  const lesson = loadDemo();
  const all = buildPrepModel(lesson, []);
  const one = buildPrepModel(lesson, ['emerging']);
  assert.equal(all.estimateMinutes, all.steps.reduce((n, s) => n + s.minutes, 0));
  assert.ok(one.estimateMinutes <= all.estimateMinutes, 'one level is no longer than three');
});

test('a lesson with a cool-down does it as the student task; one without falls back to the close', () => {
  const lesson = loadDemo();
  const m = buildPrepModel(lesson);
  assert.equal(m.code, '6.2.1');
  assert.equal(m.proof.coolDown, DRAFT_COOL_DOWNS['6.2.1']);
  assert.deepEqual(m.proof.lookFors, DRAFT_COOL_DOWNS['6.2.1'].lookFors);

  lesson.meta = { ...lesson.meta, lesson_number: '99' };
  const none = buildPrepModel(lesson);
  assert.equal(none.proof.coolDown, null);
  assert.ok(none.proof.lookFors.length > 0, 'falls back to the lesson-wide look-fors');
});

test('every draft cool-down is complete, marked as a draft, and keeps its answer out of the task', () => {
  for (const [code, cd] of Object.entries(DRAFT_COOL_DOWNS)) {
    assert.match(code, /^\d+\.\d+\.\d+$/, code);
    assert.ok(cd.draft, `${code} is a placeholder until DSST supplies its own`);
    assert.ok(cd.task.length >= 2 && cd.strongAnswer.length >= 2 && cd.lookFors.length >= 3, code);
    for (const line of cd.strongAnswer) assert.ok(!cd.task.includes(line), `${code}: an answer line appears in the task`);
  }
});
