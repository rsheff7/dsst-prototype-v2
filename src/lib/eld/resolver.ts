/**
 * Pure resolver — KLU + WIDA level → ResolvedInstructionalState.
 *
 * Never calls a model. The four KLU lenses are owned lookup data.
 */

import type { KLU, Lens, ResolvedInstructionalState, WidaLevel } from './types.ts';
import { ARGUE_LENS } from './argue.ts';
import { EXPLAIN_LENS } from './explain.ts';
import { INFORM_LENS } from './inform.ts';
import { NARRATE_LENS } from './narrate.ts';

const LENS_BY_KLU: Record<KLU, Lens> = {
  Argue: ARGUE_LENS,
  Explain: EXPLAIN_LENS,
  Inform: INFORM_LENS,
  Narrate: NARRATE_LENS,
};

export function getLens(klu: KLU): Lens {
  return LENS_BY_KLU[klu];
}

export function resolve(klu: KLU, level: WidaLevel): ResolvedInstructionalState {
  const lens = LENS_BY_KLU[klu];
  // Lenses are stored in level order (1-indexed). Defensive lookup by level
  // value rather than array index in case someone reorders the data later.
  const row = lens.find((r) => r.level === level);
  if (!row) {
    // Should be unreachable for any KLU + WidaLevel pair the type system allows.
    // If it ever fires, fall back to the closest level we can find rather
    // than throwing, so the UI degrades instead of crashing.
    const fallback = lens[Math.min(Math.max(level, 1), lens.length) - 1];
    return toResolved(klu, fallback);
  }
  return toResolved(klu, row);
}

function toResolved(klu: KLU, row: Lens[number]): ResolvedInstructionalState {
  return {
    klu,
    surfaceAnchor: { system: 'WIDA', level: row.level, label: row.label },
    internalPlanningArchetype: row.archetype,
    dimensionTargets: {
      discourse: row.discourse,
      sentence: row.sentence,
      wordPhrase: row.wordPhrase,
    },
    embeddedMove: row.embeddedMove,
    provenance: row.provenance,
  };
}
