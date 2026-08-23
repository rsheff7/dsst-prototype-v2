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
import { kluFromElsf, resolve } from '@/lib/eld';

interface Props {
  /** The activity id to differentiate. Used to look up ELSF inference. */
  activityId: string;
  lesson: LessonData;
  /** Compact mode — for inline use inside a tile or narrow column. */
  compact?: boolean;
  /**
   * The scenario being shown, where there is one.
   *
   * With it, the move rendered is the lesson-specific one generated for this
   * scenario at this band — naming the actual objects and student wording.
   * Without it (the activity-level call sites), the lens move is shown instead,
   * which is general to the Key Language Use and says nothing about the lesson.
   */
  scenario?: DecisionScenario;
}

/**
 * The three bands generation produces are WIDA's own labels for levels 2, 3 and
 * 4. Levels outside that range take the nearest band — a Level 1 learner is
 * served by the Emerging move, a Level 5 or 6 learner by the Expanding one.
 */
function bandForLevel(level: number): 'emerging' | 'developing' | 'expanding' {
  if (level <= 2) return 'emerging';
  if (level === 3) return 'developing';
  return 'expanding';
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

  // Prefer the move written for THIS scenario at this band. The lens move is
  // the fallback: it is true of any learner at this level in any lesson, which
  // is exactly what makes it weak guidance where something specific exists.
  const band = bandForLevel(selectedWidaLevel);
  const banded = scenario?.proficiency_moves?.[band];
  const specificMove = banded?.move?.trim() ? banded.move : null;
  const move = specificMove ?? state.embeddedMove;
  const avoid = specificMove ? banded?.avoid?.trim() || null : null;

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
        </div>

      <div className="px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-1.5" style={{ color: WIDA_INK, opacity: 0.7 }}>
          {specificMove ? 'Embedded move — this scenario' : 'Embedded move'}
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