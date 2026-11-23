/**
 * The Unit 3 content the app ships with: the unit, the routine catalog, and
 * each built lesson's IM and Premo layers. Static imports, so the build fails
 * loudly if a file is missing. Run `npm run check:u3` before committing.
 */
import type { ImLesson, PremoLesson, Routine, U3Lesson, Unit } from './types';
import unitJson from '../../../content/u3/unit.json';
import routinesJson from '../../../content/routines.json';
import im1 from '../../../content/u3/im/6.3.1.json';
import im2 from '../../../content/u3/im/6.3.2.json';
import im3 from '../../../content/u3/im/6.3.3.json';
import im4 from '../../../content/u3/im/6.3.4.json';
import im5 from '../../../content/u3/im/6.3.5.json';
import im6 from '../../../content/u3/im/6.3.6.json';
import im7 from '../../../content/u3/im/6.3.7.json';
import im8 from '../../../content/u3/im/6.3.8.json';
import im9 from '../../../content/u3/im/6.3.9.json';
import im10 from '../../../content/u3/im/6.3.10.json';
import im11 from '../../../content/u3/im/6.3.11.json';
import im12 from '../../../content/u3/im/6.3.12.json';
import im13 from '../../../content/u3/im/6.3.13.json';
import im14 from '../../../content/u3/im/6.3.14.json';
import im15 from '../../../content/u3/im/6.3.15.json';
import im16 from '../../../content/u3/im/6.3.16.json';
import im17 from '../../../content/u3/im/6.3.17.json';
import premo1 from '../../../content/u3/premo/6.3.1.json';
import premo2 from '../../../content/u3/premo/6.3.2.json';
import premo3 from '../../../content/u3/premo/6.3.3.json';
import premo4 from '../../../content/u3/premo/6.3.4.json';
import premo5 from '../../../content/u3/premo/6.3.5.json';
import premo6 from '../../../content/u3/premo/6.3.6.json';
import premo7 from '../../../content/u3/premo/6.3.7.json';
import premo8 from '../../../content/u3/premo/6.3.8.json';
import premo9 from '../../../content/u3/premo/6.3.9.json';
import premo10 from '../../../content/u3/premo/6.3.10.json';
import premo11 from '../../../content/u3/premo/6.3.11.json';
import premo12 from '../../../content/u3/premo/6.3.12.json';
import premo13 from '../../../content/u3/premo/6.3.13.json';
import premo14 from '../../../content/u3/premo/6.3.14.json';
import premo15 from '../../../content/u3/premo/6.3.15.json';
import premo16 from '../../../content/u3/premo/6.3.16.json';
import premo17 from '../../../content/u3/premo/6.3.17.json';

export const UNIT = unitJson as unknown as Unit;
export const ROUTINES = (routinesJson as unknown as { routines: Routine[] }).routines;

const IM: Record<string, ImLesson> = {
  '6.3.1': im1 as unknown as ImLesson,
  '6.3.2': im2 as unknown as ImLesson,
  '6.3.3': im3 as unknown as ImLesson,
  '6.3.4': im4 as unknown as ImLesson,
  '6.3.5': im5 as unknown as ImLesson,
  '6.3.6': im6 as unknown as ImLesson,
  '6.3.7': im7 as unknown as ImLesson,
  '6.3.8': im8 as unknown as ImLesson,
  '6.3.9': im9 as unknown as ImLesson,
  '6.3.10': im10 as unknown as ImLesson,
  '6.3.11': im11 as unknown as ImLesson,
  '6.3.12': im12 as unknown as ImLesson,
  '6.3.13': im13 as unknown as ImLesson,
  '6.3.14': im14 as unknown as ImLesson,
  '6.3.15': im15 as unknown as ImLesson,
  '6.3.16': im16 as unknown as ImLesson,
  '6.3.17': im17 as unknown as ImLesson,
};
const PREMO: Record<string, PremoLesson> = {
  '6.3.1': premo1 as unknown as PremoLesson,
  '6.3.2': premo2 as unknown as PremoLesson,
  '6.3.3': premo3 as unknown as PremoLesson,
  '6.3.4': premo4 as unknown as PremoLesson,
  '6.3.5': premo5 as unknown as PremoLesson,
  '6.3.6': premo6 as unknown as PremoLesson,
  '6.3.7': premo7 as unknown as PremoLesson,
  '6.3.8': premo8 as unknown as PremoLesson,
  '6.3.9': premo9 as unknown as PremoLesson,
  '6.3.10': premo10 as unknown as PremoLesson,
  '6.3.11': premo11 as unknown as PremoLesson,
  '6.3.12': premo12 as unknown as PremoLesson,
  '6.3.13': premo13 as unknown as PremoLesson,
  '6.3.14': premo14 as unknown as PremoLesson,
  '6.3.15': premo15 as unknown as PremoLesson,
  '6.3.16': premo16 as unknown as PremoLesson,
  '6.3.17': premo17 as unknown as PremoLesson,
};

/** Lessons with both layers, in unit order. */
export const BUILT = UNIT.built.filter((c) => IM[c] && PREMO[c]);

export function getLesson(code: string): U3Lesson | null {
  return IM[code] && PREMO[code] ? { schemaVersion: 1, im: IM[code], premo: PREMO[code] } : null;
}
