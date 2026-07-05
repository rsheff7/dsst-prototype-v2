/**
 * ELD Convergence Layer — types.
 *
 * The convergence layer is OWNED LOOKUP DATA + a PURE RESOLVER. It is never
 * generated at runtime by an LLM. The model may render from resolved state;
 * it never reconciles WIDA and CA frameworks live.
 *
 * Surface vocabulary: WIDA only (Entering / Emerging / Developing / Expanding
 * / Bridging / Reaching). CA contributes planning logic internally via
 * `internalPlanningArchetype` — that field is INTERNAL ONLY and must never
 * reach the UI.
 *
 * `provenance` is also INTERNAL ONLY. It tracks how grounded each lens row
 * is so future expert review can prioritize.
 */

export type KLU = 'Argue' | 'Explain' | 'Inform' | 'Narrate';

export type WidaLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type WidaLabel =
  | 'Entering'
  | 'Emerging'
  | 'Developing'
  | 'Expanding'
  | 'Bridging'
  | 'Reaching';

export type Provenance =
  | 'evidence_grounded' // validated against real classroom or assessment evidence
  | 'framework_grounded' // directly transcribed from WIDA / CA ELD framework descriptors
  | 'design_hypothesis'; // drafted by analogy or extrapolation; pending validation

export interface DimensionTarget {
  /** What the learner is currently doing at this level for this KLU dimension. */
  does: string;
  /** What the learner is reaching toward next. May be "—" at level 6. */
  reaching: string;
}

export interface LensRow {
  level: WidaLevel;
  label: WidaLabel;
  /** CA-derived planning archetype. INTERNAL ONLY — never surface in UI. */
  archetype: string;
  /** How grounded this row is. INTERNAL ONLY — never surface in UI. */
  provenance: Provenance;
  discourse: DimensionTarget;
  sentence: DimensionTarget;
  wordPhrase: DimensionTarget;
  /** The move the teacher embeds inside the existing math content. */
  embeddedMove: string;
}

export type Lens = readonly LensRow[];

/**
 * The single object the views consume after resolution. Aligns to the
 * ResolvedInstructionalState schema in PREMO_ELD_Convergence_Framework.md.
 */
export interface ResolvedInstructionalState {
  klu: KLU;
  surfaceAnchor: { system: 'WIDA'; level: WidaLevel; label: WidaLabel };
  /** CA-derived. INTERNAL ONLY — never surface. */
  internalPlanningArchetype: string;
  dimensionTargets: {
    discourse: DimensionTarget;
    sentence: DimensionTarget;
    wordPhrase: DimensionTarget;
  };
  embeddedMove: string;
  /** INTERNAL ONLY — never surface. */
  provenance: Provenance;
}

export const WIDA_LABELS: Record<WidaLevel, WidaLabel> = {
  1: 'Entering',
  2: 'Emerging',
  3: 'Developing',
  4: 'Expanding',
  5: 'Bridging',
  6: 'Reaching',
};

export const WIDA_LEVELS: readonly WidaLevel[] = [1, 2, 3, 4, 5, 6] as const;
