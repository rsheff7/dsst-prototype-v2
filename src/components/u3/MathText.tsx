'use client';

import type { ReactNode } from 'react';
import s from './u3.module.css';

/**
 * IM's text carries mathematics as \( … \), the way IM's web pages write it.
 * Unit 3 uses four commands: \frac, \boldcdot, \div and \approx. This renders
 * exactly those; anything else shows as written, so nothing is silently lost.
 */
function renderMath(tex: string, key: string): ReactNode {
  const out: ReactNode[] = [];
  let i = 0;
  let k = 0;
  const text = (t: string) =>
    t
      .replace(/\\boldcdot|\\cdot/g, '·')
      .replace(/\\div/g, '÷')
      .replace(/\\approx/g, '≈')
      .replace(/\\\$/g, '$')
      .replace(/\\left|\\right/g, '')
      .replace(/\\,|\\!|\\ /g, '')
      .replace(/[{}]/g, '');
  const arg = (from: number): [string, number] => {
    // \frac12 is valid TeX for ½: single-character arguments without braces.
    if (tex[from] !== '{') return [tex[from] ?? '', from + 1];
    let depth = 0;
    for (let j = from; j < tex.length; j++) {
      if (tex[j] === '{') depth++;
      else if (tex[j] === '}' && --depth === 0) return [tex.slice(from + 1, j), j + 1];
    }
    return [tex.slice(from + 1), tex.length];
  };
  while (i < tex.length) {
    const f = tex.indexOf('\\frac', i);
    if (f < 0) {
      out.push(text(tex.slice(i)));
      break;
    }
    out.push(text(tex.slice(i, f)));
    const [num, a] = arg(f + 5);
    const [den, b] = arg(a);
    out.push(
      <span key={`${key}-${k++}`} className={s.frac}>
        <span>{renderMath(num, `${key}n${k}`)}</span>
        <span>{renderMath(den, `${key}d${k}`)}</span>
      </span>,
    );
    i = b;
  }
  return out;
}

export function MathText({ children }: { children: string | null | undefined }) {
  if (!children) return null;
  const parts = children.replace(/\\\$/g, '$').split(/\\\(|\\\)/);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <span key={i} className={s.math}>
            {renderMath(p, String(i))}
          </span>
        ) : (
          p
        ),
      )}
    </>
  );
}

const startsRow = (l: string | undefined) => !!l && /^\|/.test(l.trim());
// IM writes a table's header row without the leading bar, so a "a | b" line
// counts as a row when a row follows it, or when it has three or more cells.
const isRow = (l: string, next?: string) =>
  startsRow(l) || (/ \| /.test(l) && !/[.?!:]$/.test(l.trim()) && (startsRow(next) || l.split(' | ').length > 2));
const cells = (l: string) => l.trim().replace(/^\|\s?/, '').split(/\s*\|\s*/);

/**
 * A run of IM lines as IM prints them: paragraphs, and tables where IM's
 * lines are table rows ("| a | b"). The first row of a run is the header.
 */
export function IMLines({ lines, className }: { lines: string[] | null | undefined; className?: string }) {
  if (!lines?.length) return null;
  const blocks: ({ kind: 'p'; text: string } | { kind: 't'; rows: string[][] })[] = [];
  const clean = lines.filter((l) => !/^\[image: Expand image\]$/.test(l.trim()));
  for (let i = 0; i < clean.length; i++) {
    const l = clean[i];
    if (isRow(l, clean[i + 1])) {
      const last = blocks[blocks.length - 1];
      if (last?.kind === 't') last.rows.push(cells(l));
      else blocks.push({ kind: 't', rows: [cells(l)] });
    } else blocks.push({ kind: 'p', text: l.replace(/\s*\[image: Expand image\]/g, '') });
  }
  return (
    <div className={className ?? s.lines}>
      {blocks.map((b, i) =>
        b.kind === 'p' ? (
          /^\[image:/.test(b.text) ? (
            <p key={i} className={s.image}>
              <MathText>{b.text.replace(/^\[image:\s*|\]$/g, '')}</MathText>
            </p>
          ) : (
            <p key={i}>
              <MathText>{b.text}</MathText>
            </p>
          )
        ) : (
          <div key={i} className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  {b.rows[0].map((c, j) => (
                    <th key={j}>
                      <MathText>{c}</MathText>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.rows.slice(1).map((r, j) => (
                  <tr key={j}>
                    {b.rows[0].map((_, c) => (
                      <td key={c}>
                        <MathText>{r[c] ?? ''}</MathText>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ),
      )}
    </div>
  );
}
