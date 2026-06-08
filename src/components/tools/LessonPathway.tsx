'use client';

import { useState } from 'react';
import { LessonData, Activity, FrictionPoint } from '@/lib/types';
import { ToolId } from '@/app/lesson/page';
import ToolInfo from '@/components/shared/ToolInfo';
import MlrChip from '@/components/shared/MlrChip';
import { useLesson } from '@/lib/lessonContext';
import { kluFromElsf, resolve, WIDA_LABELS } from '@/lib/eld';

const ACCENT = '#00876C';
const SYNTH_ACCENT = '#7A3E1C';
const SYNTH_BG = '#FBF3EA';
const SYNTH_BG_TINT = '#F6E7D2';

const DEMAND_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  low: { bg: '#EAF3DE', text: '#27500A', label: 'Low' },
  medium: { bg: '#FAEEDA', text: '#633806', label: 'Medium' },
  high: { bg: '#FAECE7', text: '#712B13', label: 'High' },
};

const FRICTION_TYPE_LABEL: Record<FrictionPoint['type'], { label: string; bg: string; text: string }> = {
  math: { label: 'Math', bg: '#F1EFE8', text: '#444441' },
  language: { label: 'Language', bg: '#E1F5EE', text: '#085041' },
  'language-math': { label: 'Language + math', bg: '#EEEDFE', text: '#26215C' },
};

interface Props {
  lesson: LessonData;
  onNavigate: (tool: ToolId) => void;
}

function ProficiencyRow({
  label,
  level,
  bg,
  border,
  text,
}: {
  label: string;
  level: { text: string; mlr?: { number: number; name: string } };
  bg: string;
  border: string;
  text: string;
}) {
  return (
    <div
      className="rounded-lg border px-3 py-2"
      style={{ backgroundColor: bg, borderColor: border, color: text }}
    >
      <div className="flex items-baseline justify-between gap-2 mb-1 flex-wrap">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em]">{label}</p>
        {level.mlr && (
          <span
            className="text-[9px] font-semibold rounded-full px-1.5 py-0.5"
            style={{ backgroundColor: '#EEEDFE', color: '#26215C' }}
          >
            MLR {level.mlr.number}
          </span>
        )}
      </div>
      <p className="text-[0.825rem] leading-relaxed">{level.text}</p>
    </div>
  );
}

function ActivityCard({
  activity,
  proficiency,
  lesson,
}: {
  activity: Activity;
  proficiency: LessonData['adaptation_guardrails']['by_proficiency'];
  lesson: LessonData;
}) {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { selectedWidaLevel } = useLesson();

  // ELD Convergence — resolve the embedded move for the educator-selected
  // WIDA level. The KLU is DERIVED from ELSF's existing language_functions
  // output (never re-inferred). If no WIDA level is selected, or no ELSF
  // inference exists for this activity, the embedded ELD move is not
  // surfaced. Per architectural rule: deterministic, never runtime model.
  const elsfActivity = lesson.elsf_inference?.activities.find(
    (a) => a.activity_id === activity.id,
  );
  const eldResolved =
    selectedWidaLevel !== null && elsfActivity
      ? resolve(
          kluFromElsf(elsfActivity.functional_language.language_functions),
          selectedWidaLevel,
        )
      : null;
  const demand = DEMAND_STYLES[activity.language_demand];
  const langFrictions = activity.friction_points.filter(
    (fp) => fp.type === 'language' || fp.type === 'language-math',
  );

  const toggleMain = () => {
    setOpen((o) => {
      const next = !o;
      if (next) setLangOpen(false);
      return next;
    });
  };
  const toggleLang = () => {
    setLangOpen((v) => {
      const next = !v;
      if (next) setOpen(false);
      return next;
    });
  };

  return (
    <div className="relative pl-12 pb-6">
      <div
        className={`absolute left-0 top-5 h-10 w-10 rounded-full border-2 bg-card flex items-center justify-center shadow-sm ${activity.is_crux ? '' : 'border-line'}`}
        style={activity.is_crux ? { borderColor: ACCENT, borderWidth: 2 } : {}}
      >
        <span className="text-[11px] font-semibold text-ink-muted">{activity.id}</span>
      </div>

      <div
        className={`rounded-xl border border-line bg-card shadow-sm overflow-hidden ${activity.is_crux ? 'border-l-[3px]' : ''}`}
        style={activity.is_crux ? { borderLeftColor: ACCENT } : {}}
      >
        <button
          onClick={toggleMain}
          className="w-full text-left px-5 pt-5 pb-3 focus-visible:outline-none cursor-pointer"
        >
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: ACCENT }}
            >
              {activity.function}
            </span>
            {activity.is_crux && (
              <span
                className="text-[9px] font-bold uppercase tracking-[0.1em] text-white px-2 py-0.5 rounded-full"
                style={{ backgroundColor: ACCENT }}
              >
                Crux
              </span>
            )}
          </div>

          <h3 className="text-[1.05rem] font-semibold text-ink leading-snug">{activity.title}</h3>

          <p
            className="mt-2.5 text-[0.925rem] text-ink leading-[1.65] max-w-[58ch]"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            {activity.function_summary}
          </p>

          <div className="mt-3.5 flex items-center gap-2.5 flex-wrap">
            <span className="text-[0.7rem] text-ink-faint">{activity.duration}</span>
            <span className="text-ink-faint text-[0.65rem]">·</span>
            <span className="text-[0.7rem] text-ink-faint">{activity.grouping}</span>
            <span className="ml-auto inline-flex items-center gap-1.5 flex-wrap">
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  toggleLang();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.stopPropagation();
                    e.preventDefault();
                    toggleLang();
                  }
                }}
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold cursor-pointer hover:opacity-85 transition-opacity focus-visible:outline-none inline-flex items-center gap-1"
                style={{ backgroundColor: demand.bg, color: demand.text }}
                aria-label={`${demand.label} language demand. ${langOpen ? 'Hide' : 'Show'} language support.`}
                aria-expanded={langOpen}
              >
                Language Support
                <span className="text-[9px] opacity-70">{langOpen ? '−' : '+'}</span>
              </span>
              <span
                className="rounded-full border px-2 py-0.5 text-[10px] font-semibold inline-flex items-center gap-1 select-none"
                style={{ borderColor: ACCENT, color: ACCENT, backgroundColor: '#FFFFFF' }}
                aria-hidden="true"
              >
                Activity Guidance
                <span className="text-[9px] opacity-70">{open ? '−' : '+'}</span>
              </span>
            </span>
          </div>
        </button>

        {/* Language demand accordion */}
        <div
          className="grid transition-all duration-200 ease-in-out"
          style={{ gridTemplateRows: langOpen ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            {langFrictions.length > 0 && (
              <div className="border-t border-line-subtle px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-2.5">
                  Where language gets in the way
                </p>
                <div className="space-y-2.5">
                  {langFrictions.map((fp, i) => {
                    const typeStyle = FRICTION_TYPE_LABEL[fp.type];
                    return (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="mt-[3px] shrink-0 text-[#854F0B] text-[12px]">▲</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[0.825rem] text-ink-muted leading-relaxed">{fp.description}</p>
                          <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                            <span
                              className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                              style={{ backgroundColor: typeStyle.bg, color: typeStyle.text }}
                            >
                              {typeStyle.label}
                            </span>
                            {fp.mlr && <MlrChip mlr={fp.mlr} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="border-t border-line-subtle px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-2.5">
                How to support across proficiency
              </p>
              <div className="space-y-2">
                <ProficiencyRow label="Emerging" level={proficiency.emerging} bg="#E1F5EE" border="#9FE1CB" text="#085041" />
                <ProficiencyRow label="Developing" level={proficiency.developing} bg="#EEEDFE" border="#AFA9EC" text="#26215C" />
                <ProficiencyRow label="Expanding" level={proficiency.expanding} bg="#F1EFE8" border="#D3D1C7" text="#444441" />
              </div>
            </div>
          </div>
        </div>

        <div
          className="grid transition-all duration-200 ease-in-out"
          style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            {activity.learning_target && (
              <div
                className="border-t border-line-subtle px-5 py-4"
                style={{ backgroundColor: '#F4FAF7' }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.14em] mb-1.5"
                  style={{ color: ACCENT }}
                >
                  Learning target for this activity
                </p>
                <p
                  className="text-[0.95rem] text-ink leading-[1.55]"
                  style={{ fontFamily: 'var(--font-dm-serif), serif' }}
                >
                  {activity.learning_target}
                </p>
              </div>
            )}
            {activity.causal_link && (
              <div
                className="border-t border-line-subtle px-5 py-4"
                style={{ backgroundColor: '#FAFAF7' }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-1.5">
                  Why this activity matters
                </p>
                <p className="text-[0.825rem] text-ink-muted leading-[1.65] italic">
                  {activity.causal_link}
                </p>
              </div>
            )}

            {activity.success_signals.length > 0 && (
              <div className="border-t border-line-subtle px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-2.5">
                  Signals of strong thinking
                </p>
                <div className="space-y-2">
                  {activity.success_signals.map((signal, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="mt-[3px] shrink-0 text-[12px]" style={{ color: ACCENT }}>●</span>
                      <p className="text-[0.825rem] text-ink-muted leading-relaxed">{signal}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activity.friction_points.length > 0 && (
              <div className="border-t border-line-subtle px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-2.5">
                  Where it gets hard
                </p>
                <div className="space-y-2.5">
                  {activity.friction_points.map((fp, i) => {
                    const typeStyle = FRICTION_TYPE_LABEL[fp.type];
                    return (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="mt-[3px] shrink-0 text-[#854F0B] text-[12px]">▲</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[0.825rem] text-ink-muted leading-relaxed">{fp.description}</p>
                          <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                            <span
                              className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                              style={{ backgroundColor: typeStyle.bg, color: typeStyle.text }}
                            >
                              {typeStyle.label}
                            </span>
                            {fp.mlr && <MlrChip mlr={fp.mlr} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {(activity.teacher_moves.length > 0 || eldResolved) && (
              <div className="border-t border-line-subtle px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-2.5">
                  Teacher moves
                </p>
                <ul className="space-y-2.5">
                  {activity.teacher_moves.map((move, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-line" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[0.825rem] text-ink-muted leading-relaxed">{move.text}</span>
                        {move.mlr && (
                          <div className="mt-1">
                            <MlrChip mlr={move.mlr} />
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                  {eldResolved && (
                    <li className="flex items-start gap-2.5">
                      <span
                        className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: '#534AB7' }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[0.825rem] text-ink leading-relaxed">
                          {eldResolved.embeddedMove}
                        </span>
                        <div className="mt-1">
                          <span
                            className="inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{ backgroundColor: '#EEEDFE', color: '#26215C' }}
                            title={`Differentiated for a learner at WIDA ${eldResolved.surfaceAnchor.level}: ${eldResolved.surfaceAnchor.label}`}
                          >
                            For {eldResolved.surfaceAnchor.label} ·{' '}
                            {eldResolved.dimensionTargets.discourse.does}
                          </span>
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {activity.synthesis_prompt && (
              <div
                className="border-t-2 px-5 py-4"
                style={{ backgroundColor: SYNTH_BG, borderTopColor: SYNTH_ACCENT }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[9px] font-bold uppercase tracking-[0.12em] text-white px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: SYNTH_ACCENT }}
                  >
                    Close
                  </span>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: SYNTH_ACCENT }}
                  >
                    Synthesize toward the learning target
                  </p>
                </div>
                <p className="text-[0.875rem] text-ink leading-[1.65]">
                  {activity.synthesis_prompt}
                </p>
              </div>
            )}

            {activity.extension && (
              <div className="border-t border-line-subtle px-5 py-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-2">
                  For students who finish early
                </p>
                <div className="rounded-lg border-2 border-dashed border-line p-3">
                  <p className="text-[0.825rem] text-ink-muted leading-relaxed">{activity.extension}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LessonPathway({ lesson, onNavigate }: Props) {
  return (
    <div className="pt-6">
      <ToolInfo toolId="pathway" />
      <div className="h-6" />

      {/* Arc statement */}
      <div
        className="rounded-xl border border-line bg-card shadow-sm overflow-hidden border-l-[3px]"
        style={{ borderLeftColor: ACCENT }}
      >
        <div className="px-6 py-5">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2"
            style={{ color: ACCENT }}
          >
            The arc of this lesson
          </p>
          <p
            className="text-[1rem] text-ink leading-[1.65]"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            {lesson.arc_statement}
          </p>
        </div>

        <div className="border-t border-line-subtle px-6 py-4 bg-surface">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-1">
            Where students must arrive
          </p>
          <p className="text-[0.825rem] text-ink-muted leading-[1.65]">{lesson.destination}</p>
        </div>
      </div>

      {/* Activity timeline */}
      <div className="mt-10 relative">
        <div
          className="absolute left-[19px] top-6 bottom-6 w-px"
          style={{ backgroundColor: '#E6E4DE' }}
        />

        <div className="space-y-0">
          {lesson.activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              proficiency={lesson.adaptation_guardrails.by_proficiency}
              lesson={lesson}
            />
          ))}
        </div>
      </div>

      {/* Lesson close — lesson_synthesis */}
      {(lesson.lesson_synthesis.prompt || lesson.lesson_synthesis.builds_on.length > 0) && (
        <div className="relative pl-12 pb-2">
          <div
            className="absolute left-0 top-5 h-10 w-10 rounded-full border-2 flex items-center justify-center shadow-sm"
            style={{ borderColor: SYNTH_ACCENT, backgroundColor: SYNTH_BG_TINT, borderWidth: 2 }}
          >
            <span className="text-[14px] font-bold" style={{ color: SYNTH_ACCENT }}>★</span>
          </div>

          <div
            className="rounded-xl border shadow-sm overflow-hidden border-l-[3px]"
            style={{ backgroundColor: SYNTH_BG, borderColor: '#E6CFB5', borderLeftColor: SYNTH_ACCENT }}
          >
            <div
              className="px-5 py-3 border-b"
              style={{ borderColor: '#E6CFB5', backgroundColor: SYNTH_BG_TINT }}
            >
              <p
                className="text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{ color: SYNTH_ACCENT }}
              >
                Lesson close — synthesize toward the destination
              </p>
            </div>

            {lesson.destination && (
              <div className="px-6 py-4 border-b" style={{ borderColor: '#E6CFB5' }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-1.5">
                  Land here
                </p>
                <p
                  className="text-[1rem] text-ink leading-[1.55]"
                  style={{ fontFamily: 'var(--font-dm-serif), serif' }}
                >
                  {lesson.destination}
                </p>
              </div>
            )}

            {lesson.lesson_synthesis.prompt && (
              <div className="px-6 py-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-2">
                  How to close
                </p>
                <p className="text-[0.95rem] text-ink leading-[1.65]">
                  {lesson.lesson_synthesis.prompt}
                </p>
              </div>
            )}

            {lesson.lesson_synthesis.builds_on.length > 0 && (
              <div className="px-6 py-4 border-t" style={{ borderColor: '#E6CFB5' }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-2">
                  This close builds on
                </p>
                <ul className="space-y-1.5">
                  {lesson.lesson_synthesis.builds_on.map((line, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-[5px] shrink-0" style={{ color: SYNTH_ACCENT }}>›</span>
                      <span className="text-[0.825rem] text-ink-muted leading-[1.55]">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Key vocabulary if present */}
      {lesson.key_vocabulary.length > 0 && (
        <div className="mt-2 mb-8 rounded-xl overflow-hidden" style={{ backgroundColor: '#E5EEEB' }}>
          <div className="px-5 py-3 border-b" style={{ borderColor: '#B5D3CB' }}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#005A48' }}>
              Pre-teach before the lesson
            </p>
          </div>
          <div className="divide-y" style={{ borderColor: '#B5D3CB' }}>
            {lesson.key_vocabulary.map((v) => (
              <div key={v.term} className="px-5 py-3">
                <span className="text-[0.85rem] font-semibold" style={{ color: '#005A48' }}>
                  {v.term}
                </span>
                <span className="text-[0.82rem] ml-1" style={{ color: '#005A48', opacity: 0.85 }}>
                  {' — '}
                  {v.definition}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div className="mt-8 flex gap-3 flex-wrap">
        <button
          onClick={() => onNavigate('moves')}
          className="flex-1 min-w-0 rounded-xl border border-line bg-card px-5 py-3 text-[0.875rem] font-semibold text-ink hover:bg-surface-accent transition-colors cursor-pointer text-left"
        >
          Walk through the moves →
        </button>
        <button
          onClick={() => onNavigate('adapt')}
          className="flex-1 min-w-0 rounded-xl border border-line bg-card px-5 py-3 text-[0.875rem] font-semibold text-ink hover:bg-surface-accent transition-colors cursor-pointer text-left"
        >
          Adapt this lesson →
        </button>
      </div>
    </div>
  );
}
