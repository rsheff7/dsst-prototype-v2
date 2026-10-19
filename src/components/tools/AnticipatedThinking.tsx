'use client';

import { useState } from 'react';
import { LessonData, ThinkingPattern, MlrRef } from '@/lib/types';
import ToolInfo from '@/components/shared/ToolInfo';
import MlrChip from '@/components/shared/MlrChip';
import { activitySlot } from '@/lib/activityLabel';

function whyHereFor(lesson: LessonData, activityId: string, mlr: MlrRef): string | undefined {
  const a = lesson.mlr_inference.activities.find((x) => x.activity_id === activityId);
  return a?.mlrs.find((m) => m.number === mlr.number)?.why_here;
}

const PATTERN_STYLES: Record<ThinkingPattern['type'], { bg: string; border: string; text: string; badge: string; badgeBg: string; badgeText: string }> = {
  'on-track': {
    bg: 'var(--color-developing-bg)', border: 'var(--color-developing-border)', text: 'var(--color-developing-text)',
    badge: 'Build on this', badgeBg: 'var(--color-thinking)', badgeText: 'var(--color-card)',
  },
  'misconception': {
    bg: 'var(--color-demand-high-bg)', border: 'var(--color-demand-high-border)', text: 'var(--color-demand-high-text)',
    badge: 'Common error', badgeBg: 'var(--color-demand-high-text)', badgeText: 'var(--color-card)',
  },
  'partial': {
    bg: 'var(--color-bridging-bg)', border: 'var(--color-bridging-border)', text: 'var(--color-bridging-text)',
    badge: 'Almost there', badgeBg: 'var(--color-ink-faint)', badgeText: 'var(--color-card)',
  },
  'extension': {
    bg: 'var(--color-demand-low-bg)', border: 'var(--color-demand-low-border)', text: 'var(--color-demand-low-text)',
    badge: 'Ready to stretch', badgeBg: 'var(--color-demand-low-text)', badgeText: 'var(--color-card)',
  },
  'language-math': {
    bg: 'var(--color-developing-bg)', border: 'var(--color-developing-border)', text: 'var(--color-developing-text)',
    badge: 'Language barrier', badgeBg: 'var(--color-thinking)', badgeText: 'var(--color-card)',
  },
};

const FREQUENCY_LABELS: Record<string, string> = {
  'most students': 'Plan for this',
  'some students': 'Have a move ready',
  'watch for this': 'Notice when it appears',
};

interface Props {
  lesson: LessonData;
}

export default function AnticipatedThinking({ lesson }: Props) {
  const activities = lesson.anticipated_thinking.activities;
  const [activeActivityId, setActiveActivityId] = useState(activities[0]?.activity_id ?? '');

  const activeActivity = activities.find((a) => a.activity_id === activeActivityId);
  if (!activeActivity) return null;
  const sourceActivity = lesson.activities.find((x) => x.id === activeActivityId);
  const isLastActivity =
    activities.length > 0 && activities[activities.length - 1].activity_id === activeActivityId;

  const sortedPatterns = [...activeActivity.patterns].sort((a, b) => {
    if (a.is_mll_specific && !b.is_mll_specific) return -1;
    if (!a.is_mll_specific && b.is_mll_specific) return 1;
    if (a.type === 'misconception' && b.type !== 'misconception') return -1;
    if (a.type !== 'misconception' && b.type === 'misconception') return 1;
    return 0;
  });

  return (
    <div className="pt-6">
      <ToolInfo toolId="thinking" />
      <div className="h-5" />

      {lesson.anticipated_thinking.orientation && (
        <div
          className="rounded-xl border border-line bg-card shadow-sm overflow-hidden border-l-[3px] mb-8"
          style={{ borderLeftColor: 'var(--color-thinking)' }}
        >
          <div className="px-6 py-5">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2"
              style={{ color: 'var(--color-thinking)' }}
            >
              What student thinking to expect
            </p>
            <p
              className="text-[1rem] text-ink leading-[1.65]"
              style={{ fontFamily: 'var(--font-dm-serif), serif' }}
            >
              {lesson.anticipated_thinking.orientation}
            </p>
          </div>
        </div>
      )}

      {activities.length > 1 && (
        <div className="flex border-b border-line mb-6 overflow-x-auto">
          {activities.map((a) => {
            const isActive = a.activity_id === activeActivityId;
            const sourceActivity = lesson.activities.find((x) => x.id === a.activity_id);
            const label = sourceActivity
              ? `${sourceActivity.id} ${activitySlot(sourceActivity.title)}`
              : `Activity ${a.activity_id}`;
            return (
              <button
                key={a.activity_id}
                onClick={() => {
                  setActiveActivityId(a.activity_id);
                }}
                className={`px-4 py-2.5 text-[11px] font-semibold cursor-pointer transition-colors whitespace-nowrap border-b-2 -mb-px focus-visible:outline-none ${
                  isActive
                    ? 'text-ink border-b-2'
                    : 'text-ink-faint hover:text-ink-muted border-transparent'
                }`}
                style={isActive ? { borderBottomColor: 'var(--color-thinking)', color: 'var(--color-thinking)' } : {}}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      <div className="space-y-4 mb-8">
        {sortedPatterns.map((pattern, i) => {
          // Defensive: if the model emitted an out-of-enum pattern.type that
          // slipped past the normalizer, fall back to on-track styling rather
          // than crashing the React tree.
          const styles = PATTERN_STYLES[pattern.type] ?? PATTERN_STYLES['on-track'];
          const key = `${activeActivityId}-${i}`;

          return (
            <article
              key={key}
              className="rounded-xl border border-line bg-card shadow-sm overflow-hidden border-l-[3px]"
              style={{ borderLeftColor: styles.badgeBg }}
            >
              {/* Header section — white card */}
              <div className="px-5 py-4">
                <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]"
                      style={{ backgroundColor: styles.badgeBg, color: styles.badgeText }}
                    >
                      {styles.badge}
                    </span>
                    {pattern.is_mll_specific && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{ backgroundColor: 'var(--color-thinking)', color: 'var(--color-card)' }}
                      >
                        MLL
                      </span>
                    )}
                    {pattern.mlr && (
                      <MlrChip
                        mlr={pattern.mlr}
                        whyHere={whyHereFor(lesson, activeActivityId, pattern.mlr)}
                      />
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-ink-faint shrink-0">
                    {FREQUENCY_LABELS[pattern.frequency] ?? pattern.frequency}
                  </span>
                </div>

                <h3
                  className="text-[1.1rem] text-ink leading-snug mb-2"
                  style={{ fontFamily: 'var(--font-dm-serif), serif' }}
                >
                  {pattern.label}
                </h3>

                <p className="text-[0.875rem] text-ink-muted leading-relaxed">
                  {pattern.description}
                </p>
              </div>

              {/* Move section — bg-surface tinted, always visible */}
              <div className="border-t border-line-subtle bg-surface px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-2">
                  What to do
                </p>
                <p className="text-[0.875rem] text-ink leading-relaxed">{pattern.move}</p>
              </div>
            </article>
          );
        })}
      </div>

      {activeActivity.sentence_frames.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-3">
            Ready to hand to students
          </p>
          <div className="space-y-2">
            {activeActivity.sentence_frames.map((sf, i) => (
              <div
                key={i}
                className="rounded-xl border-2 border-dashed border-line bg-card px-5 py-3"
              >
                <p className="text-[0.85rem] text-ink-muted leading-relaxed italic">&ldquo;{sf.frame}&rdquo;</p>
                {sf.mlr && (
                  <div className="mt-1.5">
                    <MlrChip mlr={sf.mlr} whyHere={whyHereFor(lesson, activeActivityId, sf.mlr)} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeActivity.questions_to_listen_for.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-3">
            Questions worth listening for
          </p>
          <ul className="space-y-2">
            {activeActivity.questions_to_listen_for.map((q, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-[0.35rem] h-1.5 w-1.5 shrink-0 rounded-full bg-line" />
                <p className="text-[0.85rem] text-ink-muted leading-relaxed">{q}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {sourceActivity?.synthesis_prompt && (
        <div
          className="mt-8 rounded-xl border shadow-sm overflow-hidden border-l-[3px]"
          style={{ backgroundColor: 'var(--color-synth-bg)', borderColor: 'var(--color-synth-border)', borderLeftColor: 'var(--color-synth-accent)' }}
        >
          <div
            className="px-5 py-3 border-b"
            style={{ borderColor: 'var(--color-synth-border)', backgroundColor: 'var(--color-synth-bg-tint)' }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ color: 'var(--color-synth-accent)' }}
            >
              Close this activity — synthesize what their thinking surfaced
            </p>
          </div>
          {sourceActivity.learning_target && (
            <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--color-synth-border)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-1">
                Drive them toward
              </p>
              <p className="text-[0.875rem] text-ink leading-[1.55]">{sourceActivity.learning_target}</p>
            </div>
          )}
          <div className="px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-2">
              How to close
            </p>
            <p className="text-[0.9rem] text-ink leading-[1.65]">{sourceActivity.synthesis_prompt}</p>
          </div>
        </div>
      )}

      {isLastActivity &&
        (lesson.lesson_synthesis.prompt || lesson.lesson_synthesis.builds_on.length > 0) && (
          <div
            className="mt-4 rounded-xl border shadow-sm overflow-hidden border-l-[3px]"
            style={{ backgroundColor: 'var(--color-synth-bg-dark)', borderColor: 'var(--color-synth-accent)', borderLeftColor: 'var(--color-synth-bg)' }}
          >
            <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--color-synth-accent)' }}>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{ color: 'var(--color-synth-bg)' }}
              >
                Then — lesson close
              </p>
            </div>
            {lesson.lesson_synthesis.prompt && (
              <div className="px-5 py-4">
                <p className="text-[0.9rem] leading-[1.65]" style={{ color: 'var(--color-synth-bg)' }}>
                  {lesson.lesson_synthesis.prompt}
                </p>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
