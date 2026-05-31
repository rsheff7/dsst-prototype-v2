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
          <div className="qr-print-hide flex items-baseline justify-between gap-3 mb-2 flex-wrap">
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

      {/* Activity rows — each activity is a horizontal row */}
      <div className="qr-activities flex flex-col gap-3 mb-5">
        {wb.activities.map((wba) => {
          const activity = activityById[wba.activity_id];
          if (!activity) return null;
          return (
            <section
              key={wba.activity_id}
              className="qr-activity rounded-2xl border bg-card shadow-sm overflow-hidden flex flex-col md:flex-row"
              style={{ borderColor: activity.is_crux ? QR_ACCENT : '#E6E4DE', borderWidth: activity.is_crux ? 2 : 1 }}
            >
              {/* Left rail: identity of the activity */}
              <div
                className="qr-activity-rail shrink-0 md:w-48 px-4 py-3 border-b md:border-b-0 md:border-r flex md:flex-col items-baseline md:items-start justify-between md:justify-start gap-2"
                style={{ borderColor: '#E6E4DE', backgroundColor: '#FAFAF7' }}
              >
                <div className="min-w-0 flex-1 md:flex-none">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p
                      className="text-[10px] font-semibold uppercase tracking-[0.1em]"
                      style={{ color: QR_ACCENT }}
                    >
                      {activitySlot(activity.title)}
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
                  <p className="text-[11px] text-ink-faint">{activity.duration}</p>
                </div>
              </div>

              {/* Moment tiles flow horizontally to the right */}
              <div className="qr-activity-tiles flex-1 px-3 py-3 flex flex-col md:flex-row gap-2">
                {wba.tiles.map((tile, i) => {
                  const pill = FRICTION_PILL[tile.friction_type];
                  return (
                    <div
                      key={i}
                      className="qr-tile flex-1 rounded-lg border px-3 py-2.5"
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
      <div className="qr-strips grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
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

      {/* Print stylesheet — optimized to fit one letter-size page */}
      <style jsx global>{`
        @media print {
          @page {
            size: letter;
            margin: 0.35in;
          }
          html, body {
            background: white !important;
            color: black !important;
            font-size: 9pt !important;
          }
          nav, .print\\:hidden, [class*="fixed"], [class*="sticky"] {
            display: none !important;
          }
          .quickread-root {
            padding: 0 !important;
          }
          main {
            padding: 0 !important;
            max-width: 100% !important;
          }
          .quickread-root section,
          .quickread-root header,
          .quickread-root .rounded-xl,
          .quickread-root .rounded-2xl,
          .quickread-root .rounded-lg {
            break-inside: avoid;
            page-break-inside: avoid;
            box-shadow: none !important;
            border-radius: 4px !important;
          }

          /* Tighten the outer header tile */
          .quickread-root header {
            margin-bottom: 6pt !important;
            border-left-width: 2px !important;
          }
          .quickread-root header > div {
            padding: 5pt 10pt !important;
          }
          .quickread-root header h1 {
            font-size: 12pt !important;
            line-height: 1.2 !important;
            margin-bottom: 2pt !important;
          }
          .quickread-root header p {
            font-size: 8.5pt !important;
            line-height: 1.3 !important;
            margin: 0 !important;
          }
          .quickread-root .qr-destination {
            margin-top: 3pt !important;
            padding-top: 3pt !important;
          }
          .quickread-root .qr-destination p:first-child {
            font-size: 7pt !important;
            margin-bottom: 1pt !important;
          }
          .quickread-root .qr-destination p:last-child {
            font-size: 8pt !important;
          }
          .qr-print-hide {
            display: none !important;
          }

          /* Activity rows — flow horizontally on print */
          .qr-activities {
            display: flex !important;
            flex-direction: column !important;
            gap: 5pt !important;
            margin-bottom: 6pt !important;
          }
          .qr-activity {
            flex-direction: row !important;
            border-width: 1px !important;
          }
          .qr-activity-rail {
            width: 1.5in !important;
            padding: 5pt 8pt !important;
            border-bottom: none !important;
            border-right: 1px solid #E6E4DE !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .qr-activity-rail p {
            font-size: 7.5pt !important;
            line-height: 1.2 !important;
            margin: 0 !important;
          }
          .qr-activity-rail h2 {
            font-size: 9pt !important;
            line-height: 1.2 !important;
            margin: 1pt 0 1pt !important;
          }
          .qr-activity-rail span {
            font-size: 6.5pt !important;
            padding: 1pt 4pt !important;
          }
          .qr-activity-tiles {
            padding: 4pt 5pt !important;
            gap: 4pt !important;
            flex-direction: row !important;
          }
          .qr-tile {
            padding: 4pt 5pt !important;
            border-width: 1px !important;
            flex: 1 1 0 !important;
          }
          .qr-tile > div {
            margin-bottom: 2pt !important;
            gap: 3pt !important;
          }
          .qr-tile p {
            font-size: 7.5pt !important;
            line-height: 1.25 !important;
            margin: 0 !important;
          }
          .qr-tile p + p {
            margin-top: 2pt !important;
          }
          .qr-tile span {
            font-size: 6.5pt !important;
            padding: 1pt 4pt !important;
          }

          /* Signals + frictions strips, compact */
          .qr-strips {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 6pt !important;
            margin-bottom: 8pt !important;
          }
          .qr-strips > div > div:first-child {
            padding: 3pt 8pt !important;
          }
          .qr-strips > div > div:first-child p {
            font-size: 7pt !important;
            margin: 0 !important;
          }
          .qr-strips ul {
            padding: 4pt 8pt !important;
          }
          .qr-strips ul li {
            font-size: 8pt !important;
            line-height: 1.3 !important;
            margin-bottom: 2pt !important;
          }

          /* MLR legend — single row */
          .qr-legend > div:first-child {
            padding: 3pt 8pt !important;
          }
          .qr-legend > div:first-child p {
            font-size: 7pt !important;
            margin: 0 !important;
          }
          .qr-legend ul {
            display: flex !important;
            flex-direction: row !important;
            divide: none !important;
            border-top: none !important;
          }
          .qr-legend ul li {
            flex: 1 !important;
            padding: 4pt 8pt !important;
            border-right: 1px solid #E6E4DE !important;
            font-size: 8pt !important;
            line-height: 1.3 !important;
            align-items: flex-start !important;
            flex-direction: column !important;
            gap: 2pt !important;
          }
          .qr-legend ul li:last-child {
            border-right: none !important;
          }

          /* Chip i indicator off */
          .qr-activities button[aria-label*="About MLR"] span:last-child,
          .qr-strips button[aria-label*="About MLR"] span:last-child,
          .qr-legend button[aria-label*="About MLR"] span:last-child {
            display: none !important;
          }
          button[aria-label*="About MLR"] {
            padding: 1pt 4pt !important;
            font-size: 7pt !important;
            cursor: default !important;
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
