'use client';

/**
 * The planning view: DSST's Lesson Intellectual Preparation Protocol (IPP) on a
 * phone, for one Unit 3 lesson. See docs/PLANNING-VIEW-REQUIREMENTS.md.
 *
 *   1 End goal        the lesson's place in the unit, the idea, the arc
 *   2 Language goal   the CLO; the teacher drafts what it sounds like, then compares
 *   3 Cool-down       solve it, check against IM's response and the CLO look-for
 *   4 Activities      the crux is required; the teacher adds any others
 *   5 Rehearse        each chosen activity on its own: math, barriers, responses,
 *                     grouping; at the crux, Three Reads, the frame, and MLR 1 or 2
 *   6 Synthesis       IM's lesson synthesis, planned
 *   7 Carry it        in-class card, the exemplar to post, the coach summary, a saved record
 *
 * It reads the lesson's IM and Premo layers and its plan file; the reviewed prep
 * (/u3/<code>) is a separate view and reads none of the plan.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import type { ImActivity, Moment, U3Lesson } from '@/lib/u3/types';
import type { PlanActivity, PlanLesson } from '@/lib/u3/planTypes';
import type { WidaLevel } from '@/lib/eld/types';
import { bandForLevel } from '@/lib/eld/types';
import { LEVELS, TIER_WORDS, levelName, tierOf } from '@/lib/prep/levelTiers';
import { findRoutine, routineTitle } from '@/lib/u3/routines';
import { IMLines, MathText, type TableFill } from '@/components/u3/MathText';
import U3ActivityNotes, { U3RoutineNotes } from '@/components/u3/U3ActivityNotes';
import { ImCredit } from '@/components/u3/U3Notice';
import { Check, Icon, Sheet, SheetTop, cx } from '@/components/prep/parts';
import s from '@/components/prep/prep.module.css';
import p from './plan.module.css';

type View = 'home' | 'step' | 'incl';

interface PlanState {
  view: View;
  step: number;
  /** Which chosen activity Rehearse is on. */
  ai: number;
  started: number | null;
  levels: WidaLevel[];
  /** Activities the teacher added; the crux is always in. */
  extra: string[];
  clo: string;
  cool: string;
  synth: string;
  shown: Record<string, boolean>;
  said: Record<string, boolean>;
  ticks: Record<string, boolean>;
  flags: Record<string, boolean>;
  /** What the teacher wrote into blank table cells. */
  cells: Record<string, string>;
}

const fresh = (): PlanState => ({
  view: 'home',
  step: 0,
  ai: 0,
  started: null,
  levels: [],
  extra: [],
  clo: '',
  cool: '',
  synth: '',
  shown: {},
  said: {},
  ticks: {},
  flags: {},
  cells: {},
});

const STEPS = [
  { key: 'goal', name: 'Understand the end goal', short: 'Goal', min: 4 },
  { key: 'clo', name: 'The language goal', short: 'Language', min: 5 },
  { key: 'cool', name: 'Do the cool-down', short: 'Cool-down', min: 5 },
  { key: 'choose', name: 'Choose activities', short: 'Choose', min: 1 },
  { key: 'rehearse', name: 'Rehearse', short: 'Rehearse', min: 10 },
  { key: 'synth', name: 'Lesson synthesis', short: 'Synthesis', min: 3 },
  { key: 'carry', name: 'Carry it', short: 'Carry', min: 2 },
] as const;
/** Each activity added beyond the crux adds about this much rehearsal. */
const PER_EXTRA = 4;

type Card = { id: string; activityId: string; kind: 'math' | 'launch' | 'release' | 'moment' | 'synthesis'; momentId?: string };

const MOMENT_LABEL: Record<Moment['kind'], string> = {
  'student-thinking': 'Student thinking',
  'im-misconception': 'Common error',
  'routine-breakdown': 'When the routine slips',
  'which-work-first': 'Who shares first',
  'teacher-move': 'Your move',
  language: 'Language',
  'run-routine': 'Run the routine',
};
// DSST's crux routines (requirements D1): MLR 1, 2, 6 and 8.
const D1_ROUTINES = [1, 2, 6, 8];
// For a moment the Premo layer didn't write checks for.
const FALLBACK_CRITERIA = ['Responded to what I saw, not the answer I wanted', 'Left the thinking with the student', 'Asked for the language goal, not just the number'];
const SYNTH_CRITERIA: Record<PlanLesson['crux']['synthesis']['routine'], string[]> = {
  'MLR2: Collect and Display': ['Called on work in IM’s order', 'Wrote students’ own words where all can see them', 'Asked the question in the language goal’s form'],
  'MLR1: Stronger and Clearer Each Time': ['Students wrote a first draft alone', 'Each partner pressed for one more detail', 'Students rewrote using words they heard'],
};

const SLOT = { 'warm-up': 'Warm-up', activity: 'Activity', optional: 'Optional', 'cool-down': 'Cool-down' } as const;

const listOf = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')}${xs.length > 2 ? ',' : ''} and ${xs[xs.length - 1]}`);
const q = (t: string) => `“${t.replace(/^[“"]|[”"]$/g, '')}”`;

/** Browser storage for one lesson's plan. Missing storage just means no resume. */
function usePlanState(key: string) {
  const storageKey = `dsst-plan:${key}`;
  const [st, setSt] = useState<PlanState>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
      if (saved) return { ...fresh(), ...saved };
    } catch {
      /* no storage */
    }
    return fresh();
  });
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(st));
    } catch {
      /* no storage */
    }
  }, [st, storageKey]);
  const update = useCallback((patch: Partial<PlanState> | ((x: PlanState) => Partial<PlanState>)) => {
    setSt((x) => ({ ...x, ...(typeof patch === 'function' ? patch(x) : patch) }));
  }, []);
  const reset = useCallback(() => setSt(fresh()), []);
  return { st, update, reset };
}

interface CtxValue {
  st: PlanState;
  toggle: (field: 'shown' | 'said' | 'ticks' | 'flags', k: string) => void;
  setSheet: (x: string | null) => void;
  premo: U3Lesson['premo'];
  plan: PlanLesson;
  levels: WidaLevel[];
}
const Ctx = createContext<CtxValue>(null as unknown as CtxValue);

function Reveal({ k, label, children }: { k: string; label: string; children: ReactNode }) {
  const { st, toggle } = useContext(Ctx);
  return st.shown[k] ? (
      <div className={cx(s.stack, s.reveal)}>{children}</div>
    ) : (
      <button type="button" className={cx(s.btn, s.sm)} style={{ justifySelf: 'start' }} onClick={() => toggle('shown', k)}>
        {label}
      </button>
    );
}

function RoutineChip({ name }: { name: string }) {
  const { setSheet } = useContext(Ctx);
  return findRoutine(name) ? (
      <button type="button" className={cx(s.pill, s.pillAct, s.pillBtn)} onClick={() => setSheet(`rt:${name}`)}>
        {routineTitle(name)} ⓘ
      </button>
    ) : (
      <span className={cx(s.pill, s.pillAct)}>{name}</span>
    );
}

/** The frame at the crux, for each level picked, under the level-tier rule. */
function Frames() {
  const { premo, plan, levels } = useContext(Ctx);
    const shownLevels = levels.length ? levels : null;
    const rows = shownLevels
      ? shownLevels.map((l) => ({ key: `L${l}`, label: `Level ${l}`, band: bandForLevel(l), tier: tierOf(l) as 'lower' | 'higher' | null, level: l }))
      : (['emerging', 'developing', 'expanding'] as const).map((b, i) => ({ key: b, label: `Levels ${i * 2 + 1}–${i * 2 + 2}`, band: b, tier: null, level: null }));
    return (
      <div className={s.prof}>
        {rows.map((r) => {
          const x = plan.crux.release.byBand?.[r.band] ?? premo.cruxLanguage.byBand[r.band];
          return (
            <div key={r.key} className={s.pc}>
              <span className={s.lv}>{r.label}</span>
              {x.frame && (
                <>
                  {r.tier && <span className={cx(s.muted, s.small)}>{TIER_WORDS[r.tier].frame}:</span>}
                  <span className={s.frame}>
                    <MathText>{x.frame}</MathText>
                  </span>
                </>
              )}
              {r.tier !== 'lower' && x.stretch && (
                <span className={s.small}>
                  <b>At Level {r.level ?? (r.band === 'emerging' ? 2 : r.band === 'developing' ? 4 : 6)}, also:</b> <MathText>{x.stretch}</MathText>
                </span>
              )}
              {r.tier && <span className={cx(s.muted, s.small)}>{TIER_WORDS[r.tier].partner}</span>}
            </div>
          );
        })}
      </div>
    );
  }

export default function PlanApp({ lesson, plan }: { lesson: U3Lesson; plan: PlanLesson }) {
  const { im, premo } = lesson;
  const { st, update, reset } = usePlanState(im.code);
  const [sheet, setSheet] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const cruxId = premo.crux;
  const actIm = (id: string) => im.activities.find((a) => a.id === id);
  const actPlan = (id: string) => plan.activities.find((a) => a.id === id);
  const moment = (id: string) => premo.moments.find((m) => m.id === id);
  const chosen = useMemo(
    () => im.activities.filter((a) => a.id === cruxId || st.extra.includes(a.id)).map((a) => a.id),
    [im.activities, cruxId, st.extra],
  );
  const minutes = (k: (typeof STEPS)[number]['key'], min: number) => (k === 'rehearse' ? min + PER_EXTRA * (chosen.length - 1) : min);
  const total = STEPS.reduce((n, x) => n + minutes(x.key, x.min), 0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSheet(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const go = (i: number) => {
    update({ view: 'step', step: i, ai: i === 4 ? 0 : st.ai });
    window.scrollTo(0, 0);
  };
  const toggle = (field: 'shown' | 'said' | 'ticks' | 'flags', k: string) => update((x) => ({ [field]: { ...x[field], [k]: !x[field][k] } }));
  const levels = st.levels;
  const fill = (key: string, answers?: string[] | null, check?: boolean): TableFill => ({
    key,
    answers,
    check,
    values: st.cells,
    onChange: (cell, value) => update((x) => ({ cells: { ...x.cells, [cell]: value } })),
  });
  const filled = (key: string) => Object.entries(st.cells).some(([k, v]) => k.startsWith(`${key}:`) && v.trim());
  const crux = actIm(cruxId)!;

  // --------------------------------------------------------------- steps
  const stepGoal = () => (
    <div className={s.stackLg}>
      <section className={cx(s.card, s.stack)}>
        <span className={s.eyebrow}>The idea</span>
        <p className={s.goal}>
          <MathText>{premo.goal}</MathText>
        </p>
        <p className={s.small}>
          <MathText>{plan.story}</MathText>
        </p>
        <p className={cx(s.small, s.muted)}>
          <b>Builds on:</b> <MathText>{plan.previous}</MathText>
        </p>
        <details className={s.more}>
          <summary>IM’s lesson narrative and goals</summary>
          <div className={s.stack}>
            <IMLines lines={im.narrative} />
            <ul className={s.clean}>
              {im.goals.map((g, i) => (
                <li key={i}>
                  <MathText>{g.text}</MathText>
                </li>
              ))}
            </ul>
          </div>
        </details>
      </section>
      <section className={s.stack}>
        <h3>The arc</h3>
        <ol className={s.tl}>
          {im.activities.map((a) => (
            <li key={a.id} className={cx(a.id === cruxId && s.tlCrux)}>
              <span className={s.tlTime}>{a.minutes}m</span>
              <button type="button" className={s.tlBtn} onClick={() => setSheet(`act:${a.id}`)}>
                <span className={s.tlName}>
                  {a.id} · {a.title}
                  {a.id === cruxId ? <span className={cx(s.pill, s.pillCrux)}>Crux</span> : <span className={s.pill}>{SLOT[a.slot]}</span>}
                </span>
                {premo.watchFor[a.id] && (
                  <span className={s.tlWatch}>
                    <MathText>{premo.watchFor[a.id]}</MathText>
                  </span>
                )}
              </button>
            </li>
          ))}
        </ol>
        <span className={cx(s.muted, s.small)}>Tap an activity for IM’s notes.</span>
      </section>
    </div>
  );

  const stepClo = () => (
    <div className={s.stackLg}>
      <section className={cx(s.card, s.stack)}>
        <span className={s.eyebrow}>Content language objective</span>
        <p className={s.goal}>
          <MathText>{plan.clo.statement}</MathText>
        </p>
        <dl className={s.kv}>
          <dt>Function</dt>
          <dd>{plan.clo.function}</dd>
          <dt>Form</dt>
          <dd>
            <span className={s.frame}>
              <MathText>{plan.clo.form}</MathText>
            </span>
          </dd>
          <dt>Precise</dt>
          <dd>{plan.clo.precise.join(', ')}</dd>
          {plan.clo.informal.length > 0 && (
            <>
              <dt>Fine today</dt>
              <dd>{plan.clo.informal.join(', ')}</dd>
            </>
          )}
        </dl>
        <span className={cx(s.muted, s.small)}>
          From IM’s goal: <MathText>{plan.clo.imGoal}</MathText>
        </span>
      </section>
      <div className={s.stack}>
        <label htmlFor="plan-clo" className={s.prompt} style={{ fontSize: 20 }}>
          At the crux, what does a strong student sentence sound like?
        </label>
        {/* The crux was on the last page; bring its task and IM's notes back without leaving this one. */}
        <div className={s.row}>
          <span className={cx(s.pill, s.pillCrux)}>
            {crux.id} {crux.title}
          </span>
          <button type="button" className={cx(s.pill, s.pillBtn)} onClick={() => setSheet(`act:${cruxId}`)}>
            IM’s notes ⓘ
          </button>
        </div>
        <textarea
          id="plan-clo"
          value={st.clo}
          placeholder="Write it the way a strong student would say it…"
          onChange={(e) => update({ clo: e.target.value })}
        />
      </div>
      {st.shown.clo && (
        <section className={cx(s.stack, s.reveal)}>
          <div className={s.flat}>
            <span className={s.lab}>Premo’s exemplar</span>
            <p className={p.say}>
              <MathText>{q(plan.clo.exemplar)}</MathText>
            </p>
          </div>
          <h3>Does yours…</h3>
          <div className={s.checks}>
            <Check on={!!st.ticks['clo#form']} onClick={() => toggle('ticks', 'clo#form')}>
              Follow the form
            </Check>
            <Check on={!!st.ticks['clo#terms']} onClick={() => toggle('ticks', 'clo#terms')}>
              Use {listOf(plan.clo.precise.map((t) => q(t)))} precisely
            </Check>
            <Check on={!!st.ticks['clo#nums']} onClick={() => toggle('ticks', 'clo#nums')}>
              Say it with the task’s own numbers
            </Check>
          </div>
        </section>
      )}
    </div>
  );

  const stepCool = () => (
    <div className={s.stackLg}>
      <section className={cx(s.card, s.stack)}>
        <span className={s.eyebrow}>Cool-down · {im.coolDown.title}</span>
        <IMLines lines={im.coolDown.task} fill={fill('cool', im.coolDown.response, !!st.shown.cool)} />
        <p className={cx(s.muted, s.small)}>Fill in the table, write your reasoning, then say it out loud.</p>
      </section>
      <textarea value={st.cool} placeholder="Your reasoning, as a strong student…" onChange={(e) => update({ cool: e.target.value })} />
      {st.shown.cool && (
        <section className={cx(s.stack, s.reveal)}>
          <div className={s.flat}>
            <span className={s.lab}>IM’s response</span>
            <IMLines lines={im.coolDown.response} />
          </div>
          <h3>Would your answer show these?</h3>
          <div className={s.checks}>
            {[...im.targets, plan.clo.lookFor].map((t, i) => (
              <Check key={i} on={!!st.ticks[`cool#${i}`]} onClick={() => toggle('ticks', `cool#${i}`)}>
                <MathText>{t}</MathText>
              </Check>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const stepChoose = () => (
    <div className={s.stack}>
      {im.activities.map((a) => {
        const isCrux = a.id === cruxId;
        const on = isCrux || st.extra.includes(a.id);
        return (
          <button
            key={a.id}
            type="button"
            className={cx(s.toggle)}
            aria-pressed={on}
            disabled={isCrux}
            onClick={() => update((x) => ({ extra: x.extra.includes(a.id) ? x.extra.filter((y) => y !== a.id) : [...x.extra, a.id] }))}
          >
            <span className={s.stack} style={{ gap: 2 }}>
              <b>
                {a.id} · {a.title}
              </b>
              <span className={cx(s.muted, s.small)}>
                {SLOT[a.slot]} · {a.minutes} min
                {isCrux && (
                  <>
                    {' · '}
                    <span className={p.required}>Crux · required</span>
                  </>
                )}
              </span>
            </span>
            <span className={s.sw} aria-hidden="true" />
          </button>
        );
      })}
      <p className={cx(s.muted, s.small)}>Each activity you add is about {PER_EXTRA} more minutes. The warm-up is never required.</p>
    </div>
  );

  // --------------------------------------------------------------- rehearse
  // One card at a time, the way the reviewed prep rehearses: what you see, say your
  // move aloud, check it, then the model wording. The cards follow the lesson as it
  // runs, for the activities the teacher chose: each starts with doing the math; the
  // crux adds the launch, the release and the synthesis around its moments.
  const cards = useMemo(() => {
    const out: Card[] = [];
    for (const id of chosen) {
      const a = actIm(id);
      const pa = actPlan(id);
      if (!a || !pa) continue;
      const isCrux = id === cruxId;
      out.push({ id: `math:${id}`, activityId: id, kind: 'math' });
      if (isCrux) out.push({ id: `launch:${id}`, activityId: id, kind: 'launch' }, { id: `release:${id}`, activityId: id, kind: 'release' });
      for (const mid of pa.momentIds) if (moment(mid)) out.push({ id: mid, activityId: id, kind: 'moment', momentId: mid });
      if (isCrux) out.push({ id: `synth:${id}`, activityId: id, kind: 'synthesis' });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosen.join(','), plan, premo]);

  const cardView = (c: Card) => {
    const a = actIm(c.activityId)!;
    const pa = actPlan(c.activityId)!;
    const m = c.momentId ? moment(c.momentId) : undefined;
    const isCrux = c.activityId === cruxId;
    const synthRoutine = plan.crux.synthesis.routine;
    const spec: { label: string; routine?: string; see: ReactNode; seeAs?: 'task'; prompt: string; criteria: string[]; model: ReactNode } =
      c.kind === 'math'
        ? {
            label: 'Do the math',
            // Photos show only as alt text and credit here; IM's notes keep them.
            see: <IMLines lines={a.task.filter((l) => !/^\[image:|Attribution:/.test(l))} fill={fill(`task:${a.id}`, a.response, !!st.said[`math:${a.id}`])} />,
            seeAs: 'task',
            prompt: 'Solve it, then say the ways students will solve it and what you’ll watch for.',
            criteria: ['Solved the task myself', 'Named more than one way students might solve it', 'Said what I’ll watch and listen for while they work'],
            model: (
              <>
                <div className={s.flat}>
                  <span className={s.lab}>Ways students will solve it</span>
                  <ul className={s.clean}>
                    {pa.strategies.map((x, i) => (
                      <li key={i}>
                        <MathText>{x}</MathText>
                      </li>
                    ))}
                  </ul>
                  {a.response && (
                    <details className={s.more}>
                      <summary>IM’s response</summary>
                      <IMLines lines={a.response} />
                    </details>
                  )}
                </div>
                <div className={s.avoid}>
                  <span className={s.lab}>Barriers and misconceptions</span>
                  <ul className={s.clean}>
                    {[...pa.barriers, ...pa.misconceptions].map((x, i) => (
                      <li key={i}>
                        <MathText>{x}</MathText>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={s.respond}>
                  <span className={s.lab}>Back-pocket questions</span>
                  <ul className={s.clean}>
                    {pa.backPocket.map((x, i) => (
                      <li key={i}>
                        <MathText>{q(x)}</MathText>
                      </li>
                    ))}
                  </ul>
                </div>
                <span className={s.small}>
                  <b>How students work:</b> <MathText>{pa.grouping}</MathText>
                </span>
                <span className={s.small}>
                  <b>Monitor:</b> <MathText>{pa.monitor}</MathText>
                </span>
              </>
            ),
          }
        : c.kind === 'launch'
          ? {
              label: 'Launch',
              routine: 'MLR6: Three Reads',
              see: 'The task is up with its questions covered. Students are waiting to start.',
              prompt: 'Run the three reads out loud.',
              criteria: ['Read 1: the situation, with no numbers', 'Read 2: the quantities, with their units', 'Read 3: the question, without solving it'],
              model: (
                <>
                  {plan.crux.threeReads.map((r, i) => (
                    <div key={i} className={s.respond}>
                      <span className={s.lab}>
                        Read {i + 1} · {r.focus}
                      </span>
                      <p style={{ fontWeight: 600 }}>
                        <MathText>{q(r.say)}</MathText>
                      </p>
                      <span className={cx(s.muted, s.small)}>
                        <b>Listen for:</b> <MathText>{r.listenFor}</MathText>
                      </span>
                    </div>
                  ))}
                </>
              ),
            }
          : c.kind === 'release'
            ? {
                label: 'Release with a frame',
                routine: 'MLR8: Discussion Supports',
                see: 'The three reads are done. Students are about to start work.',
                prompt: 'Say how you release them: the language they must use, and the frame.',
                criteria: ['Named the language they must use', 'Offered the frame the way my students’ levels need it', 'Set up a moment for them to say it to a partner'],
                model: (
                  <>
                    <div className={s.respond}>
                      <span className={s.lab}>Respond</span>
                      <p style={{ fontWeight: 600 }}>
                        <MathText>{q(plan.crux.release.say)}</MathText>
                      </p>
                      <span className={s.small}>
                        <b>Success criteria:</b> <MathText>{plan.crux.release.successCriteria}</MathText>
                      </span>
                    </div>
                    <span className={s.lab}>The frame · by WIDA level</span>
                    <Frames />
                    <div className={s.flat}>
                      <span className={s.lab}>Talk practice</span>
                      <ul className={s.clean}>
                        {plan.crux.release.talkMoments.map((x, i) => (
                          <li key={i}>
                            <MathText>{x}</MathText>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ),
              }
            : c.kind === 'synthesis'
              ? {
                  label: 'Synthesis',
                  routine: synthRoutine,
                  see: 'Work time is over. Pairs have answers and are ready to share.',
                  prompt: `Run the synthesis with ${routineTitle(synthRoutine)}: who shares, what students say, and your question.`,
                  criteria: SYNTH_CRITERIA[synthRoutine],
                  model: (
                    <>
                      <div className={s.flat}>
                        <span className={s.lab}>Run it</span>
                        <ol className={s.clean} style={{ listStyle: 'decimal' }}>
                          {plan.crux.synthesis.steps.map((x, i) => (
                            <li key={i}>
                              <MathText>{x}</MathText>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className={s.respond}>
                        <span className={s.lab}>Ask</span>
                        <p style={{ fontWeight: 600 }}>
                          <MathText>{q(plan.crux.synthesis.prompt)}</MathText>
                        </p>
                        <span className={cx(s.muted, s.small)}>
                          <b>Sounds like:</b> <MathText>{q(plan.crux.synthesis.sounds)}</MathText>
                        </span>
                      </div>
                    </>
                  ),
                }
              : {
                  label: m ? MOMENT_LABEL[m.kind] : '',
                  // Only the crux routines DSST chose (D1) get a chip; a moment tagged with another routine shows none.
                  routine: m?.routine && D1_ROUTINES.includes(findRoutine(m.routine)?.mlr ?? 0) ? m.routine : undefined,
                  see: <MathText>{m?.see ?? ''}</MathText>,
                  prompt: 'What do you do or say next?',
                  criteria: m?.criteria?.length ? m.criteria : FALLBACK_CRITERIA,
                  model: m ? (
                    <>
                      <div className={s.flat}>
                        <span className={s.lab}>What’s going on</span>
                        <MathText>{m.means}</MathText>
                      </div>
                      {m.byBand ? (
                        <>
                          <span className={s.lab}>Respond · by WIDA level</span>
                          <div className={s.prof}>
                            {(levels.length ? levels : ([1, 3, 5] as WidaLevel[])).map((l) => (
                              <div key={l} className={s.pc}>
                                <span className={s.lv}>{levels.length ? `Level ${l}` : `Levels ${l}–${l + 1}`}</span>
                                <b>
                                  <MathText>{q(m.byBand![bandForLevel(l)].say)}</MathText>
                                </b>
                                {levels.length > 0 && tierOf(l) === 'higher' && (
                                  <span className={cx(s.muted, s.small)}>Ask first; hold the frame back unless they stall.</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        m.say && (
                          <div className={s.respond}>
                            <span className={s.lab}>Respond</span>
                            <p style={{ fontWeight: 600 }}>
                              <MathText>{q(m.say)}</MathText>
                            </p>
                          </div>
                        )
                      )}
                      <div className={s.avoid}>
                        <span className={s.lab}>Avoid</span>
                        <p>
                          <MathText>{m.dont}</MathText>
                        </p>
                      </div>
                    </>
                  ) : null,
                };
    const said = !!st.said[c.id];
    const lang = c.kind === 'launch' || c.kind === 'release' || c.kind === 'synthesis' || m?.kind === 'language';
    return (
      <article className={cx(s.scard, isCrux && s.scardCrux)} aria-live="polite">
        <div className={s.row}>
          <span className={s.pill}>
            {a.id} {a.title}
          </span>
          <span className={s.pill}>{spec.label}</span>
          {isCrux && <span className={cx(s.pill, s.pillCrux)}>Crux</span>}
          {lang && <span className={cx(s.pill, s.pillMll)}>Language</span>}
          {spec.routine && <RoutineChip name={spec.routine} />}
        </div>
        <div className={s.stack} style={{ gap: 8 }}>
          <span className={s.lab}>{spec.seeAs === 'task' ? 'The task students get' : 'You see'}</span>
          <div className={spec.seeAs === 'task' ? s.flat : s.notice}>{spec.see}</div>
        </div>
        {!said ? (
          <div className={s.sayit}>
            {Icon.mic}
            <b>Say your move out loud.</b>
            {spec.prompt}
          </div>
        ) : (
          <div className={cx(s.stack, s.reveal)}>
            <div>
              <span className={s.lab}>Check what you said</span>
              <div className={s.checks}>
                {spec.criteria.map((t, j) => (
                  <Check key={j} on={!!st.ticks[`${c.id}#${j}`]} onClick={() => toggle('ticks', `${c.id}#${j}`)}>
                    {t}
                  </Check>
                ))}
              </div>
            </div>
            {st.shown[`model:${c.id}`] ? (
              <div className={cx(s.stack, s.reveal)}>{spec.model}</div>
            ) : (
              <button type="button" className={cx(s.btn, s.sm)} style={{ justifySelf: 'start' }} onClick={() => toggle('shown', `model:${c.id}`)}>
                Show model wording
              </button>
            )}
            <button type="button" className={s.flagbtn} aria-pressed={!!st.flags[c.id]} onClick={() => toggle('flags', c.id)}>
              {Icon.flag}
              {st.flags[c.id] ? 'Flagged for coach' : 'Flag as hard'}
            </button>
          </div>
        )}
      </article>
    );
  };

  const stepRehearse = () => {
    if (!cards.length) return <p className={s.flat}>No activities to rehearse.</p>;
    const i = Math.min(st.ai, cards.length - 1);
    const saidCount = cards.filter((c) => st.said[c.id]).length;
    return (
      <div className={s.stack}>
        <div className={s.dotsnav} role="group" aria-label="Moments">
          {cards.map((c, j) => (
            <button
              key={c.id}
              type="button"
              className={cx(st.said[c.id] && s.said, st.flags[c.id] && s.flagged)}
              aria-current={j === i}
              aria-label={`Moment ${j + 1}`}
              onClick={() => update({ ai: j })}
            >
              {j + 1}
            </button>
          ))}
        </div>
        {cardView(cards[i])}
        <p className={cx(s.muted, s.small)} style={{ textAlign: 'center' }}>
          {i + 1} of {cards.length} · {saidCount} said · {chosen.length} {chosen.length === 1 ? 'activity' : 'activities'}
        </p>
      </div>
    );
  };

  const stepSynth = () => (
    <div className={s.stackLg}>
      <section className={cx(s.card, s.stack)}>
        <span className={s.eyebrow}>Say the ideas</span>
        {plan.lessonSynthesis.ideas.map((x, i) => (
          <p key={i} style={{ fontWeight: 600 }}>
            <MathText>{q(x)}</MathText>
          </p>
        ))}
        <span className={s.small}>
          <b>Point to:</b> <MathText>{plan.lessonSynthesis.pointTo}</MathText>
        </span>
        <Check on={!!st.said['lsynth']} onClick={() => toggle('said', 'lsynth')}>
          I said the ideas out loud, pointing to the chart
        </Check>
        <details className={s.more}>
          <summary>IM’s lesson synthesis</summary>
          <IMLines lines={im.lessonSynthesis} />
        </details>
      </section>
      <section className={cx(s.card, s.stack)}>
        <span className={s.eyebrow}>Quick check before the cool-down</span>
        <p className={s.prompt} style={{ fontSize: 19 }}>
          <MathText>{q(plan.lessonSynthesis.check.question)}</MathText>
        </p>
        <span className={cx(s.muted, s.small)}>Students answer in the language goal’s form. Say a strong answer yourself first.</span>
        <Reveal k="lcheck" label="What a strong answer sounds like">
          <div className={s.flat}>
            <MathText>{q(plan.lessonSynthesis.check.sounds)}</MathText>
          </div>
        </Reveal>
      </section>
    </div>
  );

  const record = () => {
    const flagged = cards.filter((c) => st.flags[c.id]).map((c) => `- ${c.activityId}: ${c.momentId ? moment(c.momentId)?.see : c.kind === 'math' ? 'doing the math' : c.kind}`);
    return [
      `# Lesson ${im.code} ${im.title}: planning record`,
      `${new Date().toLocaleDateString()} · Grade 6 Unit 3 · Activities rehearsed: ${chosen.join(', ')}`,
      ``,
      `## Language goal`,
      plan.clo.statement,
      `Exemplar: ${q(plan.clo.exemplar)}`,
      `My sentence: ${st.clo || '(not written)'}`,
      ``,
      `## Cool-down, as a student`,
      ...(filled('cool') ? [`Table: ${Object.entries(st.cells).filter(([k, v]) => k.startsWith('cool:') && v.trim()).map(([, v]) => v.trim()).join(', ')}`] : []),
      st.cool || '(no reasoning written)',
      ``,
      `## Lesson synthesis`,
      ...plan.lessonSynthesis.ideas.map((x) => `- ${x}`),
      `Quick check: ${q(plan.lessonSynthesis.check.question)}`,
      ``,
      `## Flagged as hard`,
      ...(flagged.length ? flagged : ['- None']),
      ``,
      `## Coach look-fors`,
      `- The language goal and what it sounds like: ${q(plan.clo.exemplar)}`,
      `- Three Reads at the launch of ${cruxId}, and ${routineTitle(plan.crux.synthesis.routine)} in its synthesis`,
      `- The frame in use at release, with the success criteria named: ${plan.crux.release.successCriteria}`,
      `- The teacher monitoring students’ language, not only their answers`,
      `- Students saying the language goal in the synthesis at least once`,
    ]
      .join('\n')
      // Plain text for a planning folder: fractions as a/b, mixed numbers as 16 2/3.
      .replace(/(\d)\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1 $2/$3')
      .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1/$2')
      .replace(/\\\(|\\\)/g, '');
  };

  const stepCarry = () => (
    <div className={s.stackLg}>
      <section className={s.stack}>
        <h3>The exemplar to post</h3>
        <div className={p.poster}>
          <span className={s.eyebrow}>
            Lesson {im.code} · Today’s language goal
          </span>
          <p className={p.posterBig}>
            <MathText>{plan.clo.statement}</MathText>
          </p>
          <span className={s.lab}>It sounds like</span>
          <p className={p.posterBig}>
            <MathText>{q(plan.clo.exemplar)}</MathText>
          </p>
          <span className={s.frame}>
            <MathText>{plan.clo.form}</MathText>
          </span>
        </div>
        <button type="button" className={cx(s.btn, s.sm)} onClick={() => window.print()}>
          Print the exemplar
        </button>
      </section>
      <section className={cx(s.card, s.stack)}>
        <h3>Your planning record</h3>
        <p className={cx(s.muted, s.small)}>For your lesson planning folder and your coach. It includes the coach’s look-fors.</p>
        <div className={s.duo}>
          <button
            type="button"
            className={s.btn}
            onClick={() => {
              navigator.clipboard?.writeText(record()).then(
                () => setToast('Copied'),
                () => setToast('Couldn’t copy'),
              );
            }}
          >
            Copy
          </button>
          <button
            type="button"
            className={s.btn}
            onClick={() => {
              const url = URL.createObjectURL(new Blob([record()], { type: 'text/markdown' }));
              const el = document.createElement('a');
              el.href = url;
              el.download = `plan-${im.code}-${new Date().toISOString().slice(0, 10)}.md`;
              el.click();
              URL.revokeObjectURL(url);
            }}
          >
            Download
          </button>
        </div>
        <details className={s.acc}>
          <summary>
            <b>Preview</b>
          </summary>
          <div className={s.accIn}>
            <textarea className={s.copybox} readOnly value={record()} />
          </div>
        </details>
      </section>
      {plan.cuts.length > 0 && (
        <details className={s.acc}>
          <summary>
            <b>If you run short</b>
          </summary>
          <div className={s.accIn}>
            <ul className={s.clean}>
              {plan.cuts.map((c, i) => (
                <li key={i}>
                  <b>{c.activityId}</b> <MathText>{c.note}</MathText>
                </li>
              ))}
            </ul>
          </div>
        </details>
      )}
      {plan.beforeClass.length > 0 && (
        <section className={cx(s.card, s.stack)}>
          <h3>Before class tomorrow</h3>
          <div className={s.checks}>
            {plan.beforeClass.map((t, i) => (
              <Check key={i} on={!!st.ticks[`bc#${i}`]} onClick={() => toggle('ticks', `bc#${i}`)}>
                <MathText>{t}</MathText>
              </Check>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  // --------------------------------------------------------------- actions per step
  const nextStep = () => go(Math.min(st.step + 1, STEPS.length - 1));
  const action = (): ReactNode => {
    const k = STEPS[st.step].key;
    const nextLabel = st.step < STEPS.length - 1 ? `Next: ${STEPS[st.step + 1].name} →` : '';
    const btn = (label: string, on: () => void, disabled = false) => (
      <button type="button" className={cx(s.btn, s.pri)} disabled={disabled} onClick={on}>
        {label}
      </button>
    );
    if (k === 'clo' && !st.shown.clo) return btn('Show Premo’s exemplar', () => toggle('shown', 'clo'), !st.clo.trim());
    if (k === 'cool' && !st.shown.cool) return btn('Check my answer', () => toggle('shown', 'cool'), !st.cool.trim() && !filled('cool'));
    if (k === 'rehearse' && cards.length) {
      const i = Math.min(st.ai, cards.length - 1);
      const c = cards[i];
      if (!st.said[c.id]) return btn('I said it', () => toggle('said', c.id));
      if (i < cards.length - 1)
        return btn('Next moment →', () => {
          update({ ai: i + 1 });
          window.scrollTo(0, 0);
        });
      const skipped = cards.findIndex((x) => !st.said[x.id]);
      if (skipped >= 0) return btn('Back to the ones you skipped', () => update({ ai: skipped }));
    }
    if (k === 'carry') return btn('In-class card', () => update({ view: 'incl' }));
    return btn(nextLabel, nextStep);
  };

  const STEP_VIEWS = [stepGoal, stepClo, stepCool, stepChoose, stepRehearse, stepSynth, stepCarry];

  // --------------------------------------------------------------- views
  const sheetAct = sheet?.startsWith('act:') ? actIm(sheet.slice(4)) : undefined;
  const sheetRoutine = sheet?.startsWith('rt:') ? findRoutine(sheet.slice(3)) : null;

  const home = (
    <>
      <div className={cx(s.bar, s.barPlain)}>
        <div className={s.ttl}>
          <b>Grade 6 · Unit 3</b>
          <span>DSST Math · Lesson {im.code} planning</span>
        </div>
        <span />
      </div>
      <main className={cx(s.main, s.stackLg)}>
        <section className={s.hero}>
          <div className={s.eyebrow}>Tonight · Lesson {im.code}</div>
          <h1>{im.title}</h1>
          <div className={s.meta}>
            <span>About {total} min</span>
            <span>{STEPS.length} steps</span>
          </div>
          <div className={s.ministeps} style={{ gridTemplateColumns: `repeat(${STEPS.length}, 1fr)` }}>
            {STEPS.map((x, i) => (
              <span key={x.key} className={st.started && i <= st.step ? undefined : s.todo}>
                {x.short}
              </span>
            ))}
          </div>
          <button
            type="button"
            className={s.btn}
            onClick={() => {
              if (!st.started) update({ started: Date.now() });
              go(st.started ? st.step : 0);
            }}
          >
            {Icon.play}
            {st.started ? `Resume: ${STEPS[st.step].name}` : 'Start planning'}
          </button>
        </section>
        <section className={s.sect} aria-label="Class ELD profile">
          <header className={s.sectHead}>
            <h3>Class ELD profile</h3>
            <span className={cx(s.muted, s.small)}>Sets the frames at the crux</span>
          </header>
          <div className={s.chips}>
            {LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                className={s.chip}
                aria-pressed={levels.includes(l)}
                onClick={() => update((x) => ({ levels: (x.levels.includes(l) ? x.levels.filter((y) => y !== l) : [...x.levels, l]).sort() }))}
              >
                WIDA {levelName(l)}
              </button>
            ))}
          </div>
        </section>
        <section className={s.sect}>
          <header className={s.sectHead}>
            <h3>The steps</h3>
          </header>
          <ol className={s.clean} style={{ listStyle: 'decimal' }}>
            {STEPS.map((x) => (
              <li key={x.key}>
                {x.name} <span className={s.muted}>· {minutes(x.key, x.min)} min</span>
              </li>
            ))}
          </ol>
        </section>
        <footer className={s.foot}>
          <Link href="/plan">All lessons</Link>
          <button type="button" onClick={reset}>
            Start over
          </button>
          <ImCredit />
        </footer>
      </main>
    </>
  );

  const stepView = () => {
    const i = st.step;
    const x = STEPS[i];
    return (
      <>
        <div className={s.bar}>
          <button type="button" className={s.iconbtn} aria-label="Back" onClick={() => (i === 0 ? update({ view: 'home' }) : go(i - 1))}>
            {Icon.back}
          </button>
          <div className={s.ttl}>
            <b>{im.code} planning</b>
            <span>
              Step {i + 1} of {STEPS.length} · {minutes(x.key, x.min)} min
            </span>
          </div>
          <span />
          <button type="button" className={s.iconbtn} aria-label="Home" onClick={() => update({ view: 'home' })}>
            {Icon.home}
          </button>
        </div>
        <div className={s.segs} aria-hidden="true" style={{ gridTemplateColumns: `repeat(${STEPS.length}, 1fr)` }}>
          {STEPS.map((y, j) => (
            <i key={y.key} className={cx(j < i ? s.done : j === i && s.on)} />
          ))}
        </div>
        <main className={s.main}>
          <header className={s.stephead}>
            <h2>{x.name}</h2>
          </header>
          {STEP_VIEWS[i]()}
        </main>
        <div className={s.act}>{action()}</div>
      </>
    );
  };

  const inClass = (
    <>
      <div className={cx(s.bar, s.barBack)}>
        <button type="button" className={s.iconbtn} aria-label="Back" onClick={() => update({ view: 'step' })}>
          {Icon.back}
        </button>
        <div className={s.ttl}>
          <b>In class · {im.code}</b>
          <span>Glance card for the crux</span>
        </div>
      </div>
      <main className={cx(s.main, s.incl)}>
        <section className={s.now}>
          <span className={s.eyebrow}>
            {crux.id} {crux.title} · Crux
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, opacity: 0.9 }}>LANGUAGE GOAL</span>
          <p className={s.nowSay} style={{ fontSize: 19 }}>
            <MathText>{plan.clo.statement}</MathText>
          </p>
        </section>
        <div className={s.mv}>
          <span className={s.lab}>Launch · Three Reads</span>
          {plan.crux.threeReads.map((r, i) => (
            <span key={i} className={s.mvDo}>
              {i + 1}. <MathText>{q(r.say)}</MathText>
            </span>
          ))}
        </div>
        <div className={s.mv}>
          <span className={s.lab}>Release</span>
          <span className={s.mvDo}>
            <MathText>{q(plan.crux.release.say)}</MathText>
          </span>
          <span className={s.mvIf}>
            <MathText>{plan.crux.release.successCriteria}</MathText>
          </span>
        </div>
        <Frames />
        <div className={s.mv}>
          <span className={s.lab}>Synthesis · {routineTitle(plan.crux.synthesis.routine)}</span>
          <span className={s.mvDo}>
            <MathText>{q(plan.crux.synthesis.prompt)}</MathText>
          </span>
          <span className={s.mvIf}>
            Listen for: <MathText>{q(plan.clo.exemplar)}</MathText>
          </span>
        </div>
      </main>
    </>
  );

  return (
    <Ctx.Provider value={{ st, toggle, setSheet, premo, plan, levels }}>
    <div className={cx(s.app, p.root)}>
      {st.view === 'home' && home}
      {st.view === 'step' && stepView()}
      {st.view === 'incl' && inClass}
      {sheetAct && (
        <Sheet onClose={() => setSheet(null)}>
          <SheetTop eyebrow={`${sheetAct.id} · ${sheetAct.minutes} min`} onClose={() => setSheet(null)} />
          <U3ActivityNotes a={sheetAct} heading={sheetAct.title} />
        </Sheet>
      )}
      {sheetRoutine && (
        <Sheet onClose={() => setSheet(null)}>
          <SheetTop eyebrow="IM routine" onClose={() => setSheet(null)} />
          <U3RoutineNotes r={sheetRoutine} />
        </Sheet>
      )}
      {toast && (
        <div className={s.toast} role="status">
          {toast}
        </div>
      )}
    </div>
    </Ctx.Provider>
  );
}
