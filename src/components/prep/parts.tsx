'use client';

import type { ReactNode } from 'react';
import type { PrepActivity } from '@/lib/prep/prepModel';
import { activityName } from '@/lib/prep/prepModel';
import type { MlrRef } from '@/lib/types';
import s from './prep.module.css';

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

const svg = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {d}
  </svg>
);

export const Icon = {
  back: svg(<path d="M15 18l-6-6 6-6" />),
  book: svg(
    <>
      <path d="M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2z" />
      <path d="M22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z" />
    </>,
  ),
  home: svg(
    <>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
    </>,
  ),
  play: svg(<path d="M7 5l12 7-12 7z" />),
  card: svg(
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M7 10h10M7 14h6" />
    </>,
  ),
  x: svg(<path d="M6 6l12 12M18 6L6 18" />),
  check: svg(<path d="M5 12l5 5 9-10" />),
  lock: svg(
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>,
  ),
  flag: svg(<path d="M5 21V4h11l-2 4 2 4H5" />),
  mic: svg(
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </>,
  ),
};

export function Check({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className={s.ck} aria-pressed={on} onClick={onClick}>
      <span className={s.ckBox}>{Icon.check}</span>
      <span>{children}</span>
    </button>
  );
}

export function MlrPill({ mlr }: { mlr?: MlrRef }) {
  if (!mlr) return null;
  return (
    <span className={cx(s.pill, s.pillAct)} title={mlr.name}>
      MLR {mlr.number} · {mlr.name}
    </span>
  );
}

export function Sheet({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  return (
    <div className={s.scrim} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={s.sheet} role="dialog" aria-modal="true">
        <div className={s.grab} />
        {children}
      </div>
    </div>
  );
}

export function SheetTop({ eyebrow, onClose }: { eyebrow: string; onClose: () => void }) {
  return (
    <div className={s.sheetTop}>
      <span className={s.eyebrow}>{eyebrow}</span>
      <button type="button" className={s.iconbtn} onClick={onClose} aria-label="Close" autoFocus>
        {Icon.x}
      </button>
    </div>
  );
}

const DEMAND: Record<string, string> = { low: 'Low', medium: 'Medium', high: 'High' };

/** Everything the lesson says about one activity, for the Orient bottom sheet. */
export function ActivityDetail({ a }: { a: PrepActivity }) {
  const x = a.source;
  return (
    <div className={s.stack} style={{ fontSize: 15 }}>
      <h2>{activityName(a)}</h2>
      {a.prep && (
        <div className={s.flat}>
          <span className={s.lab}>Before class</span>
          {a.prep}
        </div>
      )}
      <div>
        <span className={s.lab}>What happens</span>
        {x.function_summary}
      </div>
      {x.causal_link && (
        <div>
          <span className={s.lab}>Why it’s here</span>
          {x.causal_link}
        </div>
      )}
      <div>
        <span className={s.lab}>Learning target</span>
        {x.learning_target}
      </div>
      {x.success_signals?.length > 0 && (
        <div>
          <span className={s.lab}>Signals of strong thinking</span>
          <ul className={s.clean}>
            {x.success_signals.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}
      {x.friction_points?.length > 0 && (
        <div>
          <span className={s.lab}>Friction</span>
          <ul className={s.clean}>
            {x.friction_points.map((f, i) => (
              <li key={i}>
                <b>{f.type === 'math' ? 'Math' : f.type === 'language' ? 'Language' : 'Language + math'}:</b>{' '}
                {f.description}
              </li>
            ))}
          </ul>
        </div>
      )}
      {x.teacher_moves?.length > 0 && (
        <div>
          <span className={s.lab}>Teacher moves</span>
          <ul className={s.clean}>
            {x.teacher_moves.map((m, i) => (
              <li key={i}>
                {m.text} {m.mlr && <MlrPill mlr={m.mlr} />}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <span className={s.lab}>Language · {DEMAND[x.language_demand] ?? x.language_demand} demand</span>
        {a.language ? (
          <ul className={s.clean}>
            <li>
              <b>Read and listen:</b> {a.language.receptive}
            </li>
            <li>
              <b>Say and write:</b> {a.language.productive}
            </li>
            <li>
              <b>Talk together:</b> {a.language.interactive}
            </li>
            <li>
              <b>From everyday to math language:</b> {a.language.bridge}
            </li>
            {a.language.homeLanguage && (
              <li>
                <b>Home language:</b> {a.language.homeLanguage}
              </li>
            )}
          </ul>
        ) : null}
      </div>
      {x.synthesis_prompt && (
        <div className={s.flat}>
          <span className={s.lab}>Synthesis</span>
          {x.synthesis_prompt}
        </div>
      )}
    </div>
  );
}
