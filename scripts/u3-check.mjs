#!/usr/bin/env node
/**
 * Check the Unit 3 content against its sources and against the prep standard.
 *
 *   node scripts/u3-check.mjs            (also: npm run check:u3)
 *
 * IM layer (content/u3/im/*.json): every line IM wrote must appear in the
 * sources, word for word. Premo layer (content/u3/premo/*.json): anything it
 * attributes to IM must be IM's exact words, and the rules from
 * premo-ssa/docs/GENERATION-PROMPT.md that a machine can check must hold.
 * Exits non-zero on any error. Warnings are printed and do not fail.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('content/u3');
const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);
const norm = (s) => String(s).replace(/\\\$/g, '$').replace(/\s+/g, ' ').trim();
const unquote = (s) => norm(s).replace(/^[“"‘']+|[”"’']+$/g, '');
const words = (s) => norm(s).split(' ').filter(Boolean).length;
const PLACEHOLDER = /^(n\/?a|none|null|tbd|-+|—)\.?$/i;

const read = (f) => fs.readFileSync(f, 'utf8');
const json = (f) => JSON.parse(read(f));
const flat = (x) => (Array.isArray(x) ? x.flatMap(flat) : x && typeof x === 'object' ? Object.values(x).flatMap(flat) : typeof x === 'string' ? [x] : []);

const routines = json(path.resolve('content/routines.json')).routines;
const routineByName = new Map(routines.map((r) => [r.name, r]));
const mlrNumber = (name) => /^MLR ?(\d)/.exec(name)?.[1] ?? null;
const findRoutine = (name) => routineByName.get(name) ?? routines.find((r) => mlrNumber(name) && String(r.mlr) === mlrNumber(name));

const shared = [
  read(path.join(ROOT, 'source/tg-unit.txt')),
  read(path.join(ROOT, 'source/im-course-routines.txt')),
  read(path.join(ROOT, 'source/im-course-design-principles.txt')),
].map(norm);

function sourcesFor(code) {
  const texts = [...shared];
  for (const f of fs.readdirSync(path.join(ROOT, 'source'))) if (f.startsWith(code + '-')) texts.push(norm(read(path.join(ROOT, 'source', f))));
  const tg = path.join(ROOT, 'tg', `${code}.json`);
  if (fs.existsSync(tg)) texts.push(norm(flat(json(tg)).join('\n')));
  return texts;
}
const inSources = (texts, s) => texts.some((t) => t.includes(norm(s)));

// ---------------------------------------------------------------------------
// IM layer
// ---------------------------------------------------------------------------
const imFiles = fs.readdirSync(path.join(ROOT, 'im')).filter((f) => f.endsWith('.json'));
const imByCode = new Map();
for (const f of imFiles) {
  const l = json(path.join(ROOT, 'im', f));
  imByCode.set(l.code, l);
  const at = `im/${f}`;
  const src = sourcesFor(l.code);
  const verbatim = [
    ...l.goals.map((g) => g.text),
    ...l.targets,
    ...l.narrative,
    ...l.materials,
    ...l.preparation,
    ...l.lessonSynthesis,
    ...l.summary,
    ...(l.coolDown.task ?? []),
    ...(l.coolDown.response ?? []),
  ];
  for (const a of l.activities) {
    verbatim.push(...a.narrative, ...a.launch, ...a.task, ...a.misconceptions, ...a.synthesis, ...(a.response ?? []));
    if (a.extension) verbatim.push(...a.extension.task, ...(a.extension.response ?? []));
    verbatim.push(...a.ell.map((e) => e.text), ...a.access.map((x) => x.text));
    if (a.purposeEvidence && !inSources(src, a.purposeEvidence)) err(`${at} ${a.id}`, `purpose evidence is not IM's words: "${a.purposeEvidence.slice(0, 60)}…"`);
    if (a.slot !== 'warm-up' && !a.purpose) warn(`${at} ${a.id}`, 'no task purpose');
    if (!a.response) warn(`${at} ${a.id}`, 'no student response');
    for (const r of a.routines) if (!findRoutine(r)) err(`${at} ${a.id}`, `routine not in catalog: ${r}`);
    for (const e of a.ell) if (!findRoutine(e.routine)) err(`${at} ${a.id}`, `support routine not in catalog: ${e.routine}`);
  }
  if (!l.coolDown.task) warn(at, 'no cool-down task');
  for (const s of verbatim) if (!inSources(src, s)) err(at, `not in the sources: "${norm(s).slice(0, 70)}…"`);
}

// ---------------------------------------------------------------------------
// Premo layer
// ---------------------------------------------------------------------------
const BANDS = ['emerging', 'developing', 'expanding'];
const premoDir = path.join(ROOT, 'premo');
const premoFiles = fs.existsSync(premoDir) ? fs.readdirSync(premoDir).filter((f) => f.endsWith('.json')) : [];
for (const f of premoFiles) {
  const code = f.replace(/\.json$/, '');
  const at = `premo/${f}`;
  const p = json(path.join(premoDir, f));
  const im = imByCode.get(code);
  if (!im) {
    err(at, 'no IM layer for this lesson');
    continue;
  }
  const src = sourcesFor(code);
  const acts = new Map(im.activities.map((a) => [a.id, a]));
  for (const s of flat(p)) if (PLACEHOLDER.test(norm(s))) err(at, `placeholder text: "${s}"`);
  if (!['draft', 'reviewed'].includes(p.status)) err(at, 'status must be draft or reviewed');

  const crux = acts.get(p.crux);
  if (!crux) err(at, `crux ${p.crux} is not an activity`);
  else if (crux.slot !== 'activity') err(at, `crux ${p.crux} is a ${crux.slot}; the crux is never a warm-up, optional activity or cool-down`);
  else if (
    (crux.purpose === 'mastery' || crux.purpose === 'practice-language') &&
    im.activities.some((a) => a.slot === 'activity' && a.purpose !== 'mastery' && a.purpose !== 'practice-language')
  )
    // A fluency lesson can be all mastery work; otherwise the crux is where the new idea is.
    err(at, `crux ${p.crux} has purpose ${crux.purpose} while the lesson has an activity with new mathematics`);
  if (!p.cruxWhy) err(at, 'cruxWhy is missing');
  if (!p.object?.name) err(at, 'no testable object');

  for (const id of acts.keys()) if (!p.watchFor?.[id]) err(at, `no watchFor for ${id}`);

  const ids = new Set();
  const says = [];
  for (const m of p.moments) {
    const mat = `${at} ${m.id}`;
    if (ids.has(m.id)) err(mat, 'duplicate id');
    ids.add(m.id);
    const a = acts.get(m.activityId);
    if (!a) err(mat, `activity ${m.activityId} does not exist`);
    if (!m.see || !m.means || !m.dont) err(mat, 'see, means and dont are required');
    if (!m.say && !m.byBand) err(mat, 'needs say or byBand');
    if (m.byBand) {
      for (const b of BANDS) {
        if (!m.byBand[b]?.say || !m.byBand[b]?.move) err(mat, `byBand.${b} needs say and move`);
        else says.push([mat, m.byBand[b].say]);
      }
    }
    if (m.say) says.push([mat, m.say]);
    if (m.sayFrom === 'im') for (const s of [m.say, ...BANDS.map((b) => m.byBand?.[b]?.say)].filter(Boolean)) if (!inSources(src, unquote(s))) err(mat, `say marked IM's is not IM's words: "${s}"`);
    if (m.from === 'im') {
      if (!m.evidence) err(mat, 'a moment from IM needs its evidence');
      else if (!inSources(src, m.evidence)) err(mat, `evidence is not IM's words: "${norm(m.evidence).slice(0, 60)}…"`);
    }
    if (m.routine && !findRoutine(m.routine)) err(mat, `routine not in catalog: ${m.routine}`);
    if (m.kind === 'routine-breakdown' && !m.routine) err(mat, 'a routine breakdown names its routine');
    if (m.kind === 'routine-breakdown' && a && m.routine && !a.routines.some((r) => findRoutine(r) === findRoutine(m.routine))) err(mat, `${m.routine} is not a routine IM lists for ${a.id}`);
    if (m.kind === 'which-work-first' && a && !a.fivePractices && !/select|sequence|share/i.test(a.synthesis.join(' '))) warn(mat, 'which-work-first on an activity whose synthesis does not sequence work');
    if (m.rehearse) {
      if (m.criteria?.length !== 3) err(mat, 'a rehearsed moment has exactly three checks');
      const lines = [m.say, ...BANDS.map((b) => m.byBand?.[b]?.say)].filter(Boolean).map(unquote);
      for (const c of m.criteria ?? []) for (const s of lines) if (s.length > 12 && norm(c).includes(s)) err(mat, 'a check repeats the model wording');
    }
  }
  const rehearsed = p.moments.filter((m) => m.rehearse);
  if (rehearsed.length !== 6) err(at, `${rehearsed.length} rehearsed moments; the standard is six`);
  if (crux && rehearsed.filter((m) => m.activityId === p.crux).length < 3) err(at, 'fewer than three rehearsed moments at the crux');
  const lengths = says.map(([, s]) => words(unquote(s))).sort((x, y) => x - y);
  if (lengths.length && lengths[Math.floor(lengths.length / 2)] > 10) err(at, `median say line is ${lengths[Math.floor(lengths.length / 2)]} words; about ten`);
  for (const [mat, s] of says) if (words(unquote(s)) > 16) err(mat, `say line is ${words(unquote(s))} words: "${s}"`);

  for (const id of p.inClass?.momentIds ?? []) if (!rehearsed.some((m) => m.id === id)) err(at, `in-class moment ${id} is not rehearsed`);
  if (p.inClass?.launchFrom === 'im' && !inSources(src, unquote(p.inClass.launch))) err(at, `launch marked IM's is not IM's words`);
  for (const id of p.predict?.activityIds ?? []) if (!acts.has(id)) err(at, `predict names unknown activity ${id}`);
  for (const c of p.cuts ?? []) if (!acts.has(c.activityId)) err(at, `cut names unknown activity ${c.activityId}`);

  // The crux's language support lives inside IM's support for the crux.
  if (crux) {
    const ell = crux.ell.find((e) => findRoutine(e.routine) === findRoutine(p.cruxLanguage?.routine ?? ''));
    if (!ell) err(at, `cruxLanguage.routine ${p.cruxLanguage?.routine} is not IM's support for ${p.crux} (${crux.ell.map((e) => e.routine).join(', ') || 'none'})`);
    else if (ell.phase !== p.cruxLanguage.phase) err(at, `cruxLanguage.phase is ${p.cruxLanguage.phase}; IM places it at ${ell.phase}`);
    for (const b of BANDS) if (!p.cruxLanguage?.byBand?.[b]?.entry) err(at, `cruxLanguage.byBand.${b} has no entry`);
  }
}

// ---------------------------------------------------------------------------
// Correction notes: each must still point at an IM line, or it silently stops showing.
// ---------------------------------------------------------------------------
const corr = path.join(ROOT, 'corrections.json');
if (fs.existsSync(corr)) {
  for (const n of json(corr).notes) {
    const im = imByCode.get(n.code);
    const lines = im ? flat(im) : [];
    const hit = lines.some((l) => (n.line ? l === n.line : n.prefix && l.startsWith(n.prefix)));
    if (!hit) err('corrections.json', `${n.code}: no IM line matches "${(n.line ?? n.prefix ?? '').slice(0, 50)}…"`);
    if (!n.note) err('corrections.json', `${n.code}: empty note`);
  }
}

for (const w of warnings) console.log('warn ', w);
for (const e of errors) console.log('ERROR', e);
console.log(`u3 content: ${imFiles.length} IM lessons, ${premoFiles.length} Premo layers, ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
