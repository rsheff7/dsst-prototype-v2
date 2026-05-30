'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { LessonData } from './types';

interface LessonContextValue {
  lesson: LessonData | null;
  setLesson: (lesson: LessonData) => void;
}

const LessonContext = createContext<LessonContextValue | null>(null);

export function LessonProvider({ children }: { children: ReactNode }) {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  return (
    <LessonContext.Provider value={{ lesson, setLesson }}>
      {children}
    </LessonContext.Provider>
  );
}

export function useLesson() {
  const ctx = useContext(LessonContext);
  if (!ctx) throw new Error('useLesson must be used within LessonProvider');
  return ctx;
}
