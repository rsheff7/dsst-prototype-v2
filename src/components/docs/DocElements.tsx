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

export const DOC_ACCENT = '#006C57';

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
  published: { label: 'From the lesson', bg: '#E1F5EE', text: '#085041', border: '#9FE1CB' },
  // Decided in code by a rule you can read.
  computed: { label: 'Computed', bg: '#EAF3DE', text: '#27500A', border: '#C3DDA4' },
  // Written by the model, under stated constraints.
  generated: { label: 'Written for this lesson', bg: '#EEEDFE', text: '#26215C', border: '#AFA9EC' },
  // Our judgement, not yet reviewed by DSST's math team.
  hypothesis: { label: 'Design hypothesis', bg: '#F7EDE0', text: '#854F0B', border: '#E3C99F' },
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
              style={{ backgroundColor: '#E4E2DC' }}
            />
          )}
          <span
            className="relative z-10 mt-[2px] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold"
            style={{ backgroundColor: '#FFFFFF', borderColor: accent, color: accent }}
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
        style={{ backgroundColor: '#FFFFFF', borderColor: '#C3DDA4' }}
      >
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-2"
          style={{ color: '#27500A' }}
        >
          Guaranteed by the build
        </p>
        <ul className="space-y-2">
          {settled.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-[0.85rem] text-ink leading-[1.6]">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: '#27500A' }} />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="rounded-xl border p-4"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E3C99F' }}
      >
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-2"
          style={{ color: '#854F0B' }}
        >
          Still a design hypothesis
        </p>
        <ul className="space-y-2">
          {provisional.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-[0.85rem] text-ink leading-[1.6]">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: '#854F0B' }} />
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
      style={{ borderColor: '#E4E2DC', borderLeftColor: accent }}
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
