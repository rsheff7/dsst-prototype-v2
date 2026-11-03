import { test } from 'node:test';
import assert from 'node:assert/strict';
import { markCell } from './marks.ts';

// IM writes answers in LaTeX, sometimes with alternatives ("6/15 or 0.4"); teachers type plain numbers.
test('numbers match IM by value', () => {
  assert.equal(markCell('12', '12'), 'right');
  assert.equal(markCell('13', '12'), 'wrong');
  assert.equal(markCell('$35', '35'), 'right');
  assert.equal(markCell('2/5', '\\(\\frac{6}{15}\\) or 0.4'), 'right');
  assert.equal(markCell('0.4', '\\(\\frac{6}{15}\\) or 0.4'), 'right');
});

test('mixed numbers and rounding to two places', () => {
  assert.equal(markCell('16 2/3', '\\(16\\frac{2}{3}\\)'), 'right');
  assert.equal(markCell('16.67', '\\(16\\frac{2}{3}\\)'), 'right');
  assert.equal(markCell('16.6', '\\(16\\frac{2}{3}\\)'), 'wrong');
});

test('expressions IM writes differently are shown to compare, not marked wrong', () => {
  assert.equal(markCell('c/b', '\\(\\frac{c}{b}\\)'), 'right');
  assert.equal(markCell('7b', '\\(b \\boldcdot (7)\\)'), 'compare');
});
