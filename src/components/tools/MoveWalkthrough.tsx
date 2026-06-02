'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { LessonData, TeacherMove, ScenarioType, DecisionScenario, MlrRef } from '@/lib/types';
import { MlrNumber, MLRS } from '@/lib/mlrs';
import ToolInfo from '@/components/shared/ToolInfo';
import MlrChip from '@/components/shared/MlrChip';
import { activitySlot, activityHeading } from '@/lib/activityLabel';

function activityLabel(activityId: string, activityTitle: string): string {
  const slot = activitySlot(activityTitle);
  const heading = activityHeading(activityTitle);
  if (heading && heading !== slot) {
    return `${activityId} ${slot} — ${heading}`;
  }
  return `${activityId} ${slot}`;
}

function whyHereFor(lesson: LessonData, activityId: string, mlr: MlrRef): string | undefined {
  const a = lesson.mlr_inference.activities.find((x) => x.activity_id === activityId);
  return a?.mlrs.find((m) => m.number === mlr.number)?.why_here;
}

const ACCENT = '#185FA5';
const MLL_ACCENT = '#534AB7';

const SCENARIO_TYPE_META: Record<ScenarioType, { label: string; color: string }> = {
  'common-error': { label: 'Common error', color: '#712B13' },
  'productive-insight': { label: 'Productive insight', color: '#00876C' },
  'on-track': { label: 'On track', color: '#185FA5' },
  'partial-understanding': { label: 'Partial understanding', color: '#706E69' },
  'productive-struggle': { label: 'Productive struggle', color: '#854F0B' },
};

type Screen = 'overview' | 'detail' | 'cheat-sheet';

interface FlatScenario extends DecisionScenario {
  index: number;
  activity_id: string;
  activity_title: string;
  is_crux_activity: boolean;
}

interface Props {
  lesson: LessonData;
}

function MoveCard({ move }: { move: TeacherMove }) {
  return (
    <div className="space-y-3">
      <div
        className="rounded-xl border-l-[3px] px-5 py-4"
        style={{
          borderColor: ACCENT,
          borderLeftColor: ACCENT,
          backgroundColor: '#EBF3FD',
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderBottomWidth: 1,
        }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-2" style={{ color: ACCENT }}>
          Move
        </p>
        <p
          className="text-[1.025rem] leading-[1.5]"
          style={{ color: '#0E3A69', fontFamily: 'var(--font-dm-serif), serif' }}
        >
          {move.move}
        </p>
      </div>

      {move.say && (
        <div className="rounded-xl border border-line bg-surface-accent px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-2">
            You might say
          </p>
          <p className="text-[0.875rem] text-ink leading-[1.6] italic">{move.say}</p>
        </div>
      )}

      {move.nonverbal && (
        <div
          className="rounded-xl border px-5 py-4"
          style={{ backgroundColor: '#E1F5EE', borderColor: '#9FE1CB' }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-2" style={{ color: '#085041' }}>
            Non-verbal move
          </p>
          <p className="text-[0.875rem] leading-[1.6]" style={{ color: '#085041' }}>
            {move.nonverbal}
          </p>
        </div>
      )}

      <div className="rounded-xl border border-line bg-card px-5 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-2">
          Avoid
        </p>
        <p className="text-[0.875rem] text-ink-muted leading-[1.6]">{move.avoid}</p>
      </div>
    </div>
  );
}

function ProficiencyColumn({
  label,
  letter,
  move,
  color,
}: {
  label: string;
  letter: string;
  move: TeacherMove;
  color: string;
}) {
  return (
    <div className="rounded-xl border px-4 py-4" style={{ borderColor: color, backgroundColor: '#FFFFFF' }}>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-line-subtle">
        <span
          className="h-7 w-7 rounded-full flex items-center justify-center text-[0.75rem] font-bold text-white shrink-0"
          style={{ backgroundColor: color }}
        >
          {letter}
        </span>
        <p className="text-[0.85rem] font-semibold text-ink">{label}</p>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-1">Move</p>
          <p className="text-[0.825rem] text-ink leading-relaxed">{move.move}</p>
        </div>
        {move.say && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-1">Say</p>
            <p className="text-[0.825rem] text-ink-muted leading-relaxed italic">{move.say}</p>
          </div>
        )}
        {move.nonverbal && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-1" style={{ color: '#085041' }}>
              Non-verbal
            </p>
            <p className="text-[0.825rem] leading-relaxed" style={{ color: '#085041' }}>
              {move.nonverbal}
            </p>
          </div>
        )}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-1">Avoid</p>
          <p className="text-[0.825rem] text-ink-muted leading-relaxed">{move.avoid}</p>
        </div>
      </div>
    </div>
  );
}

function ScenarioCard({
  scenario,
  visited,
  onOpen,
  lesson,
}: {
  scenario: FlatScenario;
  visited: boolean;
  onOpen: () => void;
  lesson: LessonData;
}) {
  const meta = SCENARIO_TYPE_META[scenario.scenario_type];
  return (
    <button
      onClick={onOpen}
      className="w-full text-left rounded-xl border bg-card hover:bg-surface-accent transition-colors cursor-pointer focus-visible:outline-none px-5 py-4 group"
      style={{ borderColor: '#E6E4DE' }}
    >
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full border"
          style={{ color: meta.color, borderColor: meta.color }}
        >
          {meta.label}
        </span>
        {scenario.is_mll && (
          <span
            className="text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full"
            style={{ backgroundColor: MLL_ACCENT, color: 'white' }}
          >
            MLL
          </span>
        )}
        {scenario.mlr && (
          <MlrChip mlr={scenario.mlr} whyHere={whyHereFor(lesson, scenario.activity_id, scenario.mlr)} />
        )}
        {visited && (
          <span className="ml-auto text-[10px] text-ink-faint flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT, opacity: 0.5 }} />
            viewed
          </span>
        )}
      </div>
      <p
        className="text-[0.95rem] text-ink leading-snug group-hover:text-ink"
        style={{ fontFamily: 'var(--font-dm-serif), serif' }}
      >
        {scenario.label}
      </p>
      <p className="mt-2 text-[0.75rem] text-ink-faint">Open →</p>
    </button>
  );
}

export default function MoveWalkthrough({ lesson }: Props) {
  // Flatten scenarios with activity context
  const scenarios = useMemo<FlatScenario[]>(() => {
    const flat: FlatScenario[] = [];
    let idx = 0;
    for (const dgActivity of lesson.decision_guide.activities) {
      const activity = lesson.activities.find((a) => a.id === dgActivity.activity_id);
      for (const scenario of dgActivity.scenarios) {
        flat.push({
          ...scenario,
          index: idx++,
          activity_id: dgActivity.activity_id,
          activity_title: activity?.title ?? '',
          is_crux_activity: activity?.is_crux ?? false,
        });
      }
    }
    return flat;
  }, [lesson]);

  const [screen, setScreen] = useState<Screen>('overview');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [reflections, setReflections] = useState<Record<number, string>>({});
  const [grouping, setGrouping] = useState<'activity' | 'mlr'>('activity');

  if (scenarios.length === 0) {
    return (
      <div className="pt-6">
        <ToolInfo toolId="moves" />
        <p className="mt-6 text-[0.875rem] text-ink-muted">No scenarios available for this lesson.</p>
      </div>
    );
  }

  const current = scenarios[currentIndex];
  const activityIds = Array.from(new Set(scenarios.map((s) => s.activity_id)));
  const mllCount = scenarios.filter((s) => s.is_mll).length;
  const mlrNumbersInLesson = Array.from(
    new Set(scenarios.filter((s) => s.mlr).map((s) => s.mlr!.number)),
  ).sort((a, b) => a - b) as MlrNumber[];

  const openScenario = (idx: number) => {
    setCurrentIndex(idx);
    setVisited((prev) => new Set(prev).add(idx));
    setScreen('detail');
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      openScenario(currentIndex - 1);
    }
  };

  const goNext = () => {
    if (currentIndex < scenarios.length - 1) {
      openScenario(currentIndex + 1);
    }
  };

  // ----- OVERVIEW -----
  if (screen === 'overview') {
    return (
      <div className="pt-6">
        <ToolInfo toolId="moves" />
        <div className="h-5" />

        <div
          className="rounded-xl border border-line bg-card shadow-sm overflow-hidden border-l-[3px]"
          style={{ borderLeftColor: ACCENT }}
        >
          <div className="px-6 py-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: ACCENT }}>
              How to use this
            </p>
            <p
              className="text-[1rem] text-ink leading-[1.6]"
              style={{ fontFamily: 'var(--font-dm-serif), serif' }}
            >
              Each card below is a moment you might see during this lesson. Open the ones that feel less familiar. Each one shows what you might see, what it usually means, and how to respond — all on a single screen.
            </p>
          </div>
        </div>

        <div className="mt-6 mb-4">
          <p
            className="text-[0.825rem] leading-relaxed rounded-lg px-3 py-2"
            style={{ backgroundColor: '#F4F2FE', color: '#26215C' }}
          >
            <span className="font-semibold">
              {mllCount} of {scenarios.length} moments involve multilingual learners.
            </span>{' '}
            These show the response across Entering, Developing, and Bridging proficiency levels side by side — the proficiency-differentiated move is one of the most distinctive things this tool teaches.
          </p>
        </div>

        {mlrNumbersInLesson.length > 0 && (
          <div className="mb-5 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint">View:</span>
            <div className="inline-flex rounded-full border" style={{ borderColor: '#E6E4DE' }}>
              <button
                onClick={() => setGrouping('activity')}
                className="px-3 py-1 text-[11px] font-semibold rounded-full cursor-pointer transition-colors focus-visible:outline-none"
                style={
                  grouping === 'activity'
                    ? { backgroundColor: ACCENT, color: 'white' }
                    : { color: '#706E69' }
                }
              >
                By activity
              </button>
              <button
                onClick={() => setGrouping('mlr')}
                className="px-3 py-1 text-[11px] font-semibold rounded-full cursor-pointer transition-colors focus-visible:outline-none"
                style={
                  grouping === 'mlr'
                    ? { backgroundColor: ACCENT, color: 'white' }
                    : { color: '#706E69' }
                }
              >
                By MLR
              </button>
            </div>
          </div>
        )}

        {grouping === 'activity' && activityIds.map((aid) => {
          const items = scenarios.filter((s) => s.activity_id === aid);
          const first = items[0];
          return (
            <section key={aid} className="mb-8">
              <div className="flex items-baseline justify-between mb-3 gap-3">
                <h3 className="text-[0.95rem] font-semibold text-ink">
                  {activityLabel(aid, first.activity_title)}
                </h3>
                {first.is_crux_activity && (
                  <span
                    className="text-[9px] font-bold uppercase tracking-[0.1em] text-white px-2 py-0.5 rounded-full shrink-0"
                    style={{ backgroundColor: ACCENT }}
                  >
                    Crux
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {items.map((s) => (
                  <ScenarioCard
                    key={s.index}
                    scenario={s}
                    visited={visited.has(s.index)}
                    onOpen={() => openScenario(s.index)}
                    lesson={lesson}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {grouping === 'mlr' && mlrNumbersInLesson.map((n) => {
          const items = scenarios.filter((s) => s.mlr?.number === n);
          if (items.length === 0) return null;
          const mlrMeta = MLRS[n];
          return (
            <section key={n} className="mb-8">
              <div className="flex items-baseline justify-between mb-3 gap-3 flex-wrap">
                <h3 className="text-[0.95rem] font-semibold text-ink">
                  MLR {n}: {mlrMeta.name}
                </h3>
                <span className="text-[11px] text-ink-faint">{items.length} moment{items.length === 1 ? '' : 's'}</span>
              </div>
              <div className="space-y-2">
                {items.map((s) => (
                  <ScenarioCard
                    key={s.index}
                    scenario={s}
                    visited={visited.has(s.index)}
                    onOpen={() => openScenario(s.index)}
                    lesson={lesson}
                  />
                ))}
              </div>
            </section>
          );
        })}

        <div className="mt-10 pt-6 border-t border-line">
          <button
            onClick={() => setScreen('cheat-sheet')}
            className="w-full rounded-xl px-5 py-3 text-[0.875rem] font-semibold cursor-pointer transition-colors focus-visible:outline-none"
            style={{ backgroundColor: ACCENT, color: 'white' }}
          >
            See the pre-lesson cheat sheet →
          </button>
          <p className="mt-3 text-center text-[0.75rem] text-ink-faint">
            A printable summary of every moment in this lesson on one page.
          </p>
        </div>
      </div>
    );
  }

  // ----- CHEAT SHEET -----
  if (screen === 'cheat-sheet') {
    return (
      <div className="pt-6">
        <ToolInfo toolId="moves" />
        <div className="h-5" />

        <button
          onClick={() => setScreen('overview')}
          className="text-[0.8rem] text-ink-faint hover:text-ink-muted cursor-pointer mb-5 transition-colors"
        >
          ← Back to walkthrough
        </button>

        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: ACCENT }}>
          Pre-lesson cheat sheet
        </p>
        <h2
          className="text-[1.5rem] text-ink leading-tight mb-3"
          style={{ fontFamily: 'var(--font-dm-serif), serif' }}
        >
          Moments to watch for
        </h2>
        <p className="text-[0.85rem] text-ink-muted leading-relaxed mb-2 max-w-[58ch]">
          {lesson.meta.grade} · {lesson.meta.unit} · {lesson.meta.lesson_number} — {lesson.meta.lesson_title}
        </p>
        <p className="text-[0.85rem] text-ink-muted mb-8 leading-relaxed max-w-[58ch]">
          When you see one of these moments in class, take a second before you do anything. Try to name what is happening. That pause — even for just a beat — is how you get better at this.
        </p>

        <div className="space-y-8">
          {activityIds.map((aid) => {
            const items = scenarios.filter((s) => s.activity_id === aid);
            const isCrux = items[0]?.is_crux_activity;
            const activity = lesson.activities.find((a) => a.id === aid);
            return (
              <section
                key={aid}
                className={`rounded-xl border bg-card overflow-hidden ${isCrux ? 'border-l-[3px]' : 'border-line'}`}
                style={isCrux ? { borderLeftColor: ACCENT, borderColor: '#E6E4DE' } : {}}
              >
                <div className="px-6 pt-5 pb-4 border-b border-line-subtle">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-[0.12em]"
                      style={{ color: ACCENT }}
                    >
                      {activity?.function ?? ''}
                    </span>
                    {isCrux && (
                      <span
                        className="text-[9px] font-bold uppercase tracking-[0.1em] text-white px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: ACCENT }}
                      >
                        Crux
                      </span>
                    )}
                  </div>
                  <p className="text-[1rem] text-ink font-semibold leading-snug mb-2">
                    {activityLabel(aid, items[0]?.activity_title ?? '')}
                  </p>
                </div>

                <div className="divide-y divide-line-subtle">
                  {items.map((s) => (
                    <div key={s.index} className="px-6 py-5">
                      <div className="flex items-start gap-2.5 mb-3">
                        <span
                          className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: SCENARIO_TYPE_META[s.scenario_type].color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-[1.05rem] text-ink leading-[1.5] mb-1.5"
                            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
                          >
                            {s.label}
                          </p>
                          <div className="flex gap-1.5 flex-wrap">
                            <span
                              className="inline-block text-[9px] font-bold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-full border"
                              style={{
                                color: SCENARIO_TYPE_META[s.scenario_type].color,
                                borderColor: SCENARIO_TYPE_META[s.scenario_type].color,
                              }}
                            >
                              {SCENARIO_TYPE_META[s.scenario_type].label}
                            </span>
                            {s.is_mll && (
                              <span
                                className="inline-block text-[9px] font-bold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-full"
                                style={{ backgroundColor: MLL_ACCENT, color: 'white' }}
                              >
                                MLL
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pl-5 mb-2.5">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint">
                          Means
                        </span>
                        <span className="ml-2 text-[0.85rem] text-ink-muted leading-relaxed">
                          {s.interpretation}
                        </span>
                      </div>

                      <div className="pl-5">
                        {!s.is_mll && s.flat_move && (
                          <>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: ACCENT }}>
                              Move
                            </span>
                            <span className="ml-2 text-[0.875rem] text-ink leading-relaxed">
                              {s.flat_move.move}
                              {s.flat_move.say && (
                                <span className="text-ink-muted italic"> — {s.flat_move.say}</span>
                              )}
                            </span>
                          </>
                        )}
                        {s.is_mll && s.proficiency_moves && (
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: MLL_ACCENT }}>
                              Response by proficiency
                            </p>
                            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[0.85rem] text-ink leading-snug">
                              <span className="font-bold" style={{ color: '#00876C' }}>Em</span>
                              <span>{s.proficiency_moves.emerging.move}</span>
                              <span className="font-bold" style={{ color: '#534AB7' }}>D</span>
                              <span>{s.proficiency_moves.developing.move}</span>
                              <span className="font-bold" style={{ color: '#706E69' }}>Ex</span>
                              <span>{s.proficiency_moves.expanding.move}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {Object.values(reflections).filter((v) => v?.trim()).length > 0 && (
          <div className="mt-10 rounded-xl border border-line bg-card px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-3">
              Your notes from this walkthrough
            </p>
            <div className="space-y-3">
              {scenarios
                .filter((s) => reflections[s.index]?.trim())
                .map((s) => (
                  <div key={s.index}>
                    <p className="text-[0.75rem] text-ink-faint mb-0.5">
                      {s.activity_id} {activitySlot(s.activity_title)} · {s.label}
                    </p>
                    <p className="text-[0.825rem] text-ink-muted italic">{reflections[s.index]}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-3 flex-wrap">
          <button
            onClick={() => setScreen('overview')}
            className="flex-1 min-w-0 rounded-xl border border-line bg-card px-5 py-3 text-[0.875rem] font-semibold text-ink hover:bg-surface-accent transition-colors cursor-pointer text-center"
          >
            Back to walkthrough
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 min-w-0 rounded-xl px-5 py-3 text-[0.875rem] font-semibold cursor-pointer transition-colors focus-visible:outline-none text-center"
            style={{ backgroundColor: ACCENT, color: 'white' }}
          >
            Print this summary
          </button>
        </div>
      </div>
    );
  }

  // ----- DETAIL (single scenario, all content visible) -----
  return (
    <div className="pt-6">
      <ToolInfo toolId="moves" />
      <div className="h-5" />

      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <button
          onClick={() => setScreen('overview')}
          className="text-[0.8rem] text-ink-faint hover:text-ink-muted cursor-pointer transition-colors"
        >
          ← All scenarios
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="text-[0.75rem] text-ink-faint hover:text-ink-muted cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1"
          >
            ← Previous
          </button>
          <span className="text-ink-faint text-[0.65rem]">·</span>
          <span className="text-[0.7rem] text-ink-faint px-1">
            {currentIndex + 1} of {scenarios.length}
          </span>
          <span className="text-ink-faint text-[0.65rem]">·</span>
          <button
            onClick={goNext}
            disabled={currentIndex === scenarios.length - 1}
            className="text-[0.75rem] text-ink-faint hover:text-ink-muted cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1"
          >
            Next →
          </button>
        </div>
      </div>

      <p className="text-[0.75rem] text-ink-faint mb-3">
        {activityLabel(current.activity_id, current.activity_title)}
      </p>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full border"
          style={{
            color: SCENARIO_TYPE_META[current.scenario_type].color,
            borderColor: SCENARIO_TYPE_META[current.scenario_type].color,
          }}
        >
          {SCENARIO_TYPE_META[current.scenario_type].label}
        </span>
        {current.is_mll && (
          <span
            className="text-[10px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded-full"
            style={{ backgroundColor: MLL_ACCENT, color: 'white' }}
          >
            MLL
          </span>
        )}
        {current.mlr && (
          <MlrChip mlr={current.mlr} whyHere={whyHereFor(lesson, current.activity_id, current.mlr)} />
        )}
      </div>

      {/* Observation */}
      <div
        className="rounded-xl border-l-[3px] px-6 py-5 mb-6"
        style={{
          borderColor: ACCENT,
          borderLeftColor: ACCENT,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderBottomWidth: 1,
        }}
      >
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-2"
          style={{ color: ACCENT }}
        >
          You might see this
        </p>
        <p className="text-[1.1rem] text-ink leading-[1.55]" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>
          {current.label}
        </p>
      </div>

      {/* Interpretation */}
      <div className="mb-6">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2"
          style={{ color: ACCENT }}
        >
          What this usually means
        </p>
        <div
          className="rounded-xl border-l-[3px] px-6 py-5"
          style={{
            borderColor: ACCENT,
            borderLeftColor: ACCENT,
            backgroundColor: '#EBF3FD',
            borderTopWidth: 1,
            borderRightWidth: 1,
            borderBottomWidth: 1,
          }}
        >
          <p
            className="text-[1.025rem] leading-[1.6]"
            style={{ color: '#0E3A69', fontFamily: 'var(--font-dm-serif), serif' }}
          >
            {current.interpretation}
          </p>
        </div>
      </div>

      {/* Move (flat or proficiency-branched) */}
      <div className="mb-6">
        {!current.is_mll && current.flat_move && (
          <>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: ACCENT }}>
              Recommended move
            </p>
            <MoveCard move={current.flat_move} />
          </>
        )}

        {current.is_mll && current.proficiency_moves && (
          <>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2"
              style={{ color: MLL_ACCENT }}
            >
              The response depends on the student&apos;s proficiency level
            </p>
            <p className="text-[0.825rem] text-ink-muted mb-4 leading-relaxed">
              Read across — notice how the move adapts to what is available in shared language.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <ProficiencyColumn
                label="Emerging"
                letter="Em"
                move={current.proficiency_moves.emerging}
                color="#00876C"
              />
              <ProficiencyColumn
                label="Developing"
                letter="D"
                move={current.proficiency_moves.developing}
                color="#534AB7"
              />
              <ProficiencyColumn
                label="Expanding"
                letter="Ex"
                move={current.proficiency_moves.expanding}
                color="#706E69"
              />
            </div>

            {current.mll_framework_note && (
              <div
                className="mt-4 rounded-xl border px-5 py-4"
                style={{ backgroundColor: '#F4F2FE', borderColor: '#D9D4F4' }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-2" style={{ color: MLL_ACCENT }}>
                  Notice the progression
                </p>
                <p className="text-[0.85rem] leading-relaxed" style={{ color: '#26215C' }}>
                  {current.mll_framework_note}
                </p>
              </div>
            )}

            {current.proficiency_divergence_note && (
              <div
                className="mt-4 rounded-xl border-l-[3px] px-5 py-3"
                style={{ backgroundColor: '#FAFAF7', borderLeftColor: '#534AB7', borderTopWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#E6E4DE' }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-1" style={{ color: '#534AB7' }}>
                  Routine across proficiency
                </p>
                <p className="text-[0.82rem] text-ink-muted leading-relaxed">
                  {current.proficiency_divergence_note}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reflection — optional */}
      <details className="mb-6 rounded-xl border border-line bg-card">
        <summary className="cursor-pointer px-5 py-3 text-[0.825rem] font-medium text-ink-muted hover:text-ink select-none">
          Note your thinking (optional)
        </summary>
        <div className="px-5 pb-4">
          <textarea
            value={reflections[current.index] || ''}
            onChange={(e) =>
              setReflections({ ...reflections, [current.index]: e.target.value })
            }
            placeholder="What would you do differently? What did you notice?"
            rows={2}
            className="w-full text-[0.85rem] text-ink bg-surface rounded-lg border border-line-subtle px-3 py-2 placeholder:text-ink-faint focus-visible:outline-none focus-visible:border-ink-faint resize-none"
          />
        </div>
      </details>

      {/* Bottom navigation */}
      <div className="flex items-center justify-between gap-3 pt-6 border-t border-line">
        <button
          onClick={() => setScreen('overview')}
          className="text-[0.8rem] text-ink-muted hover:text-ink cursor-pointer transition-colors"
        >
          ← All scenarios
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="rounded-xl border border-line bg-card px-4 py-2 text-[0.825rem] text-ink hover:bg-surface-accent disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={goNext}
            disabled={currentIndex === scenarios.length - 1}
            className="rounded-xl px-4 py-2 text-[0.825rem] font-semibold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-visible:outline-none"
            style={{ backgroundColor: ACCENT, color: 'white' }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
