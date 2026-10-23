#!/usr/bin/env node
/**
 * Build the IM layer of each Unit 3 lesson from IM's teacher pages.
 *
 *   node scripts/u3-extract.mjs [lesson ...]      default: 5 6 7 8 9
 *
 * Reads content/u3/source/6.3.<n>-{index,preparation}.txt (written by
 * u3-sources.mjs) and writes content/u3/im/6.3.<n>.json. Every string it
 * writes is a line of the source, unchanged; this script copies and sorts,
 * it never words anything.
 *
 * Three things are not on the web pages and are merged in from
 * content/u3/tg/6.3.<n>.json when that file exists: student responses, the
 * cool-down task and response, and extension responses. They come from the
 * Teacher Guide PDF, transcribed from the page images because its text layer
 * drops the mathematics.
 *
 * Task purpose is Premo's reading, not IM's label, and lives in
 * content/u3/purposes.json; it is merged in with the sentence it rests on.
 */
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('content/u3/source');
const TG = path.resolve('content/u3/tg');
const OUT = path.resolve('content/u3/im');
const lessons = process.argv.slice(2).length ? process.argv.slice(2) : ['5', '6', '7', '8', '9'];

const read = (f) => fs.readFileSync(path.join(SRC, f), 'utf8').split('\n').map((l) => l.trim());
const isHead = (l) => l.startsWith('## ');
const head = (l) => l.replace(/^##\s*/, '').trim();
const GATED = /Teachers with a valid work email address/;
const content = (lines) => {
  // Drop empty lines, the duplicated image alt text IM emits, and sign-in notices.
  const out = [];
  for (const l of lines) {
    if (!l || l === '|' || GATED.test(l)) continue;
    if (/^\[image:/.test(l) && out[out.length - 1] === l) continue;
    out.push(l);
  }
  return out;
};
/** Lines under the first heading `name` that comes after the heading `anchor`. */
function sectionAfter(lines, anchor, name) {
  const i = lines.findIndex((l) => isHead(l) && head(l) === anchor);
  return i < 0 ? [] : section(lines.slice(i + 1), name);
}

/** Lines after the heading `name` up to the next heading, or up to `stop`. */
function section(lines, name, stop = isHead) {
  const i = lines.findIndex((l) => isHead(l) && head(l) === name);
  if (i < 0) return [];
  const rest = lines.slice(i + 1);
  const j = rest.findIndex((l) => stop(l));
  return j < 0 ? rest : rest.slice(0, j);
}

const ACCESS = /^(Representation|Engagement|Action and Expression): ([^.]+)\.\s*(.*)$/;
const ELL = /^([A-Z][A-Za-z, ]*?): (?:This activity uses )?(MLR ?\d)\s*:?\s*([A-Z][^.]*?)\.\s*(.*)$/;
const DOMAINS = ['speaking', 'listening', 'writing', 'reading', 'conversing', 'representing'];
const PRINCIPLES = [
  ['support sense-making', 'support-sense-making'],
  ['optimize output', 'optimize-output'],
  ['cultivate conversation', 'cultivate-conversation'],
  ['maximize meta-awareness', 'maximize-meta-awareness'],
];

/** Pull access and English-learner supports out of a run of lines, leaving the rest. */
function supports(lines, phase) {
  const access = [];
  const ell = [];
  const rest = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const a = ACCESS.exec(l);
    if (a && /^Supports accessibility for:/.test(lines[i + 1] ?? '')) {
      access.push({
        area: a[1],
        title: a[2].trim(),
        text: l,
        supports: lines[i + 1].replace(/^Supports accessibility for:\s*/, '').split(/;\s*/).map((x) => x.trim()).filter(Boolean),
      });
      i++;
      continue;
    }
    const e = ELL.exec(l);
    if (e && /^Design Principle\(s\):/.test(lines[i + 1] ?? '')) {
      const pl = lines[i + 1].toLowerCase();
      ell.push({
        routine: `${e[2].replace(' ', '')}: ${e[3].trim()}`,
        phase,
        domains: DOMAINS.filter((d) => e[1].toLowerCase().includes(d)),
        principles: PRINCIPLES.filter(([k]) => pl.includes(k)).map(([, v]) => v),
        text: l,
        principleLine: lines[i + 1],
      });
      i++;
      continue;
    }
    rest.push(l);
  }
  return { access, ell, rest };
}

function alignment(header) {
  const al = { buildingOn: [], addressing: [], buildingTowards: [] };
  let cur = null;
  for (const l of header) {
    if (l === 'Building On') cur = 'buildingOn';
    else if (l === 'Addressing') cur = 'addressing';
    else if (l === 'Building Towards') cur = 'buildingTowards';
    else if (/^\d\.[A-Z]{1,3}\./.test(l) && cur) al[cur].push(l);
    else if (l === 'Routines and Materials') cur = null;
  }
  return al;
}

function routines(header) {
  const i = header.indexOf('Instructional Routines');
  if (i < 0) return [];
  const out = [];
  for (const l of header.slice(i + 1)) {
    if (/^Required (Materials|Preparation)$/.test(l) || isHead(l)) break;
    if (l) out.push(l);
  }
  return out;
}

const ACT_HEAD = /^## (\d+\.\d+): (.+?) \((\d+) minutes\)$/;

function activity(block, purposes, tg) {
  const m = ACT_HEAD.exec(block[0]);
  const [, id, rawTitle, mins] = m;
  const coolDown = /^Cool-down - /.test(rawTitle);
  const title = rawTitle.replace(/^Cool-down - /, '');
  // IM marks the slot with a heading; everything above it is the activity's header.
  const SLOTS = ['Warm-up', 'Activity', 'Optional activity', 'Cool-Down'];
  const firstHead = block.findIndex((l, i) => i > 0 && isHead(l) && SLOTS.includes(head(l)));
  const header = block.slice(1, firstHead < 0 ? undefined : firstHead).map((l) => (isHead(l) ? head(l) : l));
  const slotHead = firstHead < 0 ? '' : head(block[firstHead]);
  const slot = coolDown ? 'cool-down' : slotHead === 'Warm-up' ? 'warm-up' : slotHead === 'Optional activity' ? 'optional' : 'activity';
  const body = block.slice(firstHead < 0 ? block.length : firstHead);

  const narrative = content(section(body, slotHead));
  const launchPart = supports(content(section(body, 'Launch')), 'launch');
  const task = content(section(body, 'Student Facing'));
  const synthPart = supports(content(section(body, 'Activity Synthesis')), 'synthesis');
  const misconceptions = content(section(body, 'Anticipated Misconceptions'));
  // The extension runs from its heading to its Student Response; IM sometimes
  // marks its first item up as a heading, so headings in between are content.
  const extAt = body.findIndex((l) => isHead(l) && head(l) === 'Are you ready for more?');
  const extEnd = extAt < 0 ? -1 : body.findIndex((l, i) => i > extAt && isHead(l) && head(l) === 'Student Response');
  const extTask = extAt < 0 ? [] : content(body.slice(extAt + 1, extEnd < 0 ? undefined : extEnd).map((l) => (isHead(l) ? head(l) : l)));
  const t = tg?.activities?.[id] ?? {};
  const p = purposes[id];
  const rts = routines(header);
  return {
    id,
    slot,
    title,
    minutes: Number(mins),
    purpose: p?.purpose ?? null,
    purposeEvidence: p?.evidence ?? null,
    routines: rts,
    fivePractices: rts.some((r) => /^Anticipate, Monitor, Select, Sequence, Connect$/.test(r)),
    alignment: alignment(header),
    narrative,
    launch: launchPart.rest,
    task,
    response: t.response ?? null,
    misconceptions,
    synthesis: synthPart.rest,
    extension: extTask.length ? { task: extTask, response: t.extensionResponse ?? null } : null,
    ell: [...launchPart.ell, ...synthPart.ell],
    access: [...launchPart.access, ...synthPart.access],
  };
}

const MODES = [
  [/orally/, 'orally'],
  [/in writing/, 'in writing'],
  [/other representations/, 'other representations'],
];

function lesson(n) {
  const idx = read(`6.3.${n}-index.txt`);
  const prep = read(`6.3.${n}-preparation.txt`);
  const purposes = JSON.parse(fs.readFileSync(path.resolve('content/u3/purposes.json'), 'utf8'));
  const tgFile = path.join(TG, `6.3.${n}.json`);
  const tg = fs.existsSync(tgFile) ? JSON.parse(fs.readFileSync(tgFile, 'utf8')) : null;
  const unit = JSON.parse(fs.readFileSync(path.resolve('content/u3/unit.json'), 'utf8'));
  const code = `6.3.${n}`;

  const lessonHead = prep.findIndex((l) => l === `## Lesson ${n}`);
  const title = head(prep.slice(lessonHead + 1).find((l) => l) ?? '');

  const goals = content(sectionAfter(prep, 'Learning Goals', 'Teacher Facing'));
  const targets = content(sectionAfter(prep, 'Learning Targets', 'Student Facing'));

  // Activities: split the index page at each activity heading.
  const starts = idx.map((l, i) => (ACT_HEAD.test(l) ? i : -1)).filter((i) => i >= 0);
  const synthAt = idx.findIndex((l) => l === '## Lesson Synthesis');
  const blocks = starts.map((s, k) => idx.slice(s, k + 1 < starts.length ? starts[k + 1] : idx.length));
  const all = blocks.map((b) => {
    // The last regular activity runs into the lesson synthesis; cut it there.
    const cut = b.findIndex((l, i) => i > 0 && l === '## Lesson Synthesis');
    return activity(cut < 0 ? b : b.slice(0, cut), purposes, tg);
  });
  const cool = all.find((a) => a.slot === 'cool-down');
  const activities = all.filter((a) => a.slot !== 'cool-down');

  const lessonSynthesis = content(idx.slice(synthAt + 1, starts.find((s) => s > synthAt))).filter((l) => !isHead(l));
  const summary = content(
    section(idx.slice(idx.findIndex((l) => head(l) === 'Student Lesson Summary') + 1), 'Student Facing', (l) => isHead(l) || GATED.test(l)),
  );

  return {
    code: `6.3.${n}`,
    title,
    section: unit.sections.find((x) => x.lessons.includes(code))?.title ?? null,
    goals: goals.map((text) => ({ text, modes: MODES.filter(([re]) => re.test(text)).map(([, v]) => v) })),
    targets,
    narrative: content(section(prep, 'Lesson Narrative')),
    materials: content(section(prep, 'Required Materials')),
    preparation: content(section(prep, 'Required Preparation')),
    standards: alignment(content(section(prep, 'CCSS Standards'))),
    activities,
    lessonSynthesis,
    coolDown: {
      id: cool?.id ?? null,
      title: cool?.title ?? null,
      minutes: cool?.minutes ?? null,
      task: tg?.coolDown?.task ?? null,
      response: tg?.coolDown?.response ?? null,
    },
    summary,
    vocabulary: unit.terminology[code] ?? { receptive: [], productive: [] },
    languageUses: unit.languageProgression.filter((u) => u.items.some((i) => i.lessons.includes(code))).map((u) => u.use),
    sources: [
      `https://im.kendallhunt.com/MS/teachers/1/3/${n}/index.html`,
      `https://im.kendallhunt.com/MS/teachers/1/3/${n}/preparation.html`,
      ...(tg ? ['IM 6–8 Math Teacher Guide, Grade 6 Unit 3 (CC BY), transcribed from page images'] : []),
    ],
  };
}

fs.mkdirSync(OUT, { recursive: true });
for (const n of lessons) {
  const l = lesson(n);
  fs.writeFileSync(path.join(OUT, `${l.code}.json`), JSON.stringify(l, null, 1) + '\n');
  const ells = l.activities.reduce((k, a) => k + a.ell.length, 0);
  console.log(
    l.code,
    l.title,
    '|',
    l.activities.map((a) => `${a.id} ${a.slot} ${a.minutes}m${a.purpose ? '' : ' (no purpose)'}${a.response ? '' : ' (no response)'}`).join(', '),
    '| ELL',
    ells,
    '| cool-down',
    l.coolDown.title,
    l.coolDown.task ? '' : '(no task yet)',
  );
}
