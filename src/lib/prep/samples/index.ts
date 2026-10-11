/**
 * Lessons bundled for side-by-side comparison in the prototype, opened with
 * /prep?sample=<key>. Not part of the product: a teacher's lessons come from
 * the home page.
 *
 * `6.2.4-generated` is the stored analysis of IM 6.2.4 from 2026-08-22, as the
 * app produced it from the student pages. `6.2.4-authored` is the same lesson
 * written by hand to the Social Studies prep standard from the lesson's CC BY
 * teacher edition (print version). It is a draft: nobody has reviewed it.
 */
import type { PrepLesson } from '../prepModel';
import authored624 from './6.2.4-authored.json';
import generated624 from './6.2.4-generated.json';

export const PREP_SAMPLES: Record<string, PrepLesson> = {
  '6.2.4-authored': authored624 as unknown as PrepLesson,
  '6.2.4-generated': generated624 as unknown as PrepLesson,
};
