/**
 * Differentiation gate — ensures every KLU lens distinguishes adjacent
 * levels in a real way, not by cosmetic intensifier swaps.
 *
 * Run with: npm run check:eld
 *
 * Architectural rule: lookup data is owned and verifiable. This test is the
 * floor of quality for every lens row that ships, regardless of provenance.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
// Explicit .ts extensions so Node's ESM resolver finds the files when running
// via `node --test --experimental-strip-types`. TypeScript's bundler module
// resolution accepts these as well, so type-check still passes.
import { ARGUE_LENS } from './argue.ts';
import { EXPLAIN_LENS } from './explain.ts';
import { INFORM_LENS } from './inform.ts';
import { NARRATE_LENS } from './narrate.ts';
import { kluFromElsf } from './kluFromElsf.ts';
import { resolve } from './resolver.ts';
import type { Lens, WidaLevel } from './types.ts';

const LENSES: ReadonlyArray<{ name: string; lens: Lens }> = [
  { name: 'Argue', lens: ARGUE_LENS },
  { name: 'Explain', lens: EXPLAIN_LENS },
  { name: 'Inform', lens: INFORM_LENS },
  { name: 'Narrate', lens: NARRATE_LENS },
];

// Words that, if they are the ONLY difference between two adjacent rows,
// indicate cosmetic differentiation rather than a real level distinction.
const INTENSIFIER_PATTERN = /\b(more|additional|further|extra|added|added)\b/gi;

function stripIntensifiers(s: string): string {
  return s.replace(INTENSIFIER_PATTERN, '').replace(/\s+/g, ' ').trim().toLowerCase();
}

for (const { name, lens } of LENSES) {
  test(`${name}: lens has 6 rows in level order 1..6`, () => {
    assert.equal(lens.length, 6, `${name} lens has ${lens.length} rows; expected 6`);
    for (let i = 0; i < lens.length; i++) {
      assert.equal(
        lens[i].level,
        (i + 1) as WidaLevel,
        `${name} row ${i} has level=${lens[i].level}; expected ${i + 1}`,
      );
    }
  });

  test(`${name}: adjacent levels have non-identical embedded moves`, () => {
    for (let i = 0; i < lens.length - 1; i++) {
      const a = lens[i].embeddedMove;
      const b = lens[i + 1].embeddedMove;
      assert.notStrictEqual(
        a,
        b,
        `${name}: levels ${i + 1} and ${i + 2} have identical embeddedMove strings`,
      );
    }
  });

  test(`${name}: adjacent embedded moves don't differ only by intensifiers`, () => {
    for (let i = 0; i < lens.length - 1; i++) {
      const a = stripIntensifiers(lens[i].embeddedMove);
      const b = stripIntensifiers(lens[i + 1].embeddedMove);
      assert.notStrictEqual(
        a,
        b,
        `${name}: levels ${i + 1} and ${i + 2} differ only by intensifier words (more/additional/further/extra) — not a real level distinction`,
      );
    }
  });

  test(`${name}: adjacent discourse 'does' descriptions differ`, () => {
    for (let i = 0; i < lens.length - 1; i++) {
      const a = lens[i].discourse.does;
      const b = lens[i + 1].discourse.does;
      assert.notStrictEqual(
        a,
        b,
        `${name}: levels ${i + 1} and ${i + 2} have identical discourse.does`,
      );
    }
  });

  test(`${name}: level 6 'reaching' is the terminal marker ('—')`, () => {
    const row6 = lens[5];
    assert.equal(row6.discourse.reaching, '—');
    assert.equal(row6.sentence.reaching, '—');
    assert.equal(row6.wordPhrase.reaching, '—');
  });

  test(`${name}: provenance values are valid`, () => {
    for (const row of lens) {
      assert.ok(
        ['evidence_grounded', 'framework_grounded', 'design_hypothesis'].includes(row.provenance),
        `${name} level ${row.level} has invalid provenance: ${row.provenance}`,
      );
    }
  });
}

test('kluFromElsf: argue keywords map to Argue', () => {
  assert.equal(kluFromElsf(['justify a conjecture']), 'Argue');
  assert.equal(kluFromElsf(['defend a claim']), 'Argue');
  assert.equal(kluFromElsf(['describe a relationship', 'prove that x > y']), 'Argue');
});

test('kluFromElsf: explain keywords map to Explain', () => {
  assert.equal(kluFromElsf(['explain reasoning']), 'Explain');
  assert.equal(kluFromElsf(['show how a method works']), 'Explain');
});

test('kluFromElsf: inform keywords map to Inform when no higher KLU matches', () => {
  assert.equal(kluFromElsf(['describe the pattern']), 'Inform');
  assert.equal(kluFromElsf(['identify the shape', 'count the objects']), 'Inform');
});

test('kluFromElsf: narrate keywords map to Narrate when no higher KLU matches', () => {
  assert.equal(kluFromElsf(['retell the story']), 'Narrate');
  assert.equal(kluFromElsf(['sequence events in the problem']), 'Narrate');
});

test('kluFromElsf: empty or unmatched input defaults to Explain', () => {
  assert.equal(kluFromElsf([]), 'Explain');
  assert.equal(kluFromElsf(['mathematical practices']), 'Explain');
});

test('resolve: returns a state with the requested KLU and level', () => {
  const state = resolve('Argue', 3);
  assert.equal(state.klu, 'Argue');
  assert.equal(state.surfaceAnchor.level, 3);
  assert.equal(state.surfaceAnchor.label, 'Developing');
  assert.ok(state.embeddedMove.length > 0);
});

test('resolve: every (KLU × level) pair returns a populated state', () => {
  const klus = ['Argue', 'Explain', 'Inform', 'Narrate'] as const;
  const levels: WidaLevel[] = [1, 2, 3, 4, 5, 6];
  for (const k of klus) {
    for (const l of levels) {
      const state = resolve(k, l);
      assert.equal(state.surfaceAnchor.level, l);
      assert.ok(state.embeddedMove.length > 0, `resolve(${k}, ${l}) returned empty embeddedMove`);
    }
  }
});
