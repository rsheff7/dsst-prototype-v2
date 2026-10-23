/**
 * The Unit 3 content the app ships with: the unit, the routine catalog, and
 * each built lesson's IM and Premo layers. Static imports, so the build fails
 * loudly if a file is missing. Run `npm run check:u3` before committing.
 */
import type { ImLesson, PremoLesson, Routine, U3Lesson, Unit } from './types';
import unitJson from '../../../content/u3/unit.json';
import routinesJson from '../../../content/routines.json';
import im5 from '../../../content/u3/im/6.3.5.json';
import im6 from '../../../content/u3/im/6.3.6.json';
import im7 from '../../../content/u3/im/6.3.7.json';
import im8 from '../../../content/u3/im/6.3.8.json';
import im9 from '../../../content/u3/im/6.3.9.json';
import premo5 from '../../../content/u3/premo/6.3.5.json';
import premo6 from '../../../content/u3/premo/6.3.6.json';
import premo7 from '../../../content/u3/premo/6.3.7.json';
import premo8 from '../../../content/u3/premo/6.3.8.json';
import premo9 from '../../../content/u3/premo/6.3.9.json';

export const UNIT = unitJson as unknown as Unit;
export const ROUTINES = (routinesJson as unknown as { routines: Routine[] }).routines;

const IM: Record<string, ImLesson> = {
  '6.3.5': im5 as unknown as ImLesson,
  '6.3.6': im6 as unknown as ImLesson,
  '6.3.7': im7 as unknown as ImLesson,
  '6.3.8': im8 as unknown as ImLesson,
  '6.3.9': im9 as unknown as ImLesson,
};
const PREMO: Record<string, PremoLesson> = {
  '6.3.5': premo5 as unknown as PremoLesson,
  '6.3.6': premo6 as unknown as PremoLesson,
  '6.3.7': premo7 as unknown as PremoLesson,
  '6.3.8': premo8 as unknown as PremoLesson,
  '6.3.9': premo9 as unknown as PremoLesson,
};

/** Lessons with both layers, in unit order. */
export const BUILT = UNIT.built.filter((c) => IM[c] && PREMO[c]);

export function getLesson(code: string): U3Lesson | null {
  return IM[code] && PREMO[code] ? { schemaVersion: 1, im: IM[code], premo: PREMO[code] } : null;
}
