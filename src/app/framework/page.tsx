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

export default function FrameworkPage() {
  const { setLesson } = useLesson();
  const router = useRouter();

  const openDemo = () => {
    setLesson(demoLesson);
    router.push('/lesson');
  };

  const DemoLink = ({ children }: { children: React.ReactNode }) => (
    <button
      onClick={openDemo}
      className="underline decoration-1 underline-offset-2 text-ink hover:text-ink-muted cursor-pointer transition-colors focus-visible:outline-none"
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-surface">
      <div className="border-b border-line bg-card">
        <div className="mx-auto max-w-2xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-[0.8rem] text-ink-muted hover:text-ink transition-colors">
            ← Back
          </Link>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
            About Premo
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
            Premo · for DSST
          </p>
          <h1
            className="text-[2rem] leading-[1.1] tracking-tight text-ink"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            What this is, and why to trust it.
          </h1>
          <p className="mt-4 text-[1rem] italic text-ink-muted leading-snug">
            A planning tool for math teachers and the instructional coaches who support them.
          </p>
        </header>

        {/* SECTION 1: What this is */}
        <section className="mt-14">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2"
            style={{ color: ACCENT }}
          >
            Part one
          </p>
          <h2
            className="text-[1.6rem] leading-tight text-ink mb-5"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            What this is
          </h2>

          <div className="space-y-5 text-[0.95rem] leading-[1.7] text-ink">
            <p>
              Premo reads a math lesson and produces planning guidance for the teacher who will teach it. The version you are using is built for DSST Public Schools and is anchored to Illustrative Mathematics, though the engine works on any text-based lesson PDF.
            </p>
            <p>
              The tool is organized around <em>Richard Elmore&apos;s Instructional Core</em>: the idea that learning happens at the intersection of three things — the teacher, the task, and the student — and that you cannot improve learning by working on one of those corners alone. Premo gives each corner its own view of the lesson, then brings them together in a fourth view for practice.
            </p>
          </div>

          {/* The triangle */}
          <div className="mt-10">
            <div className="rounded-xl border bg-card overflow-hidden" style={{ borderColor: '#E6E4DE' }}>
              <div className="px-5 py-3 border-b" style={{ backgroundColor: '#FAFAF7', borderColor: '#E6E4DE' }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint">
                  The Instructional Core, mapped to Premo
                </p>
              </div>

              <div className="divide-y" style={{ borderColor: '#E6E4DE' }}>
                <CoreRow
                  vertex="Teacher"
                  tool="Lesson Pathway"
                  toolAccent={PATHWAY}
                  description="What the teacher needs to read into the lesson before they teach it — the arc, the crux, the moments where students will struggle and the moments where the math has to land."
                />
                <CoreRow
                  vertex="Task"
                  tool="Adapt"
                  toolAccent={ADAPT}
                  description="What the task is for, mathematically — what is safe to change, what cannot be removed without losing the lesson, how to adapt for multilingual learners at three proficiency levels."
                />
                <CoreRow
                  vertex="Student"
                  tool="Thinking"
                  toolAccent={THINKING}
                  description="What students bring and what they will produce — the patterns of thinking to anticipate, the sentence frames to hand them, the questions worth listening for."
                />
              </div>

              <div className="border-t px-5 py-4" style={{ borderColor: '#E6E4DE', backgroundColor: '#F4F8FB' }}>
                <div className="flex items-baseline gap-3 mb-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: MOVES }}>
                    Where the three meet
                  </p>
                  <p
                    className="text-[1rem] font-semibold"
                    style={{ fontFamily: 'var(--font-dm-serif), serif', color: MOVES }}
                  >
                    Move Walkthrough
                  </p>
                </div>
                <p className="text-[0.875rem] text-ink leading-[1.65]">
                  Practice-based scenarios that bring teacher, task, and student together in specific moments. Each scenario shows what the teacher would see, what it usually means, and the response — including a side-by-side comparison across multilingual learner proficiency levels.
                </p>
              </div>
            </div>

            <p className="mt-5 text-[0.9rem] text-ink-muted leading-[1.7]">
              Above all four sits the <DemoLink>Quick Read</DemoLink> — the single page that carries the integrated read into class. It is the artifact a teacher takes onto the floor.
            </p>
          </div>
        </section>

        {/* SECTION 2: Why to trust it */}
        <section className="mt-16">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2"
            style={{ color: ACCENT }}
          >
            Part two
          </p>
          <h2
            className="text-[1.6rem] leading-tight text-ink mb-5"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            Why to trust it
          </h2>

          <div className="space-y-5 text-[0.95rem] leading-[1.7] text-ink">
            <p>
              Premo&apos;s guidance is produced by a language model — but the model is not improvising. Every analysis runs through a structured guidance layer: a defined set of evidence, a defined set of rules, and an inference step that has to show its work before any guidance is written.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <TrustBlock
              label="Evidence"
              title="What the tool reads"
            >
              The single source of evidence is the lesson PDF you upload. Premo does not pull from external curricula, the web, or prior conversations. When a lesson is from a curriculum that labels its language routines in the teacher edition (Illustrative Mathematics, Amplify Desmos), Premo recognizes those labels and uses them. When the labels are not present, Premo infers them from the student-facing content using the rules below.
            </TrustBlock>

            <TrustBlock
              label="Rules"
              title="What the tool applies"
            >
              <span className="block mb-2">
                The guidance layer applies four specific rules to every lesson:
              </span>
              <ul className="space-y-1.5 mt-2 pl-1">
                <li className="flex items-start gap-2">
                  <span className="mt-1 shrink-0 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                  <span><strong>The Mathematical Language Routines</strong> (8 routines from Zwiers and the Stanford Understanding Language team). The tool applies one or more MLRs to every language-rich moment, with criteria for which routine fits which behavior.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 shrink-0 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                  <span><strong>The friction taxonomy.</strong> Every difficulty point is tagged math, language, or language+math — so the response can match the actual barrier rather than treating all confusion as math confusion.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 shrink-0 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                  <span><strong>Asset-based framing.</strong> No deficit language about students anywhere in the output. The tool describes what students bring and where their thinking takes work — never what they lack.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 shrink-0 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                  <span><strong>Execution-faithful guidance.</strong> When a move invokes an MLR, the move text must read as that routine running step by step — not generic advice with a routine name attached.</span>
                </li>
              </ul>
            </TrustBlock>

            <TrustBlock
              label="Inference"
              title="How the tool reasons"
            >
              Every analysis produces an <code>mlr_inference</code> block first. For each activity, this block names the language work happening, which routines apply, and a one-line reason for each routine&apos;s fit. The rest of the guidance — the scenarios, the patterns, the sentence frames, the Quick Read tiles — is produced after this inference and must be consistent with it. The reasoning happens before the guidance, not after.
            </TrustBlock>

            <TrustBlock
              label="Transparency"
              title="How to verify"
            >
              Every MLR chip in the tool opens a panel showing the routine&apos;s name, its 3–4 step structure, and a <em>Why here</em> line tied to the inference. The internal <Link href="/audit" className="underline">audit page</Link> surfaces seven threads of cross-tool coherence plus an eighth MLR map showing which routines were inferred for each activity and where each one actually surfaces. Coaches and reviewers can inspect the guidance, not just consume it.
            </TrustBlock>

            <TrustBlock
              label="What this is not"
              title="Honest limits"
            >
              Premo is a planning support tool, not a script. The guidance is a starting point for your judgment, not a replacement for it. We do not yet have student outcome data — what teachers tell us shapes the tool; what happens to student learning is what will ultimately validate it. The framework is still being tested. If you see guidance that does not match the lesson you uploaded, that is a defect — not a feature — and we want to know.
            </TrustBlock>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 mb-2 rounded-xl border border-line bg-card p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-2">
            See it in practice
          </p>
          <p className="text-[0.95rem] text-ink leading-relaxed mb-4">
            The Grade 6 ratios lesson is loaded as a demo. Open it to see the Instructional Core mapped onto an actual lesson and to inspect the guidance layer at work.
          </p>
          <button
            onClick={openDemo}
            className="rounded-xl text-card px-5 py-3 text-[0.875rem] font-semibold hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-none"
            style={{ backgroundColor: ACCENT, color: '#FFFFFF' }}
          >
            Open the ratios lesson →
          </button>
        </section>

        <footer className="mt-16 pt-6 border-t border-line">
          <p className="text-[0.8rem] text-ink-faint italic">
            Premo · v2.2 — ELSF preview · for DSST Public Schools · Scale Up Partners, LLC
          </p>
        </footer>
      </article>
    </div>
  );
}

function CoreRow({
  vertex,
  tool,
  toolAccent,
  description,
}: {
  vertex: string;
  tool: string;
  toolAccent: string;
  description: string;
}) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-baseline gap-3 mb-1.5 flex-wrap">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint">
          {vertex}
        </p>
        <p
          className="text-[1rem] font-semibold"
          style={{ fontFamily: 'var(--font-dm-serif), serif', color: toolAccent }}
        >
          {tool}
        </p>
      </div>
      <p className="text-[0.875rem] text-ink leading-[1.65]">{description}</p>
    </div>
  );
}

function TrustBlock({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card px-5 py-4" style={{ borderColor: '#E6E4DE' }}>
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-1"
        style={{ color: ACCENT }}
      >
        {label}
      </p>
      <h3
        className="text-[1.05rem] text-ink mb-2 leading-tight"
        style={{ fontFamily: 'var(--font-dm-serif), serif' }}
      >
        {title}
      </h3>
      <div className="text-[0.875rem] text-ink leading-[1.65]">{children}</div>
    </div>
  );
}
