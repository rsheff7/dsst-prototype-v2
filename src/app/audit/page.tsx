'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useLesson } from '@/lib/lessonContext';
import { demoLesson } from '@/lib/demoLesson';
import { findTermAppearances, activityDensity, toneSamples, mlrCoherenceMap } from '@/lib/audit';
import { activitySlot } from '@/lib/activityLabel';

const SECTIONS = [
  { id: 'purpose', label: '1. Mathematical purpose anchor' },
  { id: 'destination', label: '2. Destination → activities' },
  { id: 'vocabulary', label: '3. Vocabulary recurrence' },
  { id: 'crux', label: '4. Crux density' },
  { id: 'friction', label: '5. Friction → scenarios per activity' },
  { id: 'tone', label: '6. Tone samples' },
  { id: 'non-negotiables', label: '7. Adapt non-negotiables' },
  { id: 'mlr-coherence', label: '8. MLR coherence map' },
];

export default function AuditPage() {
  const { lesson, setLesson } = useLesson();

  const density = useMemo(() => (lesson ? activityDensity(lesson) : []), [lesson]);
  const samples = useMemo(() => (lesson ? toneSamples(lesson) : []), [lesson]);
  const mlrMap = useMemo(() => (lesson ? mlrCoherenceMap(lesson) : []), [lesson]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="bg-ink text-card">
          <div className="mx-auto max-w-3xl px-6 py-2 flex items-center justify-between">
            <Link href="/" className="text-[0.75rem] hover:opacity-80">← Back</Link>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] opacity-80">
              Internal coherence audit · not for teacher view
            </p>
          </div>
        </div>
        <main className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="text-[1.75rem] text-ink mb-4" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>
            Coherence audit
          </h1>
          <p className="text-[0.95rem] text-ink-muted mb-6 leading-relaxed">
            Surfaces the connective tissue across the four tools so you can verify the lesson holds together. Different from <code>/qa</code>, which is pass/fail structural checks.
          </p>
          <button
            onClick={() => setLesson(demoLesson)}
            className="rounded-xl text-card px-5 py-3 text-[0.875rem] font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            style={{ backgroundColor: '#00876C' }}
          >
            Load the demo lesson
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-ink text-card">
        <div className="mx-auto max-w-3xl px-6 py-2 flex items-center justify-between">
          <Link href="/" className="text-[0.75rem] hover:opacity-80">← Back</Link>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] opacity-80">
            Internal coherence audit · not for teacher view
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-ink-faint mb-1">
          Coherence audit for
        </p>
        <h1 className="text-[1.5rem] text-ink mb-1" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>
          {lesson.meta.lesson_title}
        </h1>
        <p className="text-[0.85rem] text-ink-muted mb-8">
          {lesson.meta.grade} · {lesson.meta.unit} · {lesson.meta.lesson_number}
        </p>

        {/* Section index */}
        <div className="rounded-xl border border-line bg-card px-5 py-4 mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-2">
            Jump to thread
          </p>
          <ul className="text-[0.85rem] text-ink-muted space-y-1">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="hover:text-ink underline-offset-2 hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* 1. Mathematical purpose */}
        <section id="purpose" className="mb-12 scroll-mt-6">
          <h2 className="text-[1.05rem] font-semibold text-ink mb-1">
            1. Does the lesson anchor to a single mathematical purpose?
          </h2>
          <p className="text-[0.825rem] text-ink-muted mb-4 leading-relaxed">
            Read these five passages back to back. Are they all pointing at the same big idea?
          </p>

          <div className="space-y-3">
            <EvidenceCard label="Adapt: mathematical_purpose" text={lesson.adaptation_guardrails.mathematical_purpose} />
            <EvidenceCard label="Adapt: rigor_check" text={lesson.adaptation_guardrails.rigor_check} />
            <EvidenceCard label="Pathway: arc_statement" text={lesson.arc_statement} />
            {lesson.activities.map((a) => (
              <EvidenceCard
                key={a.id}
                label={`Pathway: Activity ${a.id} function_summary${a.is_crux ? ' (crux)' : ''}`}
                text={a.function_summary}
              />
            ))}
          </div>
        </section>

        {/* 2. Destination */}
        <section id="destination" className="mb-12 scroll-mt-6">
          <h2 className="text-[1.05rem] font-semibold text-ink mb-1">
            2. Does the destination match what the activities are doing?
          </h2>
          <p className="text-[0.825rem] text-ink-muted mb-4 leading-relaxed">
            The destination names what students should be able to do by the end. Each activity should contribute to that destination.
          </p>

          <div className="space-y-3">
            <EvidenceCard label="Destination" text={lesson.destination} highlight />
            {lesson.activities.map((a) => (
              <EvidenceCard
                key={a.id}
                label={`Activity ${a.id} — ${a.title}`}
                text={a.function_summary}
              />
            ))}
          </div>
        </section>

        {/* 3. Vocabulary */}
        <section id="vocabulary" className="mb-12 scroll-mt-6">
          <h2 className="text-[1.05rem] font-semibold text-ink mb-1">
            3. Does the vocabulary appear in activity content?
          </h2>
          <p className="text-[0.825rem] text-ink-muted mb-4 leading-relaxed">
            For each vocabulary term, where does it actually appear across the lesson? If a term doesn&apos;t show up anywhere outside the vocabulary block, it&apos;s decorative.
          </p>

          {lesson.key_vocabulary.length === 0 ? (
            <p className="text-[0.85rem] text-ink-muted italic">No vocabulary defined for this lesson.</p>
          ) : (
            <div className="space-y-5">
              {lesson.key_vocabulary.map((v) => {
                const appearances = findTermAppearances(v.term, lesson);
                return (
                  <div
                    key={v.term}
                    className="rounded-xl border border-line bg-card overflow-hidden"
                  >
                    <div className="px-5 py-3 border-b border-line-subtle bg-surface">
                      <p className="text-[0.95rem] font-semibold text-ink">{v.term}</p>
                      <p className="text-[0.8rem] text-ink-muted mt-1">{v.definition}</p>
                    </div>
                    {appearances.length === 0 ? (
                      <div
                        className="px-5 py-3 text-[0.8rem]"
                        style={{ backgroundColor: '#FAECE7', color: '#712B13' }}
                      >
                        ⚠ Term does not appear anywhere outside the vocabulary block. Either weave it into the lesson or remove it from vocabulary.
                      </div>
                    ) : (
                      <ul className="divide-y divide-line-subtle">
                        {appearances.map((a, i) => (
                          <li key={i} className="px-5 py-2.5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                              {a.location}
                            </p>
                            <p className="text-[0.8rem] text-ink-muted mt-0.5 leading-relaxed">
                              {a.context}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 4. Crux density */}
        <section id="crux" className="mb-12 scroll-mt-6">
          <h2 className="text-[1.05rem] font-semibold text-ink mb-1">
            4. Does the crux activity get the most attention?
          </h2>
          <p className="text-[0.825rem] text-ink-muted mb-4 leading-relaxed">
            The activity marked as the crux should have the most patterns in Thinking and the most scenarios in Moves. Otherwise the structural emphasis disagrees with the framework claim.
          </p>

          <div className="rounded-xl border border-line bg-card overflow-hidden">
            <table className="w-full text-[0.85rem]">
              <thead>
                <tr className="border-b border-line-subtle bg-surface">
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                    Activity
                  </th>
                  <th className="text-center px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                    Crux?
                  </th>
                  <th className="text-center px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                    Thinking patterns
                  </th>
                  <th className="text-center px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                    Moves scenarios
                  </th>
                  <th className="text-center px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                    MLL
                  </th>
                </tr>
              </thead>
              <tbody>
                {density.map((d) => (
                  <tr key={d.id} className="border-b border-line-subtle last:border-b-0">
                    <td className="px-4 py-2.5 text-ink">{d.id}</td>
                    <td className="text-center px-4 py-2.5">
                      {d.is_crux ? (
                        <span
                          className="text-[9px] font-bold uppercase tracking-[0.1em] text-white px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#00876C' }}
                        >
                          Crux
                        </span>
                      ) : (
                        <span className="text-ink-faint">—</span>
                      )}
                    </td>
                    <td className="text-center px-4 py-2.5 text-ink-muted">{d.thinking_patterns}</td>
                    <td className="text-center px-4 py-2.5 text-ink-muted">{d.moves_scenarios}</td>
                    <td className="text-center px-4 py-2.5 text-ink-muted">{d.moves_mll}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. Friction-to-scenarios per activity */}
        <section id="friction" className="mb-12 scroll-mt-6">
          <h2 className="text-[1.05rem] font-semibold text-ink mb-1">
            5. Do friction points in Pathway have corresponding scenarios in Moves?
          </h2>
          <p className="text-[0.825rem] text-ink-muted mb-4 leading-relaxed">
            For each activity, the friction points listed in Pathway should be addressable in the Moves scenarios for that activity. Read the friction next to the scenarios — are they covering the same territory?
          </p>

          <div className="space-y-5">
            {lesson.activities.map((a) => {
              const dgActivity = lesson.decision_guide.activities.find((x) => x.activity_id === a.id);
              return (
                <div
                  key={a.id}
                  className="rounded-xl border border-line bg-card overflow-hidden"
                >
                  <div className="px-5 py-3 border-b border-line-subtle bg-surface">
                    <p className="text-[0.9rem] font-semibold text-ink">
                      {a.id} {a.title}
                      {a.is_crux && (
                        <span
                          className="ml-2 text-[9px] font-bold uppercase tracking-[0.1em] text-white px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#00876C' }}
                        >
                          Crux
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-line-subtle">
                    <div className="px-5 py-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint mb-2">
                        Friction in Pathway ({a.friction_points.length})
                      </p>
                      {a.friction_points.length === 0 ? (
                        <p className="text-[0.8rem] text-ink-faint italic">No friction points listed.</p>
                      ) : (
                        <ul className="space-y-2">
                          {a.friction_points.map((fp, i) => (
                            <li key={i} className="text-[0.825rem] text-ink leading-relaxed">
                              <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-ink-faint mr-2">
                                {fp.type}
                              </span>
                              {fp.description}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="px-5 py-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint mb-2">
                        Scenarios in Moves ({dgActivity?.scenarios.length ?? 0})
                      </p>
                      {!dgActivity || dgActivity.scenarios.length === 0 ? (
                        <p className="text-[0.8rem] text-ink-faint italic">No scenarios for this activity.</p>
                      ) : (
                        <ul className="space-y-2">
                          {dgActivity.scenarios.map((s, i) => (
                            <li key={i} className="text-[0.825rem] text-ink leading-relaxed">
                              <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-ink-faint mr-2">
                                {s.scenario_type}
                                {s.is_mll && ' · MLL'}
                              </span>
                              {s.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. Tone */}
        <section id="tone" className="mb-12 scroll-mt-6">
          <h2 className="text-[1.05rem] font-semibold text-ink mb-1">
            6. Do all four tools read in the same voice?
          </h2>
          <p className="text-[0.825rem] text-ink-muted mb-4 leading-relaxed">
            One sample pulled from each tool&apos;s hot spot. Read them straight through — does any one of them sound like a different writer?
          </p>

          <div className="space-y-3">
            {samples.map((s, i) => (
              <EvidenceCard key={i} label={s.location} text={s.text} />
            ))}
          </div>
        </section>

        {/* 7. Adapt non-negotiables */}
        <section id="non-negotiables" className="mb-12 scroll-mt-6">
          <h2 className="text-[1.05rem] font-semibold text-ink mb-1">
            7. Do Adapt&apos;s &ldquo;do not remove&rdquo; items match what the activities actually require?
          </h2>
          <p className="text-[0.825rem] text-ink-muted mb-4 leading-relaxed">
            Each item in <code>do_not_remove</code> is a non-negotiable. Read it, then scan the activity content for evidence the activities actually require it. If an item is in <code>do_not_remove</code> but no activity enforces it, you have a gap.
          </p>

          <div className="space-y-4">
            {lesson.adaptation_guardrails.do_not_remove.map((item, i) => (
              <div key={i} className="rounded-xl border border-line bg-card overflow-hidden">
                <div className="px-5 py-3 border-b border-line-subtle" style={{ backgroundColor: '#FAECE7' }}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: '#712B13' }}>
                    Do not remove #{i + 1}
                  </p>
                  <p className="text-[0.875rem] text-ink mt-1 leading-relaxed">{item.text}</p>
                </div>
                <div className="px-5 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint mb-2">
                    What activity content supports this?
                  </p>
                  <p className="text-[0.8rem] text-ink-muted italic">
                    Scan the activity function summaries and teacher moves above. If you can&apos;t see the requirement in any activity, the non-negotiable is detached from the lesson — fix Adapt or fix the activities.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. MLR coherence map */}
        <section id="mlr-coherence" className="mb-12 scroll-mt-6">
          <h2 className="text-[1.05rem] font-semibold text-ink mb-1">
            8. Does the MLR inference match what surfaces in the tools?
          </h2>
          <p className="text-[0.825rem] text-ink-muted mb-4 leading-relaxed">
            For each activity, this shows the routines the analysis inferred and which routines actually appear in each tool. If a routine is inferred but never surfaces, the chip is missing. If a routine surfaces but was not inferred, it is detached from the reasoning.
          </p>

          <div className="space-y-5">
            {mlrMap.map((entry) => (
              <div
                key={entry.activity_id}
                className="rounded-xl border border-line bg-card overflow-hidden"
              >
                <div className="px-5 py-3 border-b border-line-subtle bg-surface">
                  <p className="text-[0.9rem] font-semibold text-ink">{entry.activity_id}{(() => {
                    const src = lesson.activities.find((x) => x.id === entry.activity_id);
                    return src ? ` ${activitySlot(src.title)}` : '';
                  })()}</p>
                  {entry.language_work && (
                    <p className="text-[0.8rem] text-ink-muted mt-1 leading-relaxed italic">
                      {entry.language_work}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-line-subtle">
                  <div className="px-5 py-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint mb-2">
                      Inferred ({entry.inferred.length})
                    </p>
                    {entry.inferred.length === 0 ? (
                      <p className="text-[0.8rem] text-ink-faint italic">No routines inferred.</p>
                    ) : (
                      <ul className="space-y-2.5">
                        {entry.inferred.map((m, i) => (
                          <li key={i}>
                            <p className="text-[0.825rem] text-ink font-semibold">
                              MLR {m.number}: {m.name}
                            </p>
                            <p className="text-[0.78rem] text-ink-muted leading-relaxed mt-0.5">
                              {m.why_here}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-faint mb-2">
                      Surfaces in tools ({entry.appearances.length})
                    </p>
                    {entry.appearances.length === 0 ? (
                      <p className="text-[0.8rem] text-ink-faint italic">No routine surfaces yet.</p>
                    ) : (
                      <ul className="space-y-2.5">
                        {entry.appearances.map((a) => (
                          <li key={a.number}>
                            <p className="text-[0.825rem] text-ink font-semibold">
                              MLR {a.number}: {a.name}
                            </p>
                            <p className="text-[0.78rem] text-ink-muted leading-relaxed mt-0.5">
                              {a.locations.join(' · ')}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className="text-[0.8rem] text-ink-faint italic mt-12 pt-6 border-t border-line">
          Audit v2.0 · For structural pass/fail checks, see{' '}
          <Link href="/qa" className="underline-offset-2 underline">/qa</Link>
        </p>
      </main>
    </div>
  );
}

function EvidenceCard({ label, text, highlight }: { label: string; text: string; highlight?: boolean }) {
  return (
    <div
      className="rounded-xl border px-5 py-3"
      style={{
        backgroundColor: highlight ? '#E5EEEB' : '#FFFFFF',
        borderColor: highlight ? '#B5D3CB' : '#E6E4DE',
      }}
    >
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.08em] mb-1.5"
        style={{ color: highlight ? '#005A48' : '#A3A39E' }}
      >
        {label}
      </p>
      <p className="text-[0.85rem] text-ink leading-relaxed">{text}</p>
    </div>
  );
}
