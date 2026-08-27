'use client';

/**
 * Shared learner-axis differentiation surface.
 *
 * Path E: the ELD Convergence layer is the sole proficiency surface. Wherever
 * the older 3-card by_proficiency view used to render (Pathway accordion,
 * Adapt, Moves side-by-side), this component renders the WIDA-aligned
 * differentiation derived from the activity's ELSF inference.
 *
 * Architectural rules honored:
 *   - WIDA is the only surface vocabulary (no CA labels).
 *   - Deterministic: KLU is derived from ELSF; resolver is pure lookup.
 *   - Asset register: every string reads "does + reaching".
 *   - Provenance is INTERNAL ONLY (used by tests, never surfaced).
 */

import { DecisionScenario, LessonData } from '@/lib/types';
import { useLesson } from '@/lib/lessonContext';
import { kluFromElsf, resolve, bandForLevel, bandLevels } from '@/lib/eld';

interface Props {
  /** The activity id to differentiate. Used to look up ELSF inference. */
  activityId: string;
  lesson: LessonData;
  /** Compact mode — for inline use inside a tile or narrow column. */
  compact?: boolean;
  /**
   * The scenario being shown, where there is one.
   *
   * With it, the move rendered is the one generated for THIS scenario at this
   * band — naming the actual objects and student wording. Without it (the
   * activity-level call sites) the lesson-level move is used instead: less
   * precise, still this lesson. See the fallback chain below.
   */
  scenario?: DecisionScenario;
}

const WIDA_ACCENT = '#534AB7';
const WIDA_BG = '#EEEDFE';
const WIDA_BORDER = '#AFA9EC';
const WIDA_INK = '#26215C';

export default function EldProficiencyView({ activityId, lesson, compact = false, scenario }: Props) {
  const { selectedWidaLevel, setSelectedWidaLevel } = useLesson();
  const elsfActivity = lesson.elsf_inference?.activities.find(
    (a) => a.activity_id === activityId,
  );

  // No ELSF inference for this activity → can't derive KLU. Show nothing
  // rather than guessing. ELSF is upstream truth; without it, no surface.
  if (!elsfActivity) return null;

  if (selectedWidaLevel === null) {
    return (
      <div
        className="rounded-lg border px-3 py-2.5 flex items-start gap-2"
        style={{ backgroundColor: WIDA_BG, borderColor: WIDA_BORDER }}
      >
        <span
          className="mt-[1px] text-[12px] shrink-0"
          style={{ color: WIDA_INK }}
          aria-hidden="true"
        >
          ↑
        </span>
        <p className="text-[0.8rem] leading-relaxed" style={{ color: WIDA_INK }}>
          Select a WIDA level in the header to see differentiation for this learner.
        </p>
      </div>
    );
  }

  const klu = kluFromElsf(elsfActivity.functional_language.language_functions);
  const state = resolve(klu, selectedWidaLevel);
  const { surfaceAnchor, dimensionTargets } = state;

  // Three tiers, most specific first:
  //
  //   1. the move written for THIS scenario at this band  (Moves)
  //   2. the lesson's own band move from adaptation_guardrails  (everywhere else)
  //   3. the lens move from the 4x6 lookup  (last resort)
  //
  // Tier 3 is generic by construction — "demonstrate the procedure yourself
  // first, then narrate it with one math term per step" is true of a learner at
  // this level in any lesson, and about nothing in the one being taught. This
  // product forbids that everywhere else; the activity-level call sites were the
  // last place it still surfaced, because they pass no scenario and so fell
  // straight from tier 1 to tier 3. Tier 2 closes that: it is generated for this
  // lesson and was already being threaded into Pathway unused.
  //
  // Tier 2 is lesson-level, not activity-level, so it reads the same across the
  // activities of one lesson. That is the known cost of using it, and it is
  // still strictly better than a string that names no lesson at all.
  const band = bandForLevel(selectedWidaLevel);
  const banded = scenario?.proficiency_moves?.[band];
  const scenarioMove = banded?.move?.trim() ? banded.move : null;
  const lessonMove = lesson.adaptation_guardrails?.by_proficiency?.[band]?.text?.trim() || null;

  const move = scenarioMove ?? lessonMove ?? state.embeddedMove;
  const avoid = scenarioMove ? banded?.avoid?.trim() || null : null;

  // Drives the caption only. A teacher should be able to tell how specific the
  // guidance in front of them is without being told out loud.
  const moveScope: 'scenario' | 'lesson' | 'general' = scenarioMove
    ? 'scenario'
    : lessonMove
      ? 'lesson'
      : 'general';

  // Names the band by the WIDA levels it covers. Never coin a name for it: a
  // compound built from WIDA words reads as a WIDA term, and WIDA has none.
  const levels = bandLevels(band);
  const bandCoverage = `Levels ${levels[0]}–${levels[levels.length - 1]}`;

  // The chart prefers the profile generated for THIS activity's language in this
  // lesson's words. The lens rows remain the fallback for lessons generated
  // before the profile existed, and read as a category of learner rather than
  // the student in the room.
  const profile = lesson.elsf_inference?.activities
    .find((a) => a.activity_id === activityId)
    ?.learner_profile?.find((p) => p.band === band);

  // Per-cell fallback: a generated string wins where it exists, the lens covers
  // the rest. A half-filled profile should not blank a column.
  const pick = (
    generated: string | undefined,
    fallback: { does: string; reaching: string },
    key: 'does' | 'reaching',
  ) => (generated && generated.trim() ? generated : fallback[key]);

  const cells = profile
    ? {
        discourse: {
          does: pick(profile.discourse_does, dimensionTargets.discourse, 'does'),
          reaching: pick(profile.discourse_reaching, dimensionTargets.discourse, 'reaching'),
        },
        sentence: {
          does: pick(profile.sentence_does, dimensionTargets.sentence, 'does'),
          reaching: pick(profile.sentence_reaching, dimensionTargets.sentence, 'reaching'),
        },
        wordPhrase: {
          does: pick(profile.word_does, dimensionTargets.wordPhrase, 'does'),
          reaching: pick(profile.word_reaching, dimensionTargets.wordPhrase, 'reaching'),
        },
      }
    : dimensionTargets;

  if (compact) {
    return (
      <div className="px-4 pt-2 pb-4 mt-2 border-t-2" style={{ borderColor: WIDA_BORDER }}>
        <div className="flex items-baseline gap-2 mb-1.5 flex-wrap">
          <span
            className="text-[9px] font-bold uppercase tracking-[0.1em] text-white px-2 py-0.5 rounded-full"
            style={{ backgroundColor: WIDA_ACCENT }}
          >
            WIDA
          </span>
          <p
            className="text-[0.8rem] font-semibold"
            style={{ color: WIDA_INK }}
          >
            {surfaceAnchor.label}
          </p>
          <span className="text-[0.7rem]" style={{ color: WIDA_INK, opacity: 0.75 }}>
            guidance for {bandCoverage}
          </span>
        </div>
        <p className="text-[0.825rem] font-semibold text-gray-800 leading-tight">
          {move}
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ backgroundColor: WIDA_BG, borderColor: WIDA_BORDER }}
    >
        <div className="px-4 py-2.5 flex items-baseline gap-2 flex-wrap border-b" style={{ borderColor: WIDA_BORDER }}>
          <span
            className="text-[9px] font-bold uppercase tracking-[0.1em] text-white px-2 py-0.5 rounded-full"
            style={{ backgroundColor: WIDA_ACCENT }}
          >
            WIDA
          </span>
          <p
            className="text-[0.95rem] font-semibold"
            style={{ color: WIDA_INK }}
          >
            {surfaceAnchor.label}
          </p>
          <span className="text-[0.775rem]" style={{ color: WIDA_INK, opacity: 0.75 }}>
            guidance for {bandCoverage}
          </span>
        </div>

      <div className="px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-1.5" style={{ color: WIDA_INK, opacity: 0.7 }}>
          {moveScope === 'scenario'
            ? 'Embedded move — this scenario'
            : moveScope === 'lesson'
              ? 'Embedded move — this lesson'
              : 'Embedded move'}
        </p>
        <p className="text-[0.875rem] leading-relaxed" style={{ color: WIDA_INK }}>
          {move}
        </p>
        {avoid && (
          <p className="text-[0.825rem] leading-relaxed mt-2" style={{ color: WIDA_INK }}>
            <span className="font-semibold">Avoid: </span>
            <span className="italic">{avoid}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x" style={{ borderColor: WIDA_BORDER }}>
        <DimensionCell title="Discourse" target={cells.discourse} />
        <DimensionCell title="Sentence" target={cells.sentence} />
        <DimensionCell title="Word / phrase" target={cells.wordPhrase} />
      </div>
    </div>
  );
}

function DimensionCell({
  title,
  target,
}: {
  title: string;
  target: { does: string; reaching: string };
}) {
  return (
    <div className="px-4 py-3" style={{ borderColor: WIDA_BORDER }}>
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.08em] mb-1.5"
        style={{ color: WIDA_INK, opacity: 0.7 }}
      >
        {title}
      </p>
      <p className="text-[0.78rem] leading-snug mb-1.5" style={{ color: WIDA_INK }}>
        <span className="font-semibold">Does: </span>
        {target.does}
      </p>
      {target.reaching && target.reaching !== '—' && (
        <p className="text-[0.78rem] leading-snug" style={{ color: WIDA_INK, opacity: 0.85 }}>
          <span className="font-semibold">Reaching: </span>
          {target.reaching}
        </p>
      )}
    </div>
  );
}