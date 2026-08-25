/**
 * Gate for outcome-first MLR selection.
 *
 * Run with: npm run check:mlr
 *
 * Two things are being defended here. First, determinism — the whole reason
 * selection moved out of the model. Second, and easier to lose: that the table
 * still *reaches* the full repertoire. The previous version was perfectly
 * deterministic and quietly emitted four of eight routines, with MLR 8 on 81% of
 * activities. Stable and wrong is the failure mode these tests exist to catch.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  recommendMlrs,
  buildMlrPlan,
  routinesUsed,
  routinesFor,
  describeMlrPlan,
  needsStandingSupports,
  OUTCOME_TYPES,
  type AnchorActivity,
} from './mlrSelection.ts';
import { ALL_MLR_NUMBERS, MLRS } from './mlrs.ts';

const ROLES = ['Setup', 'Crux', 'Application', 'Synthesis', ''] as const;

// Affordances are part of the input space now: a routine whose precondition is
// unmet and whose prep is unrealistic steps aside for a substitute. Sweeping
// outcome x role alone would report MLR 4 as unreachable, which is only true
// when nothing splits between partners.
const AFFORDANCE_SETS: AnchorActivity[] = [
  {} as AnchorActivity,
  { splittable_materials: true } as AnchorActivity,
  { flawed_sample_provided: true } as AnchorActivity,
  { student_products_differ: true, public_share_step: true } as AnchorActivity,
  { context_word_count: 80 } as AnchorActivity,
  { frames_already_printed: true } as AnchorActivity,
];

/** Every recommendation the table can produce, across the whole input space. */
function sweep(): { rec: ReturnType<typeof recommendMlrs>; label: string }[] {
  const out = [];
  for (const outcome_type of OUTCOME_TYPES) {
    for (const fn of ROLES) {
      for (const aff of AFFORDANCE_SETS) {
        out.push({
          rec: recommendMlrs({ ...aff, id: 'x', function: fn, outcome_type }),
          label: `${outcome_type}/${fn || 'no-role'}/${JSON.stringify(aff)}`,
        });
      }
    }
  }
  return out;
}

// G6 U2 L1 and G7 U6 L22, characterised from the source PDFs.
const G6: AnchorActivity[] = [
  { id: '1.1', function: 'Setup', outcome_type: 'formulate_precisely' },
  {
    id: '1.2',
    function: 'Crux',
    outcome_type: 'formulate_precisely',
    error_harvestable: true,
    frames_already_printed: true,
  },
  {
    id: '1.3',
    function: 'Application',
    outcome_type: 'connect_representations',
    student_products_differ: true,
    public_share_step: true,
  },
];

const G7: AnchorActivity[] = [
  { id: '22.1', function: 'Setup', outcome_type: 'justify_or_evaluate', flawed_sample_provided: true },
  { id: '22.2', function: 'Crux', outcome_type: 'communicate_precisely', splittable_materials: true },
  { id: '22.3', function: 'Application', outcome_type: 'generalize_in_writing', student_products_differ: true },
];

test('deterministic — repeated calls never differ', () => {
  for (const activity of [...G6, ...G7]) {
    const first = JSON.stringify(recommendMlrs(activity));
    for (let i = 0; i < 50; i++) {
      assert.equal(JSON.stringify(recommendMlrs(activity)), first, `${activity.id} drifted`);
    }
  }
});

test('total — every combination yields a valid recommendation', () => {
  for (const outcome_type of OUTCOME_TYPES) {
    for (const fn of ROLES) {
      const rec = recommendMlrs({ id: 'x', function: fn, outcome_type });
      assert.ok(ALL_MLR_NUMBERS.includes(rec.lead), `bad lead for ${outcome_type}/${fn}`);
      if (rec.second !== null) {
        assert.ok(ALL_MLR_NUMBERS.includes(rec.second));
        assert.notEqual(rec.second, rec.lead, `duplicate pair for ${outcome_type}/${fn}`);
      }
      assert.ok(rec.because.length > 20, `missing rationale for ${outcome_type}/${fn}`);
    }
  }
});

test('degenerate input never throws', () => {
  for (const activity of [{}, { id: 'x' }, { id: 'x', function: 'Nonsense' }] as AnchorActivity[]) {
    const rec = recommendMlrs(activity);
    assert.ok(ALL_MLR_NUMBERS.includes(rec.lead));
  }
});

test('the repertoire is reachable — routines 1-7 can all be selected', () => {
  const reachable = new Set<number>();
  for (const { rec } of sweep()) for (const n of routinesFor(rec)) reachable.add(n);
  for (const n of [1, 2, 3, 4, 5, 6, 7] as const) {
    assert.ok(reachable.has(n), `MLR ${n} (${MLRS[n].name}) can never be selected`);
  }
});

test('MLR 4 is reachable only where the materials actually split', () => {
  const withSplit = recommendMlrs({
    id: 'x',
    function: 'Crux',
    outcome_type: 'communicate_precisely',
    splittable_materials: true,
  });
  assert.equal(withSplit.lead, 4, 'splittable materials should yield Information Gap');

  const withoutSplit = recommendMlrs({
    id: 'x',
    function: 'Crux',
    outcome_type: 'communicate_precisely',
    student_products_differ: true,
  });
  assert.notEqual(
    withoutSplit.lead,
    4,
    'Information Gap needs a novice to author a card set — it must step aside',
  );
  assert.equal(withoutSplit.lead, 7, 'it should fall to comparing the differing work');
});

test('MLR 8 never occupies an activity slot', () => {
  // It is a lesson-level standing support. If it starts appearing as a lead or a
  // second, the filler problem is back.
  for (const { rec, label } of sweep()) {
    assert.ok(!routinesFor(rec).includes(8), `MLR 8 assigned for ${label}`);
  }
});

test('no single routine collapses the input space', () => {
  // Guards the failure that made the previous table useless: MLR 8 on 81% of
  // activities.
  //
  // The threshold is 50%, not something tighter, and the distinction is worth
  // stating. MLR 8 dominating was pathological because it is a bundle of teacher
  // moves with no student obligation and no artifact — every slot it took was a
  // slot that said nothing. MLR 1 currently sits at ~42% here and that is
  // defensible: it has a student artifact and a revision criterion, and most
  // activities do end with students holding a draft worth sharpening.
  //
  // This sweep is also uniform over outcome types, which real lessons are not.
  // The measure that matters for repertoire is per-lesson spread, covered by
  // 'a lesson uses a range of routines'.
  const counts = new Map<number, number>();
  let total = 0;
  for (const { rec } of sweep()) {
    for (const n of routinesFor(rec)) {
      counts.set(n, (counts.get(n) ?? 0) + 1);
      total++;
    }
  }
  for (const [routine, count] of counts) {
    assert.ok(
      count / total < 0.5,
      `MLR ${routine} takes ${Math.round((count / total) * 100)}% of all slots`,
    );
  }
});

test('outcome changes the routine — the table is not a constant', () => {
  const seen = new Set(
    OUTCOME_TYPES.map((outcome_type) => recommendMlrs({ id: 'x', function: 'Crux', outcome_type }).lead),
  );
  assert.ok(seen.size >= 4, `only ${seen.size} distinct leads across all outcome types`);
});

test('an activity may need only one routine', () => {
  const rec = recommendMlrs({ id: 'x', function: 'Setup', outcome_type: 'formulate_precisely' });
  assert.equal(rec.second, null, 'a five-minute warm-up should not carry two routines');
});

test('prep instructions appear exactly when the materials do not supply the precondition', () => {
  const noSample = recommendMlrs({ id: 'x', function: 'Crux', outcome_type: 'justify_or_evaluate' });
  assert.ok(noSample.teacher_prep, 'MLR 3 with no printed flawed sample must carry prep');

  const withSample = recommendMlrs({
    id: 'x',
    function: 'Crux',
    outcome_type: 'justify_or_evaluate',
    flawed_sample_provided: true,
  });
  assert.equal(withSample.teacher_prep, null, 'no prep needed when the sample is printed');
});

test('reproduces the per-activity recommendations made from the source PDFs', () => {
  // These six were arrived at independently by reading the lesson PDFs, before
  // any table existed. If a table change breaks one, it is the table that has to
  // justify itself.
  const expected: Record<string, [number, number | null]> = {
    '1.1': [2, null],
    '1.2': [3, 1],
    '1.3': [7, 1],
    '22.1': [3, 2],
    '22.2': [4, null],
    '22.3': [1, 7],
  };
  const plan = { ...buildMlrPlan(G6), ...buildMlrPlan(G7) };
  for (const [id, [lead, second]] of Object.entries(expected)) {
    assert.equal(plan[id].lead, lead, `${id} lead`);
    assert.equal(plan[id].second, second, `${id} second`);
  }
});

test('a lesson uses a range of routines, not one repeated', () => {
  assert.ok(routinesUsed(buildMlrPlan(G6)).length >= 3);
  assert.ok(routinesUsed(buildMlrPlan(G7)).length >= 4);
});

test('standing supports are flagged at the lesson level', () => {
  assert.equal(needsStandingSupports(G7), true);
  assert.equal(
    needsStandingSupports([{ id: 'x', function: 'Setup', outcome_type: 'connect_representations' }]),
    false,
  );
});

test('the directive carries targets, routines, rationale and prep', () => {
  const plan = buildMlrPlan(G6);
  const text = describeMlrPlan(plan, (n) => MLRS[n].name, ['I can write or say a sentence that describes a ratio']);
  assert.ok(text.includes('I can write or say a sentence'), 'published target missing');
  assert.ok(text.includes('MLR 2'), 'routine missing');
  assert.ok(text.includes('WHY:'), 'rationale missing');
  assert.ok(text.includes('PREP:'), 'prep missing');
  assert.ok(text.includes('one routine, not two'), 'single-routine instruction missing');
});
