#!/usr/bin/env node
/**
 * Pre-generate the launch lesson set.
 *
 * The point is to move variance from a runtime risk to a review-time one. Every
 * lesson in the launch set gets generated once, checked, and reviewed by a human
 * before any teacher sees it; teachers then hit the cache and get the reviewed
 * artifact. Nobody waits ~30s, and nobody meets a generation failure.
 *
 * Requires the Blob store to be connected to the project — otherwise each run
 * generates fresh and populates nothing. The script says so rather than quietly
 * doing nothing useful.
 *
 *   node scripts/pregenerate.mjs --dir <pdf-dir> --endpoint <url> [options]
 *
 * Options
 *   --dir <path>       Directory of lesson PDFs (non-recursive).
 *   --pdf <path>       A single PDF; repeatable. Use instead of --dir.
 *   --endpoint <url>   App base URL. Default http://localhost:3000
 *   --out <dir>        Where generated lessons land.
 *                      Default benchmarks/runs/pregen-<stamp>
 *   --concurrency <n>  Parallel lessons. Default 2 — each request already fans
 *                      out to five model calls.
 *   --retries <n>      Retries per lesson on failure. Default 1.
 *   --stamp <label>    Names the output dir instead of a timestamp.
 *
 * Writes <out>/<key>.json per lesson, plus manifest.json and review.md — the
 * checklist a human works through before launch.
 */

import fs from 'node:fs';
import path from 'node:path';

/* ------------------------------------------------------------------ */
/*  Quality gate                                                       */
/* ------------------------------------------------------------------ */

const len = (x) => (Array.isArray(x) ? x.length : x ? 1 : 0);

// Each check returns null when it passes, or a human-readable reason when the
// lesson needs a person to look at it. These encode what the IM reviewers
// validated on 2026-06-01 plus the defects found on 2026-08-19/20.
const CHECKS = [
  [
    'meta types',
    (d) =>
      Object.entries(d.meta ?? {}).every(([, v]) => typeof v === 'string')
        ? null
        : 'meta has non-string fields — will fail .dsst re-import',
  ],
  [
    'destination form',
    (d) =>
      /^students can\b/i.test(d.destination ?? '')
        ? null
        : `destination does not open "Students can": "${(d.destination ?? '').slice(0, 60)}"`,
  ],
  [
    'chip coverage',
    (d) => {
      const missing = (d.wristband?.activities ?? []).reduce(
        (s, a) => s + (a.tiles ?? []).filter((t) => !t.mlr).length,
        0,
      );
      return missing === 0 ? null : `${missing} wristband tile(s) with no MLR chip`;
    },
  ],
  [
    'synthesis present',
    (d) =>
      (d.lesson_synthesis?.prompt ?? '').length > 40
        ? null
        : 'lesson_synthesis.prompt missing or too short',
  ],
  [
    'activity coverage',
    (d) => {
      const ids = (d.activities ?? []).map((a) => a.id);
      const blocks = {
        mlr_inference: d.mlr_inference?.activities,
        elsf_inference: d.elsf_inference?.activities,
        anticipated_thinking: d.anticipated_thinking?.activities,
        decision_guide: d.decision_guide?.activities,
        wristband: d.wristband?.activities,
      };
      const gaps = Object.entries(blocks)
        .map(([name, arr]) => {
          const got = (arr ?? []).map((a) => a.activity_id);
          const miss = ids.filter((i) => !got.includes(i));
          return miss.length ? `${name} missing ${miss.join(',')}` : null;
        })
        .filter(Boolean);
      return gaps.length ? gaps.join('; ') : null;
    },
  ],
  [
    'move density',
    (d) => {
      const thin = (d.activities ?? []).filter((a) => len(a.teacher_moves) < 2).map((a) => a.id);
      return thin.length ? `activities with <2 teacher moves: ${thin.join(',')}` : null;
    },
  ],
  [
    'crux marked',
    (d) => {
      const n = (d.activities ?? []).filter((a) => a.is_crux).length;
      return n === 1 ? null : `${n} activities marked crux (expected exactly 1)`;
    },
  ],
  [
    'MLL scenarios have proficiency moves',
    (d) => {
      const scenarios = (d.decision_guide?.activities ?? []).flatMap((a) => a.scenarios ?? []);
      const bad = scenarios.filter((s) => s.is_mll && !s.proficiency_moves?.emerging).length;
      return bad ? `${bad} MLL scenario(s) without proficiency moves` : null;
    },
  ],
];

function review(lesson) {
  const issues = [];
  for (const [name, fn] of CHECKS) {
    let reason;
    try {
      reason = fn(lesson);
    } catch (err) {
      reason = `check threw: ${err}`;
    }
    if (reason) issues.push({ check: name, reason });
  }
  return issues;
}

/* ------------------------------------------------------------------ */
/*  Generation                                                         */
/* ------------------------------------------------------------------ */

async function generate(endpoint, pdfPath, retries) {
  const buffer = fs.readFileSync(pdfPath);
  const name = path.basename(pdfPath);
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const form = new FormData();
    form.append('pdf', new Blob([buffer], { type: 'application/pdf' }), name);
    const started = Date.now();
    try {
      const res = await fetch(`${endpoint.replace(/\/$/, '')}/api/analyze`, {
        method: 'POST',
        body: form,
      });
      const text = await res.text();
      if (res.ok) return { ok: true, lesson: JSON.parse(text), ms: Date.now() - started, attempt };
      try {
        lastError = JSON.parse(text).error ?? text.slice(0, 200);
      } catch {
        lastError = text.slice(0, 200);
      }
    } catch (err) {
      lastError = String(err);
    }
  }
  return { ok: false, error: lastError };
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

function arg(name, fallback = undefined) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
}
function argAll(name) {
  const out = [];
  process.argv.forEach((a, i) => {
    if (a === `--${name}`) out.push(process.argv[i + 1]);
  });
  return out;
}

async function main() {
  const endpoint = arg('endpoint', 'http://localhost:3000');
  const concurrency = Number(arg('concurrency', 2));
  const retries = Number(arg('retries', 1));
  const dir = arg('dir');
  const singles = argAll('pdf');

  const pdfs = dir
    ? fs
        .readdirSync(dir)
        .filter((f) => f.toLowerCase().endsWith('.pdf'))
        .sort()
        .map((f) => path.join(dir, f))
    : singles;

  if (!pdfs.length) {
    console.error('Nothing to do — pass --dir <dir> or one or more --pdf <file>.');
    process.exit(2);
  }

  const stamp = arg('stamp') ?? `${pdfs.length}-lessons`;
  const outDir = arg('out', path.join('benchmarks', 'runs', `pregen-${stamp}`));
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`Pre-generating ${pdfs.length} lesson(s) against ${endpoint}`);
  console.log(`Output: ${outDir}\n`);

  const results = [];
  const queue = [...pdfs.entries()];
  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (queue.length) {
      const [index, pdfPath] = queue.shift();
      const file = path.basename(pdfPath);
      const res = await generate(endpoint, pdfPath, retries);

      if (!res.ok) {
        console.log(`  [${index + 1}] FAIL  ${file} — ${res.error}`);
        results.push({ file, ok: false, error: res.error });
        continue;
      }

      const lesson = res.lesson;
      const key = lesson.provenance?.cache_key ?? 'unkeyed';
      const issues = review(lesson);
      fs.writeFileSync(path.join(outDir, `${key}.json`), JSON.stringify(lesson, null, 2));

      console.log(
        `  [${index + 1}] ${issues.length ? 'REVIEW' : 'OK    '} ${file} — ` +
          `${lesson.meta?.lesson_title ?? '?'} (${(res.ms / 1000).toFixed(1)}s${
            lesson.provenance?.served_from_cache ? ', cached' : ''
          })${issues.length ? ` — ${issues.length} issue(s)` : ''}`,
      );

      results.push({
        file,
        ok: true,
        key,
        title: lesson.meta?.lesson_title ?? '',
        grade: lesson.meta?.grade ?? '',
        unit: lesson.meta?.unit ?? '',
        lesson_number: lesson.meta?.lesson_number ?? '',
        ms: res.ms,
        cached: Boolean(lesson.provenance?.served_from_cache),
        provenance: lesson.provenance ?? null,
        issues,
      });
    }
  });
  await Promise.all(workers);

  results.sort((a, b) => pdfs.findIndex((p) => path.basename(p) === a.file) - pdfs.findIndex((p) => path.basename(p) === b.file));

  const ok = results.filter((r) => r.ok);
  const clean = ok.filter((r) => !r.issues.length);
  const cachedCount = ok.filter((r) => r.cached).length;

  const L = [];
  L.push('# Pre-generation review');
  L.push('');
  L.push(`- **Endpoint:** ${endpoint}`);
  L.push(`- **Lessons:** ${results.length} attempted, ${ok.length} generated, ${clean.length} clean`);
  L.push(`- **Served from cache:** ${cachedCount}`);
  if (ok.length && cachedCount === 0) {
    L.push('');
    L.push(
      '> No lesson was served from cache. If this is a re-run, the Blob store is ' +
        'probably not connected to the project — generation still works, but nothing ' +
        'is being stored, so teachers will not get identical plans.',
    );
  }
  L.push('');

  const failed = results.filter((r) => !r.ok);
  if (failed.length) {
    L.push('## Failed to generate');
    L.push('');
    for (const f of failed) L.push(`- \`${f.file}\` — ${String(f.error).replace(/\|/g, '\\|')}`);
    L.push('');
  }

  L.push('## Needs review');
  L.push('');
  const needsReview = ok.filter((r) => r.issues.length);
  if (!needsReview.length) {
    L.push('None — every generated lesson passed all checks.');
  } else {
    for (const r of needsReview) {
      L.push(`### ${r.title || r.file}`);
      L.push('');
      L.push(`- file: \`${r.file}\`  ·  key: \`${r.key}\``);
      for (const i of r.issues) L.push(`- **${i.check}** — ${i.reason}`);
      L.push('');
    }
  }
  L.push('');

  L.push('## All lessons');
  L.push('');
  L.push('| # | lesson | grade/unit | key | status |');
  L.push('|---|---|---|---|---|');
  results.forEach((r, i) => {
    if (!r.ok) {
      L.push(`| ${i + 1} | \`${r.file}\` | — | — | FAILED |`);
      return;
    }
    L.push(
      `| ${i + 1} | ${r.title} | ${r.grade} ${r.unit} ${r.lesson_number} | \`${r.key}\` | ${
        r.issues.length ? `${r.issues.length} issue(s)` : 'clean'
      } |`,
    );
  });

  fs.writeFileSync(path.join(outDir, 'review.md'), L.join('\n') + '\n');
  fs.writeFileSync(
    path.join(outDir, 'manifest.json'),
    JSON.stringify({ endpoint, generatedCount: ok.length, results }, null, 2),
  );

  console.log(`\n${ok.length}/${results.length} generated, ${clean.length} clean, ${cachedCount} from cache`);
  console.log(`Review checklist: ${path.join(outDir, 'review.md')}`);

  if (failed.length) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
