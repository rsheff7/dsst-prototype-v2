import { LessonData } from './types';

export interface TermAppearance {
  location: string;
  context: string;
}

// Search every string in the lesson for a term. Returns where it appears
// (location label) and a snippet with surrounding context. Skips the
// key_vocabulary block itself — we want to know where the term shows up
// OUTSIDE its own definition.
export function findTermAppearances(term: string, lesson: LessonData): TermAppearance[] {
  const results: TermAppearance[] = [];
  const termLower = term.toLowerCase();

  const search = (text: string | null | undefined, location: string) => {
    if (!text) return;
    const lower = text.toLowerCase();
    const idx = lower.indexOf(termLower);
    if (idx === -1) return;
    const start = Math.max(0, idx - 35);
    const end = Math.min(text.length, idx + termLower.length + 35);
    const context =
      (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
    results.push({ location, context });
  };

  search(lesson.arc_statement, 'Pathway: arc_statement');
  search(lesson.destination, 'Pathway: destination');

  for (const a of lesson.activities) {
    search(a.function_summary, `Activity ${a.id}: function_summary`);
    a.friction_points.forEach((f, i) => search(f.description, `Activity ${a.id}: friction[${i}]`));
    a.success_signals.forEach((s, i) => search(s, `Activity ${a.id}: success_signal[${i}]`));
    a.teacher_moves.forEach((m, i) => search(m.text, `Activity ${a.id}: teacher_move[${i}]`));
    search(a.causal_link, `Activity ${a.id}: causal_link`);
    search(a.extension, `Activity ${a.id}: extension`);
  }

  const g = lesson.adaptation_guardrails;
  search(g.mathematical_purpose, 'Adapt: mathematical_purpose');
  search(g.rigor_check, 'Adapt: rigor_check');
  g.safe_to_change.forEach((s, i) => search(s, `Adapt: safe_to_change[${i}]`));
  g.do_not_remove.forEach((s, i) => search(s.text, `Adapt: do_not_remove[${i}]`));
  search(g.by_proficiency.entering.text, 'Adapt: by_proficiency.entering');
  search(g.by_proficiency.developing.text, 'Adapt: by_proficiency.developing');
  search(g.by_proficiency.bridging.text, 'Adapt: by_proficiency.bridging');

  for (const a of lesson.anticipated_thinking.activities) {
    a.patterns.forEach((p, i) => {
      search(p.label, `Thinking ${a.activity_id}: pattern[${i}].label`);
      search(p.description, `Thinking ${a.activity_id}: pattern[${i}].description`);
      search(p.move, `Thinking ${a.activity_id}: pattern[${i}].move`);
    });
    a.sentence_frames.forEach((s, i) => search(s.frame, `Thinking ${a.activity_id}: sentence_frame[${i}]`));
    a.questions_to_listen_for.forEach((q, i) =>
      search(q, `Thinking ${a.activity_id}: question[${i}]`)
    );
  }

  for (const a of lesson.decision_guide.activities) {
    a.scenarios.forEach((s, i) => {
      search(s.label, `Moves ${a.activity_id}: scenario[${i}].label`);
      search(s.interpretation, `Moves ${a.activity_id}: scenario[${i}].interpretation`);
      if (s.flat_move) {
        search(s.flat_move.move, `Moves ${a.activity_id}: flat_move.move`);
        search(s.flat_move.say, `Moves ${a.activity_id}: flat_move.say`);
        search(s.flat_move.nonverbal, `Moves ${a.activity_id}: flat_move.nonverbal`);
        search(s.flat_move.avoid, `Moves ${a.activity_id}: flat_move.avoid`);
      }
      if (s.proficiency_moves) {
        (['entering', 'developing', 'bridging'] as const).forEach((level) => {
          const move = s.proficiency_moves![level];
          search(move.move, `Moves ${a.activity_id}: ${level}.move`);
          search(move.say, `Moves ${a.activity_id}: ${level}.say`);
          search(move.nonverbal, `Moves ${a.activity_id}: ${level}.nonverbal`);
          search(move.avoid, `Moves ${a.activity_id}: ${level}.avoid`);
        });
      }
      search(s.mll_framework_note, `Moves ${a.activity_id}: scenario[${i}].mll_framework_note`);
    });
  }

  return results;
}

export interface ActivityDensity {
  id: string;
  is_crux: boolean;
  thinking_patterns: number;
  moves_scenarios: number;
  moves_mll: number;
}

export function activityDensity(lesson: LessonData): ActivityDensity[] {
  return lesson.activities.map((a) => {
    const t = lesson.anticipated_thinking.activities.find((x) => x.activity_id === a.id);
    const d = lesson.decision_guide.activities.find((x) => x.activity_id === a.id);
    return {
      id: a.id,
      is_crux: a.is_crux,
      thinking_patterns: t?.patterns.length ?? 0,
      moves_scenarios: d?.scenarios.length ?? 0,
      moves_mll: d?.scenarios.filter((s) => s.is_mll).length ?? 0,
    };
  });
}

// MLR coherence: per activity, what MLRs were inferred, and where each
// MLR actually surfaces across the four tools. Used by the /audit page
// to inspect whether the inference matches what teachers will see.
export interface MlrCoherenceEntry {
  activity_id: string;
  language_work: string;
  inferred: { number: number; name: string; why_here: string }[];
  appearances: { number: number; name: string; locations: string[] }[];
}

export function mlrCoherenceMap(lesson: LessonData): MlrCoherenceEntry[] {
  return lesson.activities.map((a) => {
    const inf = lesson.mlr_inference.activities.find((x) => x.activity_id === a.id);
    const appearancesByMlr = new Map<number, { name: string; locations: string[] }>();

    const note = (n: number, name: string, location: string) => {
      const existing = appearancesByMlr.get(n);
      if (existing) existing.locations.push(location);
      else appearancesByMlr.set(n, { name, locations: [location] });
    };

    a.friction_points.forEach((fp, i) => {
      if (fp.mlr) note(fp.mlr.number, fp.mlr.name, `Pathway friction[${i}]`);
    });
    a.teacher_moves.forEach((m, i) => {
      if (m.mlr) note(m.mlr.number, m.mlr.name, `Pathway teacher_move[${i}]`);
    });

    const thinking = lesson.anticipated_thinking.activities.find((x) => x.activity_id === a.id);
    thinking?.patterns.forEach((p, i) => {
      if (p.mlr) note(p.mlr.number, p.mlr.name, `Thinking pattern[${i}]`);
    });
    thinking?.sentence_frames.forEach((f, i) => {
      if (f.mlr) note(f.mlr.number, f.mlr.name, `Thinking frame[${i}]`);
    });

    const dg = lesson.decision_guide.activities.find((x) => x.activity_id === a.id);
    dg?.scenarios.forEach((s, i) => {
      if (s.mlr) note(s.mlr.number, s.mlr.name, `Moves scenario[${i}]`);
    });

    lesson.wristband.activities
      .find((x) => x.activity_id === a.id)
      ?.tiles.forEach((t, i) => {
        if (t.mlr) note(t.mlr.number, t.mlr.name, `Quick Read tile[${i}]`);
      });

    return {
      activity_id: a.id,
      language_work: inf?.language_work ?? '',
      inferred: inf?.mlrs ?? [],
      appearances: Array.from(appearancesByMlr.entries())
        .map(([number, v]) => ({ number, ...v }))
        .sort((x, y) => x.number - y.number),
    };
  });
}

// Sample text from each tool's "hot spot" — the line a reviewer would
// look at first when checking tone. Returns up to one snippet per tool.
export function toneSamples(lesson: LessonData): { location: string; text: string }[] {
  const samples: { location: string; text: string }[] = [];
  if (lesson.arc_statement) samples.push({ location: 'Pathway: arc_statement', text: lesson.arc_statement });
  const crux = lesson.activities.find((a) => a.is_crux);
  if (crux) samples.push({ location: `Pathway: Activity ${crux.id} function_summary`, text: crux.function_summary });
  if (lesson.adaptation_guardrails.rigor_check)
    samples.push({ location: 'Adapt: rigor_check', text: lesson.adaptation_guardrails.rigor_check });

  // Pick a misconception pattern interpretation if we can find one
  for (const a of lesson.anticipated_thinking.activities) {
    const misc = a.patterns.find((p) => p.type === 'misconception');
    if (misc) {
      samples.push({ location: `Thinking ${a.activity_id}: ${misc.label}`, text: misc.description });
      break;
    }
  }

  // Pick the first interpretation from the crux activity in Moves
  if (crux) {
    const movesActivity = lesson.decision_guide.activities.find((x) => x.activity_id === crux.id);
    if (movesActivity && movesActivity.scenarios.length > 0) {
      const first = movesActivity.scenarios[0];
      samples.push({
        location: `Moves ${crux.id}: ${first.label.slice(0, 60)}…`,
        text: first.interpretation,
      });
    }
  }

  return samples;
}
