/**
 * Lesson cache — the same lesson yields the same plan.
 *
 * Everything else we did narrows run-to-run difference; only this removes it.
 * The measured position on 2026-08-20: with constrained decoding, a computed MLR
 * assignment, AND temperature pinned to 0 with thinking off, the anchor's
 * learning_target still came back 15 distinct across 15 activities. The API does
 * not give us reproducibility, so we stop asking it for the same lesson twice.
 *
 * Key = hash(pipeline version + model + extracted lesson text). Two teachers in
 * a PLC uploading the same PDF get byte-identical plans; a teacher who reloads
 * sees what they saw yesterday.
 *
 * The version, the model, AND a digest of the logic that shapes the output are
 * all IN the key. The digest covers the system prompt, the pass schemas, and the
 * selection tables, so editing any of them invalidates stored lessons without
 * anyone remembering to. PIPELINE_VERSION remains for changes those three do not
 * capture — a normalizer fix, say. Relying on the manual bump alone failed
 * twice: selection changed three times under one version string and stale
 * artifacts kept being served.
 *
 * Failure policy: the cache is an optimization, never a dependency. Every
 * operation swallows its errors — a broken or unconfigured store degrades to
 * generating fresh, which is exactly today's behavior.
 */

import { createHash } from 'node:crypto';
import { get, put } from '@vercel/blob';
import type { LessonData } from './types';
import { lessonIdentity } from './lessonIdentity';

// Bump when a prompt, schema, or normalizer change should invalidate the cache.
// 2026-08-22.3 — cache keys on lesson identity (grade/unit/lesson read from
// the document) rather than file text, so any export of a lesson matches.
//
// BUMP THIS when the SHAPE of the response changes. The automatic digest below
// covers the system prompt, the pass schemas and the selection tables, so
// changing what the model is asked or how a routine is chosen invalidates the
// cache on its own. It cannot see how the route assembles the response, so a new
// or renamed field needs this constant moved by hand. Getting that wrong has
// bitten three times now; the symptom is a stored lesson missing a field that
// downstream code expects.
export const PIPELINE_VERSION = '2026-08-22.3';

const PREFIX = 'lessons';

export interface CacheProvenance {
  pipeline_version: string;
  cache_key: string;
  provider: string;
  model: string;
  thinking: string;
  generated_at: string;
  served_from_cache: boolean;
}

export type CachedLesson = LessonData & { provenance?: CacheProvenance };

/**
 * A store connected to the project supplies BLOB_STORE_ID and an OIDC token; a
 * static BLOB_READ_WRITE_TOKEN also works (for local runs or an unlinked store).
 * With neither, caching is off and the pipeline behaves as it did before.
 */
export function isCacheEnabled(): boolean {
  return Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Identity of a lesson = the text we actually send the model, not the file. Two
 * different PDF exports of the same lesson should land on the same key, so the
 * text is whitespace-normalized before hashing.
 */
/**
 * Strip the parts of an export that change between downloads of the same
 * lesson, so two exports hash alike.
 *
 * Open Up prints a timestamp into every PDF footer — "8/22/26, 11:51 AM" — plus
 * the source URL and page markers. Hashing raw text meant a teacher who
 * re-exported Lesson 2 a minute later got a different key, missed the reviewed
 * artifact entirely, and paid for a fresh generation. Observed in production:
 * the same lesson succeeded in one tab and failed in another, because only one
 * of them was the file we had pre-generated from.
 *
 * Only export chrome is removed. Nothing that carries lesson content is touched.
 */
export function normalizeLessonText(lessonText: string): string {
  return lessonText
    // Print timestamps: "8/22/26, 11:51 AM"
    .replace(/\d{1,2}\/\d{1,2}\/\d{2,4},?\s*\d{1,2}:\d{2}(:\d{2})?\s*[AP]\.?M\.?/gi, ' ')
    // Source URLs printed into the footer
    .replace(/https?:\/\/\S+/g, ' ')
    // Footer page markers: "3/6"
    .replace(/\b\d{1,3}\s*\/\s*\d{1,3}\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * The cache key.
 *
 * Prefers the lesson's own identity — "Grade 6 Mathematics, Unit 2.2" — so every
 * export of a lesson lands on one entry and every teacher sees the same plan.
 * Falls back to hashing the text when a document does not identify itself, which
 * still gives same-file consistency; it just cannot recognise a re-export.
 *
 * Version, model and logic digest are folded in either way, so a change to any
 * of them still invalidates.
 */
export function lessonCacheKey(
  lessonText: string,
  model: string,
  logicFingerprint = '',
): string {
  const identity = lessonIdentity(lessonText);
  const basis = identity ? `id:${identity.key}` : `text:${normalizeLessonText(lessonText)}`;
  return createHash('sha256')
    .update(`${PIPELINE_VERSION}\n${model}\n${logicFingerprint}\n${basis}`)
    .digest('hex')
    .slice(0, 32);
}

/** Whether a lesson was recognised by identity rather than by text hash. */
export function cacheKeyBasis(lessonText: string): 'identity' | 'text-hash' {
  return lessonIdentity(lessonText) ? 'identity' : 'text-hash';
}

const pathFor = (key: string) => `${PREFIX}/${key}.json`;

export async function readCachedLesson(key: string): Promise<CachedLesson | null> {
  if (!isCacheEnabled()) return null;
  try {
    // useCache:false reads from origin. The CDN read cache also caches the 404
    // from a miss, and a stale negative entry makes a stored lesson look absent
    // — observed 2026-08-20: three sequential requests for the same PDF went
    // miss, hit, MISS, and the third regenerated a different plan. Origin reads
    // cost Fast Origin Transfer, which is nothing against a ~30s generation and
    // is the whole point of the cache.
    const result = await get(pathFor(key), { access: 'private', useCache: false });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as CachedLesson;
  } catch (err) {
    console.warn('[cache] read failed, generating fresh:', err);
    return null;
  }
}

export async function writeCachedLesson(key: string, lesson: CachedLesson): Promise<boolean> {
  if (!isCacheEnabled()) return false;
  try {
    await put(pathFor(key), JSON.stringify(lesson), {
      access: 'private',
      contentType: 'application/json',
      // First write wins. The stored lesson is the reviewed artifact, and a
      // spurious miss must never replace it with a freshly sampled one — that
      // would quietly undo the guarantee this whole module exists to provide.
      // Losing the race just means one wasted generation.
      allowOverwrite: false,
    });
    return true;
  } catch (err) {
    // An "already exists" rejection is the expected outcome of a lost race, not
    // a failure: the copy that is already there is the one we want to keep.
    if (err instanceof Error && /already exists/i.test(err.message)) {
      console.log('[cache] entry already present, keeping the stored copy');
      return true;
    }
    console.warn('[cache] write failed, continuing:', err);
    return false;
  }
}
