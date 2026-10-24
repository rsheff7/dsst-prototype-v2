/**
 * The level-tier rule: one band's content, shown for the WIDA level a teacher
 * picked. Robert's rule, 2026-10-24.
 *
 * Content is written for three bands (Levels 1–2, 3–4, 5–6). A student moving
 * up within a band needs less support for the same math, so the rule changes
 * which support comes first; it never changes the math or the question.
 *
 *                      lower level (1, 3, 5)          higher level (2, 4, 6)
 *   sentence frame     given before they speak         held back, offered if they stall
 *   without words      offered first                   kept as a fallback
 *   home language      work it out first in it          share in English, switch if stuck
 *   partner rehearsal  before sharing with the class    share with the class directly
 *
 * What the higher level adds (a unit, a reason, a comparison) depends on the
 * lesson, so it is authored once per band as `stretch` and shown only there.
 */
import type { ProficiencyBand, WidaLevel } from '../eld/types';
import { bandForLevel } from '../eld/types';

export type Tier = 'lower' | 'higher';

export const LEVELS: readonly WidaLevel[] = [1, 2, 3, 4, 5, 6];

const WIDA_NAME: Record<WidaLevel, string> = {
  1: 'Entering',
  2: 'Emerging',
  3: 'Developing',
  4: 'Expanding',
  5: 'Bridging',
  6: 'Reaching',
};

export const tierOf = (level: WidaLevel): Tier => (level % 2 ? 'lower' : 'higher');
export const levelLabel = (level: WidaLevel) => `Level ${level}`;
export const levelName = (level: WidaLevel) => `${level} · ${WIDA_NAME[level]}`;

/** The bands the picked levels fall in, in band order. */
export function bandsForLevels(levels: readonly WidaLevel[]): ProficiencyBand[] {
  const order: ProficiencyBand[] = ['emerging', 'developing', 'expanding'];
  return order.filter((b) => levels.some((l) => bandForLevel(l) === b));
}

// The house home-language sentence (every Premo layer uses this exact form).
const HOME_FIRST = 'They can work it out first in any language they share with a partner.';
const HOME_FALLBACK = 'They share in English, and can switch to a language they share with a partner if they get stuck.';

/** A band's text, with the home-language line set for the tier. */
export const forTier = (text: string, tier: Tier) => (tier === 'higher' ? text.replaceAll(HOME_FIRST, HOME_FALLBACK) : text);

export const TIER_WORDS: Record<Tier, { frame: string; nonverbal: string; partner: string }> = {
  lower: {
    frame: 'Give this frame before they speak',
    nonverbal: 'Without words, first',
    partner: 'Rehearse with a partner before sharing with the class.',
  },
  higher: {
    frame: 'Hold this frame back; offer it if they stall',
    nonverbal: 'If they stall, without words',
    partner: 'Ready to share with the class without rehearsing first.',
  },
};
