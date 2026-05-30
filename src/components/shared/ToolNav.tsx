'use client';

import { ToolId } from '@/app/lesson/page';

const TABS: { id: ToolId; label: string; accent: string }[] = [
  { id: 'pathway', label: 'Pathway', accent: '#00876C' },
  { id: 'adapt', label: 'Adapt', accent: '#854F0B' },
  { id: 'thinking', label: 'Thinking', accent: '#534AB7' },
  { id: 'moves', label: 'Moves', accent: '#185FA5' },
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
        {TABS.map(({ id, label, accent }) => {
          const isActive = activeTool === id;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className="flex-1 flex flex-col items-center py-3 gap-1 cursor-pointer focus-visible:outline-none min-h-[56px] transition-colors"
              style={{ color: isActive ? accent : undefined }}
            >
              <span
                className={`text-[11px] font-semibold ${isActive ? '' : 'text-ink-faint'}`}
                style={isActive ? { color: accent } : {}}
              >
                {label}
              </span>
              {isActive && (
                <span className="h-0.5 w-5 rounded-full" style={{ backgroundColor: accent }} />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex gap-0 -mb-px">
      {TABS.map(({ id, label, accent }) => {
        const isActive = activeTool === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`px-4 py-2.5 text-[11px] font-semibold cursor-pointer transition-colors border-b-2 focus-visible:outline-none -mb-px ${
              isActive ? 'text-ink' : 'text-ink-faint hover:text-ink-muted border-b-2 border-transparent'
            }`}
            style={isActive ? { borderBottomColor: accent, color: accent } : {}}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
