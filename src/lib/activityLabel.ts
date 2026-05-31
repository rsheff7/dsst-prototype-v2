import { Activity } from './types';

export function activitySlot(title: string): string {
  const match = title.match(/^(Warm-Up|Activity\s+\d+|Lesson Synthesis|Cool-Down|Synthesis)/i);
  if (match) return match[1];
  const colonIdx = title.indexOf(':');
  if (colonIdx > 0) return title.slice(0, colonIdx);
  return title;
}

export function activityHeading(title: string): string {
  const colonIdx = title.indexOf(':');
  if (colonIdx > 0 && colonIdx < title.length - 1) return title.slice(colonIdx + 1).trim();
  return title;
}

export function activityShortLabel(activity: Pick<Activity, 'id' | 'title'>): string {
  return `${activity.id} ${activitySlot(activity.title)}`;
}

export function activityFullLabel(activity: Pick<Activity, 'id' | 'title'>): string {
  const heading = activityHeading(activity.title);
  const slot = activitySlot(activity.title);
  if (heading && heading !== slot) {
    return `${activity.id} ${slot} — ${heading}`;
  }
  return `${activity.id} ${slot}`;
}
