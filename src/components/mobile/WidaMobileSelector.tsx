'use client';

import { useLesson } from '@/lib/lessonContext';
import { WidaLevel, WIDA_LABELS, WIDA_LEVELS } from '@/lib/eld/types';

const WIDA_ACCENT = '#534AB7';
const WIDA_BG = '#EEEDFE';
const WIDA_BORDER = '#AFA9EC';
const WIDA_INK = '#26215C';

export default function WidaMobileSelector() {
  const { lesson, selectedWidaLevel, setSelectedWidaLevel } = useLesson();

  // Only show selector if lesson has ELSF inference data
  const hasElsfInference = lesson?.elsf_inference && lesson.elsf_inference.activities.length > 0;

  if (!hasElsfInference) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '') {
      setSelectedWidaLevel(null);
    } else {
      setSelectedWidaLevel(Number(value) as WidaLevel);
    }
  };

  return (
    <div className="w-full px-4 py-3 border-b border-gray-200 bg-white">
      <div className="flex flex-col gap-2">
        <label 
          htmlFor="wida-selector-mobile"
          className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500"
        >
          WIDA Proficiency Level
        </label>
        
        <div className="relative">
          <select
            id="wida-selector-mobile"
            value={selectedWidaLevel || ''}
            onChange={handleChange}
            className="w-full appearance-none bg-white border-2 rounded-lg px-4 py-3 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ 
              borderColor: WIDA_BORDER,
              color: WIDA_INK,
              backgroundColor: WIDA_BG,
              fontSize: '0.9rem',
              minHeight: '44px'
            }}
            aria-label="Select WIDA proficiency level"
          >
            <option value="">— Not Selected —</option>
            {WIDA_LEVELS.map((level) => (
              <option key={level} value={level}>
                {WIDA_LABELS[level]}
              </option>
            ))}
          </select>

          {/* Custom dropdown arrow */}
          <div
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            aria-hidden="true"
          >
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}