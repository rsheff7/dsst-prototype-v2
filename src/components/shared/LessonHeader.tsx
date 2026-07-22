'use client';

import Link from 'next/link';
import ExportIcon from '@/components/icons/ExportIcon';
import ImportIcon from '@/components/icons/ImportIcon';
import { LessonData, ToolId } from '@/lib/types';
import { useLesson } from '@/lib/lessonContext';
import { WIDA_LABELS, WIDA_LEVELS, type WidaLevel } from '@/lib/eld';

const TOOL_NAMES: Record<ToolId, string> = {
  quickread: 'Quick Read',
  pathway: 'Pathway',
  adapt: 'Adapt',
  thinking: 'Thinking',
  moves: 'Moves',
};

interface LessonHeaderProps {
  lesson: LessonData;
  activeTool: ToolId;
  compact: boolean;
  onSavePlan?: () => void;
}

export default function LessonHeader({ lesson, activeTool, compact, onSavePlan }: LessonHeaderProps) {
  const { meta } = lesson;
  const hasElsfInference = lesson.elsf_inference?.activities && lesson.elsf_inference.activities.length > 0;

if (compact) {
    return (
      <div className="py-3 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
<p className="text-[0.8rem] font-bold text-gray-900 truncate">
            Lesson {meta.grade}.{meta.lesson_number}: {meta.lesson_title}
          </p>
          <p className="text-[0.75rem] font-semibold text-ink shrink-0">{TOOL_NAMES[activeTool]}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
          {meta.grade} · {meta.unit} · {meta.lesson_number}
        </p>
        <div className="flex items-center gap-3">
          {onSavePlan && (
            <button
              onClick={onSavePlan}
              className="flex items-center gap-2 px-3 py-1.5 text-[0.75rem] font-medium text-ink-muted hover:text-ink transition-colors rounded border border-ink-muted hover:border-ink"
            >
              <ExportIcon className="w-4 h-4" />
              Export to file
            </button>
          )}
          <Link
            href="/"
            className="text-[0.75rem] font-medium text-ink-muted hover:text-ink transition-colors shrink-0"
          >
            Upload a different lesson
          </Link>
        </div>
      </div>
      <p
        className="mt-1 text-[1.1rem] text-ink leading-snug"
        style={{ fontFamily: 'var(--font-dm-serif), serif' }}
      >
        {meta.lesson_title}
      </p>
      {hasElsfInference && <WidaLevelSelector />}
    </div>
  );
}

function WidaLevelSelector() {
  const { selectedWidaLevel, setSelectedWidaLevel } = useLesson();
  return (
    <div className="mt-3 flex items-center gap-2 flex-wrap">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint shrink-0">
        Show moves for a learner at
      </p>
      <div className="inline-flex rounded-full border" style={{ borderColor: '#E6E4DE' }}>
        {WIDA_LEVELS.map((level: WidaLevel) => {
          const isActive = selectedWidaLevel === level;
          return (
            <button
              key={level}
              type="button"
              onClick={() => setSelectedWidaLevel(isActive ? null : level)}
              className="px-2.5 py-1 text-[10px] font-semibold cursor-pointer transition-colors focus-visible:outline-none first:rounded-l-full last:rounded-r-full"
              style={
                isActive
                  ? { backgroundColor: '#534AB7', color: 'white' }
                  : { color: '#706E69' }
              }
              aria-pressed={isActive}
              aria-label={`WIDA level ${level}: ${WIDA_LABELS[level]}`}
            >
              {WIDA_LABELS[level]}
            </button>
          );
        })}
      </div>
      {selectedWidaLevel !== null && (
        <button
          type="button"
          onClick={() => setSelectedWidaLevel(null)}
          className="text-[10px] text-ink-faint hover:text-ink-muted cursor-pointer underline-offset-2 hover:underline"
        >
          clear
        </button>
      )}
    </div>
  );
}
