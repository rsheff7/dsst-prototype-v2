import { NextRequest, NextResponse } from 'next/server';
import { del, list } from '@vercel/blob';

/**
 * Empties the lesson cache.
 *
 * Bumping PIPELINE_VERSION makes stored lessons unreachable but leaves the blobs
 * in place. Actually deleting them needs the plaintext BLOB_READ_WRITE_TOKEN,
 * which the CLI wants and the API only returns encrypted — so the deletion runs
 * here, where the token is already in the runtime environment and never has to
 * be written anywhere.
 *
 * Gated behind DSST_ALLOW_CACHE_BYPASS, which is set on preview only, so this is
 * unreachable on production. Add ?dry=1 to see what would go without deleting.
 *
 *   curl -X POST "<preview-url>/api/cache-purge?dry=1"
 *   curl -X POST "<preview-url>/api/cache-purge"
 */
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (process.env.DSST_ALLOW_CACHE_BYPASS !== 'true') {
    return NextResponse.json(
      { error: 'not enabled on this deployment — preview only' },
      { status: 403 },
    );
  }

  const dryRun = req.nextUrl.searchParams.get('dry') === '1';
  const deleted: string[] = [];
  let cursor: string | undefined;

  try {
    do {
      const page = await list({ prefix: 'lessons/', cursor, limit: 1000 });
      for (const blob of page.blobs) {
        if (!dryRun) await del(blob.url);
        deleted.push(blob.pathname);
      }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);

    return NextResponse.json({ dryRun, count: deleted.length, sample: deleted.slice(0, 20) });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err), deletedSoFar: deleted.length },
      { status: 500 },
    );
  }
}
