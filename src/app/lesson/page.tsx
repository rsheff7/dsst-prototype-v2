'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLesson } from '@/lib/lessonContext';
import LessonHeader from '@/components/shared/LessonHeader';
import ToolNav from '@/components/shared/ToolNav';
import LessonPathway from '@/components/tools/LessonPathway';
import AdaptationGuardrails from '@/components/tools/AdaptationGuardrails';
import AnticipatedThinking from '@/components/tools/AnticipatedThinking';
import MoveWalkthrough from '@/components/tools/MoveWalkthrough';

export type ToolId = 'pathway' | 'adapt' | 'thinking' | 'moves';

export default function LessonPage() {
  const { lesson } = useLesson();
  const router = useRouter();
  const [activeTool, setActiveTool] = useState<ToolId>('pathway');

  useEffect(() => {
    if (!lesson) router.replace('/');
  }, [lesson, router]);

  if (!lesson) return null;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Desktop: fixed top bar with header + nav */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-40 bg-card border-b border-line">
        <div className="mx-auto max-w-3xl px-6">
          <LessonHeader lesson={lesson} activeTool={activeTool} compact={false} />
          <ToolNav activeTool={activeTool} onSelect={setActiveTool} />
        </div>
      </div>

      {/* Mobile: compact sticky header */}
      <div className="md:hidden sticky top-0 z-40 bg-card border-b border-line">
        <div className="px-4">
          <LessonHeader lesson={lesson} activeTool={activeTool} compact={true} />
        </div>
      </div>

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 md:px-6 pb-28 md:pb-12">
        <div className="hidden md:block" style={{ height: 120 }} />

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

      {/* Mobile: fixed bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-line">
        <ToolNav activeTool={activeTool} onSelect={setActiveTool} mobile />
      </div>
    </div>
  );
}
