'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProficiencyBand } from '@/lib/eld';

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
  done: boolean;
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

export const freshPrep = (bands: ProficiencyBand[] = []): PrepState => ({
  view: 'home',
  ret: 'home',
  step: 0,
  maxStep: 0,
  started: null,
  stopped: null,
  done: false,
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
 */
export function usePrepState(key: string, initialBands: ProficiencyBand[]) {
  const storageKey = `dsst-prep:${key}`;
  const [st, setSt] = useState<PrepState>(() => freshPrep(initialBands));
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setSt({ ...freshPrep(initialBands), ...JSON.parse(raw) });
    } catch {
      /* no storage: start fresh */
    }
    loaded.current = true;
    // initialBands only seeds a fresh prep; it must not reset a saved one.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    if (!loaded.current) return;
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
    setSt(freshPrep(initialBands));
  }, [storageKey, initialBands]);

  return { st, update, reset };
}

/** Seconds of prep so far; the clock stops when the teacher carries the prep out. */
export function elapsedSeconds(st: PrepState, now: number): number {
  if (!st.started) return 0;
  return Math.max(0, ((st.stopped ?? now) - st.started) / 1000);
}

export function mmss(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}
