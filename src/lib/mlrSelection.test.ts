/**
 * Determinism gate for MLR assignment.
 *
 * Run with: npm run check:mlr
 *
 * Architectural rule, same as src/lib/eld/eld.test.ts: what the code decides is
 * owned and verifiable. MLR assignment moved out of the model precisely because
 * a generated answer varied five ways across ten runs of one lesson — so the
 * replacement has to be provably stable, or we traded one kind of drift for
 * another that is harder to see.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
// Explicit .ts extensions so Node's ESM resolver finds the files when running
// via `node --test --experimental-strip-types`.
import { selectMlrs, buildMlrPlan, describeMlrPlan } from './mlrSelection.ts';
import { ALL_MLR_NUMBERS, MLRS } from './mlrs.ts';

const ACTIVITIES = [
  {
    id: '1.1',
    function: 'Setup',
    language_demand: 'low',
    learning_target: 'Students sort a set of figures into categories and identify the count in each group.',
  },
  {
    id: '1.2',
    function: 'Crux',
    language_demand: 'high',
    learning_target: 'Students write ratio statements using to, colon, and for every notation.',
  },
  {
    id: '1.3',
    function: 'Application',
    language_demand: 'medium',
    learning_target: 'Students justify why two ratios are equivalent.',
  },
  {
    id: '1.4',
    function: 'Synthesis',
    language_demand: 'low',
    learning_target: 'Students compare two representations of the same ratio.',
  },
];

test('same activity always yields the same pair', () => {
  for (const activity of ACTIVITIES) {
    const first = selectMlrs(activity);
    for (let i = 0; i < 50; i++) {
      assert.deepEqual(selectMlrs(activity), first, `${activity.id} drifted on repeat call`);
    }
  }
});

test('a plan is stable across repeated builds', () => {
  const once = JSON.stringify(buildMlrPlan(ACTIVITIES));
  for (let i = 0; i < 50; i++) {
    assert.equal(JSON.stringify(buildMlrPlan(ACTIVITIES)), once);
  }
});

test('always exactly two distinct, valid routines', () => {
  for (const activity of ACTIVITIES) {
    const pair = selectMlrs(activity);
    assert.equal(pair.length, 2, `${activity.id} did not get two routines`);
    assert.notEqual(pair[0], pair[1], `${activity.id} got a duplicate pair`);
    for (const n of pair) {
      assert.ok(ALL_MLR_NUMBERS.includes(n), `${activity.id} got MLR ${n}, which is not 1-8`);
    }
  }
});

test('total on any input — missing fields must not throw', () => {
  const degenerate = [
    {},
    { id: 'x' },
    { id: 'x', function: 'NotARealFunction' },
    { id: 'x', language_demand: 'nonsense' },
    { id: 'x', learning_target: '' },
    { id: 'x', title: '', learning_target: '' },
  ];
  for (const activity of degenerate) {
    const pair = selectMlrs(activity as { id: string });
    assert.equal(pair.length, 2);
    assert.notEqual(pair[0], pair[1]);
  }
});

test('a high language demand always earns Discussion Supports', () => {
  // MLR 8 is what makes the other routines survivable for a student still
  // building English; the table must not lose it to a function override.
  for (const fn of ['Setup', 'Crux', 'Application', 'Synthesis']) {
    const pair = selectMlrs({
      id: 'x',
      function: fn,
      language_demand: 'high',
      learning_target: 'Students explain how the diagram shows the relationship.',
    });
    assert.ok(pair.includes(8), `${fn} at high demand dropped MLR 8: got ${pair.join(',')}`);
  }
});

test('the KLU signal actually changes the assignment', () => {
  // If every input produced the same pair the mapping would be stable but
  // useless — this guards against the table collapsing to a constant.
  const argue = selectMlrs({ id: 'x', learning_target: 'Students justify why the claim holds.' });
  const inform = selectMlrs({ id: 'x', learning_target: 'Students list and count the categories.' });
  assert.notDeepEqual(argue, inform, 'Argue and Inform produced the same routines');
});

test('the directive names every activity and its routines', () => {
  const plan = buildMlrPlan(ACTIVITIES);
  const text = describeMlrPlan(plan, (n) => MLRS[n].name);
  for (const activity of ACTIVITIES) {
    assert.ok(text.includes(activity.id), `directive omits ${activity.id}`);
    for (const n of plan[activity.id]) {
      assert.ok(text.includes(`MLR ${n}`), `directive omits MLR ${n} for ${activity.id}`);
    }
  }
});
