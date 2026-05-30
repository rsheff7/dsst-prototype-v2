'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLesson } from '@/lib/lessonContext';
import { demoLesson } from '@/lib/demoLesson';
import { MLRS, ALL_MLR_NUMBERS } from '@/lib/mlrs';

const ACCENT = '#006C57';
const MLR_ACCENT = '#534AB7';

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
            Framework v2.0
          </p>
        </div>
      </div>

      <article className="mx-auto max-w-2xl px-6 py-12 md:py-16">
        <header className="mb-10">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2"
            style={{ color: ACCENT }}
          >
            DSST Math Teacher Tools
          </p>
          <h1
            className="text-[2.25rem] leading-none tracking-tight text-ink"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            Professional Noticing in Math
          </h1>
          <p className="mt-3 text-[1rem] italic text-ink-muted leading-snug">
            One cycle a teacher runs in real time. A small set of routines that make the response stronger.
          </p>
        </header>

        <section className="space-y-5 text-[0.95rem] leading-[1.7] text-ink">
          <p>
            Teaching well takes two kinds of knowing. The first is general — what good instruction looks like, what misconceptions tend to show up, how to support multilingual learners. Most of the professional learning teachers get is about that first kind. The second is specific — what to do with <em>this</em> student, in <em>this</em> moment, with <em>this</em> task, when the lesson is not going the way you planned. That is the kind of knowing that is hardest to get and most often missing when you need it.
          </p>
          <p>
            This tool is built for the second kind. Upload a lesson. The tool reads it through one integrated framework and gives you guidance anchored to that specific lesson — not generic advice repackaged, but recommendations that name the exact activity, the specific student behavior, and the particular move.
          </p>
        </section>

        {/* The cycle */}
        <section className="mt-14">
          <h2
            className="text-[1.5rem] leading-tight text-ink mb-2"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            The cycle: Notice, Sort, Respond
          </h2>
          <p className="text-[0.95rem] text-ink-muted mb-8 leading-relaxed">
            A teacher in a math classroom runs one cycle in real time. The framework names its three steps.
          </p>

          <div className="space-y-6">
            <div className="rounded-2xl border bg-card overflow-hidden" style={{ borderColor: '#E6E4DE' }}>
              <div className="px-5 py-3 border-b" style={{ backgroundColor: '#FAFAF7', borderColor: '#E6E4DE' }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: ACCENT }}>
                  Step 1
                </p>
                <h3 className="text-[1.1rem] text-ink" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>
                  Notice
                </h3>
              </div>
              <div className="px-5 py-4">
                <p className="text-[0.925rem] text-ink leading-[1.7]">
                  What students say, do, draw, gesture. Asset-based by default — name what they bring, not what they lack. In the <DemoLink>ratios lesson</DemoLink>, this is the warm-up: students sorting and counting groups long before any ratio language enters the room.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border bg-card overflow-hidden" style={{ borderColor: '#E6E4DE' }}>
              <div className="px-5 py-3 border-b" style={{ backgroundColor: '#FAFAF7', borderColor: '#E6E4DE' }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: ACCENT }}>
                  Step 2
                </p>
                <h3 className="text-[1.1rem] text-ink" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>
                  Sort
                </h3>
              </div>
              <div className="px-5 py-4">
                <p className="text-[0.925rem] text-ink leading-[1.7]">
                  What kind of moment is this — a math moment, a language moment, or both? Sorting is the move most frameworks skip. Treating a language-and-math problem like a pure math error means re-teaching math the student already understands. The tool tags every friction by type so the response can match.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border bg-card overflow-hidden" style={{ borderColor: '#E6E4DE' }}>
              <div className="px-5 py-3 border-b" style={{ backgroundColor: '#FAFAF7', borderColor: '#E6E4DE' }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: ACCENT }}>
                  Step 3
                </p>
                <h3 className="text-[1.1rem] text-ink" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>
                  Respond
                </h3>
              </div>
              <div className="px-5 py-4 space-y-3">
                <p className="text-[0.925rem] text-ink leading-[1.7]">
                  For math moments: a math move — a question, a representation, a pause. For language moments: one of the eight Mathematical Language Routines below. For language-and-math moments: an MLR with a math hook.
                </p>
                <p className="text-[0.925rem] text-ink-muted leading-[1.7]">
                  The routines are the response vocabulary. They are not extra; they are <em>how</em> a noticing teacher responds when the moment is language-rich.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The 8 MLRs */}
        <section className="mt-14">
          <h2
            className="text-[1.5rem] leading-tight text-ink mb-2"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            The eight routines
          </h2>
          <p className="text-[0.95rem] text-ink-muted mb-8 leading-relaxed">
            The Mathematical Language Routines (Zwiers and colleagues, Stanford). A small fixed set of moves that show up across lessons. The tool flags which routine fits which moment with a chip like this:{' '}
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold align-middle"
              style={{ backgroundColor: '#EEEDFE', color: '#26215C' }}
            >
              MLR 1: Stronger & Clearer
            </span>
            . Over time, you stop needing the chip — you recognize the routine.
          </p>

          <div className="space-y-4">
            {ALL_MLR_NUMBERS.map((n) => {
              const m = MLRS[n];
              return (
                <div
                  key={n}
                  className="rounded-2xl border bg-card overflow-hidden"
                  style={{ borderColor: '#E6E4DE' }}
                >
                  <div
                    className="px-5 py-3 border-b flex items-baseline gap-3"
                    style={{ backgroundColor: '#FAFAF7', borderColor: '#E6E4DE' }}
                  >
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.1em]"
                      style={{ color: MLR_ACCENT }}
                    >
                      MLR {m.number}
                    </span>
                    <h3
                      className="text-[1.05rem] text-ink"
                      style={{ fontFamily: 'var(--font-dm-serif), serif' }}
                    >
                      {m.name}
                    </h3>
                  </div>
                  <div className="px-5 py-4 space-y-3">
                    <p className="text-[0.875rem] text-ink leading-[1.7]">{m.definition}</p>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-1.5">
                        How it runs
                      </p>
                      <ol className="space-y-1 list-none">
                        {m.structure.map((step, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span
                              className="mt-[2px] shrink-0 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
                              style={{ backgroundColor: '#EEEDFE', color: '#26215C' }}
                            >
                              {i + 1}
                            </span>
                            <span className="text-[0.825rem] text-ink-muted leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-1">
                        Example
                      </p>
                      <p className="text-[0.825rem] text-ink-muted leading-relaxed italic">{m.example}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Claims */}
        <section className="mt-14">
          <h2
            className="text-[1.5rem] leading-tight text-ink mb-5"
            style={{ fontFamily: 'var(--font-dm-serif), serif' }}
          >
            What we are claiming — and what we are not
          </h2>
          <div className="space-y-5 text-[0.95rem] leading-[1.7] text-ink">
            <p>
              We believe that when teachers use this framework well, four things happen: they spend less time reacting to confusion and more time leading students through it; students who need adaptations still do the math the lesson was designed around; multilingual learners get support targeted to the actual barrier; and coaching becomes more specific because teachers and coaches share a vocabulary for what they are seeing.
            </p>
            <p>
              These are hypotheses. We do not yet have student outcome data, and we are not pretending teacher feedback is a substitute for it. We are building toward a study design that can measure both — the quality of instructional decisions and the student outcomes that follow. If this tool does not improve what students learn, the framework has failed regardless of how useful teachers find it.
            </p>
            <p>
              This is not a curriculum. It does not tell you what to teach. It is not a script — every move is a starting point for your judgment, not a replacement for it. It is not finished. It is a prototype, and the framework is still being tested.
            </p>
          </div>
        </section>

        {/* Demo CTA */}
        <section className="mt-14 mb-2 rounded-2xl border border-line bg-card p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-2">
            See it in practice
          </p>
          <p className="text-[0.95rem] text-ink leading-relaxed mb-4">
            The Grade 6 ratios lesson is loaded as a demo. Open it to see Notice / Sort / Respond and the routines anchored to a real lesson.
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
            DSST Math Teacher Tools v2.0 · Scale Up Partners, LLC
          </p>
        </footer>
      </article>
    </div>
  );
}
