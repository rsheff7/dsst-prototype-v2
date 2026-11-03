/**
 * Marking a teacher's entry in a table cell against IM's completed table
 * (the planning view). Numbers match by value, so 0.4, 6/15 and 2/5 are the
 * same answer, and 16.67 counts for 16 2/3. Anything else (an expression such
 * as b · 7) is shown beside IM's answer for the teacher to compare.
 */
/** LaTeX to plain: fractions as a/b, mixed numbers as "16 2/3". */
const plain = (s: string) =>
  s
    .replace(/\\\(|\\\)/g, '')
    .replace(/(\d)\s*\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1 $2/$3')
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2')
    .replace(/\\boldcdot|\\cdot|×|\*/g, '·')
    .replace(/\\left|\\right|[{}]/g, '')
    .trim();
const toNumber = (s: string): number | null => {
  const t = plain(s).replace(/[$,]/g, '').replace(/\s*(dollars?|cents?|cups?|hours?|minutes?|miles?|meters?|seconds?|pounds?)$/i, '').trim();
  let m = /^(-?\d+)\s+(\d+)\/(\d+)$/.exec(t);
  if (m) return Number(m[1]) + Number(m[2]) / Number(m[3]);
  m = /^(-?\d*\.?\d+)\/(\d*\.?\d+)$/.exec(t);
  if (m) return Number(m[1]) / Number(m[2]);
  return /^-?\d*\.?\d+$/.test(t) ? Number(t) : null;
};
export type CellMark = 'right' | 'wrong' | 'compare';
/** Is the teacher's entry IM's answer? Numbers match by value (0.4 = 6/15; 16.67 for 16 2/3); anything else is shown to compare. */
export function markCell(entry: string, imAnswer: string): CellMark {
  const options = imAnswer.split(/\s+or\s+/);
  const n = toNumber(entry);
  if (n !== null && options.some((o) => toNumber(o) !== null)) {
    return options.some((o) => {
      const x = toNumber(o);
      return x !== null && Math.abs(x - n) <= Math.max(0.006, Math.abs(x) * 0.001);
    })
      ? 'right'
      : 'wrong';
  }
  const squash = (s: string) => plain(s).replace(/[\s·()]/g, '').toLowerCase();
  return options.some((o) => squash(o) === squash(entry)) ? 'right' : 'compare';
}
