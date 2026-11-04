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
  // The crux's language routine is rehearsed as a routine: run it, and catch it slipping.
  const run = p.moments.filter((m) => m.kind === 'run-routine');
  if (run.length !== 1) err(at, `${run.length} run-routine moments; the standard is one, at the crux`);
  for (const m of run) {
    if (m.activityId !== p.crux) err(`${at} ${m.id}`, 'run-routine belongs at the crux');
    if (!m.rehearse) err(`${at} ${m.id}`, 'run-routine is rehearsed');
    if (findRoutine(m.routine ?? '') !== findRoutine(p.cruxLanguage?.routine ?? '')) err(`${at} ${m.id}`, `run-routine runs ${m.routine}; the crux's routine is ${p.cruxLanguage?.routine}`);
    if (!m.runSheet || m.runSheet.length < 3 || m.runSheet.length > 5) err(`${at} ${m.id}`, 'runSheet has 3 to 5 steps');
  }
  if (!p.moments.some((m) => m.rehearse && m.kind === 'routine-breakdown' && findRoutine(m.routine ?? '') === findRoutine(p.cruxLanguage?.routine ?? '')))
    err(at, "no rehearsed moment for the crux's language routine slipping");
  for (const b of BANDS) {
    const s = p.cruxLanguage?.byBand?.[b]?.stretch;
    if (!s) err(at, `cruxLanguage.byBand.${b} needs stretch: the extra step at the band's higher level`);
    else if (s.split(/\s+/).length > 20) err(at, `cruxLanguage.byBand.${b}.stretch is ${s.split(/\s+/).length} words; keep it to 20`);
    else if (s === p.cruxLanguage.byBand[b].reaching) err(at, `cruxLanguage.byBand.${b}.stretch repeats reaching`);
  }
  for (const b of BANDS) if (!p.cruxLanguage?.byBand?.[b]?.does || !p.cruxLanguage?.byBand?.[b]?.reaching) err(at, `cruxLanguage.byBand.${b} needs does and reaching`);
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
// Planning view (content/u3/plan): see docs/PLANNING-VIEW-REQUIREMENTS.md
// ---------------------------------------------------------------------------
const planDir = path.join(ROOT, 'plan');
const planFiles = fs.existsSync(planDir) ? fs.readdirSync(planDir).filter((f) => f.endsWith('.json')) : [];
const SYNTH = ['MLR1: Stronger and Clearer Each Time', 'MLR2: Collect and Display'];
const wordsIn = (s) => (s ?? '').replace(/\\\(|\\\)/g, ' ').split(/\s+/).filter(Boolean).length;
for (const f of planFiles) {
  const code = f.replace(/\.json$/, '');
  const at = `plan/${f}`;
  const pl = json(path.join(planDir, f));
  const im = imByCode.get(code);
  const pr = fs.existsSync(path.join(premoDir, f)) ? json(path.join(premoDir, f)) : null;
  if (!im || !pr) {
    err(at, 'needs the lesson’s IM and Premo layers');
    continue;
  }
  if (!im.goals.some((g) => g.text === pl.clo?.imGoal)) err(at, 'clo.imGoal is not one of IM’s goals, word for word');
  for (const k of ['function', 'form', 'statement', 'exemplar', 'lookFor']) if (!pl.clo?.[k]) err(at, `clo.${k} is missing`);
  if (!pl.clo?.precise?.length) err(at, 'clo.precise needs at least one term');
  // Vocabulary in use (R2.3): the exemplar says every term the CLO marks as precise.
  const low = (s) => (s ?? '').toLowerCase().replace(/[’']/g, "'");
  for (const term of pl.clo?.precise ?? []) if (!low(pl.clo?.exemplar).includes(low(term))) err(at, `clo.exemplar doesn’t use the precise term “${term}”`);
  if (!pl.clo?.posted?.goal || !/^We /.test(pl.clo.posted.goal)) err(at, 'clo.posted.goal must be in students’ words, starting “We …”');
  if (!pl.clo?.posted?.sentence) err(at, 'clo.posted.sentence is missing');
  else {
    if (pl.clo.posted.sentence === pl.clo.exemplar) err(at, 'clo.posted.sentence repeats the crux exemplar; post a parallel example');
    if (!(pl.clo.precise ?? []).some((term) => low(pl.clo.posted.sentence).includes(low(term)))) err(at, 'clo.posted.sentence uses none of the precise terms');
  }
  // Every IM activity has a plan entry, and nothing else does.
  const ids = im.activities.map((a) => a.id);
  for (const id of ids) if (!pl.activities?.some((a) => a.id === id)) err(at, `no plan for activity ${id}`);
  for (const a of pl.activities ?? []) {
    if (!ids.includes(a.id)) err(at, `activity ${a.id} is not in IM’s lesson`);
    for (const k of ['strategies', 'misconceptions', 'backPocket']) if (!a[k]?.length) err(at, `${a.id}.${k} is empty`);
    if (!a.grouping || !a.monitor) err(at, `${a.id} needs grouping and monitor`);
    // Moments come only from this activity (requirement R8.1).
    for (const m of a.momentIds ?? []) {
      const mo = pr.moments.find((x) => x.id === m);
      if (!mo) err(at, `${a.id}: moment ${m} is not in the Premo layer`);
      else if (mo.activityId !== a.id) err(at, `${a.id}: moment ${m} belongs to ${mo.activityId}`);
      // The crux's Launch, Release and Synthesis cards already rehearse running the routines.
      else if (mo.kind === 'run-routine') err(at, `${a.id}: moment ${m} runs a routine; the planning view's own cards do that`);
    }
    // Rehearsal stays near the reviewed prep's length: three moments at the crux, two elsewhere.
    const cap = a.id === pr.crux ? 3 : 2;
    if ((a.momentIds ?? []).length > cap) err(at, `${a.id} has ${a.momentIds.length} moments to rehearse; the most is ${cap}`);
    // Every rehearsed moment has its own checks: Premo's, or the plan's momentCriteria.
    for (const m of a.momentIds ?? []) {
      const mo = pr.moments.find((x) => x.id === m);
      if (mo && !(mo.criteria?.length) && (a.momentCriteria?.[m]?.length ?? 0) !== 3) err(at, `${a.id}: moment ${m} needs three momentCriteria (Premo has none)`);
    }
    if (a.dependsOn && !ids.includes(a.dependsOn.activityId)) err(at, `${a.id}.dependsOn names ${a.dependsOn.activityId}, not in IM’s lesson`);
    if (a.id === pr.crux && !a.barriers?.length) err(at, `${a.id}: the crux needs at least one barrier`);
    for (const b of a.backPocket ?? []) if (wordsIn(b) > 16) warn(at, `${a.id} back-pocket question is ${wordsIn(b)} words: "${b.slice(0, 50)}…"`);
  }
  const c = pl.crux;
  if (c?.threeReads?.length !== 3) err(at, 'crux.threeReads needs exactly three reads');
  for (const r of c?.threeReads ?? []) if (wordsIn(r.say) > 16) err(at, `Three Reads line is ${wordsIn(r.say)} words; keep it to 16`);
  for (const r of c?.threeReads ?? []) if (!r.focus || !r.listenFor) err(at, 'each Three Reads entry needs focus and listenFor');
  if (!c?.release?.talkMoments?.length) err(at, 'crux.release.talkMoments is empty');
  for (const b of BANDS) if (!c?.release?.byBand?.[b]?.nonverbal) err(at, `crux.release.byBand.${b} needs nonverbal`);
  // Fewer words, never less math: the Levels 1–2 frame still has words and at least two blanks.
  const ef = c?.release?.byBand?.emerging?.frame ?? '';
  if ((ef.match(/___/g) ?? []).length < 2 || (ef.replace(/___/g, '').match(/[A-Za-z]{2,}/g) ?? []).length < 3) err(at, 'crux.release.byBand.emerging.frame needs words and at least two blanks: keep the comparison');
  // Collect and Display keeps students' own words (MLR 2): the teacher scribes, not revoices.
  if (c?.synthesis?.routine === 'MLR2: Collect and Display' && (c.synthesis.steps ?? []).some((x) => /revoice/i.test(x))) err(at, 'Collect and Display steps: scribe students’ words and add the precise term beside them; don’t revoice');
  if (!SYNTH.includes(c?.synthesis?.routine)) err(at, `crux.synthesis.routine must be one of: ${SYNTH.join(', ')} (decision D1)`);
  if (!c?.release?.successCriteria || !c?.release?.say) err(at, 'crux.release needs successCriteria and say');
  for (const b of BANDS) if (!c?.release?.byBand?.[b]?.frame || !c?.release?.byBand?.[b]?.stretch) err(at, `crux.release.byBand.${b} needs frame and stretch`);
  if (!c?.synthesis?.steps?.length || !c?.synthesis?.prompt || !c?.synthesis?.sounds) err(at, 'crux.synthesis needs steps, prompt and sounds');
  const ls = pl.lessonSynthesis;
  if (!ls?.ideas?.length || !ls?.pointTo || !ls?.check?.question || !ls?.check?.sounds) err(at, 'lessonSynthesis needs ideas, pointTo and check { question, sounds }');
  // The quick check must not give away the cool-down.
  if (ls?.check?.question && (im.coolDown.task ?? []).some((l) => l.length > 20 && ls.check.question.includes(l.slice(0, 20)))) err(at, 'lessonSynthesis.check repeats the cool-down');
  const nums = (s) => new Set((s.match(/\d+(?:\.\d+)?/g) ?? []).filter((n) => Number(n) > 2));
  const coolNums = nums((im.coolDown.task ?? []).join(' '));
  const shared = [...nums(ls?.check?.question ?? '')].filter((n) => coolNums.has(n));
  if (shared.length > 1) err(at, `lessonSynthesis.check reuses the cool-down’s numbers (${shared.join(', ')})`);
  if (!pl.beforeClass?.length) err(at, 'beforeClass is empty');
  for (const c of pl.cuts ?? []) if (!ids.includes(c.activityId)) err(at, `cut for ${c.activityId}, which is not in IM’s lesson`);
  if (flat({ ...pl, reviewNotes: [] }).some((s) => /Compare and Connect|poster/i.test(s))) warn(at, 'mentions Compare and Connect or posters, which D1 replaces');
  // Rehearsal cards (docs/REHEARSAL-CARD-SPEC.md): each stands on its own.
  for (const c of pl.rehearsal ?? []) {
    const cat = `${at} card ${c.id}`;
    if (!ids.includes(c.activityId)) err(cat, `activity ${c.activityId} is not in IM’s lesson`);
    for (const k of ['name', 'where', 'ask', 'aim']) if (!c[k]) err(cat, `needs ${k}`);
    if (/\bm\d+\b|MLR|\(\d\.\d\)/.test(c.name ?? '')) err(cat, `name “${c.name}” has an id or routine; use a plain verb phrase`);
    if (wordsIn(c.aim) > 15) err(cat, `aim is ${wordsIn(c.aim)} words; keep it to 15`);
    for (const r of c.rounds ?? []) if (wordsIn(r.aim) > 15) err(cat, `round aim is ${wordsIn(r.aim)} words; keep it to 15`);
    if ((c.checks ?? []).length !== 3) err(cat, 'needs exactly three checks');
    if (c.kind === 'rounds' && (c.rounds ?? []).length !== (pl.crux?.threeReads ?? []).length) err(cat, 'rounds must match crux.threeReads');
    if (c.momentId) {
      const mo = pr.moments.find((x) => x.id === c.momentId);
      if (!mo) err(cat, `moment ${c.momentId} is not in the Premo layer`);
      else if (mo.activityId !== c.activityId) err(cat, `moment ${c.momentId} belongs to ${mo.activityId}`);
      else if (c.kind === 'levels' && !mo.byBand) err(cat, `moment ${c.momentId} has no by-level moves`);
    }
    if (c.ifSkipped && !ids.includes(c.ifSkipped.activityId)) err(cat, `ifSkipped names ${c.ifSkipped.activityId}`);
    // No student names (Robert, 2026-11-03): "a student", "Pair A".
    const text = flat({ ...c, more: [] }).join(' ');
    if (/\b(Maya|Dani|Ana|Jo|Sam)\b/.test(text)) err(cat, 'uses a student name; write “a student” or “Pair A”');
  }
  if (pl.rehearsal && !pl.rehearsal.some((c) => c.activityId === pr.crux)) err(at, 'rehearsal has no cards for the crux');
  for (const [where, s] of flat(pl).map((s) => ['', s])) if (/maths|colour|grey\b|favour|behaviour|centre\b|organis|practise\b|metre\b/.test(s)) err(at, `US spelling: "${s.slice(0, 50)}…"`);
}

// ---------------------------------------------------------------------------
// Correction notes: each must still point at an IM line, or it silently stops showing.
// ---------------------------------------------------------------------------
const corr = path.join(ROOT, 'corrections.json');
if (fs.existsSync(corr)) {
  for (const n of json(corr).notes) {
    const im = imByCode.get(n.code);
    // A unit-level note (code "6.3") is checked against unit.json.
    const lines = im ? flat(im) : n.code === '6.3' ? flat(json(path.join(ROOT, 'unit.json'))) : [];
    const hit = lines.some((l) => (n.line ? l === n.line : n.prefix && l.startsWith(n.prefix)));
    if (!hit) err('corrections.json', `${n.code}: no IM line matches "${(n.line ?? n.prefix ?? '').slice(0, 50)}…"`);
    if (!n.note) err('corrections.json', `${n.code}: empty note`);
  }
}

for (const w of warnings) console.log('warn ', w);
for (const e of errors) console.log('ERROR', e);
console.log(`u3 content: ${imFiles.length} IM lessons, ${premoFiles.length} Premo layers, ${planFiles.length} plans, ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
