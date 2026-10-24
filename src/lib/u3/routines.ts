/**
 * IM's routine catalog (content/routines.json), looked up the way the checker
 * does: by exact name, or by MLR number when IM writes "MLR 7" or "MLR7: …".
 */
import type { Routine } from './types';
import routinesJson from '../../../content/routines.json';

export const ROUTINE_LIST = (routinesJson as unknown as { routines: Routine[] }).routines;

const mlrNumber = (name: string) => /^MLR ?(\d)/.exec(name)?.[1] ?? null;

export function findRoutine(name: string | null | undefined): Routine | null {
  if (!name) return null;
  const n = mlrNumber(name);
  return ROUTINE_LIST.find((r) => r.name === name) ?? (n ? ROUTINE_LIST.find((r) => String(r.mlr) === n) : undefined) ?? null;
}

/** "MLR7: Compare and Connect" → "Compare and Connect (MLR 7)"; other routines as IM names them. */
export function routineTitle(name: string): string {
  const r = findRoutine(name);
  const base = r?.name ?? name;
  const m = /^MLR ?(\d):\s*(.+)$/.exec(base);
  return m ? `${m[2]} (MLR ${m[1]})` : base;
}
