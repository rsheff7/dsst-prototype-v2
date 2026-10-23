import s from './u3.module.css';

// Shown on preview deployments only; the live site (production) has none.
const PREVIEW = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production';

export function PilotBanner() {
  return PREVIEW ? <div className={s.pilot}>Pilot draft</div> : null;
}

/** CC BY credit: source, licence, and that it was changed. */
export function ImCredit() {
  return (
    <p className={s.credit}>
      Adapted from{' '}
      <a href="https://im.kendallhunt.com/MS/teachers/1/3/index.html">IM 6–8 Math</a>,{' '}
      <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
    </p>
  );
}
