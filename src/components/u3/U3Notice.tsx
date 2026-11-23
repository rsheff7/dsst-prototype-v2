import s from './u3.module.css';

import { APP_VERSION, RELEASE_DATE } from '@/lib/version';

// The live site (production) shows its version and date; previews also say they're a draft.
const PREVIEW = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production';

export function PilotBanner() {
  return (
    <div className={s.pilot}>
      {PREVIEW ? 'Pilot draft · ' : ''}
      {APP_VERSION} · {RELEASE_DATE}
    </div>
  );
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
