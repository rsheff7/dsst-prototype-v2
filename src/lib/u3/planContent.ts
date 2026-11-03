/**
 * The planning view's lesson files (content/u3/plan/<code>.json), alongside each
 * lesson's IM and Premo layers. Static imports, so a missing file fails the build.
 */
import type { PlanLesson } from './planTypes';
import plan5 from '../../../content/u3/plan/6.3.5.json';
import plan6 from '../../../content/u3/plan/6.3.6.json';
import plan7 from '../../../content/u3/plan/6.3.7.json';
import plan8 from '../../../content/u3/plan/6.3.8.json';
import plan9 from '../../../content/u3/plan/6.3.9.json';

const PLANS: Record<string, PlanLesson> = {
  '6.3.5': plan5 as unknown as PlanLesson,
  '6.3.6': plan6 as unknown as PlanLesson,
  '6.3.7': plan7 as unknown as PlanLesson,
  '6.3.8': plan8 as unknown as PlanLesson,
  '6.3.9': plan9 as unknown as PlanLesson,
};

export const PLANNED = Object.keys(PLANS);
export const getPlan = (code: string): PlanLesson | null => PLANS[code] ?? null;
