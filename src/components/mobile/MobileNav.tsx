'use client';

import { useLesson } from '@/lib/lessonContext';

type MobileTab = 'quickread' | 'pathway' | 'adapt';

interface MobileNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

export default function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const { lesson } = useLesson();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-line z-50">
      <div className="flex justify-around items-center h-[44px] pb-[env(safe-area-inset-bottom)]">
        {/* Quick Read Tab */}
        <button
          type="button"
          onClick={() => onTabChange('quickread')}
          className={`flex flex-col items-center justify-center flex-1 h-full px-2 ${
            activeTab === 'quickread' ? 'text-[#006C57]' : 'text-gray-500'
          }`}
        >
          <span className="text-lg">📖</span>
          <span className="text-[10px] font-semibold">Quick Read</span>
        </button>

        {/* Pathway Tab */}
        <button
          type="button"
          onClick={() => onTabChange('pathway')}
          className={`flex flex-col items-center justify-center flex-1 h-full px-2 ${
            activeTab === 'pathway' ? 'text-[#006C57]' : 'text-gray-500'
          }`}
        >
          <span className="text-lg">🗺️</span>
          <span className="text-[10px] font-semibold">Pathway</span>
        </button>

        {/* Adapt Tab */}
        <button
          type="button"
          onClick={() => onTabChange('adapt')}
          className={`flex flex-col items-center justify-center flex-1 h-full px-2 ${
            activeTab === 'adapt' ? 'text-[#006C57]' : 'text-gray-500'
          }`}
        >
          <span className="text-lg">⚙️</span>
          <span className="text-[10px] font-semibold">Adapt</span>
        </button>
      </div>
    </nav>
  );
}