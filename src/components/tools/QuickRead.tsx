'use client';

import { useState } from 'react';
import { LessonData, WristbandTile, WristbandActivity, WristbandLegendEntry, Activity } from '@/lib/types';
import { MLRS } from '@/lib/mlrs';
import MlrChip from '@/components/shared/MlrChip';
import ToolInfo from '@/components/shared/ToolInfo';
import { activitySlot, activityHeading, activityShortLabel } from '@/lib/activityLabel';

const FRICTION_PILL: Record<WristbandTile['friction_type'], { bg: string; text: string; label: string }> = {
  math: { bg: '#F1EFE8', text: '#444441', label: 'Math' },
  language: { bg: '#E1F5EE', text: '#085041', label: 'Language' },
  'language-math': { bg: '#EEEDFE', text: '#26215C', label: 'Lang + math' },
};

const FRICTION_BAR: Record<WristbandTile['friction_type'], string> = {
  math: '#854F0B',
  language: '#085041',
  'language-math': '#534AB7',
};

const QR_ACCENT = '#006C57';
const CRUX_ACCENT = '#9F2F1A';

interface Props {
  lesson: LessonData;
}

type Mode = 'plan' | 'inclass';

export default function QuickRead({ lesson }: Props) {
  const [mode, setMode] = useState<Mode>('plan');
  const wb = lesson.wristband;
  const activityById = Object.fromEntries(lesson.activities.map((a) => [a.id, a]));
  const windows = timeWindows(lesson.activities);
  const windowById: Record<string, { start: number; end: number }> = Object.fromEntries(
    lesson.activities.map((a, i) => [a.id, windows[i]]),
  );

  return (
    <div className={`pt-6 pb-12 quickread-root quickread-${mode}`}>
      <ToolInfo toolId="quickread" />
      <div className="h-4 qr-print-hide" />
      {/* Header tile */}
      <header
        className="rounded-2xl border bg-card shadow-sm overflow-hidden border-l-[4px] mb-5"
        style={{ borderLeftColor: QR_ACCENT, borderColor: '#E6E4DE' }}
      >
        <div className="px-6 py-5">
          <div className="qr-print-hide flex items-baseline justify-end gap-3 mb-2 flex-wrap">
            <p className="text-[10px] font-medium text-ink-faint">
              {lesson.meta.grade} · {lesson.meta.unit} · {lesson.meta.lesson_number} · {lesson.meta.total_time}
            </p>
          </div>
          <h1
            className="text-[1.25rem] text-ink leading-tight mb-2"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            {lesson.meta.lesson_title}
          </h1>
          {wb.arc_one_line && (
            <p
              className="text-[1rem] text-ink leading-[1.5] mb-3"
              style={{ fontFamily: 'var(--font-dm-serif), serif' }}
            >
              {wb.arc_one_line}
            </p>
          )}
          {lesson.destination && (
            <div className="qr-destination mt-2 pt-3 border-t" style={{ borderColor: '#E6E4DE' }}>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-1"
                style={{ color: QR_ACCENT }}
              >
                By the end, students can
              </p>
              <p className="text-[0.875rem] text-ink leading-[1.55]">{lesson.destination}</p>
            </div>
          )}
        </div>
        <div
          className="print:hidden border-t bg-surface px-4 py-2 flex items-center justify-between gap-3 flex-wrap"
          style={{ borderColor: '#E6E4DE' }}
        >
          <ModeToggle mode={mode} onChange={setMode} />
          {mode === 'plan' && (
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full px-3 py-1 text-[11px] font-semibold cursor-pointer hover:opacity-85 transition-opacity"
              style={{ backgroundColor: QR_ACCENT, color: '#FFFFFF' }}
            >
              Print
            </button>
          )}
          {mode === 'inclass' && (
            <p className="text-[10px] text-ink-faint">For your phone, mid-lesson.</p>
          )}
        </div>
      </header>

      {mode === 'plan' && <PlanView wb={wb} activityById={activityById} windowById={windowById} />}
      {mode === 'inclass' && <InClassView wb={wb} activityById={activityById} windowById={windowById} />}

      <style jsx global>{planPrintStyles}</style>
    </div>
  );
}

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="inline-flex rounded-full border" style={{ borderColor: '#E6E4DE' }}>
      <button
        type="button"
        onClick={() => onChange('plan')}
        className="px-3 py-1 text-[11px] font-semibold rounded-full cursor-pointer transition-colors focus-visible:outline-none"
        style={mode === 'plan' ? { backgroundColor: QR_ACCENT, color: 'white' } : { color: '#706E69' }}
      >
        Plan view
      </button>
      <button
        type="button"
        onClick={() => onChange('inclass')}
        className="px-3 py-1 text-[11px] font-semibold rounded-full cursor-pointer transition-colors focus-visible:outline-none"
        style={mode === 'inclass' ? { backgroundColor: QR_ACCENT, color: 'white' } : { color: '#706E69' }}
      >
        In class
      </button>
    </div>
  );
}

// ---------------- PLAN VIEW ----------------

function PlanView({
  wb,
  activityById,
  windowById,
}: {
  wb: LessonData['wristband'];
  activityById: Record<string, Activity>;
  windowById: Record<string, { start: number; end: number }>;
}) {
  return (
    <>
      {wb.preflight.length > 0 && (
        <section className="qr-preflight rounded-2xl border bg-card overflow-hidden mb-5" style={{ borderColor: '#E6E4DE' }}>
          <div className="px-4 py-2 border-b" style={{ backgroundColor: '#FAEEDA', borderColor: '#E8C68A' }}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#633806' }}>
              Before you begin
            </p>
          </div>
          <ul className="px-4 py-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
            {wb.preflight.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[0.8rem] text-ink leading-snug">
                <span
                  className="mt-[2px] shrink-0 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: '#FAEEDA', color: '#633806' }}
                >
                  {i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="qr-activities flex flex-col gap-3 mb-5">
        {wb.activities.map((wba) => (
          <PlanActivityRow
            key={wba.activity_id}
            wba={wba}
            activity={activityById[wba.activity_id]}
            window={windowById[wba.activity_id]}
          />
        ))}
      </div>

      {wb.mlr_legend.length > 0 && (
        <div className="qr-legend rounded-xl border bg-card overflow-hidden" style={{ borderColor: '#E6E4DE' }}>
          <div className="px-4 py-2 border-b" style={{ backgroundColor: '#EEEDFE', borderColor: '#AFA9EC' }}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#26215C' }}>
              The routines this lesson runs on
            </p>
          </div>
          <ul className="divide-y" style={{ borderColor: '#E6E4DE' }}>
            {wb.mlr_legend.map((entry, i) => (
              <li key={i} className="px-4 py-2.5 flex items-center gap-3 flex-wrap">
                <MlrChip mlr={entry.mlr} />
                <span className="text-[0.8rem] text-ink-muted leading-snug">{entry.one_line_cue}</span>
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
  return (
    <section
      className="qr-activity rounded-2xl border bg-card shadow-sm overflow-hidden flex flex-col md:flex-row"
      style={{ borderColor: activity.is_crux ? QR_ACCENT : '#E6E4DE', borderWidth: activity.is_crux ? 2 : 1 }}
    >
      <div
        className="qr-activity-rail shrink-0 md:w-52 px-4 py-3 border-b md:border-b-0 md:border-r"
        style={{ borderColor: '#E6E4DE', backgroundColor: '#FAFAF7' }}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: QR_ACCENT }}>
              {activityShortLabel(activity)}
            </p>
            {activity.is_crux && (
              <span
                className="text-[9px] font-bold uppercase tracking-[0.1em] text-white px-2 py-0.5 rounded-full"
                style={{ backgroundColor: QR_ACCENT }}
              >
                Crux
              </span>
            )}
          </div>
          <h2
            className="text-[0.9rem] leading-tight text-ink mb-1"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            {activityHeading(activity.title)}
          </h2>
          <p className="text-[11px] text-ink-faint">{formatWindow(window, activity.duration)}</p>
        </div>
      </div>

      <div className="qr-activity-tiles flex-1 flex flex-col">
        {activity.learning_target && (
          <div
            className="qr-activity-target px-3 py-2 border-b"
            style={{ borderColor: '#E6E4DE', backgroundColor: '#F4F9F7' }}
          >
            <p
              className="text-[9px] font-semibold uppercase tracking-[0.1em] mb-0.5"
              style={{ color: QR_ACCENT }}
            >
              By the end, students can
            </p>
            <p className="text-[0.78rem] text-ink leading-snug">{activity.learning_target}</p>
          </div>
        )}
        <div className="qr-activity-tilegrid px-3 py-3 flex flex-col md:flex-row gap-2 flex-1">
          {wba.tiles.map((tile, i) => (
            <PlanTile key={i} tile={tile} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlanTile({ tile }: { tile: WristbandTile }) {
  const pill = FRICTION_PILL[tile.friction_type];
  const isCrux = tile.is_crux_moment;
  return (
    <div
      className="qr-tile flex-1 rounded-lg border px-3 py-2.5 relative"
      style={{
        borderColor: isCrux ? CRUX_ACCENT : '#E6E4DE',
        borderWidth: isCrux ? 2 : 1,
        backgroundColor: isCrux ? '#FFF8F4' : '#FFFFFF',
      }}
    >
      {isCrux && (
        <div className="absolute -top-2 left-3 px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-[0.1em] text-white" style={{ backgroundColor: CRUX_ACCENT }}>
          Crux moment
        </div>
      )}

      {/* NOTICE */}
      <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-0.5">Notice</p>
      <p className="text-[0.78rem] font-medium text-ink leading-snug mb-1.5">{tile.observation_short}</p>

      {/* SORT */}
      <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-1">Sort</p>
      <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
        <span
          className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold"
          style={{ backgroundColor: pill.bg, color: pill.text }}
        >
          {pill.label}
        </span>
        {tile.has_proficiency_variants && (
          <span
            className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold"
            style={{ backgroundColor: '#EEEDFE', color: '#26215C' }}
            title="Response differs across Entering / Developing / Bridging — see Moves"
          >
            3 levels
          </span>
        )}
      </div>

      {/* RESPOND */}
      <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-1">Respond</p>
      <div className="flex items-start gap-1.5 flex-wrap">
        {tile.mlr && <MlrChip mlr={tile.mlr} showName={false} />}
        <p className="text-[0.75rem] text-ink-muted leading-snug flex-1 min-w-0">{tile.move_short}</p>
      </div>
      {tile.avoid_short && (
        <p className="qr-tile-avoid mt-1.5 text-[0.7rem] leading-snug italic" style={{ color: '#712B13' }}>
          <span className="font-semibold not-italic">Avoid:</span> {tile.avoid_short}
        </p>
      )}
    </div>
  );
}

// ---------------- IN-CLASS VIEW ----------------

function InClassView({
  wb,
  activityById,
  windowById,
}: {
  wb: LessonData['wristband'];
  activityById: Record<string, Activity>;
  windowById: Record<string, { start: number; end: number }>;
}) {
  return (
    <div className="space-y-3 max-w-md mx-auto">
      {wb.activities.map((wba) => (
        <InClassActivityBlock
          key={wba.activity_id}
          wba={wba}
          activity={activityById[wba.activity_id]}
          window={windowById[wba.activity_id]}
        />
      ))}
      {wb.mlr_legend.length > 0 && <InClassLegend entries={wb.mlr_legend} />}
    </div>
  );
}

function InClassActivityBlock({
  wba,
  activity,
  window,
}: {
  wba: WristbandActivity;
  activity: Activity | undefined;
  window: { start: number; end: number } | undefined;
}) {
  if (!activity) return null;
  return (
    <section className="rounded-xl overflow-hidden" style={{ backgroundColor: '#1A1916' }}>
      <div className="px-4 py-2 flex items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-2 flex-wrap min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white">
            {activityShortLabel(activity)}
          </span>
          <span className="text-[10px] text-white opacity-60">
            {formatWindow(window, activity.duration)}
          </span>
        </div>
        {activity.is_crux && (
          <span
            className="text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full"
            style={{ backgroundColor: '#FFFFFF', color: '#1A1916' }}
          >
            Crux
          </span>
        )}
      </div>
      <div className="bg-white">
        {wba.tiles.map((tile, i) => (
          <InClassTile key={i} tile={tile} />
        ))}
      </div>
    </section>
  );
}

function InClassTile({ tile }: { tile: WristbandTile }) {
  const isCrux = tile.is_crux_moment;
  const obs = tile.glyph_observation || tile.observation_short.toUpperCase();
  const move = tile.glyph_move || firstSentence(tile.move_short);
  return (
    <div
      className="flex items-stretch border-t"
      style={{ borderColor: '#E6E4DE', backgroundColor: isCrux ? '#FFF8F4' : undefined }}
    >
      {/* Left friction-color bar */}
      <div className="shrink-0 w-1.5" style={{ backgroundColor: FRICTION_BAR[tile.friction_type] }} />

      {/* Star for crux moment */}
      <div className="shrink-0 w-8 flex items-center justify-center" style={{ borderRight: '1px solid #F1EFE8' }}>
        {isCrux ? (
          <span className="text-[14px]" style={{ color: CRUX_ACCENT }}>★</span>
        ) : tile.has_proficiency_variants ? (
          <span className="text-[10px] font-bold" style={{ color: '#534AB7' }}>3↕</span>
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
          style={{ backgroundColor: '#EEEDFE', borderLeft: '1px solid #AFA9EC' }}
        >
          <span className="text-[10px] font-bold" style={{ color: '#26215C' }}>
            MLR {tile.mlr.number}
          </span>
        </div>
      )}
    </div>
  );
}

function InClassLegend({ entries }: { entries: WristbandLegendEntry[] }) {
  return (
    <section className="rounded-xl bg-white border" style={{ borderColor: '#E6E4DE' }}>
      <div className="px-3 py-2 border-b" style={{ backgroundColor: '#EEEDFE', borderColor: '#AFA9EC' }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: '#26215C' }}>
          MLR Quick Cues
        </p>
      </div>
      <ul className="divide-y" style={{ borderColor: '#E6E4DE' }}>
        {entries.map((entry, i) => (
          <li key={i} className="px-3 py-2 flex items-baseline gap-2">
            <span
              className="text-[10px] font-bold shrink-0 inline-flex items-center justify-center rounded-full px-1.5 py-0.5"
              style={{ backgroundColor: '#EEEDFE', color: '#26215C' }}
            >
              MLR {entry.mlr.number}
            </span>
            <span className="text-[0.8rem] font-medium text-ink leading-snug">{entry.one_line_cue}</span>
          </li>
        ))}
      </ul>
      <p className="text-center text-[9px] text-ink-faint italic py-1.5 border-t" style={{ borderColor: '#E6E4DE' }}>
        {MLRS[1].name.length > 0 ? 'Tap a chip in Plan view for the full routine.' : ''}
      </p>
    </section>
  );
}

// ---------------- helpers ----------------

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
    .quickread-root header { margin-bottom: 6pt !important; border-left-width: 2px !important; }
    .quickread-root header > div { padding: 5pt 10pt !important; }
    .quickread-root header h1 { font-size: 12pt !important; line-height: 1.2 !important; margin-bottom: 2pt !important; }
    .quickread-root header p { font-size: 8.5pt !important; line-height: 1.3 !important; margin: 0 !important; }
    .quickread-root .qr-destination { margin-top: 3pt !important; padding-top: 3pt !important; }
    .quickread-root .qr-destination p:first-child { font-size: 7pt !important; margin-bottom: 1pt !important; }
    .quickread-root .qr-destination p:last-child { font-size: 8pt !important; }
    .qr-print-hide { display: none !important; }
    .qr-preflight { margin-bottom: 6pt !important; }
    .qr-preflight > div:first-child { padding: 3pt 8pt !important; }
    .qr-preflight > div:first-child p { font-size: 7pt !important; margin: 0 !important; }
    .qr-preflight ul { padding: 4pt 8pt !important; gap: 1pt 8pt !important; }
    .qr-preflight ul li { font-size: 7.5pt !important; line-height: 1.3 !important; }
    .qr-activities { display: flex !important; flex-direction: column !important; gap: 5pt !important; margin-bottom: 6pt !important; }
    .qr-activity { flex-direction: row !important; border-width: 1px !important; }
    .qr-activity-rail { width: 1.5in !important; padding: 5pt 8pt !important; border-bottom: none !important; border-right: 1px solid #E6E4DE !important; flex-direction: column !important; align-items: flex-start !important; }
    .qr-activity-rail p { font-size: 7.5pt !important; line-height: 1.2 !important; margin: 0 !important; }
    .qr-activity-rail h2 { font-size: 9pt !important; line-height: 1.2 !important; margin: 1pt 0 1pt !important; }
    .qr-activity-rail span { font-size: 6.5pt !important; padding: 1pt 4pt !important; }
    .qr-activity-tiles { flex-direction: column !important; padding: 0 !important; gap: 0 !important; }
    .qr-activity-target { padding: 3pt 8pt !important; border-bottom: 1px solid #E6E4DE !important; background: #F4F9F7 !important; }
    .qr-activity-target p:first-child { font-size: 6.5pt !important; line-height: 1.1 !important; margin: 0 !important; }
    .qr-activity-target p:last-child { font-size: 7.5pt !important; line-height: 1.25 !important; margin: 1pt 0 0 !important; }
    .qr-activity-tilegrid { padding: 4pt 5pt !important; gap: 4pt !important; flex-direction: row !important; }
    .qr-tile { padding: 4pt 5pt !important; border-width: 1px !important; flex: 1 1 0 !important; position: relative !important; }
    .qr-tile > p { font-size: 6.5pt !important; line-height: 1.2 !important; margin: 0 !important; }
    .qr-tile > p[class*="font-medium"] { font-size: 7.5pt !important; margin-top: 1pt !important; margin-bottom: 2pt !important; }
    .qr-tile > p[class*="text-ink-muted"] { font-size: 7pt !important; margin-top: 1pt !important; }
    .qr-tile > div { margin-bottom: 2pt !important; gap: 3pt !important; }
    .qr-tile span { font-size: 6.5pt !important; padding: 1pt 4pt !important; }
    .qr-tile div[class*="absolute"] { font-size: 6pt !important; padding: 1pt 4pt !important; top: -6pt !important; }
    .qr-tile .qr-tile-avoid { font-size: 6.5pt !important; line-height: 1.25 !important; margin-top: 2pt !important; }
    .qr-legend > div:first-child { padding: 3pt 8pt !important; }
    .qr-legend > div:first-child p { font-size: 7pt !important; margin: 0 !important; }
    .qr-legend ul { display: flex !important; flex-direction: row !important; border-top: none !important; }
    .qr-legend ul li { flex: 1 !important; padding: 4pt 8pt !important; border-right: 1px solid #E6E4DE !important; font-size: 8pt !important; line-height: 1.3 !important; align-items: flex-start !important; flex-direction: column !important; gap: 2pt !important; }
    .qr-legend ul li:last-child { border-right: none !important; }
    .qr-activities button[aria-label*="About MLR"] span:last-child,
    .qr-legend button[aria-label*="About MLR"] span:last-child { display: none !important; }
    button[aria-label*="About MLR"] { padding: 1pt 4pt !important; font-size: 7pt !important; cursor: default !important; }
  }
`;
