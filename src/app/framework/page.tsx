'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLesson } from '@/lib/lessonContext';
import { demoLesson } from '@/lib/demoLesson';
import { StepFlow, SettledPanel, Callout } from '@/components/docs/DocElements';

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
              Premo reads a math lesson and produces planning guidance for the teacher who will teach it. The version you are using is built for DSST Public Schools and is anchored to Illustrative Mathematics, though the engine works on any text-based lesson PDF. Because DSST is a WIDA state, the proficiency vocabulary throughout the tool is WIDA&apos;s six-level scale — Entering, Emerging, Developing, Expanding, Bridging, Reaching.
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
                  description="What the task is for, mathematically — what is safe to change, what cannot be removed without losing the lesson, and the rigor check question to ask before any adaptation."
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
                  Practice-based scenarios that bring teacher, task, and student together in specific moments. Each scenario shows what the teacher would see, what it usually means, and the response — calibrated to the WIDA level you select in the header.
                </p>
              </div>
            </div>

            <p className="mt-5 text-[0.9rem] text-ink-muted leading-[1.7]">
              Above all four sits the <DemoLink>Quick Read</DemoLink> — the single page that carries the integrated read into class. It is the artifact a teacher takes onto the floor.
            </p>
          </div>
        </section>

        {/* SECTION 1.5: The language axis */}
        <section className="mt-16">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2"
            style={{ color: ACCENT }}
          >
            Part one — continued
          </p>
          <h2
            className="text-[1.6rem] leading-tight text-ink mb-5"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            How the tool reasons about language
          </h2>

          <div className="space-y-5 text-[0.95rem] leading-[1.7] text-ink">
            <p>
              The Instructional Core organizes the views. Inside those views, two language layers stack to give the language guidance its precision.
            </p>
          </div>

          <StepFlow
            steps={[
              {
                step: '1',
                title: 'The lesson states the outcome',
                provenance: 'published',
                body: (
                  <>
                    IM prints the learning targets in the lesson — &ldquo;I can write or say a sentence
                    that describes a ratio.&rdquo; Premo reads them as written rather than paraphrasing
                    them, so the destination is the one the curriculum set, not one the tool invented.
                  </>
                ),
              },
              {
                step: '2',
                title: 'Each activity names what students must do with language',
                provenance: 'generated',
                body: (
                  <>
                    Every activity restates that target in its own terms, and is classified by its
                    Lesson Outcome — what students are expected to accomplish: formulating
                    something precisely, judging whether something is correct, connecting two
                    representations, conveying information a partner cannot see.
                  </>
                ),
              },
              {
                step: '3',
                title: 'The outcome selects the routine',
                provenance: 'computed',
                body: (
                  <>
                    Outcome drives strategy. The Mathematical Language Routine is chosen by a rule
                    from that classification and the activity&apos;s place in the arc — not generated
                    fresh each time. Where a routine needs something the printed lesson does not
                    supply, the tool says what to prepare instead of assuming it exists.
                  </>
                ),
              },
              {
                step: '4',
                title: 'The move is written for this moment, this learner',
                provenance: 'generated',
                body: (
                  <>
                    ELSF names the activity&apos;s language demand; WIDA describes what a learner at
                    each level can already produce and is reaching for. Both feed the guidance as
                    constraints, so the move that reaches the teacher names the actual objects,
                    numbers and student wording in front of them.
                  </>
                ),
              },
            ]}
          />
          <div className="mt-5 space-y-3 text-[0.9rem] text-ink-muted leading-[1.7]">
            <p>
              Both frameworks are external — ELSF&apos;s 15 published guidelines and WIDA&apos;s
              six-level scale. The proficiency vocabulary a teacher reads is WIDA only. Other
              frameworks may inform the logic internally; they never surface in the language on screen.
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
              A language model writes the guidance. That is worth being precise about rather than
              reassuring about, so here is what the build actually guarantees and what it does not.
            </p>
          </div>

          <SettledPanel
            settled={[
              <>The same lesson always produces the same plan. Two teachers uploading the same lesson read the same guidance, and it does not change between uploads.</>,
              <>Which routine an activity uses is decided by a rule in code, not by the model — so it cannot drift between runs of the same lesson.</>,
              <>The learning targets come from the lesson document verbatim. Nothing paraphrases them.</>,
              <>Every lesson carries at least three moments flagged for multilingual learners, including one at the crux. Enforced in code, not requested in a prompt.</>,
              <>Every difficulty is tagged math, language, or both, so the response can match the actual barrier.</>,
              <>No deficit language about students. The guidance names what they bring and what they are reaching toward.</>,
            ]}
            provisional={[
              <>Which two routines pair with which Lesson Outcome and Activity Role. The pairings are our reading of the routines&apos; structure and have not been reviewed by DSST&apos;s math team.</>,
              <>The descriptions of what a learner at each WIDA level can produce. Drafted against the framework, not transcribed from it.</>,
              <>The mapping from an activity&apos;s Lesson Outcome to a Key Language Use.</>,
              <>All three are scheduled for review with DSST&apos;s math team. Until then, treat a routine recommendation as a strong suggestion rather than a settled answer.</>,
            ]}
          />

          <Callout label="What the tool reads">
            The only source is the lesson PDF you upload. Premo does not pull from external
            curricula, the web, or previous sessions. Note that student-facing IM exports do not
            carry the teacher edition&apos;s suggested routines, so Premo infers the Lesson
            Outcome from the student pages rather than reading a label.
          </Callout>

          <div className="mt-8 space-y-5">
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
            Premo · v2.4 — ELD Convergence preview · for DSST Public Schools · Scale Up Partners, LLC
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

function LangLayerRow({
  order,
  title,
  accent,
  description,
}: {
  order: string;
  title: string;
  accent: string;
  description: React.ReactNode;
}) {
  return (
    <div className="px-5 py-4 border-b last:border-b-0" style={{ borderColor: '#E6E4DE' }}>
      <div className="flex items-baseline gap-3 mb-1.5 flex-wrap">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint">
          {order}
        </p>
        <p
          className="text-[1rem] font-semibold"
          style={{ fontFamily: 'var(--font-dm-serif), serif', color: accent }}
        >
          {title}
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
