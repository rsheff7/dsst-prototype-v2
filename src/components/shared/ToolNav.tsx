'use client';

import { ToolId } from '@/lib/types';

const TABS: { id: ToolId; label: string }[] = [
  { id: 'quickread', label: 'Prep Sheet' },
  { id: 'pathway', label: 'Pathway' },
  { id: 'adapt', label: 'Adapt' },
  { id: 'thinking', label: 'Thinking' },
  { id: 'moves', label: 'Moves' },
];

interface ToolNavProps {
  activeTool: ToolId;
  onSelect: (tool: ToolId) => void;
  mobile?: boolean;
}

export default function ToolNav({ activeTool, onSelect, mobile }: ToolNavProps) {
  if (mobile) {
    return (
      <div className="flex">
        {TABS.map(({ id, label }) => {
          const isActive = activeTool === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 cursor-pointer focus-visible:outline-none min-h-[56px] transition-colors ${
                isActive ? 'text-brand-primary' : ''
              }`}
            >
              <span
                className={`text-[11px] font-semibold ${isActive ? 'text-brand-primary' : 'text-ink-faint'}`}
              >
                {label}
              </span>
              {isActive && (
                <span className="h-0.5 w-5 rounded-full bg-brand-primary" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex gap-0 -mb-px">
      {TABS.map(({ id, label }) => {
        const isActive = activeTool === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`px-4 py-2.5 text-xs font-semibold cursor-pointer transition-colors border-b-2 focus-visible:outline-none -mb-px ${
              isActive
                ? 'text-brand-primary border-brand-primary'
                : 'text-ink-faint hover:text-ink-muted border-transparent'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
