/**
 * Identify which lesson a PDF is, independent of how it was exported.
 *
 * The requirement is that a teacher uploading a lesson sees the same plan as
 * every other teacher uploading that lesson. Hashing the file's text cannot
 * deliver that: Open Up stamps the download time into every export, so two
 * downloads a minute apart are different bytes, different key, different plan.
 * Stripping the timestamp helped, but any export that renders differently — a
 * print dialog instead of a download, a different page range — still missed.
 *
 * Every Open Up export names itself in its title line: "Grade 6 Mathematics,
 * Unit 2.2 - Open Up Resources", where 2.2 is unit 2, lesson 2. That is stable
 * across exports because it describes the lesson rather than the download, and
 * it is what the cache keys on.
 *
 * Deliberately conservative. When the title line is absent we return null and
 * the caller falls back to hashing text. A cache miss costs one generation; a
 * WRONG identity would serve one lesson's plan for another, which is far worse
 * than a miss. So identity is claimed only from an unambiguous statement of
 * grade, unit and lesson — never inferred from activity numbering, which cannot
 * tell Grade 6 Lesson 2 from Grade 8 Lesson 2.
 */

export interface LessonIdentity {
  grade: number;
  unit: number;
  lesson: number;
  /** Stable string form used as the cache key, e.g. "g6-u2-l2". */
  key: string;
}

// "Grade 6 Mathematics, Unit 2.2 - Open Up Resources"
// Tolerates missing comma, extra whitespace, and "Math" for "Mathematics".
const TITLE_LINE = /Grade\s+(\d{1,2})\s+Math(?:ematics)?\s*,?\s*Unit\s+(\d{1,2})\.(\d{1,2})/i;

export function lessonIdentity(lessonText: string): LessonIdentity | null {
  if (!lessonText) return null;
  const m = TITLE_LINE.exec(lessonText);
  if (!m) return null;

  const grade = Number(m[1]);
  const unit = Number(m[2]);
  const lesson = Number(m[3]);
  if (!Number.isFinite(grade) || !Number.isFinite(unit) || !Number.isFinite(lesson)) return null;

  // Sanity bounds. A parse outside these is a misread, not a lesson, and a
  // misread must not become a cache key.
  if (grade < 1 || grade > 12) return null;
  if (unit < 1 || unit > 20) return null;
  if (lesson < 1 || lesson > 40) return null;

  return { grade, unit, lesson, key: `g${grade}-u${unit}-l${lesson}` };
}
