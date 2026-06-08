/**
 * Derive a KLU from ELSF's existing language_functions output.
 *
 * The framework rule: do NOT build a second demand classifier. ELSF already
 * diagnoses what language work the activity demands; the convergence layer
 * specializes that diagnosis per learner. This function is the deterministic
 * bridge: a pure keyword-priority scan over ELSF's language_functions strings.
 *
 * Priority (highest cognitive demand first):
 *   Argue > Explain > Inform > Narrate
 *
 * When language_functions contains keywords from multiple KLUs, the highest-
 * priority match wins. When no keywords match, default to Explain — the most
 * common math demand and a safe middle for embedding.
 *
 * This is a pure function. It never calls a model.
 */

import type { KLU } from './types.ts';

const ARGUE_PATTERNS = [
  /\bjustify\b/i,
  /\bargue\b/i,
  /\bdefend\b/i,
  /\bcritique\b/i,
  /\bprove\b/i,
  /\bevaluate\s+(an?\s+)?(argument|claim|reasoning)\b/i,
  /\bmake\s+(an?\s+)?(case|claim)\b/i,
  /\bcounterexample\b/i,
  /\bsupport\s+(a|the)\s+claim\b/i,
];

const EXPLAIN_PATTERNS = [
  /\bexplain\b/i,
  /\bshow\s+how\b/i,
  /\bdemonstrate\s+how\b/i,
  /\bwalk\s+through\b/i,
  /\bdescribe\s+how\b/i,
  /\bhow\s+to\b/i,
  /\bwhy\s+(does|this|the)\b/i,
  /\breason\s+about\b/i,
  /\baccount\s+for\b/i,
];

const INFORM_PATTERNS = [
  /\bdescribe\s+(a|the|an)\b/i,
  /\breport\b/i,
  /\bcompare\b/i,
  /\bsummari[sz]e\b/i,
  /\bidentify\b/i,
  /\blist\b/i,
  /\bcount\b/i,
  /\bstate\b/i,
  /\bname\b/i,
  /\bclassify\b/i,
  /\bcategori[sz]e\b/i,
];

const NARRATE_PATTERNS = [
  /\btell\s+(a|the)\s+story\b/i,
  /\bnarrate\b/i,
  /\brecount\b/i,
  /\bsequence\s+events\b/i,
  /\bdescribe\s+what\s+happened\b/i,
  /\bretell\b/i,
  /\bact\s+out\b/i,
];

function anyMatch(haystack: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(haystack));
}

/**
 * Derive the KLU for an activity from its ELSF language_functions output.
 *
 * @param languageFunctions  The strings emitted by ELSF
 *                           (lesson.elsf_inference.activities[i].functional_language.language_functions).
 */
export function kluFromElsf(languageFunctions: readonly string[]): KLU {
  if (!languageFunctions || languageFunctions.length === 0) return 'Explain';
  const haystack = languageFunctions.join(' \n ');
  if (anyMatch(haystack, ARGUE_PATTERNS)) return 'Argue';
  if (anyMatch(haystack, EXPLAIN_PATTERNS)) return 'Explain';
  if (anyMatch(haystack, INFORM_PATTERNS)) return 'Inform';
  if (anyMatch(haystack, NARRATE_PATTERNS)) return 'Narrate';
  return 'Explain';
}
