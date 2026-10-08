'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ProficiencyBand } from '@/lib/eld';
import type { LessonData } from '@/lib/types';

export type PrepView = 'home' | 'step' | 'library' | 'incl';
export type LibraryTab = 'quickread' | 'pathway' | 'thinking' | 'moves' | 'adapt';

export interface PrepState {
  view: PrepView;
  /** Where Back goes from the Library or the In-class card. */
  ret: 'home' | 'step';
  step: number;
  maxStep: number;
  started: number | null;
  stopped: number | null;
  /** Milliseconds of prep with the page open. Time away from the page is not prep time. */
  spent: number;
  done: boolean;
  /** Which lesson content this progress was made against. See usePrepState. */
  sig: string;
  /** Class ELD profile: which planning bands are in the room. Empty = show all. */
  bands: ProficiencyBand[];
  answer: string;
  answerChecked: boolean;
  lookFors: Record<string, boolean>;
  saidAloud: boolean;
  prediction: string;
  predictionHowMany: 'Most' | 'Some' | 'Few' | null;
  predictionRevealed: boolean;
  ri: number;
  said: Record<string, boolean>;
  crit: Record<string, boolean>;
  model: Record<string, boolean>;
  flags: Record<string, boolean>;
  cuts: Record<string, boolean>;
  setupDone: Record<string, boolean>;
  lib: LibraryTab;
}

export const freshPrep = (bands: ProficiencyBand[] = [], sig = ''): PrepState => ({
  view: 'home',
  ret: 'home',
  step: 0,
  maxStep: 0,
  started: null,
  stopped: null,
  spent: 0,
  done: false,
  sig,
  bands,
  answer: '',
  answerChecked: false,
  lookFors: {},
  saidAloud: false,
  prediction: '',
  predictionHowMany: null,
  predictionRevealed: false,
  ri: 0,
  said: {},
  crit: {},
  model: {},
  flags: {},
  cuts: {},
  setupDone: {},
  lib: 'quickread',
});

/**
 * Prep progress for one lesson, kept in this browser so a teacher can stop and
 * resume. Storage can be missing (private windows, blocked site data); prep
 * still works, it just won't survive a reload.
 *
 * Ticks and flags are stored by position ("scenario 2", "look-for 1"), so they
 * only mean something against the content they were made on. `sig` names that
 * content; progress saved against a different analysis of the same lesson is
 * dropped rather than attached to the wrong scenarios.
 */
export function usePrepState(key: string, sig: string, initialBands: ProficiencyBand[]) {
  const storageKey = `dsst-prep:${key}`;
  // Read in the initializer, not an effect: an effect-time read lets the first
  // save write a fresh state over the saved one. Safe because PrepApp only ever
  // renders in the browser (the lesson it needs is never there on the server).
  const [st, setSt] = useState<PrepState>(() => {
    const fresh = freshPrep(initialBands, sig);
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
      if (saved && saved.sig === sig) return { ...fresh, ...saved };
    } catch {
      /* no storage: start fresh */
    }
    return fresh;
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(st));
    } catch {
      /* no storage */
    }
  }, [st, storageKey]);

  const update = useCallback((patch: Partial<PrepState> | ((s: PrepState) => Partial<PrepState>)) => {
    setSt((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));
  }, []);

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      /* no storage */
    }
    setSt(freshPrep(initialBands, sig));
  }, [storageKey, initialBands, sig]);

  return { st, update, reset };
}

/** Seconds of prep so far: time with the page open, up to carrying the prep out. */
export function elapsedSeconds(st: PrepState): number {
  return st.spent / 1000;
}

const LAST_LESSON = 'dsst-prep:lesson';

/**
 * The lesson itself lives only in memory (lessonContext), so a reload — or a
 * phone dropping the tab overnight — would lose it and the prep with it. /prep
 * keeps the lesson it last opened and reopens it.
 */
export function saveLastLesson(lesson: LessonData) {
  try {
    localStorage.setItem(LAST_LESSON, JSON.stringify(lesson));
  } catch {
    /* no storage, or the lesson is too big for it: a reload goes home */
  }
}

export function loadLastLesson(): LessonData | null {
  try {
    const saved = JSON.parse(localStorage.getItem(LAST_LESSON) ?? 'null');
    return saved?.meta && Array.isArray(saved.activities) ? saved : null;
  } catch {
    return null;
  }
}

export function mmss(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}
