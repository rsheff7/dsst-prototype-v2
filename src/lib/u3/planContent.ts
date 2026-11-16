/**
 * The planning view's lesson files (content/u3/plan/<code>.json), alongside each
 * lesson's IM and Premo layers. Static imports, so a missing file fails the build.
 */
import type { PlanLesson } from './planTypes';
import plan1 from '../../../content/u3/plan/6.3.1.json';
import plan2 from '../../../content/u3/plan/6.3.2.json';
import plan3 from '../../../content/u3/plan/6.3.3.json';
import plan4 from '../../../content/u3/plan/6.3.4.json';
import plan5 from '../../../content/u3/plan/6.3.5.json';
import plan6 from '../../../content/u3/plan/6.3.6.json';
import plan7 from '../../../content/u3/plan/6.3.7.json';
import plan8 from '../../../content/u3/plan/6.3.8.json';
import plan9 from '../../../content/u3/plan/6.3.9.json';
import plan10 from '../../../content/u3/plan/6.3.10.json';
import plan11 from '../../../content/u3/plan/6.3.11.json';
import plan12 from '../../../content/u3/plan/6.3.12.json';
import plan13 from '../../../content/u3/plan/6.3.13.json';
import plan14 from '../../../content/u3/plan/6.3.14.json';
import plan15 from '../../../content/u3/plan/6.3.15.json';
import plan16 from '../../../content/u3/plan/6.3.16.json';
import plan17 from '../../../content/u3/plan/6.3.17.json';

const PLANS: Record<string, PlanLesson> = {
  '6.3.1': plan1 as unknown as PlanLesson,
  '6.3.2': plan2 as unknown as PlanLesson,
  '6.3.3': plan3 as unknown as PlanLesson,
  '6.3.4': plan4 as unknown as PlanLesson,
  '6.3.5': plan5 as unknown as PlanLesson,
  '6.3.6': plan6 as unknown as PlanLesson,
  '6.3.7': plan7 as unknown as PlanLesson,
  '6.3.8': plan8 as unknown as PlanLesson,
  '6.3.9': plan9 as unknown as PlanLesson,
  '6.3.10': plan10 as unknown as PlanLesson,
  '6.3.11': plan11 as unknown as PlanLesson,
  '6.3.12': plan12 as unknown as PlanLesson,
  '6.3.13': plan13 as unknown as PlanLesson,
  '6.3.14': plan14 as unknown as PlanLesson,
  '6.3.15': plan15 as unknown as PlanLesson,
  '6.3.16': plan16 as unknown as PlanLesson,
  '6.3.17': plan17 as unknown as PlanLesson,
};

export const PLANNED = Object.keys(PLANS);
export const getPlan = (code: string): PlanLesson | null => PLANS[code] ?? null;
