'use client';

import { useState } from 'react';
import { LessonData, WristbandActivity, WristbandTile, Activity } from '@/lib/types';
import { MLRS } from '@/lib/mlrs';

interface Props {
  lesson: LessonData;
}

type MobileTab = 'quickread' | 'pathway' | 'adapt';

export default function MobileQuickRead({ lesson }: Props) {
  const wb = lesson.wristband;
  const activityById = Object.fromEntries(lesson.activities.map((a) => [a.id, a]));

  return (
    <div className="min-h-screen bg-surface flex flex-col pb-16">
      {/* Legend for friction types */}
      {wb.activities.some((wba) => wba.tiles.some((t) => t.friction_type && (t.friction_type === 'math' || t.friction_type === 'language' || t.friction_type === 'language-math'))) && (
        <section className="mx-4 mt-4 rounded-lg bg-white border border-gray-200 shadow-sm">
          <div className="px-3 py-2 border-b border-gray-100 bg-blue-50">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#26215C]">
              Friction Types
            </p>
          </div>
          <ul className="px-3 py-2 space-y-1">
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0066cc' }} />
              <span className="text-[10px] text-gray-600">Math friction — conceptual challenge</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28a745' }} />
              <span className="text-[10px] text-gray-600">Language friction — vocabulary or expression</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff9800' }} />
              <span className="text-[10px] text-gray-600">Both math + language</span>
            </li>
          </ul>
        </section>
      )}

      {/* Activity cards */}
      <div className="flex-1 mx-4 mt-4 space-y-3">
        {wb.activities.map((wba) => (
          <ActivityCard
            key={wba.activity_id}
            wba={wba}
            activity={activityById[wba.activity_id]}
          />
        ))}
      </div>
    </div>
  );
}

function ActivityCard({
  wba,
  activity,
}: {
  wba: WristbandActivity;
  activity: Activity | undefined;
}) {
  const [expanded, setExpanded] = useState(false);

  if (!activity) return null;

  const frictionColor = getFrictionColor(wba.tiles[0]?.friction_type);

  return (
    <article className="rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden">
      {/* Activity header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#006C57] text-white"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em]">
            {activity.is_crux ? 'CRUX' : 'Activity'}
          </span>
          <span className="text-[11px] font-semibold truncate">
            {activity.title}
          </span>
        </div>
        <span className="text-[10px] opacity-90">
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {/* Activity content */}
      {expanded && (
        <div className="px-4 py-3 border-t border-gray-100">
          {/* Learning target */}
          {activity.learning_target && (
            <div className="mb-3 px-3 py-2 bg-gray-50 rounded-lg">
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-gray-500 mb-1">
                Target
              </p>
              <p className="text-[0.825rem] text-gray-700 leading-snug">
                {activity.learning_target}
              </p>
            </div>
          )}

          {/* Moments */}
          <div className="space-y-2">
            {wba.tiles.map((tile, i) => (
              <MomentTile key={i} tile={tile} />
            ))}
          </div>

          {/* Synthesis */}
          {wba.synthesis_short && (
            <div className="mt-3 px-3 py-2 bg-[#FBF3EA] border-t-2 border-[#7A3E1C]">
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: '#7A3E1C' }}>
                Close
              </p>
              <p className="text-[0.825rem] font-semibold text-gray-800 leading-tight">
                {wba.synthesis_short}
              </p>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function MomentTile({ tile }: { tile: WristbandTile }) {
  const frictionColor = getFrictionColor(tile.friction_type);
  const hasDetails = tile.avoid_short || tile.mlr;

  return (
    <div className="flex gap-3 min-h-[44px] items-start">
      {/* Friction bar */}
      <div
        className="w-1.5 rounded-sm flex-shrink-0"
        style={{ backgroundColor: frictionColor, minHeight: '24px' }}
      />

      {/* Content */}
      <div className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-gray-50">
        <p className="text-[0.875rem] font-semibold text-gray-800 mb-1">
          {tile.observation_short}
        </p>
        <p className="text-[0.825rem] font-medium text-gray-700 leading-snug">
          {tile.move_short}
        </p>

        {/* MLR badge */}
        {tile.mlr && (
          <button
            type="button"
            className="mt-2 inline-flex items-center px-2 py-1 rounded-full"
            style={{ backgroundColor: '#EEEDFE', color: '#26215C' }}
          >
            <span className="text-[9px] font-bold">MLR {tile.mlr.number}</span>
          </button>
        )}
      </div>
    </div>
  );
}

function getFrictionColor(type: WristbandTile['friction_type']): string {
  switch (type) {
    case 'math':
      return '#0066cc';
    case 'language':
      return '#28a745';
    case 'language-math':
      return '#ff9800';
    default:
      return '#e5e7eb';
  }
}