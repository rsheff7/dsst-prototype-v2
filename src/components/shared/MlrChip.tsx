'use client';

import { useState } from 'react';
import { MlrRef } from '@/lib/types';
import MlrOverlay from './MlrOverlay';

interface MlrChipProps {
  mlr: MlrRef;
  whyHere?: string;
  showName?: boolean;
}

export default function MlrChip({ mlr, whyHere, showName = true }: MlrChipProps) {
  const [open, setOpen] = useState(false);

  const label = showName ? `MLR ${mlr.number}: ${shortenName(mlr.name)}` : `MLR ${mlr.number}`;

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label={`About MLR ${mlr.number}: ${mlr.name}`}
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold cursor-pointer hover:opacity-85 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        style={{ backgroundColor: '#EEEDFE', color: '#26215C' }}
      >
        <span>{label}</span>
        <span aria-hidden="true" className="opacity-60 text-[9px]">
          i
        </span>
      </button>
      {open && (
        <MlrOverlay mlrNumber={mlr.number} whyHere={whyHere} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

function shortenName(name: string): string {
  const short: Record<string, string> = {
    'Stronger and Clearer Each Time': 'Stronger & Clearer',
    'Collect and Display': 'Collect & Display',
    'Critique, Correct, and Clarify': 'Critique & Clarify',
    'Information Gap': 'Information Gap',
    'Co-Craft Questions': 'Co-Craft Questions',
    'Three Reads': 'Three Reads',
    'Compare and Connect': 'Compare & Connect',
    'Discussion Supports': 'Discussion Supports',
  };
  return short[name] ?? name;
}
