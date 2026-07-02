'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ToolId } from '@/lib/types';

const TOOL_CONTENT: Record<ToolId, {
  title: string;
  subtitle: string;
  accent: string;
  purpose: string;
  whenToUse: string;
  whatItGives: string;
}> = {
  quickread: {
    title: 'Quick Read',
    subtitle: 'The single sheet to carry into class',
    accent: '#006C57',
    purpose:
      'See the lesson the way you will need to see it during class — the moments you will notice, the routines to run, the moves to make. Scan once before class, glance during.',
    whenToUse: 'Before class — read once. During class — glance at it. Print and keep it nearby.',
    whatItGives:
      'A one-page tile view of the lesson: the arc in one line, the moments to look for in each activity (with the routine and the move attached), the top signals and frictions, and the routines this lesson runs on.',
  },
  pathway: {
    title: 'Lesson Pathway',
    subtitle: 'Plan the lesson',
    accent: '#00876C',
    purpose: 'Get oriented before you teach. See the story of the lesson — where students start, where they shift, where the math has to land.',
    whenToUse: 'The night before or morning of the lesson.',
    whatItGives: 'A narrative arc, an activity-by-activity breakdown with language demand, signals of strong thinking, and the friction points to watch for.',
  },
  adapt: {
    title: 'Adaptation Guardrails',
    subtitle: 'Adapt without losing the math',
    accent: '#854F0B',
    purpose: 'Modify a task without accidentally removing what makes it worth teaching.',
    whenToUse: 'Pre-lesson, when planning a change for a class, small group, or individual student.',
    whatItGives: 'What is safe to change, what cannot be removed, proficiency-specific adaptations, and a single rigor check question to ask before you finalize.',
  },
  thinking: {
    title: 'Anticipated Student Thinking',
    subtitle: 'Predict what students will do',
    accent: '#534AB7',
    purpose: 'See the patterns of student thinking you are likely to encounter — including the productive ones, not just the errors.',
    whenToUse: 'While planning the lesson.',
    whatItGives: 'Pattern cards per activity (misconceptions, on-track responses, MLL-specific friction), sentence frames you can hand to students, and questions worth listening for.',
  },
  moves: {
    title: 'Move Walkthrough',
    subtitle: 'Walk through what you might see',
    accent: '#185FA5',
    purpose: 'Before you teach, practice noticing the moments that will show up. For each scenario, pause to think about what you would do — then see how the framework reads it.',
    whenToUse: 'After you have read the Pathway. A coaching session works well here too.',
    whatItGives: 'A scenario-by-scenario walkthrough that builds noticing capacity — what to attend to, what it means, how to respond. Ends with a printable summary of moments to watch for.',
  },
};

interface ToolInfoProps {
  toolId: ToolId;
}

export default function ToolInfo({ toolId }: ToolInfoProps) {
  const [open, setOpen] = useState(false);
  const content = TOOL_CONTENT[toolId];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <div className="pt-2 pb-1 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <h2
            className="text-[0.95rem] font-semibold leading-tight"
            style={{ color: content.accent }}
          >
            {content.title}
          </h2>
          <p className="text-[0.78rem] text-ink-faint mt-0.5">{content.subtitle}</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          aria-label={`About ${content.title}`}
          className="shrink-0 h-7 w-7 rounded-full border flex items-center justify-center text-[0.8rem] font-semibold cursor-pointer transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2"
          style={{
            color: content.accent,
            borderColor: content.accent,
          }}
        >
          ?
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-w-md w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-line shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 h-8 w-8 rounded-full hover:bg-surface flex items-center justify-center text-ink-muted hover:text-ink cursor-pointer focus-visible:outline-none transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <div className="px-6 py-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-2" style={{ color: content.accent }}>
                About this tool
              </p>
              <h3
                className="text-[1.25rem] leading-tight"
                style={{ fontFamily: 'var(--font-dm-serif), serif', color: '#1A1916' }}
              >
                {content.title}
              </h3>
              <p className="text-[0.85rem] text-ink-muted mt-1 mb-5">{content.subtitle}</p>

              <div className="space-y-4">
                <section>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-1.5">
                    Purpose
                  </p>
                  <p className="text-[0.875rem] text-ink leading-relaxed">{content.purpose}</p>
                </section>

                <section>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-1.5">
                    When to use
                  </p>
                  <p className="text-[0.875rem] text-ink leading-relaxed">{content.whenToUse}</p>
                </section>

                <section>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-1.5">
                    What it gives you
                  </p>
                  <p className="text-[0.875rem] text-ink leading-relaxed">{content.whatItGives}</p>
                </section>
              </div>

              <Link
                href="/framework"
                onClick={() => setOpen(false)}
                className="mt-6 block rounded-xl border border-line bg-surface px-4 py-3 hover:bg-surface-accent cursor-pointer transition-colors focus-visible:outline-none"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-0.5">
                  Curious how this is generated?
                </p>
                <p className="text-[0.875rem] font-semibold text-ink">Read the framework →</p>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
