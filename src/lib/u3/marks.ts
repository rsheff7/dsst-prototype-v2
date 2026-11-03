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
  // Units and currency don't change the value: "$35", "12 inches", "2.5 mph", "40%".
  const t = plain(s).replace(/\\?\$/g, '').replace(/,/g, '').replace(/\s*(%|[a-z][a-z .]*)$/i, '').trim();
  let m = /^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/.exec(t);
  if (m) return Number(m[1]) + Number(m[2]) / Number(m[3]);
  m = /^(-?\d*\.?\d+)\s*\/\s*(\d*\.?\d+)$/.exec(t);
  if (m) return Number(m[1]) / Number(m[2]);
  return /^-?(\d+\.?\d*|\.\d+)$/.test(t) ? Number(t) : null;
};
export type CellMark = 'right' | 'wrong' | 'compare';
/** Is the teacher's entry IM's answer? Numbers match by value (0.4 = 6/15; 16.67 for 16 2/3); anything else is shown to compare. */
export function markCell(entry: string, imAnswer: string): CellMark {
  // IM gives alternatives as "6/15 or 0.4"; only split between two answers, not inside words.
  const options = imAnswer.split(/(?<=[\d)}])\s+or\s+(?=[\\\d$(-])/);
  const n = toNumber(entry);
  if (n !== null && options.some((o) => toNumber(o) !== null)) {
    return options.some((o) => {
      const x = toNumber(o);
      // Within rounding to the hundredth: 16.67 for 16 2/3, never 999 for 1000.
      return x !== null && Math.abs(x - n) <= 0.006;
    })
      ? 'right'
      : 'wrong';
  }
  const squash = (s: string) => plain(s).replace(/[\s·()]/g, '').toLowerCase();
  return options.some((o) => squash(o) === squash(entry)) ? 'right' : 'compare';
}
