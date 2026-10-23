'use client';

import Link from 'next/link';
import { BUILT, UNIT } from '@/lib/u3/content';
import { MathText } from '@/components/u3/MathText';
import s from '@/components/u3/u3.module.css';

const USE_LABEL: Record<string, string> = { interpret: 'Interpret', explain: 'Explain', justify: 'Justify' };

// Unit 3 at a glance: where each lesson sits, what to check before the unit,
// and how the language grows. IM's words throughout, as IM wrote them.
export default function U3UnitPage() {
  const built = new Set(BUILT);
  const builtTerms = BUILT.map((c) => [c, UNIT.terminology[c]] as const).filter(([, t]) => t);
  return (
    <main className={s.unit}>
      <header style={{ display: 'grid', gap: 6 }}>
        <span className={s.eyebrow}>Grade 6 · Unit 3 · IM 6–8 Math</span>
        <h1>{UNIT.title}</h1>
        <p className={s.muted}>
          {BUILT.length} of {Object.keys(UNIT.lessonTitles).length} lessons built so far. Each opens a prep for the night before.
        </p>
      </header>

      {UNIT.sections.map((sec) => (
        <section key={sec.title} className={s.section}>
          <h2>{sec.title}</h2>
          {sec.lessons.map((c) =>
            built.has(c) ? (
              <Link key={c} href={`/u3/${c}`} className={s.lesson}>
                <span className={s.code}>{c}</span>
                <span>{UNIT.lessonTitles[c]}</span>
                <span className={s.go}>Prep →</span>
              </Link>
            ) : (
              <div key={c} className={`${s.lesson} ${s.lessonOff}`}>
                <span className={s.code}>{c}</span>
                <span>{UNIT.lessonTitles[c]}</span>
                <span className={s.muted} style={{ fontSize: 12 }}>
                  Not built yet
                </span>
              </div>
            ),
          )}
        </section>
      ))}

      <section className={s.card}>
        <h2>Before the unit</h2>
        <p className={s.muted}>From IM’s readiness check: items that point to the lessons built here.</p>
        {UNIT.readinessCheck.map((r) => (
          <details key={r.item}>
            <summary>
              Item {r.item} · first needed in {r.firstIn}
            </summary>
            <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
              {r.task.map((t, i) => (
                <p key={i}>
                  <MathText>{t}</MathText>
                </p>
              ))}
              {r.note.map((n, i) => (
                <p key={i} className={s.muted}>
                  <MathText>{n}</MathText>
                </p>
              ))}
              <p>
                <b>If most students struggle:</b> <MathText>{r.move.replace(/^If most students struggle with this item, /, '')}</MathText>
              </p>
            </div>
          </details>
        ))}
      </section>

      <section className={s.card}>
        <h2>How the language grows</h2>
        <p className={s.muted}>What IM expects students to do with language, and the new words in each built lesson.</p>
        {UNIT.languageProgression.map((u) => (
          <div key={u.use}>
            <b>{USE_LABEL[u.use] ?? u.use}</b>
            <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
              {u.items.map((i) => (
                <li key={i.text} className={i.lessons.some((c) => built.has(c)) ? undefined : s.muted}>
                  {i.text}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {builtTerms.map(([c, t]) => (
          <div key={c} style={{ display: 'grid', gap: 4 }}>
            <span className={s.code}>{c}</span>
            <div className={s.chips}>
              {t.productive.map((w) => (
                <span key={w} className={`${s.chip} ${s.chipProduce}`}>
                  say it: {w}
                </span>
              ))}
              {t.receptive.map((w) => (
                <span key={w} className={s.chip}>
                  understand it: {w}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      <details className={s.card}>
        <summary>IM’s unit narrative</summary>
        {UNIT.narrative.map((p, i) => (
          <p key={i}>
            <MathText>{p}</MathText>
          </p>
        ))}
      </details>
    </main>
  );
}
