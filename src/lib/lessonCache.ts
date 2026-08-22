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

// Bump when a prompt, schema, or normalizer change should invalidate the cache.
// 2026-08-21.1 — outcome-first MLR selection: the anchor now carries each
// activity's outcome and its classification, routines are chosen from that
// rather than from a keyword scan, and an activity may carry one routine
// instead of two. Every stored artifact predates that model.
export const PIPELINE_VERSION = '2026-08-21.1';

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
export function lessonCacheKey(
  lessonText: string,
  model: string,
  logicFingerprint = '',
): string {
  const normalized = lessonText.replace(/\s+/g, ' ').trim();
  return createHash('sha256')
    .update(`${PIPELINE_VERSION}\n${model}\n${logicFingerprint}\n${normalized}`)
    .digest('hex')
    .slice(0, 32);
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
