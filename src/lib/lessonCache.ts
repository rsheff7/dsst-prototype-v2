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
 * The version and model are IN the key on purpose. A prompt or schema change
 * must not keep serving artifacts built by the old pipeline, and switching
 * models must not silently serve the previous model's work. Bump
 * PIPELINE_VERSION whenever a change should invalidate what is stored.
 *
 * Failure policy: the cache is an optimization, never a dependency. Every
 * operation swallows its errors — a broken or unconfigured store degrades to
 * generating fresh, which is exactly today's behavior.
 */

import { createHash } from 'node:crypto';
import { get, put } from '@vercel/blob';
import type { LessonData } from './types';

// Bump when a prompt, schema, or normalizer change should invalidate the cache.
export const PIPELINE_VERSION = '2026-08-20.1';

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
export function lessonCacheKey(lessonText: string, model: string): string {
  const normalized = lessonText.replace(/\s+/g, ' ').trim();
  return createHash('sha256')
    .update(`${PIPELINE_VERSION}\n${model}\n${normalized}`)
    .digest('hex')
    .slice(0, 32);
}

const pathFor = (key: string) => `${PREFIX}/${key}.json`;

export async function readCachedLesson(key: string): Promise<CachedLesson | null> {
  if (!isCacheEnabled()) return null;
  try {
    // Pathnames are content-addressed and never overwritten, so the default
    // cached read is correct here and avoids origin transfer on every hit.
    const result = await get(pathFor(key), { access: 'private' });
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
      // Content-addressed, so a repeat write is the same bytes. Allowing
      // overwrite keeps a concurrent double-generation from throwing.
      allowOverwrite: true,
    });
    return true;
  } catch (err) {
    console.warn('[cache] write failed, continuing:', err);
    return false;
  }
}
