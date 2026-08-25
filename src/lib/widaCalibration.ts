/**
 * WIDA calibration for generated proficiency moves.
 *
 * The ELD layer owns a 4x6 lookup — the four Key Language Uses crossed with the
 * six WIDA levels — describing what a learner at each level can produce and what
 * they are reaching for. Until now the tool rendered that lookup's `embeddedMove`
 * directly, which meant a teacher working on ratio language read "demonstrate the
 * procedure yourself first, then narrate it with one math term per step". True of
 * a Level 1 learner anywhere; about nothing in the lesson they are teaching.
 *
 * Everything else in this product refuses that. The prompt forbids generic
 * guidance in as many words, and the reviewers named the lesson-specific
 * precision as what made the tool credible. The ELD surface was the one exemption.
 *
 * So the descriptors become an INPUT to generation rather than the output. The
 * model receives what a learner at each level can do and is reaching for, and
 * writes the move for this scenario at that level — naming the actual objects,
 * words and student utterance. The scale stays owned; the move becomes specific.
 *
 * The band mapping is exact rather than approximate: the three bands the schema
 * already uses are WIDA's own labels for levels 2, 3 and 4.
 */

import type { KLU, WidaLevel } from './eld/types.ts';
import { getLens } from './eld/resolver.ts';
import type { OutcomeType } from './mlrSelection.ts';

/** emerging / developing / expanding are WIDA 2 / 3 / 4 by name. */
const BAND_LEVELS: { band: 'emerging' | 'developing' | 'expanding'; level: WidaLevel }[] = [
  { band: 'emerging', level: 2 },
  { band: 'developing', level: 3 },
  { band: 'expanding', level: 4 },
];

/**
 * Which Key Language Use an activity's outcome implies.
 *
 * Pass D1 runs in parallel with the ELSF pass, so `kluFromElsf` — which reads
 * ELSF's language_functions — is not available yet. outcome_type is, it comes
 * from the anchor, and it measured stable across runs. This maps one to the
 * other.
 *
 * Pedagogy, not plumbing: worth arguing with. The reasoning is that Argue is
 * claims and critique, Explain is causal accounting for how or why, Inform is
 * reporting a state or relationship without causal work, and Narrate is
 * recounting a sequence.
 */
const KLU_BY_OUTCOME: Record<OutcomeType, KLU> = {
  // Judging whether something is correct and defending it.
  justify_or_evaluate: 'Argue',
  // Saying why two approaches amount to the same thing.
  connect_representations: 'Explain',
  // Stating a general rule and accounting for it.
  generalize_in_writing: 'Explain',
  // Naming a relationship precisely, without causal work.
  formulate_precisely: 'Inform',
  // Conveying information to someone who cannot see it.
  communicate_precisely: 'Inform',
  // Working through a situation as it unfolds.
  interpret_situation: 'Narrate',
};

export function kluForOutcome(outcome: OutcomeType | undefined): KLU {
  return outcome ? KLU_BY_OUTCOME[outcome] : 'Explain';
}

export interface BandCalibration {
  band: string;
  widaLevel: number;
  widaLabel: string;
  produces: string;
  reachingFor: string;
  sentenceLevel: string;
}

export function calibrationFor(klu: KLU): BandCalibration[] {
  const lens = getLens(klu);
  return BAND_LEVELS.map(({ band, level }) => {
    const row = lens.find((r) => r.level === level);
    return {
      band,
      widaLevel: level,
      widaLabel: row?.label ?? '',
      produces: row?.discourse.does ?? '',
      reachingFor: row?.discourse.reaching ?? '',
      sentenceLevel: `${row?.sentence.does ?? ''} → reaching for ${row?.sentence.reaching ?? ''}`,
    };
  });
}

/**
 * The block injected into Pass D1, one section per activity.
 *
 * States the descriptors and then says plainly not to restate them — the failure
 * mode is a model that paraphrases the calibration back instead of writing the
 * move, which would leave us exactly where we started.
 */
/**
 * Digest of everything the calibration depends on — the outcome-to-KLU map and
 * the lens rows for the three bands. Folded into the cache key so that editing a
 * descriptor or a mapping invalidates stored lessons automatically, rather than
 * quietly serving moves generated against the old calibration.
 */
export function calibrationFingerprint(): string {
  const lenses = (['Argue', 'Explain', 'Inform', 'Narrate'] as KLU[])
    .map((k) => k + ':' + JSON.stringify(calibrationFor(k)))
    .join('|');
  return JSON.stringify(KLU_BY_OUTCOME) + '||' + lenses;
}

export function describeCalibration(
  activities: { id: string; outcome_type?: OutcomeType }[],
): string {
  if (!activities.length) return '';

  const sections = activities.map((a) => {
    const klu = kluForOutcome(a.outcome_type);
    const rows = calibrationFor(klu)
      .map(
        (c) =>
          `    ${c.band} (WIDA ${c.widaLevel} ${c.widaLabel}) — can currently: ${c.produces}. Reaching for: ${c.reachingFor}. At sentence level: ${c.sentenceLevel}`,
      )
      .join('\n');
    return `  ${a.id} — Key Language Use: ${klu}\n${rows}`;
  });

  return `LEARNER CALIBRATION — WIDA. For every scenario where proficiency_moves is populated, each band's move MUST be writable by a learner described below, and MUST still be specific to THIS scenario: name the actual objects, numbers, words or student utterance from the lesson. Do not restate the descriptor back — it tells you what the learner can already produce, so that you can write a move that meets them there. A move that would read the same in any lesson is wrong.

${sections.join('\n')}`;
}
