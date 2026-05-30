'use client';

import Link from 'next/link';
import { LessonData } from '@/lib/types';
import { ToolId } from '@/app/lesson/page';

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
}

export default function LessonHeader({ lesson, activeTool, compact }: LessonHeaderProps) {
  const { meta } = lesson;

  if (compact) {
    return (
      <div className="py-3 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="text-[0.75rem] font-medium text-ink-muted hover:text-ink transition-colors truncate"
        >
          ← {meta.grade} · {meta.lesson_number}
        </Link>
        <p className="text-[0.75rem] font-semibold text-ink shrink-0">{TOOL_NAMES[activeTool]}</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
          {meta.grade} · {meta.unit} · {meta.lesson_number}
        </p>
        <Link
          href="/"
          className="text-[0.75rem] font-medium text-ink-muted hover:text-ink transition-colors shrink-0"
        >
          ← Upload a different lesson
        </Link>
      </div>
      <p
        className="mt-1 text-[1.1rem] text-ink leading-snug"
        style={{ fontFamily: 'var(--font-dm-serif), serif' }}
      >
        {meta.lesson_title}
      </p>
    </div>
  );
}
