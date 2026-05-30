'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useLesson } from '@/lib/lessonContext';
import { demoLesson } from '@/lib/demoLesson';
import { runAllChecks, summarize, CheckResult, CheckCategory } from '@/lib/qa';

const STATUS_STYLES: Record<CheckResult['status'], { bg: string; border: string; text: string; symbol: string; label: string }> = {
  pass: { bg: '#EAF3DE', border: '#C0DD97', text: '#27500A', symbol: '✓', label: 'Pass' },
  warn: { bg: '#FAEEDA', border: '#E8C68A', text: '#633806', symbol: '!', label: 'Warn' },
  fail: { bg: '#FAECE7', border: '#F5C4B3', text: '#712B13', symbol: '✗', label: 'Fail' },
};

const CATEGORY_ORDER: CheckCategory[] = ['Structural', 'Cross-tool', 'Pathway', 'Adapt', 'Thinking', 'Moves', 'Register'];

export default function QAPage() {
  const { lesson, setLesson } = useLesson();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const results = useMemo(() => (lesson ? runAllChecks(lesson) : []), [lesson]);
  const summary = useMemo(() => summarize(results), [results]);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const grouped = useMemo(() => {
    const map = new Map<CheckCategory, CheckResult[]>();
    for (const r of results) {
      if (!map.has(r.category)) map.set(r.category, []);
      map.get(r.category)!.push(r);
    }
    return map;
  }, [results]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="bg-ink text-card">
          <div className="mx-auto max-w-3xl px-6 py-2 flex items-center justify-between">
            <Link href="/" className="text-[0.75rem] hover:opacity-80">← Back</Link>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] opacity-80">
              Internal QA · not for teacher view
            </p>
          </div>
        </div>
        <main className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="text-[1.75rem] text-ink mb-4" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>
            Coherence checker
          </h1>
          <p className="text-[0.95rem] text-ink-muted mb-6 leading-relaxed">
            Load a lesson, then come back here to run coherence checks before showing the tools to a teacher.
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
            Internal QA · not for teacher view
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-ink-faint mb-1">
          Coherence check for
        </p>
        <h1 className="text-[1.5rem] text-ink mb-1" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>
          {lesson.meta.lesson_title}
        </h1>
        <p className="text-[0.85rem] text-ink-muted mb-8">
          {lesson.meta.grade} · {lesson.meta.unit} · {lesson.meta.lesson_number}
        </p>

        {/* Summary */}
        <div
          className="rounded-xl border-l-[4px] px-6 py-5 mb-8"
          style={{
            borderLeftColor: summary.ready ? '#27500A' : '#712B13',
            backgroundColor: summary.ready ? '#EAF3DE' : '#FAECE7',
            borderColor: summary.ready ? '#C0DD97' : '#F5C4B3',
            borderTopWidth: 1,
            borderRightWidth: 1,
            borderBottomWidth: 1,
          }}
        >
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2"
            style={{ color: summary.ready ? '#27500A' : '#712B13' }}
          >
            {summary.ready ? 'Ready to publish' : 'Not ready — fix failures'}
          </p>
          <p
            className="text-[1.5rem] mb-2"
            style={{ fontFamily: 'var(--font-dm-serif), serif', color: summary.ready ? '#27500A' : '#712B13' }}
          >
            {summary.passed} / {summary.total} checks passing
          </p>
          <div className="flex items-center gap-4 text-[0.85rem]">
            <span style={{ color: '#27500A' }}>
              <strong>{summary.passed}</strong> pass
            </span>
            {summary.warnings > 0 && (
              <span style={{ color: '#633806' }}>
                <strong>{summary.warnings}</strong> warn
              </span>
            )}
            {summary.failures > 0 && (
              <span style={{ color: '#712B13' }}>
                <strong>{summary.failures}</strong> fail
              </span>
            )}
          </div>
          <p className="text-[0.8rem] mt-3 leading-relaxed" style={{ color: summary.ready ? '#27500A' : '#712B13', opacity: 0.85 }}>
            {summary.ready
              ? 'No structural failures. Warnings (if any) are worth a look but not blocking. Tools are coherent enough to share with a teacher.'
              : 'At least one structural check failed. The corresponding tool view will be broken or misleading. Address failures before sharing with a teacher.'}
          </p>
        </div>

        {/* Results by category */}
        <div className="space-y-6">
          {CATEGORY_ORDER.map((cat) => {
            const items = grouped.get(cat);
            if (!items || items.length === 0) return null;
            const failsHere = items.filter((i) => i.status === 'fail').length;
            const warnsHere = items.filter((i) => i.status === 'warn').length;
            return (
              <section key={cat}>
                <div className="flex items-baseline justify-between mb-3">
                  <h2 className="text-[0.95rem] font-semibold text-ink">{cat}</h2>
                  <p className="text-[0.75rem] text-ink-faint">
                    {items.length} check{items.length !== 1 ? 's' : ''}
                    {failsHere > 0 && <span style={{ color: '#712B13' }}> · {failsHere} fail</span>}
                    {warnsHere > 0 && <span style={{ color: '#633806' }}> · {warnsHere} warn</span>}
                  </p>
                </div>

                <div className="space-y-2">
                  {items.map((r) => {
                    const s = STATUS_STYLES[r.status];
                    const isOpen = expanded.has(r.id);
                    const hasDetails = r.details && r.details.length > 0;
                    return (
                      <div
                        key={r.id}
                        className="rounded-xl border overflow-hidden"
                        style={{ backgroundColor: '#FFFFFF', borderColor: '#E6E4DE' }}
                      >
                        <div className="flex items-start gap-3 px-5 py-3">
                          <span
                            className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-[0.75rem] font-bold mt-0.5"
                            style={{ backgroundColor: s.bg, color: s.text, border: `1px solid ${s.border}` }}
                            aria-label={s.label}
                          >
                            {s.symbol}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[0.875rem] font-semibold text-ink leading-snug">{r.name}</p>
                            <p className="text-[0.8rem] text-ink-muted mt-1 leading-relaxed">{r.message}</p>
                          </div>
                          {hasDetails && (
                            <button
                              onClick={() => toggle(r.id)}
                              className="shrink-0 text-[0.75rem] font-semibold text-ink-faint hover:text-ink-muted cursor-pointer"
                            >
                              {isOpen ? 'Hide' : 'Details'}
                            </button>
                          )}
                        </div>
                        {hasDetails && isOpen && (
                          <div className="border-t border-line-subtle px-5 py-3 bg-surface">
                            <ul className="space-y-1">
                              {r.details!.map((d, i) => (
                                <li key={i} className="text-[0.8rem] text-ink-muted">
                                  · {d}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <p className="text-[0.8rem] text-ink-faint italic mt-12 pt-6 border-t border-line">
          QA v1.0 · runs against the lesson currently loaded in your session
        </p>
      </main>
    </div>
  );
}
