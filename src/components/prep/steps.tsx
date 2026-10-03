'use client';

import type { ReactNode } from 'react';
import { BANDS, activityName, bandLabel, quoted, type PrepModel } from '@/lib/prep/prepModel';
import type { PrepState } from './usePrepState';
import { elapsedSeconds, mmss } from './usePrepState';
import { PREP_BUDGET_MINUTES } from '@/lib/prep/prepModel';
import { Check, Icon, MlrPill, cx } from './parts';
import s from './prep.module.css';

export interface StepCtx {
  m: PrepModel;
  st: PrepState;
  update: (p: Partial<PrepState> | ((s: PrepState) => Partial<PrepState>)) => void;
  next: () => void;
  openActivity: (id: string) => void;
  openLibrary: (tab: PrepState['lib']) => void;
  openInClass: () => void;
  copyForCoach: () => void;
  now: number;
}

export type StepOut = { inner: ReactNode; action: ReactNode };

const MIN_ANSWER = 20;
const MIN_PREDICTION = 12;

function NextBtn({ c, label }: { c: StepCtx; label?: string }) {
  const nxt = c.m.steps[c.st.step + 1];
  return (
    <button type="button" className={cx(s.btn, s.pri)} onClick={c.next}>
      {label ?? `Next: ${nxt?.name}`} →
    </button>
  );
}

/** The bands to show: the class profile, or every band when none is set. */
function bandsFor(st: PrepState) {
  return st.bands.length ? BANDS.filter((b) => st.bands.includes(b)) : BANDS;
}

// ---------------------------------------------------------------------------
// 1 Orient
// ---------------------------------------------------------------------------

export function orient(c: StepCtx): StepOut {
  const { m } = c;
  const inner = (
    <div className={s.stackLg}>
      <section className={cx(s.card, s.stack)}>
        <span className={s.eyebrow}>Destination</span>
        <p className={s.goal}>{m.destination}</p>
        <dl className={s.kv}>
          <dt>Arc</dt>
          <dd>{m.arc}</dd>
          <dt>Idea</dt>
          <dd>{m.idea}</dd>
        </dl>
      </section>
      <section className={s.stack}>
        <div className={cx(s.row, s.between)}>
          <h3>The arc{m.totalTime ? ` · ${m.totalTime}` : ''}</h3>
          <span className={cx(s.muted, s.small)}>Tap for detail</span>
        </div>
        <ol className={s.tl}>
          {m.activities.map((a) => (
            <li key={a.id} className={cx(a.isCrux && s.tlCrux, a.focus === 'feeder' && s.tlFeeder)}>
              <span className={s.tlTime}>{a.start ?? a.id}</span>
              <button type="button" className={s.tlBtn} onClick={() => c.openActivity(a.id)}>
                <span className={s.tlName}>
                  {a.label !== a.id ? `${a.label} · ` : `${a.id} · `}
                  {a.label !== a.id ? a.id : a.title}
                  {a.isCrux && <span className={cx(s.pill, s.pillCrux)}>Crux</span>}
                  {a.focus === 'feeder' && <span className={cx(s.pill, s.pillCrux)}>Sets up the crux</span>}
                  {!a.isCrux && <span className={s.pill}>{a.role}</span>}
                </span>
                {a.watchFor && (
                  <span className={s.tlWatch}>
                    <b>Watch for:</b> {a.watchFor}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
  return { inner, action: <NextBtn c={c} /> };
}

// ---------------------------------------------------------------------------
// 2 Do it as a student — the question the lesson closes on
// ---------------------------------------------------------------------------

export function student(c: StepCtx): StepOut {
  const { m, st, update } = c;
  const n = st.answer.trim().length;
  const ready = n >= MIN_ANSWER;
  const inner = (
    <div className={s.stackLg}>
      <section className={cx(s.card, s.stack)}>
        <span className={s.eyebrow}>How the lesson closes</span>
        {m.proof.closing ? (
          <p className={s.prompt} style={{ fontSize: 19 }}>
            {m.proof.closing}
          </p>
        ) : (
          <p className={s.prompt}>{m.destination}</p>
        )}
        <p className={cx(s.muted, s.small)}>
          Answer the question it puts to students, in writing, the way a strong student would. Then say it out loud.
        </p>
        <div className={s.row}>
          <span className={cx(s.muted, s.small)}>Open an activity:</span>
          {m.activities.map((a) => (
            <button key={a.id} type="button" className={s.chip} onClick={() => c.openActivity(a.id)}>
              {a.id}
            </button>
          ))}
        </div>
      </section>
      <div className={s.stack}>
        <label htmlFor="prep-answer" className={s.lab}>
          Your answer, as a student
        </label>
        <textarea
          id="prep-answer"
          value={st.answer}
          readOnly={st.answerChecked}
          placeholder="Both are correct because…"
          onChange={(e) => update({ answer: e.target.value })}
        />
        {!st.answerChecked && (
          <span className={s.count}>{ready ? 'Ready to check' : `${MIN_ANSWER - n} more characters to check`}</span>
        )}
      </div>
      {st.answerChecked && (
        <section className={cx(s.stack, s.reveal)}>
          <h3>Check yours against the look-fors</h3>
          <div className={s.checks}>
            {m.proof.lookFors.map((t, i) => (
              <Check
                key={i}
                on={!!st.lookFors[i]}
                onClick={() => update((p) => ({ lookFors: { ...p.lookFors, [i]: !p.lookFors[i] } }))}
              >
                {t}
              </Check>
            ))}
            <Check on={st.saidAloud} onClick={() => update((p) => ({ saidAloud: !p.saidAloud }))}>
              I said it out loud, the way a student would at the close
            </Check>
          </div>
          <p className={cx(s.muted, s.small)}>
            From the lesson’s top signals and the crux. Where your answer got hard is where theirs will.
          </p>
        </section>
      )}
    </div>
  );
  const action = st.answerChecked ? (
    <NextBtn c={c} />
  ) : (
    <button
      type="button"
      className={cx(s.btn, s.pri)}
      disabled={!ready}
      onClick={() => ready && update({ answerChecked: true })}
    >
      Check my answer
    </button>
  );
  return { inner, action };
}

// ---------------------------------------------------------------------------
// 3 Predict the crux — and the activity that feeds it
// ---------------------------------------------------------------------------

export function predict(c: StepCtx): StepOut {
  const { m, st, update } = c;
  const feeder = m.activities.find((a) => a.focus === 'feeder');
  const ready = st.prediction.trim().length >= MIN_PREDICTION && !!st.predictionHowMany;
  const nameOf = (id: string) => m.activities.find((a) => a.id === id);
  // Context names the task, not the trouble: the function summary states the
  // misconception, which would give the prediction away.
  const inner = (
    <div className={s.stackLg}>
      {m.crux ? (
        <section className={cx(s.card, s.stack)}>
          <span className={s.eyebrow}>
            {feeder ? `${feeder.start ?? ''} ${feeder.id}, then ` : ''}
            {m.crux.start ?? ''} {m.crux.id} · Crux
          </span>
          <p>
            <b>What students do:</b> {m.crux.source.learning_target}
          </p>
          {m.setup.crux && <p className={cx(s.muted, s.small)}>{m.setup.crux}</p>}
        </section>
      ) : (
        <section className={s.flat}>This lesson has no activity marked as the crux.</section>
      )}
      <div className={s.stack}>
        <label htmlFor="prep-pred" className={s.prompt} style={{ fontSize: 20 }}>
          What will most students write at the crux?
        </label>
        <textarea
          id="prep-pred"
          value={st.prediction}
          readOnly={st.predictionRevealed}
          style={{ minHeight: 100 }}
          placeholder="Most students will write…"
          onChange={(e) => update({ prediction: e.target.value })}
        />
        <span className={s.lab} style={{ marginTop: 4 }}>
          How many will make the main error?
        </span>
        <div className={s.chips} role="group" aria-label="How many will make the main error">
          {(['Most', 'Some', 'Few'] as const).map((x) => (
            <button
              key={x}
              type="button"
              className={s.chip}
              aria-pressed={st.predictionHowMany === x}
              disabled={st.predictionRevealed}
              onClick={() => update({ predictionHowMany: x })}
            >
              {x}
            </button>
          ))}
        </div>
      </div>
      {st.predictionRevealed && (
        <section className={cx(s.stack, s.reveal)}>
          <div className={s.bubbleMe}>
            <span className={s.lab}>You predicted</span>
            {st.prediction}
            <br />
            <span className={cx(s.muted, s.small)}>{st.predictionHowMany} will make the main error.</span>
          </div>
          <h3>What Premo expects</h3>
          {m.patterns.map((p, i) => {
            const a = nameOf(p.activityId);
            return (
              <div key={i} className={s.pat}>
                <span className={cx(s.eyebrow, s[`k-${p.kind}`])}>
                  {p.kindLabel} · {p.frequencyLabel} · {a?.isCrux ? 'Crux' : 'Sets it up'} ({p.activityId})
                </span>
                <span className={s.patSays}>{p.label}</span>
                <span className={s.patWhy}>{p.description}</span>
                {p.mll && p.kind !== 'lang' && (
                  <span className={s.row}>
                    <span className={cx(s.pill, s.pillMll)}>Language is part of it</span>
                  </span>
                )}
              </div>
            );
          })}
          {m.patterns.length === 0 && <p className={s.muted}>The lesson has no anticipated thinking for the crux.</p>}
          {m.listenFor.length > 0 && (
            <div className={s.flat}>
              <span className={s.lab}>Listen for at the crux</span>
              <ul className={s.clean}>
                {m.listenFor.map((q, i) => (
                  <li key={i}>{quoted(q)}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
  const action = st.predictionRevealed ? (
    <NextBtn c={c} />
  ) : (
    <button
      type="button"
      className={cx(s.btn, s.pri)}
      disabled={!ready}
      onClick={() => ready && update({ predictionRevealed: true })}
    >
      Show what Premo expects
    </button>
  );
  return { inner, action };
}

// ---------------------------------------------------------------------------
// 4 Rehearse
// ---------------------------------------------------------------------------

export function rehearse(c: StepCtx): StepOut {
  const { m, st, update } = c;
  const list = m.scenarios;
  if (list.length === 0) {
    return {
      inner: <p className={s.flat}>The lesson has no decision scenarios around the crux to rehearse.</p>,
      action: <NextBtn c={c} />,
    };
  }
  const i = Math.min(st.ri, list.length - 1);
  const sc = list[i];
  const said = !!st.said[sc.id];
  const last = i === list.length - 1;
  const allSaid = list.every((x) => st.said[x.id]);
  const saidCount = list.filter((x) => st.said[x.id]).length;
  const act = m.activities.find((a) => a.id === sc.activityId);
  const bands = bandsFor(st);
  const shownBands = (sc.byBand ?? []).filter((b) => bands.includes(b.band));

  const inner = (
    <div className={s.stack}>
      <div className={s.dotsnav} role="group" aria-label="Scenarios">
        {list.map((x, j) => (
          <button
            key={x.id}
            type="button"
            className={cx(st.said[x.id] && s.said, st.flags[x.id] && s.flagged)}
            aria-current={j === i}
            aria-label={`Scenario ${j + 1}`}
            onClick={() => update({ ri: j })}
          >
            {j + 1}
          </button>
        ))}
      </div>
      <article className={cx(s.scard, sc.focus === 'crux' && s.scardCrux)} aria-live="polite">
        <div className={s.row}>
          <span className={s.pill}>{act ? activityName(act) : sc.activityId}</span>
          <span className={s.pill}>{sc.typeLabel}</span>
          {sc.focus === 'crux' && <span className={cx(s.pill, s.pillCrux)}>Crux</span>}
          {sc.focus === 'feeder' && <span className={cx(s.pill, s.pillCrux)}>Sets up the crux</span>}
          {sc.mll && <span className={cx(s.pill, s.pillMll)}>MLL</span>}
        </div>
        <div className={s.stack} style={{ gap: 8 }}>
          <span className={s.lab}>Notice · {sc.notice}</span>
          <p className={s.notice} style={{ fontSize: 19 }}>
            {sc.scene}
          </p>
        </div>
        {!said ? (
          <div className={s.sayit}>
            {Icon.mic}
            <b>Say your move out loud.</b>What do you do or say next?
          </div>
        ) : (
          <div className={cx(s.stack, s.reveal)}>
            <div>
              <span className={s.lab}>Check what you said</span>
              <div className={s.checks}>
                {sc.criteria.map((t, j) => {
                  const k = `${sc.id}#${j}`;
                  return (
                    <Check key={k} on={!!st.crit[k]} onClick={() => update((p) => ({ crit: { ...p.crit, [k]: !p.crit[k] } }))}>
                      {t}
                    </Check>
                  );
                })}
              </div>
            </div>
            {st.model[sc.id] ? (
              <div className={cx(s.stack, s.reveal)}>
                {sc.byBand ? (
                  <>
                    <span className={s.lab}>Respond · by WIDA level</span>
                    <div className={s.prof}>
                      {shownBands.map((mv) => (
                        <div key={mv.band} className={s.pc}>
                          <span className={s.lv}>{bandLabel(mv.band)}</span>
                          {mv.say && <b>{mv.say}</b>}
                          {mv.nonverbal && <span className={cx(s.muted, s.small)}>Without words: {mv.nonverbal}</span>}
                          <details className={s.more}>
                            <summary>The full move</summary>
                            <span className={s.small}>{mv.move}</span>
                          </details>
                          {mv.avoid && (
                            <span className={cx(s.avoid, s.small)}>
                              <b>Avoid:</b> {mv.avoid}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  sc.flat && (
                    <>
                      <div className={s.respond}>
                        <span className={s.lab}>Respond</span>
                        {sc.flat.say && <p style={{ fontWeight: 600 }}>{sc.flat.say}</p>}
                        <details className={s.more}>
                          <summary>The full move</summary>
                          <span className={s.small}>{sc.flat.move}</span>
                        </details>
                      </div>
                      {sc.flat.avoid && (
                        <div className={s.avoid}>
                          <span className={s.lab}>Avoid</span>
                          <p>{sc.flat.avoid}</p>
                        </div>
                      )}
                    </>
                  )
                )}
                {sc.mlr && (
                  <span className={s.row}>
                    <MlrPill mlr={sc.mlr} />
                  </span>
                )}
              </div>
            ) : (
              <button
                type="button"
                className={cx(s.btn, s.sm)}
                style={{ justifySelf: 'start' }}
                onClick={() => update((p) => ({ model: { ...p.model, [sc.id]: true } }))}
              >
                Show model wording
              </button>
            )}
            <button
              type="button"
              className={s.flagbtn}
              aria-pressed={!!st.flags[sc.id]}
              onClick={() => update((p) => ({ flags: { ...p.flags, [sc.id]: !p.flags[sc.id] } }))}
            >
              {Icon.flag}
              {st.flags[sc.id] ? 'Flagged for coach' : 'Flag as hard'}
            </button>
          </div>
        )}
      </article>
      <p className={cx(s.muted, s.small)} style={{ textAlign: 'center' }}>
        {i + 1} of {list.length} · {saidCount} said ·{' '}
        <button
          type="button"
          className={cx(s.btn, s.ghost, s.sm)}
          style={{ display: 'inline', padding: 0, minHeight: 0 }}
          onClick={() => c.openLibrary('moves')}
        >
          All moves in the Library
        </button>
      </p>
    </div>
  );

  let action: ReactNode;
  if (!said)
    action = (
      <button type="button" className={cx(s.btn, s.pri)} onClick={() => update((p) => ({ said: { ...p.said, [sc.id]: true } }))}>
        I said it
      </button>
    );
  else if (!last)
    action = (
      <button type="button" className={cx(s.btn, s.pri)} onClick={() => { update({ ri: i + 1 }); window.scrollTo(0, 0); }}>
        Next scenario →
      </button>
    );
  else
    action = allSaid ? (
      <NextBtn c={c} />
    ) : (
      <button
        type="button"
        className={cx(s.btn, s.pri)}
        onClick={() => update({ ri: list.findIndex((x) => !st.said[x.id]) })}
      >
        Back to the ones you skipped
      </button>
    );
  return { inner, action };
}

// ---------------------------------------------------------------------------
// 5 Adjust
// ---------------------------------------------------------------------------

export function adjust(c: StepCtx): StepOut {
  const { m, st, update } = c;
  const bands = bandsFor(st);
  const inner = (
    <div className={s.stackLg}>
      <section className={cx(s.rigor, s.stack)}>
        <span className={s.eyebrow}>The idea · pinned</span>
        <p style={{ fontWeight: 600, fontSize: 17 }}>{m.idea || m.destination}</p>
        {m.rigorCheck && (
          <p className={s.small}>
            <b>Rigor check from the lesson:</b> {m.rigorCheck}
          </p>
        )}
      </section>
      {m.cuts.length > 0 && (
        <section className={s.stack}>
          <h3>Safe to change</h3>
          <p className={cx(s.muted, s.small)}>Materials and formats you can swap without touching the idea.</p>
          {m.cuts.map((x) => (
            <button
              key={x.id}
              type="button"
              className={s.toggle}
              aria-pressed={!!st.cuts[x.id]}
              onClick={() => update((p) => ({ cuts: { ...p.cuts, [x.id]: !p.cuts[x.id] } }))}
            >
              <span>{x.text}</span>
              <span className={s.sw} aria-hidden="true" />
            </button>
          ))}
        </section>
      )}
      <section className={cx(s.card, s.stack)}>
        <h3>Never cut</h3>
        <ul className={s.locked}>
          {m.neverCut.map((x, i) => (
            <li key={i}>
              {Icon.lock}
              <span>
                {x.text} {x.mlr && <MlrPill mlr={x.mlr} />}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section className={s.stack}>
        <div className={cx(s.row, s.between)}>
          <h3>MLL supports at the crux</h3>
          <span className={cx(s.muted, s.small)}>{st.bands.length ? bands.map(bandLabel).join(' · ') : 'All levels'}</span>
        </div>
        <p className={cx(s.muted, s.small)}>Same mathematical demand, different language support. Filtered to your class.</p>
        {m.language.frames.length > 0 && (
          <div className={cx(s.card, s.stack)} style={{ gap: 8 }}>
            <span className={s.lab}>Frames to post at the crux</span>
            {m.language.frames.map((f, i) => (
              <span key={i} className={s.frame}>
                {f.frame}
              </span>
            ))}
          </div>
        )}
        <div className={s.prof}>
          {bands.map((b) => {
            const pr = m.language.profile[b];
            return (
              <div key={b} className={s.pc}>
                <span className={s.lv}>{bandLabel(b)}</span>
                {pr && (
                  <span className={s.small}>
                    <b>Already does:</b> {pr.does}
                    <br />
                    <b>Reaching for:</b> {pr.reaching}
                  </span>
                )}
                <p>{m.supports[b].text}</p>
                {m.supports[b].mlr && (
                  <span className={s.row}>
                    <MlrPill mlr={m.supports[b].mlr} />
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {m.language.vocabulary.length > 0 && (
          <div className={s.flat}>
            <span className={s.lab}>Key words</span>
            <ul className={s.clean}>
              {m.language.vocabulary.map((v) => (
                <li key={v.term}>
                  <b>{v.term}</b>: {v.definition}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
  return { inner, action: <NextBtn c={c} /> };
}
// ---------------------------------------------------------------------------
// 6 Carry it
// ---------------------------------------------------------------------------

export function coachText(m: PrepModel, st: PrepState, now: number): string {
  const flagged = m.scenarios.filter((x) => st.flags[x.id]).map((x) => `- ${x.notice}`).join('\n') || '- None flagged';
  const cuts = m.cuts.filter((x) => st.cuts[x.id]).map((x) => `- ${x.text}`).join('\n') || '- None. Teaching as written.';
  const lf = m.proof.lookFors.filter((_, i) => st.lookFors[i]).length;
  const said = m.scenarios.filter((x) => st.said[x.id]).length;
  return `DSST prep · Lesson ${m.code} ${m.heading} · ${new Date(now).toLocaleDateString()}
Prep time: ${mmss(elapsedSeconds(st, now))}

The lesson's proof, done as a student (${lf}/${m.proof.lookFors.length} look-fors):
${st.answer || '(not answered)'}

My crux prediction:
${st.prediction || '(not answered)'}
Students I expect to make the main error: ${st.predictionHowMany ?? '-'}

Rehearsal: ${said}/${m.scenarios.length}
Flagged as hard:
${flagged}

Swaps I'm planning:
${cuts}

Where I'd like help: start with the flagged scenarios.`;
}

export function carry(c: StepCtx): StepOut {
  const { m, st } = c;
  const secs = elapsedSeconds(st, c.now);
  const within = secs <= PREP_BUDGET_MINUTES * 60;
  const flagged = m.scenarios.filter((x) => st.flags[x.id]);
  const lf = m.proof.lookFors.filter((_, i) => st.lookFors[i]).length;
  const cuts = m.cuts.filter((x) => st.cuts[x.id]);
  const said = m.scenarios.filter((x) => st.said[x.id]).length;
  const inner = (
    <div className={s.stackLg}>
      <section className={cx(s.card, s.row, s.between)} style={{ alignItems: 'end' }}>
        <div>
          <span className={s.eyebrow}>Prep time</span>
          <div className={s.big}>{mmss(secs)}</div>
        </div>
        <span className={cx(s.pill, within ? s.pillOk : s.pillFlag)}>
          {within ? `Within ${PREP_BUDGET_MINUTES} min` : `Over ${PREP_BUDGET_MINUTES} min`}
        </span>
      </section>
      <section className={s.sum} aria-label="Readiness summary">
        <div>
          <span className={s.lab}>
            The lesson’s proof · {lf}/{m.proof.lookFors.length} look-fors
          </span>
          <p>{st.answer || <span className={s.muted}>Not answered</span>}</p>
        </div>
        <div>
          <span className={s.lab}>Your crux prediction</span>
          <p>{st.prediction || <span className={s.muted}>Not answered</span>}</p>
          {st.predictionHowMany && (
            <span className={cx(s.muted, s.small)}>{st.predictionHowMany} will make the main error.</span>
          )}
        </div>
        <div>
          <span className={s.lab}>
            Rehearsed {said} of {m.scenarios.length} · {flagged.length} flagged
          </span>
          {flagged.length ? (
            <ul className={s.clean}>
              {flagged.map((x) => (
                <li key={x.id}>{x.notice}</li>
              ))}
            </ul>
          ) : (
            <span className={s.muted}>None flagged</span>
          )}
        </div>
        <div>
          <span className={s.lab}>Swaps</span>
          {cuts.length ? (
            <ul className={s.clean}>
              {cuts.map((x) => (
                <li key={x.id}>{x.text}</li>
              ))}
            </ul>
          ) : (
            <span className={s.muted}>None. Teaching as written.</span>
          )}
        </div>
      </section>
      {(m.setup.crux || m.setup.checklist.length > 0) && (
        <section className={cx(s.card, s.stack)}>
          <h3>Before class tomorrow</h3>
          {m.setup.crux && (
            <p>
              <b>At the crux:</b> {m.setup.crux}
            </p>
          )}
          {m.setup.checklist.length > 0 && (
            <div className={s.checks}>
              {m.setup.checklist.map((t, i) => (
                <Check
                  key={i}
                  on={!!st.setupDone[i]}
                  onClick={() => c.update((p) => ({ setupDone: { ...p.setupDone, [i]: !p.setupDone[i] } }))}
                >
                  {t}
                </Check>
              ))}
            </div>
          )}
        </section>
      )}
      <details className={s.acc} id="prep-coachbox">
        <summary>
          <b>Coach summary</b>
          <span className={cx(s.muted, s.small)}>Plain text your coach can read in a minute</span>
        </summary>
        <div className={s.accIn}>
          <textarea id="prep-coachtxt" className={s.copybox} readOnly value={coachText(m, st, c.now)} />
        </div>
      </details>
    </div>
  );
  const action = (
    <div className={s.duo}>
      <button type="button" className={s.btn} onClick={c.copyForCoach}>
        Copy for coach
      </button>
      <button type="button" className={cx(s.btn, s.pri)} onClick={c.openInClass}>
        In-class card
      </button>
    </div>
  );
  return { inner, action };
}

export const STEP_VIEWS = [orient, student, predict, rehearse, adjust, carry];

/** Whether a step counts as done, for the progress segments. */
export function stepDone(m: PrepModel, st: PrepState, i: number): boolean {
  const k = m.steps[i]?.key;
  if (k === 'student') return st.answerChecked;
  if (k === 'predict') return st.predictionRevealed;
  if (k === 'rehearse') return m.scenarios.length > 0 && m.scenarios.every((x) => st.said[x.id]);
  return i < st.maxStep;
}
