'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import ExportIcon from '@/components/icons/ExportIcon';
import ImportIcon from '@/components/icons/ImportIcon';
import { LessonData, ToolId } from '@/lib/types';

const TOOL_NAMES: Record<ToolId, string> = {
  quickread: 'Prep Sheet',
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

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
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-ink-faint shrink-0">
            {meta.grade} · {meta.unit} · {meta.lesson_number}
          </p>
          <p
            className="text-[1.1rem] text-ink leading-snug truncate"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            {meta.lesson_title}
          </p>
        </div>
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center w-7 h-7 rounded-full border transition-colors cursor-pointer hover:bg-black/5"
            style={{ borderColor: 'var(--color-line)', color: 'var(--color-ink-muted)' }}
            aria-expanded={menuOpen}
            aria-label="Menu"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="2" y1="4" x2="12" y2="4" />
              <line x1="2" y1="7" x2="12" y2="7" />
              <line x1="2" y1="10" x2="12" y2="10" />
            </svg>
          </button>

          {menuOpen && (
            <div
              className="absolute top-full right-0 mt-1 rounded-lg shadow-lg border py-1 min-w-[180px] z-50"
              style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-line)' }}
            >
              {onSavePlan && (
                <button
                  type="button"
                  onClick={() => { onSavePlan(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-[0.75rem] font-medium cursor-pointer hover:bg-black/5 transition-colors"
                  style={{ color: 'var(--color-ink-muted)' }}
                >
                  <ExportIcon className="w-3.5 h-3.5" />
                  Export to file
                </button>
              )}
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-left text-[0.75rem] font-medium transition-colors hover:bg-black/5"
                style={{ color: 'var(--color-ink-muted)' }}
              >
                <ImportIcon className="w-3.5 h-3.5" />
                Upload a different lesson
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


