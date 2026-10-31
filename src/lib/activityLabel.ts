import { Activity } from './types';

/** 'crux' | 'feeder' | 'after' — mirrors Robert's FocusRole. */
export type FocusRole = 'crux' | 'feeder' | 'after';

/**
 * The slot name parsed from the title, e.g. "Warm-Up", "Activity 2",
 * "Lesson Synthesis". Falls back to the text before the first colon,
 * or the full title if no colon is present.
 */
export function activitySlot(title: string): string {
  const match = title.match(/^(Warm-Up|Activity\s+\d+|Lesson Synthesis|Cool-Down|Synthesis)/i);
  if (match) return match[1];
  const colonIdx = title.indexOf(':');
  if (colonIdx > 0) return title.slice(0, colonIdx);
  return title;
}

/**
 * The heading portion of the title (text after the first colon).
 * Returns the full title if no colon is present.
 */
export function activityHeading(title: string): string {
  const colonIdx = title.indexOf(':');
  if (colonIdx > 0 && colonIdx < title.length - 1) return title.slice(colonIdx + 1).trim();
  return title;
}

/**
 * The visible name for an activity card, mirroring Robert's `activityName`.
 * When the slot differs from the id (i.e. the title carries a recognisable
 * slot prefix), render "Slot (id)"; otherwise render the full title in
 * curly quotes with the id.
 */
export function activityName(a: Pick<Activity, 'id' | 'title'>): string {
  const label = activitySlot(a.title);
  if (label !== a.id) return `${label} (${a.id})`;
  return `\u201C${a.title}\u201D (${a.id})`;
}

/**
 * Locate the crux activity by position: first by `is_crux` flag, falling
 * back to `function === 'Crux'`. Returns -1 when neither matches.
 * Mirrors Robert's `findCruxIndex`.
 */
export function findCruxIndex(activities: Activity[]): number {
  const flagged = activities.findIndex((a) => a.is_crux);
  if (flagged >= 0) return flagged;
  return activities.findIndex((a) => a.function === 'Crux');
}

/**
 * Assign a focus role to each activity based on its positional
 * relationship to the crux. Mirrors Robert's `focusRoles`:
 *   i === crux               → 'crux'
 *   i === crux − 1           → 'feeder'
 *   i > crux AND high demand → 'after'
 *   otherwise                → null
 */
export function focusRoles(activities: Activity[]): (FocusRole | null)[] {
  const crux = findCruxIndex(activities);
  return activities.map((a, i) => {
    if (crux < 0) return null;
    if (i === crux) return 'crux';
    if (i === crux - 1) return 'feeder';
    if (i > crux && a.language_demand === 'high') return 'after';
    return null;
  });
}
