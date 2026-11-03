/**
 * The planning view's lesson files (content/u3/plan/<code>.json), alongside each
 * lesson's IM and Premo layers. Static imports, so a missing file fails the build.
 */
import type { PlanLesson } from './planTypes';
import plan7 from '../../../content/u3/plan/6.3.7.json';

const PLANS: Record<string, PlanLesson> = {
  '6.3.7': plan7 as unknown as PlanLesson,
};

export const PLANNED = Object.keys(PLANS);
export const getPlan = (code: string): PlanLesson | null => PLANS[code] ?? null;
