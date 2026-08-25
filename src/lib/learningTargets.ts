/**
 * Extract IM's published learning targets from the lesson text.
 *
 * Outcome drives the choice of routine, so the outcome has to be the most solid
 * thing in the pipeline. It was the least: the anchor pass was asked to write a
 * learning_target per activity, and that paraphrase came back 8-9 distinct
 * across 10 runs of one PDF. Everything keyed on it inherited the drift.
 *
 * IM already publishes the targets, and they are in the student pages we
 * receive, under a "Learning Targets" heading as "I can ..." / "I know ..."
 * statements. Reading them is deterministic; asking a model to restate them is
 * not. So we read them.
 *
 * Scope: IM publishes targets at the LESSON level, not per activity. This module
 * returns exactly what the document states and nothing more — inferring an
 * activity-level outcome is a separate job, done downstream against these as the
 * fixed reference.
 */

export interface LessonTargets {
  /** Verbatim published targets, in document order. */
  targets: string[];
  /** True when the document carried an explicit Learning Targets section. */
  explicit: boolean;
}

// IM prints these as first-person statements, and they frequently open with a
// conditional clause that is part of the target: "Given an expression, I can use
// various strategies ...". Matching on a line that STARTS with "I can" misses
// those entirely, so we work at sentence level and keep the leading clause.
const TARGET_SENTENCE = /\bI\s+(?:can|know)\b/i;

// The heading that opens the section.
const TARGETS_HEADING = /Learning\s+(?:Targets?|Goals?)\s*:?/i;

// Where the section stops. Without a bound we pick up any later "I can" — in
// G7 U6 L22 a practice problem quotes a student saying "I can tell that ...
// equals 0 just by looking at it", which is dialogue, not a learning target.
const SECTION_END = /(?:\n\s*\d{1,2}\.\d{1,2}\s|↓\s*Skip to main content|Lesson\s+\d+\s+Summary|Practice Problems)/i;

/**
 * Pull the published targets out of extracted lesson text.
 *
 * Conservative by design: reads only the bounded Learning Targets section. A
 * lesson with no published targets returns an empty list, which is a real
 * answer the caller must handle — not a failure to paper over by guessing.
 */
export function extractLessonTargets(lessonText: string): LessonTargets {
  if (!lessonText) return { targets: [], explicit: false };

  const headingMatch = TARGETS_HEADING.exec(lessonText);
  if (!headingMatch) return { targets: [], explicit: false };

  let section = lessonText.slice(headingMatch.index + headingMatch[0].length);
  const end = SECTION_END.exec(section);
  if (end) section = section.slice(0, end.index);

  // PDF extraction wraps a target across lines mid-sentence, so rejoin first,
  // then split on sentence boundaries.
  const joined = section.replace(/\s+/g, ' ').trim();

  const seen = new Set<string>();
  const targets: string[] = [];
  for (const sentence of joined.split(/(?<=\.)\s+/)) {
    if (!TARGET_SENTENCE.test(sentence)) continue;
    const cleaned = normalizeTarget(sentence);
    if (!cleaned) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    targets.push(cleaned);
  }

  return { targets, explicit: true };
}

/**
 * Tidy a matched line without changing its wording. PDF extraction leaves
 * collapsed whitespace and the occasional trailing page artifact; the words
 * themselves are IM's and stay untouched.
 */
function normalizeTarget(raw: string): string {
  const cleaned = raw
    .replace(/\s+/g, ' ')
    .replace(/\s*[.•]\s*$/, '')
    .trim();
  // A truncated fragment ("I can tell that equals 0 just by looking at") is
  // still the published wording as far as we are concerned — PDF extraction
  // drops inline math. Keep it; do not try to repair it.
  return cleaned.length >= 8 ? cleaned : '';
}

/**
 * The single target that best describes the lesson's destination, for prompts
 * and for outcome-first selection. IM lists several; the first is the broadest
 * in the lessons observed, but callers that need all of them should use
 * `targets` directly rather than relying on that.
 */
export function primaryTarget(targets: LessonTargets): string | null {
  return targets.targets[0] ?? null;
}
