'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { ToolId } from '@/lib/types';
import { useLesson } from '@/lib/lessonContext';
import { bandForLevel, type ProficiencyBand } from '@/lib/eld';
import { BANDS, PREP_BUDGET_MINUTES, activityName, bandLabel, buildPrepModel, quoted, type PrepLesson } from '@/lib/prep/prepModel';
import MobileQuickRead from '@/components/mobile/MobileQuickRead';
import WidaMobileSelector from '@/components/mobile/WidaMobileSelector';
import { U3Library } from '@/components/u3/U3ActivityNotes';
import { ImCredit } from '@/components/u3/U3Notice';
import { u3ToPrepModel } from '@/lib/u3/toPrepModel';
import type { U3Lesson } from '@/lib/u3/types';
import LessonPathway from '@/components/tools/LessonPathway';
import AnticipatedThinking from '@/components/tools/AnticipatedThinking';
import MoveWalkthrough from '@/components/tools/MoveWalkthrough';
import AdaptationGuardrails from '@/components/tools/AdaptationGuardrails';
import { usePrepState, elapsedSeconds, mmss, type PrepState } from './usePrepState';
import { STEP_VIEWS, coachText, stepDone, type StepCtx } from './steps';
import { ActivityDetail, Icon, MlrPill, Sheet, SheetTop, cx } from './parts';
import s from './prep.module.css';

const CLOCK_TICK_MS = 1000;

const LIB_TABS: [PrepState['lib'], string][] = [
  ['quickread', 'Quick Read'],
  ['pathway', 'Pathway'],
  ['thinking', 'Thinking'],
  ['moves', 'Moves'],
  ['adapt', 'Adapt'],
];

/**
 * The phone prep. Give it a generated or authored lesson (`lesson`), or a
 * Unit 3 lesson built from IM's teacher materials (`u3`). The screens are the
 * same; a Unit 3 lesson's Library is IM's own notes instead of the five tools.
 */
export default function PrepApp({ lesson, u3 }: { lesson?: PrepLesson; u3?: U3Lesson }) {
  const { selectedWidaLevel } = useLesson();
  const initialBands = useMemo<ProficiencyBand[]>(
    () => (selectedWidaLevel ? [bandForLevel(selectedWidaLevel)] : []),
    [selectedWidaLevel],
  );
  const build = useCallback(
    (bands: ProficiencyBand[] = []) => (u3 ? u3ToPrepModel(u3, bands) : buildPrepModel(lesson!, bands)),
    [lesson, u3],
  );
  const m0 = useMemo(() => build(), [build]);
  // Everything progress is stored against by position.
  const sig = useMemo(
    () => JSON.stringify([m0.scenarios.map((x) => [x.id, x.notice]), m0.proof.lookFors, m0.cuts, m0.setup.checklist]),
    [m0],
  );
  const { st, update, reset } = usePrepState(
    `${u3 ? 'u3:' : ''}${m0.code}:${m0.heading}${m0.authored && !u3 ? ':authored' : ''}`,
    sig,
    initialBands,
  );
  const m = useMemo(() => build(st.bands), [build, st.bands]);

  const [sheet, setSheet] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Prep clock: counts time with the page open. A hidden or closed page stops
  // the timer, and the gap it leaves is longer than a tick, so it isn't counted;
  // stopping tonight and resuming tomorrow doesn't read as fourteen hours.
  useEffect(() => {
    if (!st.started || st.stopped) return;
    let last = Date.now();
    const t = setInterval(() => {
      const now = Date.now();
      const add = now - last;
      last = now;
      if (add < 2 * CLOCK_TICK_MS) update((p) => ({ spent: p.spent + add }));
    }, CLOCK_TICK_MS);
    return () => clearInterval(t);
  }, [st.started, st.stopped, update]);

  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSheet(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [sheet]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const go = (step: number) => {
    update((p) => ({ view: 'step', step, maxStep: Math.max(p.maxStep, step) }));
    window.scrollTo(0, 0);
  };
  const home = () => {
    update({ view: 'home', ret: 'home' });
    window.scrollTo(0, 0);
  };
  const finish = (p: PrepState): Partial<PrepState> =>
    p.stopped ? {} : { stopped: Date.now(), done: true, maxStep: m.steps.length };

  const openLibrary = (tab?: PrepState['lib']) => {
    update((p) => ({ ret: p.view === 'step' ? 'step' : 'home', view: 'library', lib: tab ?? p.lib }));
    window.scrollTo(0, 0);
  };
  const openInClass = () => {
    update((p) => ({
      ret: p.view === 'step' ? 'step' : 'home',
      view: 'incl',
      ...(p.view === 'step' && p.step === m.steps.length - 1 ? finish(p) : {}),
    }));
    window.scrollTo(0, 0);
  };
  const backToStep = () => update({ view: 'step', ret: 'home' });

  const copyForCoach = () => {
    const txt = coachText(m, st);
    const fallback = () => {
      const box = document.getElementById('prep-coachbox') as HTMLDetailsElement | null;
      if (box) box.open = true;
      const ta = document.getElementById('prep-coachtxt') as HTMLTextAreaElement | null;
      ta?.focus();
      ta?.select();
      setToast('Select all and copy');
    };
    try {
      navigator.clipboard.writeText(txt).then(() => setToast('Copied for your coach'), fallback);
    } catch {
      fallback();
    }
    update(finish);
  };

  const clockEl = st.started ? (
    <span className={cx(s.clock, elapsedSeconds(st) > PREP_BUDGET_MINUTES * 60 && s.clockOver)} aria-label="Prep time">
      {mmss(elapsedSeconds(st))} <span className={s.muted}>/ {PREP_BUDGET_MINUTES}</span>
    </span>
  ) : (
    <span />
  );

  const tabsbar = (cur: 'home' | 'library' | 'incl') => (
    <nav className={s.tabsbar} aria-label="Main">
      <button type="button" aria-current={cur === 'home' ? 'page' : undefined} onClick={home}>
        {Icon.home}Tonight
      </button>
      <button type="button" aria-current={cur === 'library' ? 'page' : undefined} onClick={() => openLibrary()}>
        {Icon.book}Library
      </button>
      <button type="button" aria-current={cur === 'incl' ? 'page' : undefined} onClick={openInClass}>
        {Icon.card}In class
      </button>
    </nav>
  );

  // ------------------------------------------------------------------ Home
  const renderHome = () => {
    const started = !!st.started;
    const n = st.done ? m.steps.length : st.maxStep;
    const left = m.steps.slice(st.step).reduce((a, x) => a + x.minutes, 0);
    const label = st.done ? 'Review prep' : started ? `Resume: ${m.steps[st.step].name}` : 'Start prep';
    const onStart = () => {
      if (st.done) return go(m.steps.length - 1);
      if (started) return go(st.step);
      update({ started: Date.now(), stopped: null });
      go(0);
    };
    return (
      <>
        <div className={cx(s.bar, s.barPlain)}>
          <div className={s.ttl}>
            <b>
              {m.gradeUnit}
            </b>
            <span>DSST Math · Lesson {m.code}</span>
          </div>
          {started ? clockEl : null}
        </div>
        <main className={cx(s.main, s.stackLg)}>
          <section className={s.hero} aria-label="Tonight's prep">
            <div className={s.eyebrow}>Tonight · Lesson {m.code}</div>
            <h1>{m.heading}</h1>
            <div className={s.meta}>
              <span>{st.done ? 'Prep complete' : started ? `${left} min left` : `About ${m.estimateMinutes} min`}</span>
              <span>{m.steps.length} steps</span>
              {m.totalTime && <span>{m.totalTime} class</span>}
            </div>
            <div className={s.ministeps}>
              {m.steps.map((x, i) => (
                <span key={x.key} className={i < n ? undefined : s.todo}>
                  {x.name}
                </span>
              ))}
            </div>
            <button type="button" className={s.btn} onClick={onStart}>
              {Icon.play}
              {label}
            </button>
          </section>

          <section className={s.sect} aria-label="Class ELD profile">
            <header className={s.sectHead}>
              <h3>Class ELD profile</h3>
              <span className={cx(s.muted, s.small)}>Set once · filters every step</span>
            </header>
            <div className={s.chips}>
              {BANDS.map((b) => (
                <button
                  key={b}
                  type="button"
                  className={s.chip}
                  aria-pressed={st.bands.includes(b)}
                  onClick={() =>
                    update((p) => ({
                      bands: p.bands.includes(b) ? p.bands.filter((x) => x !== b) : [...p.bands, b],
                    }))
                  }
                >
                  WIDA {bandLabel(b)}
                </button>
              ))}
            </div>
            <p className={cx(s.muted, s.small)}>
              The WIDA levels in this class: Levels 1–2 means the students on your list at WIDA 1 or 2, and so on. Supports for other levels stay in the Library.
              {st.bands.length === 0 && ' None set, so every level shows.'}
            </p>
          </section>

          <section className={s.sect} aria-label="Destination">
            <header className={s.sectHead}>
              <h3>Where the lesson lands</h3>
            </header>
            <div className={cx(s.card, s.stack)}>
              <p>{m.destination}</p>
              {m.crux && (
                <p className={cx(s.muted, s.small)}>
                  <b>Crux</b>, the moment the lesson turns on: {activityName(m.crux)}
                </p>
              )}
            </div>
          </section>

          <div className={s.foot}>
            {u3 ? <Link href="/u3">Back to Unit 3</Link> : <Link href="/lesson">Open the full lesson view</Link>}
            {u3 && <ImCredit />}
            <button
              type="button"
              onClick={() => {
                if (!st.started || window.confirm('Clear your answers and start this prep again?')) reset();
              }}
            >
              Reset prep
            </button>
          </div>
        </main>
        {tabsbar('home')}
      </>
    );
  };

  // ------------------------------------------------------------------ Steps
  const renderStep = () => {
    const i = Math.min(st.step, m.steps.length - 1);
    const step = m.steps[i];
    const ctx: StepCtx = {
      m,
      st,
      update,
      next: () => i < m.steps.length - 1 && go(i + 1),
      openActivity: (id) => setSheet(`act:${id}`),
      openLibrary,
      openInClass,
      copyForCoach,
    };
    const { inner, action } = STEP_VIEWS[i](ctx);
    return (
      <>
        <div className={s.bar}>
          <button type="button" className={s.iconbtn} aria-label="Back" onClick={() => (i === 0 ? home() : go(i - 1))}>
            {Icon.back}
          </button>
          <div className={s.ttl}>
            <b>{m.code} prep</b>
            <span>
              Step {i + 1} of {m.steps.length} · {step.minutes} min
            </span>
          </div>
          {clockEl}
          <button type="button" className={s.iconbtn} aria-label="Open the tool library" onClick={() => openLibrary()}>
            {Icon.book}
          </button>
        </div>
        <div className={s.segs} aria-hidden="true">
          {m.steps.map((x, j) => (
            <i key={x.key} className={cx(j < i || (j === i && stepDone(m, st, j)) ? s.done : j === i && s.on)} />
          ))}
        </div>
        <main className={s.main}>
          <header className={s.stephead}>
            <div className={s.row}>
              <span className={cx(s.pill, s.pillAct)}>You {step.verb.toLowerCase()}</span>
              <span className={s.pill}>{step.tool}</span>
              {step.crux && <span className={cx(s.pill, s.pillCrux)}>Crux</span>}
            </div>
            <h2>{step.name}</h2>
            <p>{step.lede}</p>
          </header>
          {inner}
        </main>
        <div className={s.act}>{action}</div>
      </>
    );
  };

  // ------------------------------------------------------------------ In class
  const renderInClass = () => {
    const crux = m.crux;
    const cuts = m.cuts.filter((x) => st.cuts[x.id]);
    const flagged = m.scenarios.filter((x) => st.flags[x.id]);
    const inFlow = st.ret === 'step';
    return (
      <>
        <div className={cx(s.bar, s.barBack)}>
          <button type="button" className={s.iconbtn} aria-label="Back" onClick={inFlow ? backToStep : home}>
            {Icon.back}
          </button>
          <div className={s.ttl}>
            <b>In class · {m.code}</b>
            <span>Glance card for the crux</span>
          </div>
        </div>
        <main className={cx(s.main, s.incl)}>
          {crux && (m.inClass.launch || m.inClass.ask || m.inClass.setup) && (
            <section className={s.now}>
              <span className={s.eyebrow}>
                {crux.start ? `${crux.start} · ` : ''}
                {activityName(crux)} · Crux
              </span>
              {m.inClass.launch && (
                <>
                  <span style={{ fontSize: 13, opacity: 0.9, fontWeight: 700 }}>SAY TO START</span>
                  <p className={s.nowSay}>{m.inClass.launch}</p>
                </>
              )}
              {m.inClass.ask && (
                <>
                  <span style={{ fontSize: 13, opacity: 0.9, fontWeight: 700 }}>ASK ONCE THEY HAVE AN ANSWER</span>
                  <p className={m.inClass.launch ? undefined : s.nowSay} style={m.inClass.launch ? { fontSize: 16 } : undefined}>
                    {quoted(m.inClass.ask)}
                  </p>
                </>
              )}
              {m.inClass.setup && <span style={{ fontSize: 14, opacity: 0.92 }}>{m.inClass.setup}</span>}
            </section>
          )}
          {m.inClass.sequence && m.inClass.sequence.length > 0 && (
            <div className={s.flat}>
              <span className={s.lab}>Share in this order</span>
              <ol className={s.clean} style={{ listStyle: 'decimal' }}>
                {m.inClass.sequence.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ol>
            </div>
          )}
          {m.inClass.lines.length > 0 && (
            <>
              <span className={s.lab}>If you see · say (as you rehearsed)</span>
              {st.bands.length === 0 && m.inClass.lines.some((x) => x.say.length > 1) && (
                <span className={cx(s.muted, s.small)}>
                  Showing every WIDA level. Set your class’s levels on Tonight to shorten this card.
                </span>
              )}
              {m.inClass.lines.map((x, i) => (
                <div key={i} className={s.mv}>
                  <span className={s.mvIf}>{x.see}</span>
                  {x.say.map((y, j) => (
                    <span key={j} className={s.mvDo}>
                      {y.label && <span className={s.lv}>{y.label} </span>}
                      {y.text}
                    </span>
                  ))}
                  {x.avoid && <span className={cx(s.muted, s.small)}>Not: {x.avoid}</span>}
                </div>
              ))}
            </>
          )}
          {flagged.length > 0 && (
            <div className={s.flat}>
              <span className={s.lab}>You flagged as hard</span>
              <ul className={s.clean}>
                {flagged.map((x) => (
                  <li key={x.id}>{x.notice}</li>
                ))}
              </ul>
            </div>
          )}
          {/* A glance card: the lines to say stay open, the rest folds away. */}
          {m.neverCut.length > 0 && (
            <details className={s.acc}>
              <summary>
                <b>Never cut</b>
                <span className={cx(s.muted, s.small)}>What has to stay if you run short of time</span>
              </summary>
              <div className={s.accIn}>
                <ul className={s.locked}>
                  {m.neverCut.slice(0, 3).map((x, i) => (
                    <li key={i}>
                      {Icon.lock}
                      <span>
                        {x.text} {x.mlr && <MlrPill mlr={x.mlr} />}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          )}
          {cuts.length > 0 && (
            <div className={s.flat}>
              <span className={s.lab}>Your changes</span>
              <ul className={s.clean}>
                {cuts.map((x) => (
                  <li key={x.id}>{x.text}</li>
                ))}
              </ul>
            </div>
          )}
        </main>
        {inFlow ? null : tabsbar('incl')}
      </>
    );
  };

  // ------------------------------------------------------------------ Library
  // The five tools, unchanged, as reference. Quick Read uses its phone layout.
  const renderLibrary = () => {
    const inFlow = st.ret === 'step';
    const t = st.lib;
    return (
      <>
        <div className={cx(s.bar, s.barBack)}>
          <button type="button" className={s.iconbtn} aria-label="Back" onClick={inFlow ? backToStep : home}>
            {Icon.back}
          </button>
          <div className={s.ttl}>
            <b>Library</b>
            <span>
              {inFlow ? `Back to step ${st.step + 1}: ${m.steps[st.step].name}` : u3 ? 'IM’s teacher notes' : 'All five tools, for reference'}
            </span>
          </div>
        </div>
        <main className={s.main}>
          {u3 ? (
            <>
              <U3Library lesson={u3.im} />
              <ImCredit />
            </>
          ) : (
          <>
          <div className={s.ltabs} role="tablist">
            {LIB_TABS.map(([k, l]) => (
              <button
                key={k}
                type="button"
                role="tab"
                className={s.chip}
                aria-pressed={k === t}
                aria-selected={k === t}
                onClick={() => update({ lib: k })}
              >
                {l}
              </button>
            ))}
          </div>
          {/* .tools keeps the prep's own type and reset rules off the five tools. */}
          <div className={s.tools}>
            {/* The tools read the lesson view's WIDA level. Quick Read carries its
                own selector; the others expect one above them. */}
            {t !== 'quickread' && <WidaMobileSelector />}
            {t === 'quickread' && <MobileQuickRead lesson={lesson!} />}
            {t === 'pathway' && <LessonPathway lesson={lesson!} onNavigate={(tool: ToolId) => update({ lib: tool })} />}
            {t === 'thinking' && <AnticipatedThinking lesson={lesson!} />}
            {t === 'moves' && <MoveWalkthrough lesson={lesson!} />}
            {t === 'adapt' && <AdaptationGuardrails lesson={lesson!} />}
          </div>
          </>
          )}
        </main>
        {inFlow ? null : tabsbar('library')}
      </>
    );
  };

  const sheetAct = sheet?.startsWith('act:') ? m.activities.find((a) => a.id === sheet.slice(4)) : undefined;

  return (
    <div className={s.app}>
      {st.view === 'home' && renderHome()}
      {st.view === 'step' && renderStep()}
      {st.view === 'incl' && renderInClass()}
      {st.view === 'library' && renderLibrary()}
      {sheetAct && (
        <Sheet onClose={() => setSheet(null)}>
          <SheetTop
            eyebrow={[sheetAct.start, sheetAct.minutes ? `${sheetAct.minutes} min` : null, sheetAct.role].filter(Boolean).join(' · ')}
            onClose={() => setSheet(null)}
          />
          <ActivityDetail a={sheetAct} />
        </Sheet>
      )}
      {toast && (
        <div className={s.toast} role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
