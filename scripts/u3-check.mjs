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
/** LaTeX to plain for comparing numbers: \(16\frac{2}{3}\) → "16 2/3". */
const plainMath = (s) => (s ?? '').replace(/\\\(|\\\)/g, ' ').replace(/(\d)\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1 $2/$3').replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2').replace(/,(?=\d{3})/g, '');
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
    // No student names (Robert, 2026-11-03): "a student", "Pair A". Names in IM's own problems (Lin, Diego…) are fine in that lesson.
    const imText = flat(im).join(' ');
    const named = (text.match(/\b(Maya|Dani|Ana|Jo|Sam|Priya|Elena|Jordan|Dana|Robert|Maria|Jose|Luis|Aisha|Omar|Mia|Liam|Noah|Emma|Ava|Leo|Kai|Zoe|Ben|Max|Eli|Ivy|Nia|Raj|Lucia|Mateo|Sofia|Diego|Carlos|Ana|Jin|Mei|Amir|Fatima|Yusuf|Kofi|Ama|Tariq|Hana)\b/g) ?? []).filter((n) => !new RegExp(`\\b${n}\\b`).test(imText));
    if (named.length) err(cat, `uses a student name (${named[0]}); write “a student” or “Pair A”`);
  }
  if (pl.rehearsal && !pl.rehearsal.some((c) => c.activityId === pr.crux)) err(at, 'rehearsal has no cards for the crux');
  // The guidance rule (docs/REHEARSAL-GUIDANCE-RULE.md): what each card type must carry.
  const NEEDS = {
    task: [],
    routine: ['why', 'runIt'],
    send: ['sounds', 'why'],
    student: ['goingOn', 'avoid', 'ifNot'],
    language: ['goingOn', 'avoid', 'ifNot', 'sounds'],
    decision: ['why', 'avoid'],
  };
  for (const c of pl.rehearsal ?? []) {
    const cat = `${at} card ${c.id}`;
    if (!NEEDS[c.type]) { err(cat, `type must be one of ${Object.keys(NEEDS).join(', ')}`); continue; }
    const mo = c.momentId ? pr.moments.find((x) => x.id === c.momentId) : null;
    const has = { ...c, goingOn: c.goingOn ?? mo?.means, avoid: c.avoid ?? mo?.dont };
    for (const k of NEEDS[c.type]) if (!has[k] || (Array.isArray(has[k]) && !has[k].length)) err(cat, `a ${c.type} card needs ${k}`);
    if (c.type === 'routine' && c.runIt && (c.runIt.length < 3 || c.runIt.length > 5)) err(cat, 'runIt needs 3–5 steps');
    if (c.type === 'routine' && c.kind !== 'rounds' && !c.sounds) err(cat, 'a routine card needs sounds (Three Reads has its listen-for lines instead)');
    if (c.ifNot && !/\?\s*$/.test(c.ifNot)) err(cat, 'ifNot is one question');
    if (c.why && wordsIn(c.why) > 40) err(cat, `why is ${wordsIn(c.why)} words; keep it to two short sentences`);
    if (c.more) err(cat, 'more is retired; use the rule’s guidance fields');
    // Model: every card but Do the task, Three Reads and the by-level card says something.
    if (!['math', 'rounds', 'levels'].includes(c.kind) && !(c.say ?? []).length) err(cat, 'needs a model (say)');
    // kind and type agree.
    const PAIR = { math: ['task'], rounds: ['routine'], release: ['send'], synthesis: ['routine'], levels: ['language'], moment: ['student', 'decision'] };
    if (!PAIR[c.kind]?.includes(c.type)) err(cat, `kind ${c.kind} can't be type ${c.type}`);
    // Where we are: one of three forms, minutes within IM's time for the activity.
    const actMin = im.activities.find((x) => x.id === c.activityId)?.minutes ?? 0;
    const wm = /^About (\d+) minutes? into Activity (\d+\.\d+)\. \S/.exec(c.where ?? '');
    if (!(wm || /^Before class\. /.test(c.where ?? '') || /^Start of Activity \d+\.\d+\. /.test(c.where ?? '')))
      err(cat, 'where must start "Before class. ", "Start of Activity X.Y. " or "About N minutes into Activity X.Y. " and say what just happened');
    if (wm && wm[2] !== c.activityId) err(cat, `where names Activity ${wm[2]}, but the card is ${c.activityId}`);
    if (wm && Number(wm[1]) > actMin) err(cat, `where says ${wm[1]} minutes into a ${actMin}-minute activity`);
    // Checks: past tense, not the model repeated.
    const PAST = /^(\w+ed|Had|Didn’t|Didn't|Did|Got|Said|Made|Kept|Let|Put|Gave|Took|Told|Wrote|Found|Saw|Held|Showed|Left|Read|Ran|Sent|Set|Stopped|Went|Chose|Drew|Knew|Began|Brought|Spoke|Heard|Led|Met|Paid|Sat|Stood|Thought|Understood|Won|Built|Caught|Taught|Meant|Struck|Fed)\b/;
    for (const ch of [...(c.checks ?? []), ...(c.ifSkipped?.checks ?? [])]) {
      if (!PAST.test(ch)) err(cat, `check “${ch.slice(0, 40)}” must start with a past-tense verb`);
      if (/[.?]$/.test(ch.trim())) err(cat, `check “${ch.slice(0, 40)}” ends with punctuation`);
      if ((c.say ?? []).some((x) => low(x) === low(ch))) err(cat, 'a check repeats the model');
    }
    if (c.ifSkipped?.checks && c.ifSkipped.checks.length !== 3) err(cat, 'ifSkipped.checks needs exactly three');
    if (c.whereIfChosen && !ids.includes(c.whereIfChosen.activityId)) err(cat, `whereIfChosen names ${c.whereIfChosen.activityId}, not in IM’s lesson`);
    // If it doesn't work never states the answer: no "=", no bare result from the card's show.
    if (c.ifNot && /=/.test(c.ifNot)) err(cat, 'ifNot gives a worked answer (has “=”)');
    // Every Three Reads round asks something.
    for (const [i, r] of (c.rounds ?? []).entries()) if (!r.ask || !r.aim) err(cat, `round ${i + 1} needs ask and aim`);
    // Models and Aims never state a worked answer (Persona 1): no arithmetic, no "that gives".
    const WORKED = /=|\d\s*[×x*÷+−]\s*\d+(?:\.\d+)?\s+(?:is|gives|makes)\s+\$?\d|\b(that gives|which gives|the answer is)\b/i;
    for (const [k, v] of [['aim', c.aim], ...(c.rounds ?? []).map((r) => ['round aim', r.aim]), ...(c.say ?? []).map((x) => ['say', x]), ...(c.ifSkipped?.say ?? []).map((x) => ['ifSkipped.say', x])])
      if (v && WORKED.test(v)) err(cat, `${k} states a worked answer: “${v.slice(0, 50)}”`);
    if (c.ifSkipped && c.ifSkipped.activityId === c.activityId) err(cat, 'ifSkipped names the card’s own activity, so it never applies');
    if (c.whereIfChosen) {
      const w = c.whereIfChosen.where ?? '';
      const wm2 = /^(About (\d+) minutes? into|Start of) Activity (\d+\.\d+)\. \S/.exec(w);
      if (!wm2 || wm2[3] !== c.activityId) err(cat, 'whereIfChosen.where must use the "Where we are" form for this card’s activity');
    }
    for (const w of [c.where, c.whereIfChosen?.where]) if (w && !/[.!]["”’]?$/.test(w.trim())) err(cat, '"Where we are" must end with a period');
    if (c.ifNot && (c.ifNot.match(/\?/g) ?? []).length > 1) err(cat, 'ifNot is one question, not two');
    for (const [b, f] of Object.entries(c.levelFrames ?? {})) if (!/___/.test(f)) err(cat, `levelFrames.${b} has no blanks`);
    // With its own frames, a card needs its own way in without words for each band, unless the Premo moment has one (no borrowing).
    if (c.levelFrames) { const pm = (pr.moments ?? []).find((x) => x.id === c.momentId);
      for (const b of Object.keys(c.levelFrames)) if (!c.levelNonverbal?.[b] && !pm?.byBand?.[b]?.nonverbal) err(cat, `levelFrames.${b} has no way in without words (levelNonverbal)`); }
    if ((c.kind === 'levels' || c.language) && c.activityId !== pr.crux) err(cat, 'language cards belong to the crux only (D7)');
    if (c.kind === 'math' && (c.say ?? []).length) err(cat, 'a Do the task card has no model line');
    // A Do the task card's checks only use numbers IM's task or answers contain.
    if (c.kind === 'math') {
      const ima = im.activities.find((x) => x.id === c.activityId);
      const imNums = new Set((plainMath([...(ima?.task ?? []), ...(ima?.response ?? [])].join(' ')).match(/\d+(?:\.\d+)?/g) ?? []));
      for (const ch of c.checks ?? []) for (const n of plainMath(ch).match(/\d+(?:\.\d+)?/g) ?? []) if (Number(n) > 2 && !imNums.has(n)) err(cat, `check number ${n} isn’t in IM’s task or answers`);
    }
    const COMMON = /^(Another|That|This|It|He|She|We|You|Who|Which|What|Stronger|Clearer|Everyone|Someone|Nobody|Either|Neither|Your|My|Our)$/;
    // Names by pattern: a capitalized word acting as a student ("X says", "X’s table") that IM's lesson doesn't use.
    const ALLOW = new Set(['A', 'The', 'Pair', 'Group', 'Partner', 'Partners', 'Student', 'Students', 'Card', 'Store', 'Level', 'Levels', 'Read', 'IM', 'Today', 'They', 'Their', 'Each', 'One', 'Both', 'Crux', 'Hands', 'Pencils', 'Most', 'Some', 'Everyone', 'Nobody', 'Ask', 'Then', 'Look']);
    for (const m2 of flat({ ...c, checks: [], more: [] }).join(' ').matchAll(/\b([A-Z][a-zà-ÿ]+)(?:’s|'s| (?:says|said|writes|wrote|points|pointed|stares|thinks|asks|doubles|counts|is stuck|has|stops|stopped))\b/g))
      if (!ALLOW.has(m2[1]) && !COMMON.test(m2[1]) && !new RegExp(`\\b${m2[1]}\\b`).test(flat(im).join(' '))) err(cat, `“${m2[1]}” looks like a student name; write “a student” or “Pair A”`);
    // Line length (25 words); Aims are checked at 15 above. IM's verbatim text in show, and any long quotation in “…”, is exempt.
    for (const [k, v] of [['ask', c.ask], ['ifNot', c.ifNot], ['avoid', c.avoid], ...(c.checks ?? []).map((x) => ['check', x]), ...(c.say ?? []).map((x) => ['say', x])])
      // A word-for-word quotation (IM's text, in “…”) counts as one word: it can't be cut.
      if (v && v.replace(/“[^”]{40,}”/g, 'QUOTE').split(/(?<=[.?!])\s+/).some((sen) => wordsIn(sen) > 25)) err(cat, `${k} has a sentence over 25 words`);
  }
  // Ids unique; every activity has a Do the task card; the crux has its four routine cards.
  const seen = new Set();
  for (const c of pl.rehearsal ?? []) {
    if (seen.has(c.id)) err(at, `duplicate card id ${c.id}`);
    seen.add(c.id);
  }
  if (pl.rehearsal) {
    // One card per moment; cards in class order within each activity; Three Reads before the release.
    const mids = pl.rehearsal.filter((c) => c.momentId).map((c) => c.momentId);
    for (const m3 of new Set(mids)) if (mids.filter((x) => x === m3).length > 1) err(at, `two cards rehearse moment ${m3}`);
    const minuteOf = (c) => (/^Before class/.test(c.where) ? -1 : /^Start of/.test(c.where) ? 0 : Number(/^About (\d+)/.exec(c.where)?.[1] ?? 0));
    for (const id of ids) {
      const cs = pl.rehearsal.filter((c) => c.activityId === id);
      for (let i = 1; i < cs.length; i++) if (minuteOf(cs[i]) < minuteOf(cs[i - 1])) err(at, `${id}: card ${cs[i].id} comes before ${cs[i - 1].id} in class time`);
      const ri = cs.findIndex((c) => c.kind === 'rounds'), li = cs.findIndex((c) => c.kind === 'release');
      if (ri >= 0 && li >= 0 && li < ri) err(at, `${id}: the release card comes before Three Reads`);
    }
    for (const id of ids) if (!pl.rehearsal.some((c) => c.activityId === id && c.kind === 'math')) err(at, `no Do the task card for ${id}`);
    for (const k of ['rounds', 'release', 'synthesis']) if (!pl.rehearsal.some((c) => c.activityId === pr.crux && c.kind === k)) err(at, `the crux has no ${k} card`);
    if (!pl.rehearsal.some((c) => c.activityId === pr.crux && c.kind === 'levels')) err(at, 'the crux has no by-level language card');
    // Moves (Robert, 2026-11-03): crux-only night ≤ 8 (warn) and ≤ 10 (fail); each added activity ≤ 2.
    const moves = (a) => pl.rehearsal.filter((c) => c.activityId === a && c.kind !== 'math').length;
    if (moves(pr.crux) > 10) err(at, `crux-only night is ${moves(pr.crux)} moves; the most is 10`);
    else if (moves(pr.crux) > 8) warn(at, `crux-only night is ${moves(pr.crux)} moves; the target is 8`);
    for (const id of ids.filter((x) => x !== pr.crux)) if (moves(id) > 2) err(at, `${id} adds ${moves(id)} moves; the most is 2`);
  }
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
