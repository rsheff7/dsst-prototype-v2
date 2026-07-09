'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLesson } from '@/lib/lessonContext';
import { LessonData, ToolId } from '@/lib/types';
import LessonHeader from '@/components/shared/LessonHeader';
import ToolNav from '@/components/shared/ToolNav';
import MobileNav from '@/components/mobile/MobileNav';
import MobileQuickRead from '@/components/mobile/MobileQuickRead';
import LessonPathway from '@/components/tools/LessonPathway';
import AdaptationGuardrails from '@/components/tools/AdaptationGuardrails';
import AnticipatedThinking from '@/components/tools/AnticipatedThinking';
import MoveWalkthrough from '@/components/tools/MoveWalkthrough';
import { exportLessonToFile } from '@/lib/fileUtils';
import QuickRead from '@/components/tools/QuickRead';

export default function LessonPage() {
  const { lesson } = useLesson();
  const router = useRouter();
  const [activeTool, setActiveTool] = useState<ToolId>('quickread');

  useEffect(() => {
    if (!lesson) router.replace('/');
  }, [lesson, router]);

  const handleSavePlan = () => {
    if (!lesson) return;
    exportLessonToFile(lesson);
  };

  if (!lesson) return null;

  return (
    <div className="min-h-screen bg-surface flex flex-col pb-16 md:pb-0">
      {/* Desktop: fixed top bar with header + nav */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-40 bg-card border-b border-line">
        <div className="mx-auto max-w-3xl px-6">
          <LessonHeader lesson={lesson} activeTool={activeTool} compact={false} onSavePlan={handleSavePlan} />
          <ToolNav activeTool={activeTool} onSelect={setActiveTool} />
        </div>
      </div>

      {/* Mobile: compact sticky header */}
      <div className="md:hidden sticky top-0 z-40 bg-card border-b border-line">
        <div className="px-4">
          <LessonHeader lesson={lesson} activeTool={activeTool} compact={true} onSavePlan={handleSavePlan} />
        </div>
      </div>

<main className="flex-1 mx-auto w-full max-w-3xl px-4 md:px-6 pb-28 md:pb-12 pt-4 md:pt-20">
        <div className="hidden md:block" style={{ height: 120 }} />

        {activeTool === 'quickread' && (
          <>
            <div className="hidden md:block">
              <QuickRead lesson={lesson} />
            </div>
            <div className="md:hidden">
              <MobileQuickRead lesson={lesson} />
            </div>
          </>
        )}
        {activeTool === 'pathway' && (
          <LessonPathway lesson={lesson} onNavigate={setActiveTool} />
        )}
        {activeTool === 'adapt' && (
          <AdaptationGuardrails lesson={lesson} />
        )}
        {activeTool === 'thinking' && (
          <AnticipatedThinking lesson={lesson} />
        )}
        {activeTool === 'moves' && (
          <MoveWalkthrough lesson={lesson} />
        )}
</main>
    </div>
  )
}
