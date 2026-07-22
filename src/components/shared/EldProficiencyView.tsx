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

import { LessonData } from '@/lib/types';
import { useLesson } from '@/lib/lessonContext';
import { kluFromElsf, resolve } from '@/lib/eld';

interface Props {
  /** The activity id to differentiate. Used to look up ELSF inference. */
  activityId: string;
  lesson: LessonData;
  /** Compact mode — for inline use inside a tile or narrow column. */
  compact?: boolean;
}

const WIDA_ACCENT = '#534AB7';
const WIDA_BG = '#EEEDFE';
const WIDA_BORDER = '#AFA9EC';
const WIDA_INK = '#26215C';

export default function EldProficiencyView({ activityId, lesson, compact = false }: Props) {
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
  const { surfaceAnchor, embeddedMove, dimensionTargets } = state;

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
          {embeddedMove}
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
          Embedded move
        </p>
        <p className="text-[0.875rem] leading-relaxed" style={{ color: WIDA_INK }}>
          {embeddedMove}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x" style={{ borderColor: WIDA_BORDER }}>
        <DimensionCell title="Discourse" target={dimensionTargets.discourse} />
        <DimensionCell title="Sentence" target={dimensionTargets.sentence} />
        <DimensionCell title="Word / phrase" target={dimensionTargets.wordPhrase} />
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