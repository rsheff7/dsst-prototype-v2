'use client';

import { useEffect } from 'react';
import { MlrNumber, MLRS } from '@/lib/mlrs';

interface MlrOverlayProps {
  mlrNumber: MlrNumber;
  whyHere?: string;
  onClose: () => void;
}

export default function MlrOverlay({ mlrNumber, whyHere, onClose }: MlrOverlayProps) {
  const mlr = MLRS[mlrNumber];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-line shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 h-8 w-8 rounded-full hover:bg-surface flex items-center justify-center text-ink-muted hover:text-ink cursor-pointer focus-visible:outline-none transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 2L12 12M12 2L2 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="px-6 py-6">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-2"
            style={{ color: '#534AB7' }}
          >
            Mathematical Language Routine
          </p>
          <h3
            className="text-[1.25rem] leading-tight"
            style={{ fontFamily: 'var(--font-dm-serif), serif', color: '#1A1916' }}
          >
            MLR {mlr.number}: {mlr.name}
          </h3>

          <p className="text-[0.875rem] text-ink mt-3 leading-relaxed">{mlr.definition}</p>

          <section className="mt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-2">
              How it runs
            </p>
            <ol className="space-y-1.5 list-none">
              {mlr.structure.map((step, i) => (
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
          </section>

          <section className="mt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-faint mb-1.5">
              Example
            </p>
            <p className="text-[0.825rem] text-ink-muted leading-relaxed italic">{mlr.example}</p>
          </section>

          {whyHere && (
            <section
              className="mt-5 rounded-xl px-4 py-3 border-l-[3px]"
              style={{ backgroundColor: '#FAFAF7', borderLeftColor: '#534AB7' }}
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.1em] mb-1"
                style={{ color: '#534AB7' }}
              >
                Why here
              </p>
              <p className="text-[0.825rem] text-ink leading-relaxed">{whyHere}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
