/**
 * ELD Convergence Layer — public surface.
 *
 * The convergence layer is owned lookup data + a pure resolver. Views
 * import only from this barrel.
 *
 * Architectural rules (see PREMO_ELD_Convergence_Framework.md):
 *   1. Deterministic, not inferential. Never call a model at runtime to
 *      reconcile frameworks or generate level differentiation.
 *   2. WIDA is the only surface vocabulary. CA labels (archetype) and
 *      provenance flags are INTERNAL ONLY — never surfaced in UI.
 *   3. Integration, not parallel track. The embedded move drops INTO
 *      existing math content; never into its own panel.
 *   4. Asset register only. Every string reads "does + reaching" — no
 *      deficit framing anywhere.
 */

export type {
  KLU,
  WidaLevel,
  WidaLabel,
  Provenance,
  DimensionTarget,
  LensRow,
  Lens,
  ResolvedInstructionalState,
} from './types.ts';
export { WIDA_LABELS, WIDA_LEVELS } from './types.ts';

export { ARGUE_LENS } from './argue.ts';
export { EXPLAIN_LENS } from './explain.ts';
export { INFORM_LENS } from './inform.ts';
export { NARRATE_LENS } from './narrate.ts';

export { kluFromElsf } from './kluFromElsf.ts';
export { resolve, getLens } from './resolver.ts';
