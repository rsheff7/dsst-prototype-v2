'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { LessonData } from './types';
import type { WidaLevel } from './eld';

interface LessonContextValue {
  lesson: LessonData | null;
  setLesson: (lesson: LessonData) => void;
  /**
   * Educator-selected WIDA level. Null = no level selected → no ELD
   * convergence guidance surfaces. The convergence layer is opt-in by
   * design; the tool doesn't assume a level on behalf of the educator.
   */
  selectedWidaLevel: WidaLevel | null;
  setSelectedWidaLevel: (level: WidaLevel | null) => void;
}

const LessonContext = createContext<LessonContextValue | null>(null);

export function LessonProvider({ children }: { children: ReactNode }) {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [selectedWidaLevel, setSelectedWidaLevel] = useState<WidaLevel | null>(null);
  return (
    <LessonContext.Provider
      value={{ lesson, setLesson, selectedWidaLevel, setSelectedWidaLevel }}
    >
      {children}
    </LessonContext.Provider>
  );
}

export function useLesson() {
  const ctx = useContext(LessonContext);
  if (!ctx) throw new Error('useLesson must be used within LessonProvider');
  return ctx;
}
