export interface PromptProfile {
  id: string;
  name: string;
  coreRole: string;        // relative path to .md file within modules/
  persona?: string;        // optional — baseline profiles omit this
  framework: string;
  elsfLayer: string;
  outputFormat: string;
}

export const DEFAULT_PROFILE = 'math-lesson-baseline' as const;

export const PROFILES = [
  {
    id: 'math-lesson-baseline',
    name: 'Math Lesson (K-8) — Baseline',
    coreRole: 'core-role/math-novice',
    persona: 'persona/plain-language',
    framework: 'framework/mlr-noticing',
    elsfLayer: 'elsf-layer/language-demands',
    outputFormat: 'output-format/full-json-wristband',
  },
  {
    id: 'math-lesson-analysis',
    name: 'Math Lesson (K-8) — Robert Voice',
    coreRole: 'core-role/math-novice',
    persona: 'persona/robert-voice',
    framework: 'framework/mlr-noticing',
    elsfLayer: 'elsf-layer/language-demands',
    outputFormat: 'output-format/full-json-wristband',
  },
] as const;

export function getProfile(id: string): PromptProfile | undefined {
  return PROFILES.find(p => p.id === id);
}
