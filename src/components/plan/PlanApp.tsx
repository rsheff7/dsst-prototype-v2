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
import { IMLines, MathText } from '@/components/u3/MathText';
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

function Part({ letter, title, lang, children }: { letter: string; title: string; lang?: boolean; children: ReactNode }) {
  return (
    <section className={p.part}>
      <div className={p.partHead}>
        <span className={cx(p.letter, lang && p.letterLang)}>{letter}</span>
        <h4>{title}</h4>
      </div>
      {children}
    </section>
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

/** One Premo moment: what you see, say your move aloud, then check it. */
function MomentCard({ m }: { m: Moment }) {
  const { st, toggle, levels } = useContext(Ctx);
    const said = !!st.said[m.id];
    const bandSays = m.byBand
      ? (levels.length ? levels : ([1, 3, 5] as WidaLevel[])).map((l) => ({ l, x: m.byBand![bandForLevel(l)] }))
      : [];
    return (
      <div className={s.pat}>
        <span className={s.lab}>You see</span>
        <span className={s.patSays}>
          <MathText>{m.see}</MathText>
        </span>
        {!said ? (
          <button type="button" className={cx(s.btn, s.sm)} style={{ justifySelf: 'start' }} onClick={() => toggle('said', m.id)}>
            {Icon.mic} I said my move
          </button>
        ) : (
          <div className={cx(s.stack, s.reveal)} style={{ gap: 8 }}>
            {m.say && (
              <span className={p.say}>
                <MathText>{q(m.say)}</MathText>
              </span>
            )}
            {bandSays.map(({ l, x }) => (
              <span key={l} className={s.small}>
                <b>{levels.length ? `Level ${l}` : `Levels ${l}–${l + 1}`}:</b> <MathText>{q(x.say)}</MathText>
                {levels.length > 0 && tierOf(l) === 'higher' && <span className={s.muted}> Ask first; hold the frame back unless they stall.</span>}
              </span>
            ))}
            {m.criteria && m.criteria.length > 0 && (
              <div className={s.checks}>
                {m.criteria.map((c, j) => (
                  <Check key={j} on={!!st.ticks[`${m.id}#${j}`]} onClick={() => toggle('ticks', `${m.id}#${j}`)}>
                    {c}
                  </Check>
                ))}
              </div>
            )}
            <span className={cx(s.muted, s.small)}>
              <b>Avoid:</b> {m.dont}
            </span>
            <button type="button" className={s.flagbtn} aria-pressed={!!st.flags[m.id]} onClick={() => toggle('flags', m.id)}>
              {Icon.flag}
              {st.flags[m.id] ? 'Flagged for coach' : 'Flag as hard'}
            </button>
          </div>
        )}
      </div>
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
        <IMLines lines={im.coolDown.task} />
        <p className={cx(s.muted, s.small)}>Answer in writing, with your reasoning, then say it out loud.</p>
      </section>
      <textarea value={st.cool} placeholder="Your answer, as a strong student…" onChange={(e) => update({ cool: e.target.value })} />
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

  const activityPage = (a: ImActivity, pa: PlanActivity) => {
    const isCrux = a.id === cruxId;
    // Parts are lettered in the order they show, which follows the IPP: math, anticipate, respond, then implementation.
    let n = 0;
    const L = () => 'abcdefg'[n++];
    return (
      <div className={s.stackLg}>
        <section className={cx(s.scard, isCrux && s.scardCrux)}>
          <div className={s.row}>
            <span className={s.pill}>
              {a.id} · {SLOT[a.slot]} · {a.minutes} min
            </span>
            {isCrux && <span className={cx(s.pill, s.pillCrux)}>Crux</span>}
            <button type="button" className={cx(s.pill, s.pillBtn)} onClick={() => setSheet(`act:${a.id}`)}>
              IM’s notes ⓘ
            </button>
          </div>
          <h3>{a.title}</h3>

          <Part letter={L()} title="Do the math">
            <details className={s.more}>
              <summary>The task</summary>
              <IMLines lines={a.task} />
            </details>
            <Reveal k={`math:${a.id}`} label="I solved it. Show the strategies">
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
            </Reveal>
          </Part>

          <Part letter={L()} title="Barriers and misconceptions">
            {pa.barriers.length > 0 && (
              <div>
                <span className={s.lab}>Barriers</span>
                <ul className={s.clean}>
                  {pa.barriers.map((x, i) => (
                    <li key={i}>
                      <MathText>{x}</MathText>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <span className={s.lab}>Misconceptions</span>
              <ul className={s.clean}>
                {pa.misconceptions.map((x, i) => (
                  <li key={i}>
                    <MathText>{x}</MathText>
                  </li>
                ))}
              </ul>
            </div>
          </Part>

          <Part letter={L()} title="Plan your response">
            {pa.momentIds
              .map(moment)
              .filter((m): m is Moment => !!m)
              .map((m) => (
                <MomentCard key={m.id} m={m} />
              ))}
            <div>
              <span className={s.lab}>Back-pocket questions</span>
              <ul className={s.clean}>
                {pa.backPocket.map((x, i) => (
                  <li key={i}>
                    <MathText>{q(x)}</MathText>
                  </li>
                ))}
              </ul>
            </div>
          </Part>

          {isCrux && (
            <Part letter={L()} title="Launch with Three Reads" lang>
              <div className={s.row}>
                <RoutineChip name="MLR6: Three Reads" />
              </div>
              {plan.crux.threeReads.map((r, i) => (
                <div key={i} className={p.read}>
                  <span className={s.lab}>
                    Read {i + 1} · {r.focus}
                  </span>
                  <span className={p.say}>
                    <MathText>{q(r.say)}</MathText>
                  </span>
                  <span className={cx(s.muted, s.small)}>
                    <b>Listen for:</b> <MathText>{r.listenFor}</MathText>
                  </span>
                </div>
              ))}
              <Check on={!!st.said['tr']} onClick={() => toggle('said', 'tr')}>
                I ran the three reads out loud
              </Check>
            </Part>
          )}

          {isCrux && (
            <Part letter={L()} title="Release with a frame" lang>
              <div className={s.row}>
                <RoutineChip name="MLR8: Discussion Supports" />
              </div>
              <span className={p.say}>
                <MathText>{q(plan.crux.release.say)}</MathText>
              </span>
              <span className={s.small}>
                <b>Success criteria:</b> <MathText>{plan.crux.release.successCriteria}</MathText>
              </span>
              <Frames />
              <div>
                <span className={s.lab}>Talk practice</span>
                <ul className={s.clean}>
                  {plan.crux.release.talkMoments.map((x, i) => (
                    <li key={i}>
                      <MathText>{x}</MathText>
                    </li>
                  ))}
                </ul>
              </div>
            </Part>
          )}

          <Part letter={L()} title="Grouping and monitoring">
            <span className={s.small}>
              <b>How students work:</b> <MathText>{pa.grouping}</MathText>
            </span>
            <span className={s.small}>
              <b>Monitor:</b> <MathText>{pa.monitor}</MathText>
            </span>
          </Part>

          {isCrux && (
            <Part letter={L()} title="Synthesize in the language goal" lang>
              <div className={s.row}>
                <RoutineChip name={plan.crux.synthesis.routine} />
              </div>
              <ol className={s.clean} style={{ listStyle: 'decimal' }}>
                {plan.crux.synthesis.steps.map((x, i) => (
                  <li key={i}>
                    <MathText>{x}</MathText>
                  </li>
                ))}
              </ol>
              <span className={p.say}>
                <MathText>{q(plan.crux.synthesis.prompt)}</MathText>
              </span>
              <Reveal k="synth-sounds" label="What a strong answer sounds like">
                <div className={s.flat}>
                  <MathText>{q(plan.crux.synthesis.sounds)}</MathText>
                </div>
              </Reveal>
            </Part>
          )}
        </section>
      </div>
    );
  };

  const stepRehearse = () => {
    const i = Math.min(st.ai, chosen.length - 1);
    const a = actIm(chosen[i]);
    const pa = actPlan(chosen[i]);
    return (
      <div className={s.stack}>
        <div className={s.dotsnav} role="group" aria-label="Activities">
          {chosen.map((id, j) => (
            <button key={id} type="button" aria-current={j === i} style={{ width: 'auto', padding: '0 10px', borderRadius: 999 }} onClick={() => update({ ai: j })}>
              {id}
            </button>
          ))}
        </div>
        {a && pa ? activityPage(a, pa) : <p className={s.flat}>No plan for this activity yet.</p>}
      </div>
    );
  };

  const stepSynth = () => (
    <div className={s.stackLg}>
      <section className={cx(s.card, s.stack)}>
        <span className={s.eyebrow}>IM’s lesson synthesis</span>
        <IMLines lines={im.lessonSynthesis} />
      </section>
      <div className={s.stack}>
        <label htmlFor="plan-synth" className={s.lab}>
          What do you want students to say?
        </label>
        <textarea id="plan-synth" value={st.synth} style={{ minHeight: 90 }} onChange={(e) => update({ synth: e.target.value })} />
      </div>
      <Reveal k="lsynth" label="Compare with Premo’s plan">
        <div className={s.flat}>
          <span className={s.lab}>Desired</span>
          <MathText>{plan.lessonSynthesis.desired}</MathText>
        </div>
        <div>
          <span className={s.lab}>You may hear</span>
          <ul className={s.clean}>
            {plan.lessonSynthesis.anticipated.map((x, i) => (
              <li key={i}>
                <MathText>{q(x)}</MathText>
              </li>
            ))}
          </ul>
        </div>
        <span className={s.small}>
          <b>Back pocket:</b> <MathText>{q(plan.lessonSynthesis.backPocket)}</MathText>
        </span>
      </Reveal>
    </div>
  );

  const record = () => {
    const flagged = premo.moments.filter((m) => st.flags[m.id]).map((m) => `- ${m.see}`);
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
      st.cool || '(not answered)',
      ``,
      `## Lesson synthesis: what I want students to say`,
      st.synth || '(not written)',
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
    if (k === 'cool' && !st.shown.cool) return btn('Check my answer', () => toggle('shown', 'cool'), !st.cool.trim());
    if (k === 'rehearse' && st.ai < chosen.length - 1)
      return btn(`Next activity: ${chosen[st.ai + 1]} →`, () => {
        update({ ai: st.ai + 1 });
        window.scrollTo(0, 0);
      });
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
