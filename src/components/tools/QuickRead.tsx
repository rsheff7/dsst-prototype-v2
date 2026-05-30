'use client';

import { LessonData, WristbandTile } from '@/lib/types';
import MlrChip from '@/components/shared/MlrChip';

const FRICTION_PILL: Record<WristbandTile['friction_type'], { bg: string; text: string; label: string }> = {
  math: { bg: '#F1EFE8', text: '#444441', label: 'Math' },
  language: { bg: '#E1F5EE', text: '#085041', label: 'Language' },
  'language-math': { bg: '#EEEDFE', text: '#26215C', label: 'Lang + math' },
};

const QR_ACCENT = '#006C57';

interface Props {
  lesson: LessonData;
}

export default function QuickRead({ lesson }: Props) {
  const wb = lesson.wristband;

  const activityById = Object.fromEntries(lesson.activities.map((a) => [a.id, a]));

  return (
    <div className="pt-6 pb-12 quickread-root">
      {/* Header tile */}
      <header
        className="rounded-2xl border bg-card shadow-sm overflow-hidden border-l-[4px] mb-5"
        style={{ borderLeftColor: QR_ACCENT, borderColor: '#E6E4DE' }}
      >
        <div className="px-6 py-5">
          <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: QR_ACCENT }}
            >
              Quick Read
            </p>
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
              className="text-[1rem] text-ink leading-[1.5]"
              style={{ fontFamily: 'var(--font-dm-serif), serif' }}
            >
              {wb.arc_one_line}
            </p>
          )}
        </div>
        <div className="hidden print:block bg-card border-t px-6 py-2" style={{ borderColor: '#E6E4DE' }}>
          <p className="text-[10px] text-ink-faint">Print this and carry it into class.</p>
        </div>
        <div className="print:hidden border-t bg-surface px-6 py-2 flex items-center justify-between" style={{ borderColor: '#E6E4DE' }}>
          <p className="text-[10px] text-ink-faint">The single sheet to carry into class.</p>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full px-3 py-1 text-[11px] font-semibold cursor-pointer hover:opacity-85 transition-opacity"
            style={{ backgroundColor: QR_ACCENT, color: '#FFFFFF' }}
          >
            Print
          </button>
        </div>
      </header>

      {/* Activity tiles — side by side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {wb.activities.map((wba) => {
          const activity = activityById[wba.activity_id];
          if (!activity) return null;
          return (
            <section
              key={wba.activity_id}
              className="rounded-2xl border bg-card shadow-sm overflow-hidden flex flex-col"
              style={{ borderColor: activity.is_crux ? QR_ACCENT : '#E6E4DE', borderWidth: activity.is_crux ? 2 : 1 }}
            >
              <div
                className="px-4 py-3 border-b flex items-baseline justify-between gap-2"
                style={{ borderColor: '#E6E4DE', backgroundColor: '#FAFAF7' }}
              >
                <div className="min-w-0">
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.1em]"
                    style={{ color: QR_ACCENT }}
                  >
                    {activitySlot(activity.title)}
                  </p>
                  <p className="text-[11px] text-ink-faint">{activity.duration}</p>
                </div>
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
                className="px-4 pt-3 pb-2 text-[0.95rem] leading-tight text-ink"
                style={{ fontFamily: 'var(--font-dm-serif), serif' }}
              >
                {activityHeading(activity.title)}
              </h2>

              <div className="px-4 pb-4 space-y-2.5 flex-1">
                {wba.tiles.map((tile, i) => {
                  const pill = FRICTION_PILL[tile.friction_type];
                  return (
                    <div
                      key={i}
                      className="rounded-lg border px-3 py-2.5"
                      style={{ borderColor: '#E6E4DE', backgroundColor: '#FFFFFF' }}
                    >
                      <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                        <span
                          className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold"
                          style={{ backgroundColor: pill.bg, color: pill.text }}
                        >
                          {pill.label}
                        </span>
                        {tile.mlr && <MlrChip mlr={tile.mlr} showName={false} />}
                      </div>
                      <p className="text-[0.78rem] font-medium text-ink leading-snug mb-1">
                        {tile.observation_short}
                      </p>
                      <p className="text-[0.75rem] text-ink-muted leading-snug">{tile.move_short}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Signals + frictions strips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="rounded-xl border bg-card overflow-hidden" style={{ borderColor: '#E6E4DE' }}>
          <div className="px-4 py-2 border-b" style={{ backgroundColor: '#EAF3DE', borderColor: '#C0DD97' }}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#27500A' }}>
              Top 3 to listen for
            </p>
          </div>
          <ul className="px-4 py-3 space-y-1.5">
            {wb.top_signals.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-[0.8rem] text-ink leading-snug">
                <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: '#27500A' }} />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border bg-card overflow-hidden" style={{ borderColor: '#E6E4DE' }}>
          <div className="px-4 py-2 border-b" style={{ backgroundColor: '#FAECE7', borderColor: '#F5C4B3' }}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#712B13' }}>
              Top 3 to watch for
            </p>
          </div>
          <ul className="px-4 py-3 space-y-1.5">
            {wb.top_frictions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-[0.8rem] text-ink leading-snug">
                <span className="mt-[5px] shrink-0 text-[#854F0B] text-[10px]">▲</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* MLR legend */}
      {wb.mlr_legend.length > 0 && (
        <div className="rounded-xl border bg-card overflow-hidden" style={{ borderColor: '#E6E4DE' }}>
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

      {/* Print stylesheet */}
      <style jsx global>{`
        @media print {
          html, body {
            background: white !important;
          }
          nav, .print\\:hidden, [class*="fixed"], [class*="sticky"] {
            display: none !important;
          }
          .quickread-root {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          main {
            padding: 0 !important;
            max-width: 100% !important;
          }
          .quickread-root section, .quickread-root header, .quickread-root .rounded-xl, .quickread-root .rounded-2xl {
            break-inside: avoid;
            page-break-inside: avoid;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function activitySlot(title: string): string {
  const match = title.match(/^(Warm-Up|Activity\s+\d+|Lesson Synthesis|Cool-Down|Synthesis)/i);
  if (match) return match[1];
  const colonIdx = title.indexOf(':');
  if (colonIdx > 0) return title.slice(0, colonIdx);
  return title;
}

function activityHeading(title: string): string {
  const colonIdx = title.indexOf(':');
  if (colonIdx > 0 && colonIdx < title.length - 1) return title.slice(colonIdx + 1).trim();
  return title;
}
