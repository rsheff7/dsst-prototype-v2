'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLesson } from '@/lib/lessonContext';
import { demoLesson } from '@/lib/demoLesson';

const ACCENT = '#006C57';
const PATHWAY = '#00876C';
const ADAPT = '#854F0B';
const THINKING = '#534AB7';
const MOVES = '#185FA5';

export default function HowToPage() {
  const { setLesson } = useLesson();
  const router = useRouter();

  const openDemo = () => {
    setLesson(demoLesson);
    router.push('/lesson');
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="border-b border-line bg-card">
        <div className="mx-auto max-w-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-[0.8rem] text-ink-muted hover:text-ink transition-colors">
            ← Back
          </Link>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
            How to use Premo
          </p>
        </div>
      </div>

      <article className="mx-auto max-w-2xl px-6 py-12 md:py-16">
        {/* Header */}
        <header className="mb-12">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2"
            style={{ color: ACCENT }}
          >
            How to use Premo
          </p>
          <h1
            className="text-[2rem] leading-[1.1] tracking-tight text-ink"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            Three steps from a PDF to a planning artifact.
          </h1>
          <p className="mt-4 text-[1rem] italic text-ink-muted leading-snug">
            For teachers planning solo, and for coaches working with teachers.
          </p>
        </header>

        {/* Step 1 */}
        <Step
          number={1}
          title="Upload a lesson PDF"
          summary="Drag a text-based math lesson PDF onto the landing page. Premo reads it and produces a structured analysis."
        >
          <p>
            Any text-based PDF works — Illustrative Mathematics, Open Up, district-built lessons, supplemental tasks. Scans of paper documents will not parse; the PDF needs selectable text.
          </p>
          <p>
            Analysis takes about 2.5 to 3 minutes. The tool reads the lesson once and produces all five views from the same single read — no per-view re-analysis.
          </p>
          <p className="text-ink-muted italic text-[0.85rem]">
            Skip the upload and try the built-in Grade 6 ratios demo from the landing page to see the views immediately.
          </p>
        </Step>

        {/* Step 2 */}
        <Step
          number={2}
          title="Start with the Quick Read"
          summary="The first tab is the synthesized read of the lesson — one page, scannable, printable. Read this before any other view."
        >
          <p>
            The Quick Read is the artifact a teacher carries into class. It shows the lesson&apos;s arc in one line, the learning target per activity, the 2–3 moments to look for in each activity (with the routine and the move attached), the top signals and frictions, and the routines this lesson runs on.
          </p>
          <p>
            Two modes:
          </p>
          <ul className="space-y-1.5 mt-2 mb-3">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 shrink-0 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
              <span><strong>Plan view</strong> — the full read with prose, designed to print on one page and to study before teaching.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 shrink-0 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
              <span><strong>In-class view</strong> — stripped to glyphs and chips, designed for a phone screen during class.</span>
            </li>
          </ul>
          <p>
            If you have ten minutes before teaching, this is where ten minutes goes.
          </p>
        </Step>

        {/* Step 3 */}
        <Step
          number={3}
          title="Pick a preparation view — or rehearse the moves"
          summary="Underneath the Quick Read sit four deeper views: three for preparation, one for practice."
        >
          <p>
            The Quick Read is a synthesis. The four tools beneath it are where the work that produced the synthesis lives. Open the one that fits the planning question you have right now.
          </p>
        </Step>

        {/* Tool descriptions */}
        <div className="mt-6 space-y-4">
          <ToolCard
            accent={PATHWAY}
            label="Preparation view"
            title="Lesson Pathway"
            tag="What is this lesson really doing?"
          >
            The teacher&apos;s read of the lesson&apos;s structure and arc. Walks you through each activity in order, naming what it is for, the signals of strong student thinking to listen for, the friction points to expect, and the teacher moves that anchor each activity. Use this to plan how to teach the lesson, not just deliver it.
          </ToolCard>

          <ToolCard
            accent={ADAPT}
            label="Preparation view"
            title="Adapt"
            tag="What can I change without breaking the math?"
          >
            The task&apos;s read on what is non-negotiable and what is open. Names the mathematical purpose, the items you can safely adjust, the items you cannot remove, and the three proficiency-specific adaptations (Entering, Developing, Bridging) for multilingual learners. Use this when you need to modify the lesson for a class, a small group, or a single student.
          </ToolCard>

          <ToolCard
            accent={THINKING}
            label="Preparation view"
            title="Anticipated Student Thinking"
            tag="What will students actually say and do?"
          >
            The student&apos;s read of the lesson — the patterns of thinking students are likely to produce, color-coded by type (on-track, misconception, partial, extension, language-math), with sentence frames you can hand to students and the questions worth listening for. Use this to walk into class already familiar with what you will see and hear.
          </ToolCard>

          <ToolCard
            accent={MOVES}
            label="Practice view"
            title="Move Walkthrough"
            tag="What do I do when I see this in class?"
          >
            Practice-based scenarios for every moment that brings teacher, task, and student together — observation, interpretation, response. For multilingual learner scenarios, the response is shown side-by-side across Entering, Developing, and Bridging proficiency levels. Use this to rehearse the moves before you teach. A coaching session works well here too.
          </ToolCard>
        </div>

        {/* CTA */}
        <section className="mt-14 mb-2 rounded-2xl border border-line bg-card p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-2">
            Want to see all of this on one lesson?
          </p>
          <p className="text-[0.95rem] text-ink leading-relaxed mb-4">
            The Grade 6 ratios lesson is loaded as a demo. Open it to walk through the Quick Read, then the four deeper views, on a real lesson.
          </p>
          <button
            onClick={openDemo}
            className="rounded-xl text-card px-5 py-3 text-[0.875rem] font-semibold hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-none"
            style={{ backgroundColor: ACCENT, color: '#FFFFFF' }}
          >
            Open the demo lesson →
          </button>
        </section>

        <footer className="mt-16 pt-6 border-t border-line">
          <p className="text-[0.8rem] text-ink-faint italic">
            Premo v2 · for DSST Public Schools · Scale Up Partners, LLC
          </p>
        </footer>
      </article>
    </div>
  );
}

function Step({
  number,
  title,
  summary,
  children,
}: {
  number: number;
  title: string;
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="flex items-start gap-4 mb-4">
        <span
          className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full text-[14px] font-bold text-white"
          style={{ backgroundColor: ACCENT }}
        >
          {number}
        </span>
        <div className="min-w-0">
          <h2
            className="text-[1.35rem] leading-tight text-ink mb-1"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            {title}
          </h2>
          <p className="text-[0.95rem] italic text-ink-muted leading-snug">{summary}</p>
        </div>
      </div>
      <div className="ml-12 space-y-3 text-[0.925rem] leading-[1.7] text-ink">{children}</div>
    </section>
  );
}

function ToolCard({
  accent,
  label,
  title,
  tag,
  children,
}: {
  accent: string;
  label: string;
  title: string;
  tag: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border bg-card overflow-hidden border-l-[3px]"
      style={{ borderLeftColor: accent, borderColor: '#E6E4DE' }}
    >
      <div className="px-5 py-4">
        <div className="flex items-baseline gap-3 mb-1.5 flex-wrap">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: accent }}>
            {label}
          </p>
          <p
            className="text-[1.1rem] font-semibold"
            style={{ fontFamily: 'var(--font-dm-serif), serif', color: accent }}
          >
            {title}
          </p>
        </div>
        <p className="text-[0.875rem] italic text-ink-muted mb-2.5">{tag}</p>
        <p className="text-[0.875rem] text-ink leading-[1.65]">{children}</p>
      </div>
    </div>
  );
}
