'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLesson } from '@/lib/lessonContext';
import { demoLesson } from '@/lib/demoLesson';

const ACCENT = '#00876C';

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
            Framework v1.0
          </p>
        </div>
      </div>

      <article className="mx-auto max-w-2xl px-6 py-12 md:py-16">
        <header className="mb-10">
          <h1
            className="text-[2.5rem] leading-none tracking-tight text-ink"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            DSST Math Teacher Tools
          </h1>
          <p className="mt-3 text-[1rem] italic text-ink-muted leading-snug">
            Before the lesson. With the lesson you actually have.
          </p>
        </header>

        <section className="space-y-5 text-[0.95rem] leading-[1.7] text-ink">
          <p>
            Teaching well takes two kinds of knowledge. The first is general — what good instruction looks like, what misconceptions tend to show up, how to support multilingual learners. Most of the professional learning teachers get is about that first kind. The second is specific — what to do with <em>this</em> student, in <em>this</em> moment, with <em>this</em> task, when the lesson is not going the way you planned. That is the kind of knowing that is hardest to get and most often missing when you need it.
          </p>
          <p>
            This tool is built for the second kind. Upload a lesson. The tool reads it through a structured framework and gives you guidance anchored to that specific lesson — not generic advice repackaged, but recommendations that name the exact activity, the specific student behavior, and the particular move.
          </p>
          <p className="font-semibold">
            The framework is what makes it specific. The AI applies it.
          </p>
        </section>

        <section className="mt-14">
          <h2
            className="text-[1.5rem] leading-tight text-ink mb-2"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            How it works
          </h2>
          <p className="text-[0.95rem] text-ink-muted mb-8">
            Every lesson gets read through six lenses.
          </p>

          <div className="space-y-9">
            <div>
              <h3 className="text-[0.95rem] font-semibold text-ink mb-3">
                What the lesson is fundamentally teaching
              </h3>
              <p className="text-[0.95rem] leading-[1.7] text-ink">
                Every lesson has one big idea — one piece of math it is trying to get students to. The tool names it and gives you a question to ask before you change anything. That question is what keeps any adaptation honest. In the <DemoLink>ratios lesson</DemoLink>, the big idea is that students produce ratio language themselves — actually writing the sentences, not just filling in pre-labeled blanks. Knowing the big idea tells you what you can change and what you cannot.
              </p>
            </div>

            <div>
              <h3 className="text-[0.95rem] font-semibold text-ink mb-3">
                What each activity is doing in the lesson
              </h3>
              <p className="text-[0.95rem] leading-[1.7] text-ink">
                The tool breaks the lesson into its activities and looks at each one separately — how long it takes, what kind of grouping, how much language it demands, what makes it hard, what success looks like. This is how teachers actually plan: activity by activity. Each one has a job in the lesson, and you cannot prepare for them all the same way. In the <DemoLink>ratios lesson</DemoLink>, activity 1.1 is the setup; activity 1.2 is the crux. The same teacher needs to show up differently for each.
              </p>
            </div>

            <div>
              <h3 className="text-[0.95rem] font-semibold text-ink mb-3">
                What kind of difficulty students are having
              </h3>
              <p className="text-[0.95rem] leading-[1.7] text-ink">
                When a student is stuck, there are three different reasons it might be happening: a math error, a language barrier, or a language-and-math problem — when language is what is in the way of doing the math. These need different responses. Treating a language-and-math problem like a math error means re-teaching math the student already understands. Most frameworks lump these all together. This one keeps them separate.
              </p>
            </div>

            <div>
              <h3 className="text-[0.95rem] font-semibold text-ink mb-3">
                Which students need which support
              </h3>
              <p className="text-[0.95rem] leading-[1.7] text-ink">
                When a scenario involves a multilingual learner, the guidance shows three versions — Entering, Developing, Bridging — side by side. One-size MLL support does not exist. A student with no English needs gestures and a finger pointing at the right number; a near-fluent student needs a focused question. Both deserve the math. The side-by-side view trains your eye to see the difference.
              </p>
            </div>

            <div>
              <h3 className="text-[0.95rem] font-semibold text-ink mb-3">
                What you can actually see
              </h3>
              <p className="text-[0.95rem] leading-[1.7] text-ink">
                The walkthrough is built from what you would <em>see</em> in your classroom — not from what you would guess a student is thinking. &ldquo;A student wrote 6 to 3 instead of 3 to 6&rdquo; is observable. &ldquo;A student is confused about ratios&rdquo; is a guess. The first one points to a specific move. The second one leaves you on your own. The tool starts from what is in front of you, not from a diagnosis you have to make first.
              </p>
            </div>

            <div>
              <h3 className="text-[0.95rem] font-semibold text-ink mb-3">
                What to do — and what not to do
              </h3>
              <p className="text-[0.95rem] leading-[1.7] text-ink">
                Every recommendation includes what to say, what to do without words when needed, and what to avoid. The avoid line is often the hardest part. The most common mistake even good teachers make is over-helping — restating the problem, telling the student which operation to use, supplying the strategy. Knowing the trap is as important as knowing the move.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <h2
            className="text-[1.5rem] leading-tight text-ink mb-5"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            What we are claiming — and what we are not
          </h2>
          <div className="space-y-5 text-[0.95rem] leading-[1.7] text-ink">
            <p>
              We believe that when teachers use this framework well, four things happen: they spend less time reacting to confusion and more time leading students through it; students who need adaptations still get to do the math the lesson was designed around; multilingual learners get support targeted to the actual barrier; and coaching becomes more specific because teachers and coaches share a vocabulary for what they are seeing.
            </p>
            <p>
              These are hypotheses. We do not yet have student outcome data, and we are not pretending teacher feedback is a substitute for it. What teachers tell us shapes the framework; what happens to student learning is what ultimately validates it. We are building toward a study design that can measure both — the quality of instructional decisions and the student outcomes that follow. If this tool does not improve what students learn, the framework has failed regardless of how useful teachers find it.
            </p>
            <p>
              This is not a curriculum. It does not tell you what to teach. It is not a script — every move is a starting point for your judgment, not a replacement for it. It is not finished. It is a prototype, and the framework is still being tested.
            </p>
          </div>
        </section>

        <section className="mt-14 mb-2 rounded-2xl border border-line bg-card p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-2">
            See it in practice
          </p>
          <p className="text-[0.95rem] text-ink leading-relaxed mb-4">
            The Grade 6 ratios lesson is loaded as a demo. Open it to see what the six lenses produce for an actual lesson — the same one referenced throughout this document.
          </p>
          <button
            onClick={openDemo}
            className="rounded-xl text-card px-5 py-3 text-[0.875rem] font-semibold hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-none"
            style={{ backgroundColor: ACCENT }}
          >
            Open the ratios lesson →
          </button>
        </section>

        <footer className="mt-16 pt-6 border-t border-line">
          <p className="text-[0.8rem] text-ink-faint italic">
            DSST Math Teacher Tools v1.0 · Scale Up Partners, LLC
          </p>
        </footer>
      </article>
    </div>
  );
}
