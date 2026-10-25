'use client';

/**
 * Shared design elements for the two documentation pages.
 *
 * Both pages were prose with occasional cards, and the reader had no way to see
 * at a glance which parts of the tool are mechanically guaranteed and which are
 * still design hypotheses awaiting expert review. These components make that
 * distinction visible rather than something you infer from careful reading.
 *
 * Built from the tokens already in globals.css — no new palette.
 */

import React from 'react';

export const DOC_ACCENT = 'var(--color-brand-primary)';

/* ------------------------------------------------------------------ */
/*  Section heading                                                    */
/* ------------------------------------------------------------------ */

export function SectionHeading({
  eyebrow,
  title,
  accent = DOC_ACCENT,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
}) {
  return (
    <>
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2"
        style={{ color: accent }}
      >
        {eyebrow}
      </p>
      <h2
        className="text-[1.6rem] leading-tight text-ink mb-5"
        style={{ fontFamily: 'var(--font-dm-serif), serif' }}
      >
        {title}
      </h2>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Provenance chip                                                    */
/* ------------------------------------------------------------------ */

export type Provenance = 'published' | 'computed' | 'generated' | 'hypothesis';

const PROVENANCE: Record<Provenance, { label: string; bg: string; text: string; border: string }> = {
  // Taken verbatim from the lesson document.
  published: { label: 'From the lesson', bg: 'var(--color-entering-bg)', text: 'var(--color-entering-text)', border: 'var(--color-entering-border)' },
  // Decided in code by a rule you can read.
  computed: { label: 'Computed', bg: 'var(--color-demand-low-bg)', text: 'var(--color-demand-low-text)', border: 'var(--color-demand-low-border)' },
  // Written by the model, under stated constraints.
  generated: { label: 'Written for this lesson', bg: 'var(--color-developing-bg)', text: 'var(--color-developing-text)', border: 'var(--color-developing-border)' },
  // Our judgement, not yet reviewed by DSST's math team.
  hypothesis: { label: 'Design hypothesis', bg: 'var(--color-synth-bg)', text: 'var(--color-adapt)', border: 'var(--color-synth-border)' },
};

export function ProvenanceChip({ kind }: { kind: Provenance }) {
  const p = PROVENANCE[kind];
  return (
    <span
      className="inline-block shrink-0 rounded-full border px-2 py-[2px] text-[9px] font-bold uppercase tracking-[0.09em]"
      style={{ backgroundColor: p.bg, color: p.text, borderColor: p.border }}
    >
      {p.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Step flow                                                          */
/* ------------------------------------------------------------------ */

export interface FlowStep {
  step: string;
  title: string;
  body: React.ReactNode;
  provenance: Provenance;
}

/**
 * A vertical chain with a connecting rule, for showing how one thing leads to
 * the next. Vertical rather than horizontal so it survives a phone screen and
 * so each step can carry a sentence rather than a label.
 */
export function StepFlow({ steps, accent = DOC_ACCENT }: { steps: FlowStep[]; accent?: string }) {
  return (
    <ol className="mt-6 space-y-0">
      {steps.map((s, i) => (
        <li key={s.step} className="relative flex gap-4 pb-6 last:pb-0">
          {i < steps.length - 1 && (
            <span
              aria-hidden
              className="absolute left-[15px] top-[30px] bottom-0 w-px"
              style={{ backgroundColor: 'var(--color-line)' }}
            />
          )}
          <span
            className="relative z-10 mt-[2px] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold"
            style={{ backgroundColor: 'var(--color-card)', borderColor: accent, color: accent }}
          >
            {s.step}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3
                className="text-[1rem] leading-tight text-ink"
                style={{ fontFamily: 'var(--font-dm-serif), serif' }}
              >
                {s.title}
              </h3>
              <ProvenanceChip kind={s.provenance} />
            </div>
            <div className="text-[0.875rem] text-ink-muted leading-[1.65]">{s.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/*  Settled vs provisional                                             */
/* ------------------------------------------------------------------ */

/**
 * The page's most important element. A teacher deciding whether to act on this
 * guidance deserves to see the boundary, not discover it.
 */
export function SettledPanel({
  settled,
  provisional,
}: {
  settled: React.ReactNode[];
  provisional: React.ReactNode[];
}) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <div
        className="rounded-xl border p-4"
        style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-demand-low-border)' }}
      >
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-2"
          style={{ color: 'var(--color-demand-low-text)' }}
        >
          Guaranteed by the build
        </p>
        <ul className="space-y-2">
          {settled.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-[0.85rem] text-ink leading-[1.6]">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: 'var(--color-demand-low-text)' }} />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="rounded-xl border p-4"
        style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-synth-border)' }}
      >
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-2"
          style={{ color: 'var(--color-adapt)' }}
        >
          Still a design hypothesis
        </p>
        <ul className="space-y-2">
          {provisional.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-[0.85rem] text-ink leading-[1.6]">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: 'var(--color-adapt)' }} />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Callout                                                            */
/* ------------------------------------------------------------------ */

export function Callout({
  label,
  children,
  accent = DOC_ACCENT,
}: {
  label: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div
      className="mt-6 rounded-xl border border-l-[3px] bg-card p-4"
      style={{ borderColor: 'var(--color-line)', borderLeftColor: accent }}
    >
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-1.5"
        style={{ color: accent }}
      >
        {label}
      </p>
      <div className="text-[0.9rem] text-ink leading-[1.7]">{children}</div>
    </div>
  );
}
