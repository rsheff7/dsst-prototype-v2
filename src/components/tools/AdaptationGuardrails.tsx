'use client';

import { LessonData } from '@/lib/types';
import ToolInfo from '@/components/shared/ToolInfo';
import MlrChip from '@/components/shared/MlrChip';

interface Props {
  lesson: LessonData;
}

export default function AdaptationGuardrails({ lesson }: Props) {
  const g = lesson.adaptation_guardrails;

  return (
    <div className="pt-6 space-y-6">
      <ToolInfo toolId="adapt" />

      {/* Mathematical purpose */}
      <div
        className="rounded-xl border border-line bg-card shadow-sm overflow-hidden border-l-[3px]"
        style={{ borderLeftColor: '#854F0B' }}
      >
        <div className="px-6 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: '#854F0B' }}>
            What this lesson is for
          </p>
          <p className="text-[0.95rem] text-ink leading-[1.7]" style={{ fontFamily: 'var(--font-dm-serif), serif' }}>
            {g.mathematical_purpose}
          </p>
        </div>
      </div>

      {/* Safe to change / Do not remove */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-line bg-card shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-line-subtle" style={{ backgroundColor: '#EAF3DE' }}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#27500A' }}>
              Safe to change
            </p>
          </div>
          <div className="px-5 py-4">
            <ul className="space-y-2.5">
              {g.safe_to_change.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-[3px] shrink-0 text-[12px]" style={{ color: '#27500A' }}>●</span>
                  <p className="text-[0.85rem] text-ink leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-card shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-line-subtle" style={{ backgroundColor: '#FAECE7' }}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#712B13' }}>
              Do not remove
            </p>
          </div>
          <div className="px-5 py-4">
            <ul className="space-y-2.5">
              {g.do_not_remove.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-[3px] shrink-0 text-[12px]" style={{ color: '#712B13' }}>▲</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.85rem] text-ink leading-relaxed">{item.text}</p>
                    {item.mlr && (
                      <div className="mt-1.5">
                        <MlrChip mlr={item.mlr} />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* By proficiency */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint mb-3">
          Adaptations by language proficiency
        </p>
        <div className="space-y-3">
          <div
            className="rounded-xl border px-5 py-4"
            style={{ backgroundColor: '#E1F5EE', borderColor: '#9FE1CB', color: '#085041' }}
          >
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#085041' }}>
                Entering
              </p>
              {g.by_proficiency.entering.mlr && <MlrChip mlr={g.by_proficiency.entering.mlr} />}
            </div>
            <p className="text-[0.85rem] leading-relaxed">{g.by_proficiency.entering.text}</p>
          </div>

          <div
            className="rounded-xl border px-5 py-4"
            style={{ backgroundColor: '#EEEDFE', borderColor: '#AFA9EC', color: '#26215C' }}
          >
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#26215C' }}>
                Developing
              </p>
              {g.by_proficiency.developing.mlr && <MlrChip mlr={g.by_proficiency.developing.mlr} />}
            </div>
            <p className="text-[0.85rem] leading-relaxed">{g.by_proficiency.developing.text}</p>
          </div>

          <div
            className="rounded-xl border px-5 py-4"
            style={{ backgroundColor: '#F1EFE8', borderColor: '#D3D1C7', color: '#444441' }}
          >
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#444441' }}>
                Bridging
              </p>
              {g.by_proficiency.bridging.mlr && <MlrChip mlr={g.by_proficiency.bridging.mlr} />}
            </div>
            <p className="text-[0.85rem] leading-relaxed">{g.by_proficiency.bridging.text}</p>
          </div>
        </div>
      </div>

      {/* Rigor check */}
      <div
        className="rounded-xl border px-6 py-6"
        style={{ backgroundColor: '#FAEEDA', borderColor: '#E8C68A' }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-3" style={{ color: '#633806' }}>
          Before you adapt — ask yourself:
        </p>
        <p
          className="text-[1.15rem] leading-[1.55]"
          style={{ fontFamily: 'var(--font-dm-serif), serif', color: '#854F0B' }}
        >
          {g.rigor_check}
        </p>
      </div>
    </div>
  );
}
