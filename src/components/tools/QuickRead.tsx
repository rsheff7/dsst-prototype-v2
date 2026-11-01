'use client';

import { useState } from 'react';
import { LessonData, WristbandTile, WristbandActivity, WristbandLegendEntry, Activity } from '@/lib/types';
import { MLRS } from '@/lib/mlrs';
import MlrChip from '@/components/shared/MlrChip';
import ToolInfo from '@/components/shared/ToolInfo';
import { activitySlot, activityHeading, activityName, focusRoles, type FocusRole } from '@/lib/activityLabel';


const FRICTION_PILL: Record<WristbandTile['friction_type'], { bg: string; text: string; label: string }> = {
  math: { bg: 'var(--color-bridging-bg)', text: 'var(--color-bridging-text)', label: 'Math' },
  language: { bg: 'var(--color-entering-bg)', text: 'var(--color-entering-text)', label: 'Language' },
  'language-math': { bg: 'var(--color-developing-bg)', text: 'var(--color-developing-text)', label: 'Lang + math' },
};

const FRICTION_BAR: Record<WristbandTile['friction_type'], string> = {
  math: 'var(--color-adapt)',
  language: 'var(--color-entering-text)',
  'language-math': 'var(--color-thinking)',
};

const QR_ACCENT = 'var(--color-brand-primary)';
const CRUX_ACCENT = 'var(--color-crux-accent)';
const SYNTH_ACCENT = 'var(--color-synth-accent)';
const SYNTH_BG = 'var(--color-synth-bg)';
const SYNTH_BG_DARK = 'var(--color-synth-bg-dark)';

interface Props {
  lesson: LessonData;
}

export default function QuickRead({ lesson }: Props) {
  const wb = lesson.wristband;
  const activityById = Object.fromEntries(lesson.activities.map((a) => [a.id, a]));
  const windows = timeWindows(lesson.activities);
  const windowById: Record<string, { start: number; end: number }> = Object.fromEntries(
    lesson.activities.map((a, i) => [a.id, windows[i]]),
  );

  return (
    <div className="pt-6 pb-12 quickread-root quickread-plan">

{/* Toolbar (screen only) */}
      <div className="qr-print-hide mb-5 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full px-3 py-1 text-[11px] font-semibold cursor-pointer hover:opacity-85 transition-opacity"
          style={{ backgroundColor: QR_ACCENT, color: 'var(--color-card)' }}
        >
          Print
        </button>
        <ToolInfo toolId="quickread" hideHeading />
      </div>

      

      

      {/* Destination — hero treatment, no border, reads as page masthead */}
      {lesson.destination && (
        <div className="mb-10 px-2 py-6">
          <p
            className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] mb-3"
            style={{ color: 'var(--color-ink-faint)' }}
          >
            By the end of the lesson, students can
          </p>
          <p
            className="text-[1.625rem] leading-[1.35] text-ink"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            {stripSwbatPrefix(lesson.destination)}
          </p>
{wb.arc_one_line && (
              <p
                className="mt-5 text-[1.125rem] leading-[1.6]"
                style={{ color: 'var(--color-ink-muted)' }}
              >
                {wb.arc_one_line}
             </p>
           )}
</div>
      )}

      

      {/* Arc statement — collapsed by default */}
      {lesson.arc_statement && (
        <div className="mb-8 px-2">
          <ArcDisclosure text={lesson.arc_statement} destination={lesson.destination} />
        </div>
      )}

      <PlanView
        wb={wb}
        activityById={activityById}
        windowById={windowById}
        lessonSynthesis={lesson.lesson_synthesis}
        destination={lesson.destination}
        activityCount={lesson.activities.length}
        totalTime={lesson.meta.total_time}
      />

      <style jsx global>{planPrintStyles}</style>
    </div>
  );
}

function ArcDisclosure({ text, destination }: { text: string; destination?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-line bg-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-5 py-3 text-left cursor-pointer hover:bg-surface-accent transition-colors focus-visible:outline-none flex items-center gap-2"
        aria-expanded={open}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: QR_ACCENT }}>
          The arc of this lesson
        </span>
        <span className="ml-auto text-[11px] text-ink-faint">{open ? '−' : '+'}</span>
      </button>
      <div
        className="grid transition-all duration-200 ease-in-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p
            className="px-5 pb-4 text-[0.925rem] leading-[1.7]"
            style={{ fontFamily: 'var(--font-dm-serif), serif', color: 'var(--color-ink-muted)' }}
          >
            {text}
          </p>
          {destination && (
            <div className="border-t border-line px-5 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-1" style={{ color: 'var(--color-ink-faint)' }}>
                Where students must arrive
              </p>
              <p className="text-[0.825rem] leading-[1.65]" style={{ color: 'var(--color-ink-muted)' }}>
                {destination}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------- PLAN VIEW ----------------

function PlanView({
  wb,
  activityById,
  windowById,
  lessonSynthesis,
  destination,
  activityCount,
  totalTime,
}: {
  wb: LessonData['wristband'];
  activityById: Record<string, Activity>;
  windowById: Record<string, { start: number; end: number }>;
  lessonSynthesis: LessonData['lesson_synthesis'];
  destination: string;
  activityCount: number;
  totalTime?: string;
}) {
  return (
    <>
      {Array.isArray(wb.preflight) && wb.preflight.length > 0 && (
        <section className="qr-preflight border-l-2 border-line bg-surface pl-5 py-4 mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted mb-3">Before you begin</p>
          <ul className="space-y-2">
            {wb.preflight.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-[2px] shrink-0 text-[13px] text-ink-muted">□</span>
                <p className="text-[0.875rem] text-ink" style={{ lineHeight: 1.5 }}>{item}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted mb-3">
        Activities<span className="font-normal normal-case tracking-normal" style={{ color: 'var(--color-ink-faint)' }}>{totalTime ? ` — ${activityCount} activities, about ${totalTime.replace('min', 'minutes')}` : ''}</span>
      </p>

      <div className="qr-activities relative mb-5">
        {/* Vertical hairline connecting all activity circles */}
        <div
          className="absolute left-[19px] top-6 bottom-6 w-px"
          style={{ backgroundColor: 'var(--color-line)' }}
        />
        <div className="space-y-0">
          {wb.activities.map((wba, i) => {
            const act = activityById[wba.activity_id];
            if (!act) return null;
            const isCrux = act.is_crux;
            return (
              <div key={wba.activity_id} className="relative pl-12 pb-6 last:pb-0">
                {/* Numbered circle */}
                <div
                  className={`absolute left-0 top-4 h-10 w-10 rounded-full border-2 bg-card flex items-center justify-center shadow-sm ${isCrux ? '' : 'border-line'}`}
                  style={isCrux ? { borderColor: QR_ACCENT } : {}}
                >
                  <span className="text-[11px] font-semibold text-ink-muted">{act.id}</span>
                </div>
                <PlanActivityRow
                  wba={wba}
                  activity={act}
                  window={windowById[wba.activity_id]}
                />
              </div>
            );
          })}
        </div>
      </div>

      {(wb.lesson_synthesis_short || lessonSynthesis?.prompt) && (
        <div className="relative pl-12 pb-2">
          <div
            className="absolute left-0 top-4 h-10 w-10 rounded-full border-2 flex items-center justify-center shadow-sm"
            style={{ borderColor: SYNTH_ACCENT, backgroundColor: 'var(--color-synth-bg-tint)', borderWidth: 2 }}
          >
            <span className="text-[14px] font-bold" style={{ color: SYNTH_ACCENT }}>★</span>
          </div>
          <section
            className="qr-lesson-close rounded-xl border shadow-sm overflow-hidden mb-6 border-l-[3px]"
            style={{ backgroundColor: SYNTH_BG, borderColor: 'var(--color-synth-border)', borderLeftColor: SYNTH_ACCENT }}
          >
          <div
            className="px-5 py-3 border-b"
            style={{ borderColor: 'var(--color-synth-border)', backgroundColor: 'var(--color-synth-bg-tint)' }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ color: SYNTH_ACCENT }}
            >
              Lesson close — synthesize toward the destination
            </p>
          </div>
          <div className="px-5 py-4">
            {destination && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-1.5">
                Land here: {stripSwbatPrefix(destination)}
              </p>
            )}
            {wb.lesson_synthesis_short && (
              <p className="text-[0.925rem] font-semibold text-ink leading-[1.55] mb-2">
                {wb.lesson_synthesis_short}
              </p>
            )}
            {lessonSynthesis?.builds_on && lessonSynthesis.builds_on.length > 0 && (
              <ul className="mt-3 space-y-1">
                {lessonSynthesis?.builds_on.map((line, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-[5px] shrink-0" style={{ color: SYNTH_ACCENT }}>›</span>
                    <span className="text-[0.78rem] text-ink-muted leading-[1.5]">{line}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          </section>
        </div>
      )}

      {wb.mlr_legend.length > 0 && (
        <div className="qr-legend rounded-xl border border-line bg-card shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-line-subtle bg-surface">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint">
              The routines this lesson runs on
            </p>
          </div>
          <ul className="divide-y divide-line-subtle">
            {wb.mlr_legend.map((entry, i) => (
              <li key={i} className="px-5 py-3 flex items-center gap-3 flex-wrap">
                <MlrChip mlr={entry.mlr} />
                <span className="text-[0.825rem] text-ink-muted leading-relaxed">{entry.one_line_cue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
function PlanActivityRow({
  wba,
  activity,
  window,
}: {
  wba: WristbandActivity;
  activity: Activity | undefined;
  window: { start: number; end: number } | undefined;
}) {
  if (!activity) return null;
  const isCrux = activity.is_crux;
  return (
    <section
      className={`qr-activity rounded-xl border bg-card shadow-sm overflow-hidden ${isCrux ? 'border-l-[3px]' : 'border-line'}`}
      style={isCrux ? { borderLeftColor: QR_ACCENT } : {}}
    >
      {/* Identity header */}
      <div className="qr-activity-header px-5 py-4 border-b border-line-subtle">
        {activity.function && (
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: QR_ACCENT }}>
            {activity.function}
          </p>
        )}
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <h2 className="text-[1.1rem] font-semibold text-ink leading-tight">
            {activityHeading(activity.title)}
          </h2>
          <span className="text-[12px] text-ink-faint shrink-0 ml-auto">{activity.duration}</span>
        </div>
      </div>

      {activity.learning_target && (
        <p className="px-5 pt-3 pb-1 text-[1rem] text-ink leading-[1.5]">
          {activity.learning_target}
        </p>
      )}

      {/* Tiles flow horizontally, full width */}
      {wba.tiles.length > 0 && (
        <>
          <p className="px-5 pt-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">Anticipated friction points</p>
          <div className="qr-activity-tilegrid px-3 py-3 flex flex-col gap-2">
            {wba.tiles.map((tile, i) => (
              <PlanTile key={i} tile={tile} />
            ))}
          </div>
        </>
      )}

      {/* Synthesis close band — hard to skip */}
      {wba.synthesis_short && (
        <div
          className="qr-activity-synth border-t-2 px-5 py-3.5 flex items-start gap-3"
          style={{ backgroundColor: SYNTH_BG, borderTopColor: SYNTH_ACCENT }}
        >
          <span
            className="shrink-0 text-[9px] font-bold uppercase tracking-[0.12em] text-white px-2 py-0.5 rounded-full mt-[1px]"
            style={{ backgroundColor: SYNTH_ACCENT }}
          >
            Close
          </span>
          <p className="text-[0.875rem] font-semibold text-ink leading-[1.55] flex-1">
            {wba.synthesis_short}
          </p>
        </div>
      )}
    </section>
  );
}

function PlanTile({ tile }: { tile: WristbandTile }) {
  const pill = FRICTION_PILL[tile.friction_type];
  const isCrux = tile.is_crux_moment;
  return (
    <div
      className={`qr-tile flex-1 rounded-xl border bg-card shadow-sm overflow-hidden ${isCrux ? 'border-l-[3px]' : 'border-line'}`}
      style={isCrux ? { borderLeftColor: CRUX_ACCENT, backgroundColor: 'var(--color-crux-bg)' } : {}}
    >
      {isCrux && (
        <div
          className="qr-tile-crux-header px-4 py-2 border-b border-line-subtle"
          style={{ backgroundColor: CRUX_ACCENT }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white">
            Crux moment
          </p>
        </div>
      )}

      <div className="px-4 py-3 space-y-3">
        {/* NOTICE */}
        <div className="qr-tile-section">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-1.5">
            Notice
          </p>
          <p className="text-[0.825rem] text-ink leading-relaxed">{tile.observation_short}</p>
        </div>

        {/* CLARIFY */}
        <div className="qr-tile-section">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-1.5">
            Clarify
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{ backgroundColor: pill.bg, color: pill.text }}
            >
              {pill.label}
            </span>
          </div>
        </div>

        {/* RESPOND */}
        <div className="qr-tile-section">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-1.5">
            Respond
          </p>
          <div className="flex items-start gap-2 flex-wrap">
            {tile.mlr && <MlrChip mlr={tile.mlr} showName={false} />}
            <p className="text-[0.825rem] text-ink-muted leading-relaxed flex-1 min-w-0">
              {tile.move_short}
            </p>
          </div>
          {tile.avoid_short && (
            <p
              className="qr-tile-avoid mt-2 text-[0.75rem] leading-relaxed italic"
              style={{ color: 'var(--color-demand-high-text)' }}
            >
              <span className="font-semibold not-italic">Avoid:</span> {tile.avoid_short}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------- IN-CLASS VIEW ----------------

function InClassView({
  wb,
  activityById,
  windowById,
  lessonSynthesis,
}: {
  wb: LessonData['wristband'];
  activityById: Record<string, Activity>;
  windowById: Record<string, { start: number; end: number }>;
  lessonSynthesis: LessonData['lesson_synthesis'];
}) {
  const activityList = Object.values(activityById);
  const roleByIndex = focusRoles(activityList);
  const roleById: Record<string, FocusRole | null> = {};
  activityList.forEach((a, i) => { roleById[a.id] = roleByIndex[i]; });

  return (
    <div className="space-y-3 max-w-md mx-auto">
      {wb.activities.map((wba) => (
        <InClassActivityBlock
          key={wba.activity_id}
          wba={wba}
          activity={activityById[wba.activity_id]}
          focus={roleById[wba.activity_id] ?? null}
          window={windowById[wba.activity_id]}
        />
      ))}
      {(wb.lesson_synthesis_short || lessonSynthesis?.prompt) && (
        <InClassLessonClose
          short={wb.lesson_synthesis_short}
          buildsOn={lessonSynthesis?.builds_on || []}
        />
      )}
      {wb.mlr_legend.length > 0 && <InClassLegend entries={wb.mlr_legend} />}
    </div>
  );
}

function InClassLessonClose({ short, buildsOn }: { short: string; buildsOn: string[] }) {
  return (
    <section className="rounded-xl overflow-hidden" style={{ backgroundColor: SYNTH_BG_DARK }}>
      <div className="px-4 py-2 flex items-baseline gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white">
          Lesson close
        </span>
        <span className="text-[10px] text-white opacity-60">synthesize</span>
      </div>
      <div className="bg-white px-4 py-3">
        {short && (
          <p className="text-[0.9rem] font-semibold text-ink leading-tight tracking-tight">
            {short}
          </p>
        )}
        {buildsOn.length > 0 && (
          <ul className="mt-2 space-y-1">
            {buildsOn.map((line, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="mt-[3px] text-[10px]" style={{ color: SYNTH_ACCENT }}>›</span>
                <span className="text-[0.72rem] text-ink-muted leading-snug">{line}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function InClassActivityBlock({
  wba,
  activity,
  focus,
  window,
}: {
  wba: WristbandActivity;
  activity: Activity | undefined;
  focus: FocusRole | null;
  window: { start: number; end: number } | undefined;
}) {
  if (!activity) return null;
  const isCrux = activity.is_crux;
  const isFeeder = focus === 'feeder';
const kicker = activity.function;
  return (
    <section className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--color-ink)' }}>
      <div className="px-4 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span
            className={`shrink-0 text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full ${
              isCrux || isFeeder ? 'text-ink' : 'bg-white/15 text-white'
            }`}
            style={isCrux || isFeeder ? { backgroundColor: 'var(--color-card)' } : {}}
          >
            {kicker}
          </span>
<span className="text-[11px] text-white opacity-60 ml-auto">
            {activity.duration}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-white truncate">
          {activityName(activity)}
        </span>
</div>
      <div className="bg-white">
        {wba.tiles.map((tile, i) => (
          <InClassTile key={i} tile={tile} />
        ))}
        {wba.synthesis_short && <InClassSynthRow text={wba.synthesis_short} />}
      </div>
    </section>
  );
}

function InClassSynthRow({ text }: { text: string }) {
  return (
    <div
      className="flex items-stretch border-t"
      style={{ borderColor: 'var(--color-line)', backgroundColor: SYNTH_BG }}
    >
      <div className="shrink-0 w-1.5" style={{ backgroundColor: SYNTH_ACCENT }} />
      <div
        className="shrink-0 w-8 flex items-center justify-center"
        style={{ borderRight: '1px solid var(--color-bridging-bg)' }}
      >
        <span className="text-[10px] font-bold" style={{ color: SYNTH_ACCENT }}>↳</span>
      </div>
      <div className="flex-1 min-w-0 px-3 py-2.5">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: SYNTH_ACCENT }}>
          Close — synthesize
        </p>
        <p className="text-[0.83rem] font-semibold text-ink leading-tight tracking-tight">{text}</p>
      </div>
    </div>
  );
}

function InClassTile({ tile }: { tile: WristbandTile }) {
  const isCrux = tile.is_crux_moment;
  const obs = tile.glyph_observation || tile.observation_short.toUpperCase();
  const move = tile.glyph_move || firstSentence(tile.move_short);
  return (
    <div
      className="flex items-stretch border-t"
      style={{ borderColor: 'var(--color-line)', backgroundColor: isCrux ? 'var(--color-crux-bg)' : undefined }}
    >
      {/* Left friction-color bar */}
      <div className="shrink-0 w-1.5" style={{ backgroundColor: FRICTION_BAR[tile.friction_type] }} />

      {/* Star for crux moment */}
      <div className="shrink-0 w-8 flex items-center justify-center" style={{ borderRight: '1px solid var(--color-bridging-bg)' }}>
        {isCrux ? (
          <span className="text-[14px]" style={{ color: CRUX_ACCENT }}>★</span>
        ) : (
          <span className="text-[12px] text-ink-faint">·</span>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 px-3 py-2.5">
        <p className="text-[0.78rem] font-bold text-ink leading-tight tracking-tight mb-1">{obs}</p>
        <p className="text-[0.85rem] font-semibold text-ink leading-tight tracking-tight">{move}</p>
      </div>

      {/* MLR badge on right */}
      {tile.mlr && (
        <div
          className="shrink-0 px-2 flex items-center"
          style={{ backgroundColor: 'var(--color-developing-bg)', borderLeft: '1px solid var(--color-developing-border)' }}
        >
          <span className="text-[10px] font-bold" style={{ color: 'var(--color-developing-text)' }}>
            MLR {tile.mlr.number}
          </span>
        </div>
      )}
    </div>
  );
}

function InClassLegend({ entries }: { entries: WristbandLegendEntry[] }) {
  return (
    <section className="rounded-xl bg-white border" style={{ borderColor: 'var(--color-line)' }}>
      <div className="px-3 py-2 border-b" style={{ backgroundColor: 'var(--color-developing-bg)', borderColor: 'var(--color-developing-border)' }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--color-developing-text)' }}>
          MLR Quick Cues
        </p>
      </div>
      <ul className="divide-y" style={{ borderColor: 'var(--color-line)' }}>
        {entries.map((entry, i) => (
          <li key={i} className="px-3 py-2 flex items-baseline gap-2">
            <span
              className="text-[10px] font-bold shrink-0 inline-flex items-center justify-center rounded-full px-1.5 py-0.5"
              style={{ backgroundColor: 'var(--color-developing-bg)', color: 'var(--color-developing-text)' }}
            >
              MLR {entry.mlr.number}
            </span>
            <span className="text-[0.8rem] font-medium text-ink leading-snug">{entry.one_line_cue}</span>
          </li>
        ))}
      </ul>
      <p className="text-center text-[9px] text-ink-faint italic py-1.5 border-t" style={{ borderColor: 'var(--color-line)' }}>
        {MLRS[1].name.length > 0 ? 'Tap a chip in Plan view for the full routine.' : ''}
      </p>
    </section>
  );
}

// ---------------- helpers ----------------

function stripSwbatPrefix(s: string): string {
  const trimmed = s.replace(/^\s*Students\s+(?:can|will be able to)\s+/i, '').trim();
  if (!trimmed) return s;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function firstSentence(text: string): string {
  const trimmed = text.trim();
  const idx = trimmed.search(/[.!?]\s/);
  return idx > 0 ? trimmed.slice(0, idx).toUpperCase() : trimmed.toUpperCase();
}

function timeWindows(activities: Activity[]): { start: number; end: number }[] {
  let cumulative = 0;
  return activities.map((a) => {
    const match = a.duration.match(/(\d+)/);
    const minutes = match ? parseInt(match[1], 10) : 0;
    const start = cumulative;
    cumulative += minutes;
    return { start, end: cumulative };
  });
}

function formatWindow(
  window: { start: number; end: number } | undefined,
  fallback: string,
): string {
  if (!window || window.end === window.start) return fallback;
  return `${window.start}–${window.end} min`;
}

// ---------------- print stylesheet (plan view only) ----------------

const planPrintStyles = `
  @media print {
    @page { size: letter; margin: 0.35in; }
    html, body { background: white !important; color: black !important; font-size: 9pt !important; }
    nav, .print\\:hidden, [class*="fixed"], [class*="sticky"] { display: none !important; }
    .quickread-root { padding: 0 !important; }
    main { padding: 0 !important; max-width: 100% !important; }
    .quickread-inclass { display: none !important; }
    .quickread-root section, .quickread-root header, .quickread-root .rounded-xl, .quickread-root .rounded-2xl, .quickread-root .rounded-lg {
      break-inside: avoid; page-break-inside: avoid; box-shadow: none !important; border-radius: 4px !important;
    }
    .quickread-root header { margin-bottom: 8pt !important; border-left-width: 3px !important; }
    .quickread-root header > div { padding: 6pt 12pt !important; }
    .quickread-root header > div:first-child p:first-child { font-size: 7pt !important; margin: 0 0 2pt 0 !important; }
    .quickread-root header > div:first-child p:last-child { font-size: 11pt !important; line-height: 1.3 !important; margin: 0 !important; }
    .quickread-root header > div:last-child { padding: 3pt 12pt !important; }
    .quickread-root header > div:last-child p:first-child { font-size: 6.5pt !important; margin: 0 !important; }
    .quickread-root header > div:last-child p:last-child { font-size: 7.5pt !important; line-height: 1.3 !important; margin: 1pt 0 0 0 !important; }
    .qr-print-hide { display: none !important; }
    .qr-preflight { margin-bottom: 6pt !important; padding-left: 8pt !important; }
    .qr-preflight > p:first-child { font-size: 7pt !important; margin-bottom: 3pt !important; }
    .qr-preflight ul { padding-left: 0 !important; }
    .qr-preflight ul li { font-size: 7.5pt !important; line-height: 1.3 !important; margin-bottom: 1.5pt !important; gap: 4pt !important; }
    .qr-preflight ul li:last-child { margin-bottom: 0 !important; }
    .qr-preflight ul li span:first-child { font-size: 9pt !important; line-height: 1 !important; }
    .qr-activities { display: flex !important; flex-direction: column !important; gap: 5pt !important; margin-bottom: 6pt !important; }
    .qr-activity { border-width: 1px !important; }
    .qr-activity-header { padding: 4pt 8pt !important; }
    .qr-activity-header > div { gap: 5pt !important; margin-bottom: 0 !important; }
    .qr-activity-header > div + div { margin-top: 1pt !important; }
    .qr-activity-header > div:first-child > span:first-child { font-size: 7pt !important; }
    .qr-activity-header > div:first-child > span:last-child { font-size: 6.5pt !important; padding: 1pt 4pt !important; }
    .qr-activity-header h2 { font-size: 9.5pt !important; line-height: 1.2 !important; margin: 0 !important; }
    .qr-activity-header > div:last-child > span { font-size: 6.5pt !important; }
    .qr-activity-target { padding: 3pt 8pt !important; border-bottom: 1px solid var(--color-line) !important; }
    .qr-activity-target p:first-child { font-size: 6.5pt !important; line-height: 1.1 !important; margin: 0 !important; }
    .qr-activity-target p:last-child { font-size: 7.5pt !important; line-height: 1.25 !important; margin: 1pt 0 0 !important; }
    .qr-activity-tilegrid { padding: 4pt 5pt !important; gap: 4pt !important; flex-direction: row !important; }
    .qr-tile { padding: 0 !important; border-width: 1px !important; flex: 1 1 0 !important; position: relative !important; box-shadow: none !important; }
    .qr-tile > div { padding: 4pt 6pt !important; }
    .qr-tile > div > * + * { margin-top: 4pt !important; }
    .qr-tile-section p:first-child { font-size: 6.5pt !important; line-height: 1.1 !important; margin-bottom: 1pt !important; }
    .qr-tile-section p { font-size: 7.5pt !important; line-height: 1.3 !important; margin: 0 !important; }
    .qr-tile-section div { gap: 3pt !important; }
    .qr-tile-section span { font-size: 6.5pt !important; padding: 1pt 4pt !important; }
    .qr-tile-crux-header { padding: 2pt 6pt !important; }
    .qr-tile-crux-header p { font-size: 7pt !important; line-height: 1.2 !important; margin: 0 !important; }
    .qr-tile .qr-tile-avoid { font-size: 6.5pt !important; line-height: 1.25 !important; margin-top: 2pt !important; }
    .qr-legend > div:first-child { padding: 3pt 8pt !important; }
    .qr-legend > div:first-child p { font-size: 7pt !important; margin: 0 !important; }
    .qr-legend ul { display: flex !important; flex-direction: row !important; border-top: none !important; }
    .qr-legend ul li { flex: 1 !important; padding: 4pt 8pt !important; border-right: 1px solid var(--color-line) !important; font-size: 8pt !important; line-height: 1.3 !important; align-items: flex-start !important; flex-direction: column !important; gap: 2pt !important; }
    .qr-legend ul li:last-child { border-right: none !important; }
    .qr-activities button[aria-label*="About MLR"] span:last-child,
    .qr-legend button[aria-label*="About MLR"] span:last-child { display: none !important; }
    button[aria-label*="About MLR"] { padding: 1pt 4pt !important; font-size: 7pt !important; cursor: default !important; }
  }
`;
