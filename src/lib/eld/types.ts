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

/**
 * Planning bands.
 *
 * Generation produces three bands per scenario, and three is a planning
 * decision rather than a WIDA one: WIDA's six levels are an assessment scale,
 * and collapsing an assessment scale for instructional planning is what CA ELD
 * does with its own three levels. What a single teacher move can carry is about
 * three distinct obligations; six would force the model to manufacture
 * differences it cannot sustain, which is what BAND RULE 4 in the generation
 * prompt exists to prevent.
 *
 * The partition is even — two WIDA levels per band. It was previously 1-2 / 3 /
 * 4-6, which gave the middle band one level and the top band three, so a Level
 * 4 and a Level 6 learner received identical guidance while Level 3 had its
 * own. No framework partitions that way.
 *
 * The keys stay `emerging` / `developing` / `expanding` because they are the
 * schema's property names and renaming them would invalidate every stored
 * lesson. They are band keys, NOT WIDA level names — the `expanding` band
 * serves Bridging and Reaching. Read `label` for anything a teacher sees.
 */
export type ProficiencyBand = 'emerging' | 'developing' | 'expanding';

export interface BandRange {
  band: ProficiencyBand;
  levels: readonly WidaLevel[];
  /** What a teacher sees. Names the range, never a single level. */
  label: string;
}

export const BAND_RANGES: readonly BandRange[] = [
  { band: 'emerging', levels: [1, 2], label: 'Entering–Emerging' },
  { band: 'developing', levels: [3, 4], label: 'Developing–Expanding' },
  { band: 'expanding', levels: [5, 6], label: 'Bridging–Reaching' },
] as const;

export function bandForLevel(level: WidaLevel): ProficiencyBand {
  if (level <= 2) return 'emerging';
  if (level <= 4) return 'developing';
  return 'expanding';
}

export function bandLabel(band: ProficiencyBand): string {
  return BAND_RANGES.find((b) => b.band === band)!.label;
}
