#!/usr/bin/env node
/**
 * Variance harness — runs the same lesson PDF through /api/analyze N times and
 * reports how far the outputs drift from each other.
 *
 * The point is to make variance a number we track, not a thing we notice. Every
 * change aimed at consistency (response schema, pinned sampling params, anchor
 * expansion, cardinality specs) gets validated against a baseline from here.
 *
 *   node benchmarks/variance/harness.mjs --pdf <path> --runs 8 [options]
 *
 * Options
 *   --pdf <path>        Lesson PDF to send.                       (required unless --analyze-only)
 *   --runs <n>          How many times to run it.                 (default 5)
 *   --endpoint <url>    Base URL of the app.                      (default http://localhost:3000)
 *   --label <name>      Names the output folder.                  (default "run")
 *   --concurrency <n>   Parallel requests. Keep low — the pipeline
 *                       already fans out 4 passes per request.    (default 1)
 *   --analyze-only <d>  Re-report an existing run folder without spending tokens.
 *   --max-cv <f>        Exit 1 if any metric's coefficient of variation
 *                       exceeds this. For CI. Off by default.
 *
 * Outputs land in benchmarks/runs/variance-<label>-<n>/ (gitignored):
 *   run-<i>.json    raw response per successful run
 *   summary.json    machine-readable metrics
 *   report.md       the human-readable table
 */

import fs from 'node:fs';
import path from 'node:path';

/* ------------------------------------------------------------------ */
/*  Metrics                                                            */
/* ------------------------------------------------------------------ */

const len = (x) => (Array.isArray(x) ? x.length : x ? 1 : 0);
const sum = (arr, f) => (arr ?? []).reduce((s, x) => s + f(x), 0);

// Each metric is a single number per run. Spread across runs is what we report.
const METRICS = {
  activities: (d) => len(d.activities),
  teacher_moves: (d) => sum(d.activities, (a) => len(a.teacher_moves)),
  friction_points: (d) => sum(d.activities, (a) => len(a.friction_points)),
  success_signals: (d) => sum(d.activities, (a) => len(a.success_signals)),
  wristband_tiles: (d) => sum(d.wristband?.activities, (a) => len(a.tiles)),
  tiles_with_mlr: (d) =>
    sum(d.wristband?.activities, (a) => (a.tiles ?? []).filter((t) => t.mlr).length),
  mlrs_assigned: (d) => sum(d.mlr_inference?.activities, (a) => len(a.mlrs)),
  sentence_frames: (d) => sum(d.anticipated_thinking?.activities, (a) => len(a.sentence_frames)),
  thinking_patterns: (d) => sum(d.anticipated_thinking?.activities, (a) => len(a.patterns)),
  questions_to_listen: (d) =>
    sum(d.anticipated_thinking?.activities, (a) => len(a.questions_to_listen_for)),
  decision_scenarios: (d) => sum(d.decision_guide?.activities, (a) => len(a.scenarios)),
  preflight: (d) => len(d.wristband?.preflight),
  top_signals: (d) => len(d.wristband?.top_signals),
  top_frictions: (d) => len(d.wristband?.top_frictions),
  key_vocabulary: (d) => len(d.key_vocabulary),
  safe_to_change: (d) => len(d.adaptation_guardrails?.safe_to_change),
  do_not_remove: (d) => len(d.adaptation_guardrails?.do_not_remove),
  lesson_synthesis_chars: (d) => (d.lesson_synthesis?.prompt ?? '').length,
  builds_on: (d) => len(d.lesson_synthesis?.builds_on),
  size_kb: (d) => Math.round(JSON.stringify(d).length / 1024),
};

// Content-level checks — these catch drift that counts alone miss.
function fingerprint(d) {
  const mlrsByActivity = {};
  for (const a of d.mlr_inference?.activities ?? []) {
    mlrsByActivity[a.activity_id] = (a.mlrs ?? []).map((m) => m.number).sort((x, y) => x - y);
  }
  const chipsByActivity = {};
  for (const a of d.wristband?.activities ?? []) {
    chipsByActivity[a.activity_id] = (a.tiles ?? []).map((t) => (t.mlr ? t.mlr.number : null));
  }
  const frictionMix = {};
  for (const a of d.wristband?.activities ?? []) {
    for (const t of a.tiles ?? []) {
      const k = t.friction_type ?? 'none';
      frictionMix[k] = (frictionMix[k] ?? 0) + 1;
    }
  }
  return {
    activity_ids: (d.activities ?? []).map((a) => a.id),
    crux: (d.activities ?? []).filter((a) => a.is_crux).map((a) => a.id),
    mlrs_by_activity: mlrsByActivity,
    chips_by_activity: chipsByActivity,
    friction_mix: frictionMix,
    meta_types: Object.fromEntries(Object.entries(d.meta ?? {}).map(([k, v]) => [k, typeof v])),
    destination_is_swbat: /^students can\b/i.test(d.destination ?? ''),
    tiles_missing_mlr: sum(d.wristband?.activities, (a) => (a.tiles ?? []).filter((t) => !t.mlr).length),
  };
}

/* ------------------------------------------------------------------ */
/*  Stats                                                              */
/* ------------------------------------------------------------------ */

function stats(values) {
  if (!values.length) return { min: 0, max: 0, mean: 0, sd: 0, cv: 0, spread: 0 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  const sd = Math.sqrt(variance);
  return { min, max, mean, sd, cv: mean === 0 ? 0 : sd / mean, spread: max - min };
}

const uniq = (vals) => [...new Set(vals.map((v) => JSON.stringify(v)))];

// The dimensions we check for content drift. Shared by the report and
// summary.json so a before/after comparison can diff either one.
const CONTENT_CHECKS = [
  ['activity_ids', (f) => f.activity_ids],
  ['crux', (f) => f.crux],
  ['mlrs_by_activity', (f) => f.mlrs_by_activity],
  ['chips_by_activity', (f) => f.chips_by_activity],
  ['friction_mix', (f) => f.friction_mix],
  ['meta_types', (f) => f.meta_types],
];

function contentSummary(datasets) {
  const fps = datasets.map(fingerprint);
  const out = {};
  for (const [name, get] of CONTENT_CHECKS) {
    const variants = uniq(fps.map(get));
    out[`content.${name}`] = { distinct: variants.length, variants };
  }
  out['content.destination_swbat'] = {
    matching: fps.filter((f) => f.destination_is_swbat).length,
    total: fps.length,
  };
  out['content.tiles_missing_mlr'] = { values: fps.map((f) => f.tiles_missing_mlr) };
  return out;
}

/* ------------------------------------------------------------------ */
/*  Execution                                                          */
/* ------------------------------------------------------------------ */

async function runOnce(endpoint, pdfBuffer, pdfName, index) {
  const form = new FormData();
  form.append('pdf', new Blob([pdfBuffer], { type: 'application/pdf' }), pdfName);
  const started = Date.now();
  try {
    const res = await fetch(`${endpoint.replace(/\/$/, '')}/api/analyze`, {
      method: 'POST',
      body: form,
    });
    const ms = Date.now() - started;
    const text = await res.text();
    if (!res.ok) {
      let detail = text.slice(0, 300);
      try {
        detail = JSON.parse(text).error ?? detail;
      } catch {
        /* non-JSON error body — keep the raw slice */
      }
      return { index, ok: false, status: res.status, ms, error: detail };
    }
    return { index, ok: true, status: res.status, ms, data: JSON.parse(text) };
  } catch (err) {
    return { index, ok: false, status: 0, ms: Date.now() - started, error: String(err) };
  }
}

// Classify a failure so the report can distinguish "the model emitted bad JSON"
// from "we ran out of time" — they need different fixes.
function classify(error) {
  if (/not valid JSON/i.test(error)) return 'invalid-json';
  if (/no text/i.test(error)) return 'empty-response';
  if (/truncated|max_tokens/i.test(error)) return 'truncated';
  if (/timeout|timed out|aborted/i.test(error)) return 'timeout';
  if (/rate limit/i.test(error)) return 'rate-limit';
  if (/API key/i.test(error)) return 'auth';
  return 'other';
}

function failingPass(error) {
  const m = /Pass ([0-9A-D][^ ]*(?: \([^)]*\))?)/.exec(error);
  return m ? m[1] : null;
}

/* ------------------------------------------------------------------ */
/*  Reporting                                                          */
/* ------------------------------------------------------------------ */

function buildReport(meta, results, datasets) {
  const L = [];
  const ok = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);

  L.push(`# Variance report — ${meta.label}`);
  L.push('');
  L.push(`- **Endpoint:** ${meta.endpoint}`);
  L.push(`- **PDF:** ${meta.pdfName}`);
  L.push(`- **Runs attempted:** ${results.length}`);
  L.push(`- **Succeeded:** ${ok.length} (${Math.round((ok.length / results.length) * 100)}%)`);
  const durations = ok.map((r) => r.ms);
  if (durations.length) {
    const d = stats(durations);
    L.push(`- **Wall time:** ${(d.min / 1000).toFixed(1)}–${(d.max / 1000).toFixed(1)}s (mean ${(d.mean / 1000).toFixed(1)}s)`);
  }
  L.push('');
  L.push('> Responses carry no model/provider stamp, so this records the endpoint only.');
  L.push('> Confirm the deployment config separately when comparing across runs.');
  L.push('');

  if (failed.length) {
    L.push('## Failures');
    L.push('');
    L.push('| run | status | category | pass | detail |');
    L.push('|---|---|---|---|---|');
    for (const f of failed) {
      L.push(`| ${f.index} | ${f.status} | ${classify(f.error)} | ${failingPass(f.error) ?? '—'} | ${f.error.replace(/\|/g, '\\|').slice(0, 90)} |`);
    }
    L.push('');
  }

  if (datasets.length < 2) {
    L.push('_Fewer than two successful runs — no spread to report._');
    return L.join('\n');
  }

  L.push('## Metric spread');
  L.push('');
  L.push(`| metric | ${datasets.map((_, i) => `r${i + 1}`).join(' | ')} | min–max | CV | verdict |`);
  L.push(`|---|${datasets.map(() => '---').join('|')}|---|---|---|`);

  const summary = {};
  for (const [name, fn] of Object.entries(METRICS)) {
    const vals = datasets.map((d) => {
      try {
        return fn(d);
      } catch {
        return 0;
      }
    });
    const s = stats(vals);
    summary[name] = { values: vals, ...s };
    const verdict = s.spread === 0 ? 'stable' : s.cv > 0.15 ? '**VOLATILE**' : 'minor';
    L.push(
      `| ${name} | ${vals.join(' | ')} | ${s.min}–${s.max} | ${(s.cv * 100).toFixed(0)}% | ${verdict} |`,
    );
  }
  L.push('');

  L.push('## Content stability');
  L.push('');
  const fps = datasets.map(fingerprint);
  L.push('| check | distinct values across runs | verdict |');
  L.push('|---|---|---|');
  for (const [name, get] of CONTENT_CHECKS) {
    const variants = uniq(fps.map(get));
    L.push(`| ${name} | ${variants.length} | ${variants.length === 1 ? 'stable' : '**VOLATILE**'} |`);
  }
  L.push('');

  const swbat = fps.filter((f) => f.destination_is_swbat).length;
  L.push(`- **destination matches "Students can…":** ${swbat}/${fps.length}`);
  const missing = fps.map((f) => f.tiles_missing_mlr);
  L.push(`- **wristband tiles with no MLR chip:** ${missing.join(', ')}`);
  L.push('');

  L.push('## Where the variance is');
  L.push('');
  const volatile = Object.entries(summary)
    .filter(([k, v]) => !k.startsWith('content.') && v.spread > 0)
    .sort((a, b) => b[1].cv - a[1].cv)
    .slice(0, 8);
  if (!volatile.length) {
    L.push('No metric varied. ');
  } else {
    for (const [name, v] of volatile) {
      L.push(`- \`${name}\`: ${v.min}–${v.max} (CV ${(v.cv * 100).toFixed(0)}%)`);
    }
  }

  return L.join('\n');
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

function arg(name, fallback = undefined) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
}

async function main() {
  const analyzeOnly = arg('analyze-only');
  const label = arg('label', 'run');
  const endpoint = arg('endpoint', 'http://localhost:3000');
  const runs = Number(arg('runs', 5));
  const concurrency = Number(arg('concurrency', 1));
  const maxCv = arg('max-cv') ? Number(arg('max-cv')) : null;

  let outDir;
  let results = [];
  let meta;

  if (analyzeOnly) {
    outDir = analyzeOnly;
    meta = JSON.parse(fs.readFileSync(path.join(outDir, 'summary.json'), 'utf8')).meta;
    results = fs
      .readdirSync(outDir)
      .filter((f) => /^run-\d+\.json$/.test(f))
      .sort()
      .map((f, i) => ({ index: i + 1, ok: true, status: 200, ms: 0, data: JSON.parse(fs.readFileSync(path.join(outDir, f), 'utf8')) }));
  } else {
    const pdfPath = arg('pdf');
    if (!pdfPath) {
      console.error('--pdf is required (or use --analyze-only <dir>)');
      process.exit(2);
    }
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfName = path.basename(pdfPath);
    meta = { label, endpoint, pdfName, runs };

    outDir = path.join('benchmarks', 'runs', `variance-${label}-${runs}`);
    fs.mkdirSync(outDir, { recursive: true });

    console.log(`Running ${runs}x against ${endpoint} (concurrency ${concurrency})`);
    const queue = Array.from({ length: runs }, (_, i) => i + 1);
    const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
      while (queue.length) {
        const i = queue.shift();
        const r = await runOnce(endpoint, pdfBuffer, pdfName, i);
        results.push(r);
        console.log(
          `  run ${i}: ${r.ok ? 'OK' : 'FAIL'} ${(r.ms / 1000).toFixed(1)}s${r.ok ? '' : ' — ' + classify(r.error)}`,
        );
      }
    });
    await Promise.all(workers);
    results.sort((a, b) => a.index - b.index);

    let n = 0;
    for (const r of results) {
      if (r.ok) fs.writeFileSync(path.join(outDir, `run-${++n}.json`), JSON.stringify(r.data, null, 2));
    }
  }

  const datasets = results.filter((r) => r.ok).map((r) => r.data);
  const report = buildReport(meta, results, datasets);
  fs.writeFileSync(path.join(outDir, 'report.md'), report + '\n');

  const summary = {
    meta,
    generatedFrom: meta.endpoint,
    successRate: datasets.length / Math.max(1, results.length),
    results: results.map(({ data, ...rest }) => rest),
    ...contentSummary(datasets),
  };
  for (const [name, fn] of Object.entries(METRICS)) {
    const vals = datasets.map((d) => {
      try {
        return fn(d);
      } catch {
        return 0;
      }
    });
    summary[name] = { values: vals, ...stats(vals) };
  }
  fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));

  console.log('\n' + report);
  console.log(`\nWritten to ${outDir}/`);

  if (maxCv !== null) {
    const breached = Object.entries(summary).filter(
      ([k, v]) => v && typeof v === 'object' && 'cv' in v && v.cv > maxCv,
    );
    if (breached.length) {
      console.error(`\nFAIL: ${breached.length} metric(s) exceed CV ${maxCv}: ${breached.map(([k]) => k).join(', ')}`);
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
