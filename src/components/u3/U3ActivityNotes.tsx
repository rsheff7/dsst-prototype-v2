'use client';

import type { ImActivity, ImLesson, Routine } from '@/lib/u3/types';
import { routineTitle } from '@/lib/u3/routines';
import { IMLines, MathText, noteFor, sentences } from './MathText';
import s from './u3.module.css';

const SLOT: Record<ImActivity['slot'], string> = { 'warm-up': 'Warm-up', activity: 'Activity', optional: 'Optional', 'cool-down': 'Cool-down' };
const PHASE = { launch: 'at the launch', work: 'while students work', synthesis: 'in the closing discussion' } as const;

/** IM's support text, minus its "Domains: MLRn Name." opening, one sentence per line. */
const supportSentences = (text: string) =>
  text
    .replace(/^[A-Z][A-Za-z, ]*?: (?:This activity uses )?MLR ?\d\s*:?\s*[A-Z][^.]*?\.\s*/, '')
    .split(/(?<=[.!?][”’"]?)\s+(?=[A-Z“(])/)
    .map((x) => x.trim())
    .filter(Boolean);

/** One activity, in IM's own words and in IM's order. */
export default function U3ActivityNotes({ a, heading }: { a: ImActivity; heading?: string }) {
  return (
    <div className={s.notes} style={{ fontSize: 15 }}>
      {heading && <h2>{heading}</h2>}
      <span className={s.muted}>
        {SLOT[a.slot]} · {a.minutes} min{a.routines.length ? ` · ${a.routines.map(routineTitle).join(' · ')}` : ''}
      </span>
      <div>
        <span className={s.lab}>What it is for</span>
        <IMLines lines={a.narrative} />
      </div>
      {a.launch.length > 0 && (
        <div>
          <span className={s.lab}>Launch</span>
          <IMLines lines={a.launch} />
        </div>
      )}
      {a.task.length > 0 && (
        <div>
          <span className={s.lab}>Student task</span>
          <IMLines lines={a.task} />
        </div>
      )}
      {a.response && (
        <details>
          <summary className={s.lab} style={{ cursor: 'pointer' }}>
            Student response
          </summary>
          <IMLines lines={a.response} />
        </details>
      )}
      {a.misconceptions.length > 0 && (
        <div>
          <span className={s.lab}>Anticipated misconceptions</span>
          <IMLines lines={a.misconceptions} />
        </div>
      )}
      {a.synthesis.length > 0 && (
        <div>
          <span className={s.lab}>Activity synthesis</span>
          <IMLines lines={a.synthesis} />
        </div>
      )}
      {a.ell.map((e, i) => (
        <div key={`e${i}`} className={s.support}>
          <span className={s.lab}>Multilingual learners · {e.domains.join(', ')}</span>
          <p>
            <b>
              {routineTitle(e.routine)}, {PHASE[e.phase]}.
            </b>{' '}
            <MathText>{supportSentences(e.text)[0]}</MathText>
          </p>
          {supportSentences(e.text).length > 1 && (
            <details>
              <summary className={s.muted} style={{ cursor: 'pointer' }}>
                The rest of IM’s support
              </summary>
              {supportSentences(e.text)
                .slice(1)
                .map((x, j) => (
                  <p key={j}>
                    <MathText>{x}</MathText>
                  </p>
                ))}
              {noteFor(e.text) && <p className={s.correction}>Note: {noteFor(e.text)}</p>}
              {(e as { principleLine?: string }).principleLine && (
                <p className={s.muted}>{(e as { principleLine?: string }).principleLine}</p>
              )}
            </details>
          )}
        </div>
      ))}
      {a.access.map((x, i) => (
        <div key={`a${i}`} className={s.support}>
          <span className={s.lab}>Students with disabilities · {x.supports.join(', ')}</span>
          <p>
            <MathText>{x.text}</MathText>
          </p>
        </div>
      ))}
      {a.extension && (
        <details>
          <summary className={s.lab} style={{ cursor: 'pointer' }}>
            Are you ready for more?
          </summary>
          <IMLines lines={a.extension.task} />
          {a.extension.response && <IMLines lines={a.extension.response} />}
        </details>
      )}
    </div>
  );
}

/** The Library for a Unit 3 lesson: IM's teacher notes, activity by activity. */
export function U3Library({ lesson }: { lesson: ImLesson }) {
  return (
    <div className={s.notes}>
      <p className={s.muted}>IM’s teacher notes for this lesson, in IM’s words.</p>
      {lesson.activities.map((a) => (
        <details key={a.id} className={s.noteAct}>
          <summary>
            {a.id} {a.title}
          </summary>
          <U3ActivityNotes a={a} />
        </details>
      ))}
      <details className={s.noteAct}>
        <summary>Lesson synthesis</summary>
        <IMLines lines={lesson.lessonSynthesis} />
      </details>
      {lesson.coolDown.task && (
        <details className={s.noteAct}>
          <summary>
            {lesson.coolDown.id} Cool-down: {lesson.coolDown.title}
          </summary>
          <IMLines lines={lesson.coolDown.task} />
          <span className={s.lab}>Student response</span>
          <IMLines lines={lesson.coolDown.response} />
        </details>
      )}
      <details className={s.noteAct}>
        <summary>Student lesson summary</summary>
        <IMLines lines={lesson.summary} />
      </details>
    </div>
  );
}

/** One routine, as IM's course guide defines it. */
export function U3RoutineNotes({ r }: { r: Routine }) {
  return (
    <div className={s.notes} style={{ fontSize: 15 }}>
      <h2>{routineTitle(r.name)}</h2>
      <div>
        <span className={s.lab}>What it is</span>
        <IMLines lines={supportSentences(r.what)} />
      </div>
      {r.where && (
        <div>
          <span className={s.lab}>Where it shows up</span>
          <p>
            <MathText>{r.where}</MathText>
          </p>
        </div>
      )}
      {r.why && (
        <div>
          <span className={s.lab}>Why</span>
          <p>
            <MathText>{r.why}</MathText>
          </p>
        </div>
      )}
      {r.lines.length > 0 && (
        <div>
          <span className={s.lab}>What IM has you say</span>
          <ul>
            {r.lines.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </div>
      )}
      {r.demoFirstTimes && <p className={s.muted}>IM suggests demonstrating it with a partner the first few times.</p>}
      <p className={s.muted}>From IM’s course guide, Instructional Routines.</p>
    </div>
  );
}
