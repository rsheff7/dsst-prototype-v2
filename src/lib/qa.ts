import { LessonData } from './types';
import { isValidMlrNumber } from './mlrs';

export type CheckStatus = 'pass' | 'warn' | 'fail';

export type CheckCategory =
  | 'Structural'
  | 'Cross-tool'
  | 'Pathway'
  | 'Adapt'
  | 'Thinking'
  | 'Moves'
  | 'Register'
  | 'MLR';

export interface CheckResult {
  id: string;
  category: CheckCategory;
  name: string;
  status: CheckStatus;
  message: string;
  details?: string[];
}

// Phrases that suggest the register has drifted toward academic/PD jargon
// or deficit framing. Warn-only — these aren't always wrong but worth a look.
const REGISTER_RED_FLAGS = [
  'intuiting',
  'epistemological',
  'metacognition',
  'metacognitive',
  'privatizes',
  'structural insight',
  'noticing capacity',
  'interpretive work',
  'have no language',
  'lack the language',
  'no math language',
  'is absent',
  'absence of language',
  'unable to articulate',
];

function findFlagsInText(text: string): string[] {
  const lower = text.toLowerCase();
  return REGISTER_RED_FLAGS.filter((f) => lower.includes(f));
}

function structuralChecks(lesson: LessonData): CheckResult[] {
  const r: CheckResult[] = [];

  r.push({
    id: 'meta-populated',
    category: 'Structural',
    name: 'Lesson metadata is present',
    status:
      lesson.meta.grade && lesson.meta.lesson_title && lesson.meta.lesson_number
        ? 'pass'
        : 'fail',
    message:
      lesson.meta.grade && lesson.meta.lesson_title && lesson.meta.lesson_number
        ? `${lesson.meta.grade} · ${lesson.meta.unit} · ${lesson.meta.lesson_number} — ${lesson.meta.lesson_title}`
        : 'Grade, unit, lesson number, or lesson title is missing from meta.',
  });

  r.push({
    id: 'activities-nonempty',
    category: 'Structural',
    name: 'At least one activity exists',
    status: lesson.activities.length > 0 ? 'pass' : 'fail',
    message:
      lesson.activities.length > 0
        ? `${lesson.activities.length} activities found.`
        : 'No activities in the lesson — Pathway will be empty.',
  });

  r.push({
    id: 'arc-statement-present',
    category: 'Structural',
    name: 'Arc statement is populated',
    status: lesson.arc_statement.length > 50 ? 'pass' : 'fail',
    message:
      lesson.arc_statement.length > 50
        ? `${lesson.arc_statement.length} characters.`
        : 'Arc statement is empty or too short — Pathway loses its narrative spine.',
  });

  r.push({
    id: 'destination-present',
    category: 'Structural',
    name: 'Destination is populated',
    status: lesson.destination.length > 20 ? 'pass' : 'fail',
    message:
      lesson.destination.length > 20
        ? `${lesson.destination.length} characters.`
        : 'Destination is missing.',
  });

  return r;
}

function crossToolChecks(lesson: LessonData): CheckResult[] {
  const r: CheckResult[] = [];

  const activityIds = lesson.activities.map((a) => a.id);
  const thinkingIds = lesson.anticipated_thinking.activities.map((a) => a.activity_id);
  const decisionIds = lesson.decision_guide.activities.map((a) => a.activity_id);

  const missingFromThinking = activityIds.filter((id) => !thinkingIds.includes(id));
  const missingFromDecision = activityIds.filter((id) => !decisionIds.includes(id));
  const orphansInThinking = thinkingIds.filter((id) => !activityIds.includes(id));
  const orphansInDecision = decisionIds.filter((id) => !activityIds.includes(id));

  r.push({
    id: 'thinking-id-alignment',
    category: 'Cross-tool',
    name: 'Every activity has anticipated thinking patterns',
    status: missingFromThinking.length === 0 ? 'pass' : 'fail',
    message:
      missingFromThinking.length === 0
        ? `All ${activityIds.length} activities covered in Thinking.`
        : `${missingFromThinking.length} activities missing Thinking patterns.`,
    details: missingFromThinking.length > 0 ? missingFromThinking.map((id) => `Activity ${id}`) : undefined,
  });

  r.push({
    id: 'decision-id-alignment',
    category: 'Cross-tool',
    name: 'Every activity has decision guide scenarios',
    status: missingFromDecision.length === 0 ? 'pass' : 'fail',
    message:
      missingFromDecision.length === 0
        ? `All ${activityIds.length} activities covered in Moves.`
        : `${missingFromDecision.length} activities missing scenarios.`,
    details: missingFromDecision.length > 0 ? missingFromDecision.map((id) => `Activity ${id}`) : undefined,
  });

  if (orphansInThinking.length > 0 || orphansInDecision.length > 0) {
    r.push({
      id: 'orphan-ids',
      category: 'Cross-tool',
      name: 'No orphan activity IDs',
      status: 'fail',
      message: 'Thinking or Decision Guide references activity IDs that do not exist in the activities list.',
      details: [
        ...orphansInThinking.map((id) => `Thinking ${id} (orphan)`),
        ...orphansInDecision.map((id) => `Decision Guide ${id} (orphan)`),
      ],
    });
  } else {
    r.push({
      id: 'orphan-ids',
      category: 'Cross-tool',
      name: 'No orphan activity IDs',
      status: 'pass',
      message: 'All activity IDs in Thinking and Moves align to the activities list.',
    });
  }

  return r;
}

function pathwayChecks(lesson: LessonData): CheckResult[] {
  const r: CheckResult[] = [];

  const cruxCount = lesson.activities.filter((a) => a.is_crux).length;
  r.push({
    id: 'exactly-one-crux',
    category: 'Pathway',
    name: 'Exactly one activity is marked as the crux',
    status: cruxCount === 1 ? 'pass' : cruxCount === 0 ? 'fail' : 'warn',
    message:
      cruxCount === 1
        ? `Activity ${lesson.activities.find((a) => a.is_crux)?.id} is the crux.`
        : cruxCount === 0
          ? 'No activity is marked as the crux — Pathway loses its primary visual emphasis.'
          : `${cruxCount} activities marked as crux. Only one should be.`,
  });

  const crux = lesson.activities.find((a) => a.is_crux);
  if (crux) {
    r.push({
      id: 'crux-function-label',
      category: 'Pathway',
      name: 'Crux activity has the "Crux" function label',
      status: crux.function === 'Crux' ? 'pass' : 'warn',
      message:
        crux.function === 'Crux'
          ? `Activity ${crux.id} function: Crux.`
          : `Activity ${crux.id} is the crux but its function is "${crux.function}". These should match.`,
    });
  }

  const missingSummary = lesson.activities.filter((a) => a.function_summary.length < 50);
  r.push({
    id: 'function-summaries',
    category: 'Pathway',
    name: 'Every activity has a function summary',
    status: missingSummary.length === 0 ? 'pass' : 'fail',
    message:
      missingSummary.length === 0
        ? 'All activities have function summaries.'
        : `${missingSummary.length} activity function summaries are missing or too short.`,
    details: missingSummary.map((a) => `Activity ${a.id}`),
  });

  const missingSignals = lesson.activities.filter((a) => a.success_signals.length === 0);
  r.push({
    id: 'success-signals-present',
    category: 'Pathway',
    name: 'Every activity has signals of strong thinking',
    status: missingSignals.length === 0 ? 'pass' : 'fail',
    message:
      missingSignals.length === 0
        ? 'All activities have success signals — asset-based framing preserved.'
        : `${missingSignals.length} activities have no success signals — asset-based framing lost for those activities.`,
    details: missingSignals.map((a) => `Activity ${a.id}`),
  });

  const missingFriction = lesson.activities.filter((a) => a.friction_points.length === 0);
  r.push({
    id: 'friction-points-present',
    category: 'Pathway',
    name: 'Every activity has at least one friction point',
    status: missingFriction.length === 0 ? 'pass' : 'warn',
    message:
      missingFriction.length === 0
        ? 'All activities have friction points.'
        : `${missingFriction.length} activities have no friction points listed.`,
    details: missingFriction.map((a) => `Activity ${a.id}`),
  });

  return r;
}

function adaptChecks(lesson: LessonData): CheckResult[] {
  const r: CheckResult[] = [];
  const g = lesson.adaptation_guardrails;

  r.push({
    id: 'mathematical-purpose',
    category: 'Adapt',
    name: 'Mathematical purpose is populated',
    status: g.mathematical_purpose.length > 50 ? 'pass' : 'fail',
    message:
      g.mathematical_purpose.length > 50
        ? `${g.mathematical_purpose.length} characters.`
        : 'Mathematical purpose missing or too short — the rigor anchor is the point of Adapt.',
  });

  r.push({
    id: 'rigor-check',
    category: 'Adapt',
    name: 'Rigor check question is populated',
    status: g.rigor_check.length > 20 ? 'pass' : 'fail',
    message:
      g.rigor_check.length > 20
        ? 'Rigor check present.'
        : 'Rigor check is empty — the hero element of Adapt.',
  });

  r.push({
    id: 'safe-to-change',
    category: 'Adapt',
    name: 'At least 2 safe-to-change items listed',
    status: g.safe_to_change.length >= 2 ? 'pass' : 'warn',
    message: `${g.safe_to_change.length} safe-to-change items.`,
  });

  r.push({
    id: 'do-not-remove',
    category: 'Adapt',
    name: 'At least 2 do-not-remove items listed',
    status: g.do_not_remove.length >= 2 ? 'pass' : 'warn',
    message: `${g.do_not_remove.length} do-not-remove items.`,
  });

  const profMissing: string[] = [];
  if (g.by_proficiency.entering.text.length < 20) profMissing.push('Entering');
  if (g.by_proficiency.developing.text.length < 20) profMissing.push('Developing');
  if (g.by_proficiency.bridging.text.length < 20) profMissing.push('Bridging');

  r.push({
    id: 'by-proficiency-populated',
    category: 'Adapt',
    name: 'All three proficiency adaptations are populated',
    status: profMissing.length === 0 ? 'pass' : 'fail',
    message:
      profMissing.length === 0
        ? 'Entering / Developing / Bridging all populated.'
        : `Missing: ${profMissing.join(', ')}. Proficiency cards will be blank.`,
  });

  return r;
}

function thinkingChecks(lesson: LessonData): CheckResult[] {
  const r: CheckResult[] = [];

  const activities = lesson.anticipated_thinking.activities;
  const thinPatterns = activities.filter((a) => a.patterns.length < 2);
  r.push({
    id: 'pattern-coverage',
    category: 'Thinking',
    name: 'Each activity has at least 2 thinking patterns',
    status: thinPatterns.length === 0 ? 'pass' : 'warn',
    message:
      thinPatterns.length === 0
        ? 'All activities have at least 2 patterns.'
        : `${thinPatterns.length} activities have fewer than 2 patterns.`,
    details: thinPatterns.map((a) => `Activity ${a.activity_id} — ${a.patterns.length} pattern(s)`),
  });

  const hasMllPattern = activities.some((a) => a.patterns.some((p) => p.is_mll_specific));
  r.push({
    id: 'mll-pattern-present',
    category: 'Thinking',
    name: 'At least one MLL-specific pattern in the lesson',
    status: hasMllPattern ? 'pass' : 'warn',
    message: hasMllPattern
      ? 'MLL-specific pattern found.'
      : 'No MLL-specific patterns in Thinking — MLL primacy weakens.',
  });

  const hasMisconception = activities.some((a) =>
    a.patterns.some((p) => p.type === 'misconception')
  );
  r.push({
    id: 'misconception-pattern',
    category: 'Thinking',
    name: 'At least one misconception pattern in the lesson',
    status: hasMisconception ? 'pass' : 'warn',
    message: hasMisconception
      ? 'Misconception pattern found — noticing development has something to interpret.'
      : 'No misconception patterns — Thinking is one-sided.',
  });

  const missingFrames = activities.filter((a) => a.sentence_frames.length === 0);
  r.push({
    id: 'sentence-frames',
    category: 'Thinking',
    name: 'Each activity has sentence frames',
    status: missingFrames.length === 0 ? 'pass' : 'warn',
    message:
      missingFrames.length === 0
        ? 'All activities have sentence frames.'
        : `${missingFrames.length} activities missing sentence frames.`,
    details: missingFrames.map((a) => `Activity ${a.activity_id}`),
  });

  // ---- Coherence editor: type ↔ frequency ↔ move alignment ----
  const coherenceIssues: string[] = [];

  for (const a of lesson.anticipated_thinking.activities) {
    a.patterns.forEach((p, i) => {
      const loc = `Thinking ${a.activity_id} '${p.label || `pattern[${i}]`}'`;
      const move = (p.move || '').toLowerCase();

      // ---- Type ↔ frequency pairings (uncommon combos) ----
      if (p.type === 'extension' && p.frequency === 'most students') {
        coherenceIssues.push(
          `${loc}: type 'extension' with frequency 'most students' — extensions are typically rare. Consider 'watch for this'.`,
        );
      }
      if (p.type === 'misconception' && p.frequency === 'watch for this') {
        coherenceIssues.push(
          `${loc}: type 'misconception' with frequency 'watch for this' — misconceptions are typically 'most' or 'some students'.`,
        );
      }

      // ---- Type ↔ move text alignment (heuristic) ----
      if (
        p.type === 'on-track' &&
        !/(extend|build|confirm|affirm|accept|validate|highlight|ask .* (why|how|more)|repeat)/.test(move)
      ) {
        coherenceIssues.push(
          `${loc}: type 'on-track' but move text doesn't extend, affirm, or build on the thinking.`,
        );
      }
      if (
        p.type === 'misconception' &&
        !/(ask|read aloud|wait|show|compare|let them|address|catch|redirect|self.?correct|feel)/.test(move)
      ) {
        coherenceIssues.push(
          `${loc}: type 'misconception' but move text doesn't probe, redirect, or let the student self-correct.`,
        );
      }
      if (
        p.type === 'extension' &&
        !/(share|stop|public|class|hear|tell|ask .*explain|make .*public|pause|synthesis)/.test(move)
      ) {
        coherenceIssues.push(
          `${loc}: type 'extension' but move text doesn't make the insight public or share with the class.`,
        );
      }
      if (
        p.type === 'language-math' &&
        !/(gesture|point|frame|partner|repeat|nonverbal|home language|aloud|hands|smile|nod)/.test(move)
      ) {
        coherenceIssues.push(
          `${loc}: type 'language-math' but move text doesn't include language scaffolding (gesture, partner share, sentence frame, aloud).`,
        );
      }

      // ---- Frequency ↔ move emphasis (heuristic) ----
      // 'watch for this' = rare AND high-leverage. The move should be a public moment.
      if (
        p.frequency === 'watch for this' &&
        p.type !== 'misconception' &&
        !/(stop|pause|public|class|share|hear|make .* (public|hear)|tell|whole.room|whole group)/.test(move)
      ) {
        coherenceIssues.push(
          `${loc}: frequency 'watch for this' (rare, high-leverage) but move isn't a 'stop the room' / make-public moment.`,
        );
      }
    });
  }

  r.push({
    id: 'thinking-type-frequency-move-coherence',
    category: 'Thinking',
    name: 'Pattern type, frequency, and move text align',
    status: coherenceIssues.length === 0 ? 'pass' : 'warn',
    message:
      coherenceIssues.length === 0
        ? 'All thinking patterns coherent.'
        : `${coherenceIssues.length} potential alignment issue(s) — review for false positives.`,
    details: coherenceIssues.length > 0 ? coherenceIssues : undefined,
  });

  return r;
}

function movesChecks(lesson: LessonData): CheckResult[] {
  const r: CheckResult[] = [];

  const allScenarios = lesson.decision_guide.activities.flatMap((a) =>
    a.scenarios.map((s) => ({ ...s, activity_id: a.activity_id }))
  );

  r.push({
    id: 'scenario-count',
    category: 'Moves',
    name: 'Lesson has 6–12 scenarios',
    status:
      allScenarios.length >= 6 && allScenarios.length <= 12
        ? 'pass'
        : allScenarios.length < 6
          ? 'fail'
          : 'warn',
    message: `${allScenarios.length} total scenarios. ${allScenarios.length < 6 ? 'Too few for meaningful walkthrough.' : allScenarios.length > 12 ? 'Cheat sheet may get unwieldy.' : ''}`.trim(),
  });

  const typesUsed = new Set(allScenarios.map((s) => s.scenario_type));
  r.push({
    id: 'scenario-type-variety',
    category: 'Moves',
    name: 'At least 3 different scenario types used',
    status: typesUsed.size >= 3 ? 'pass' : 'warn',
    message:
      typesUsed.size >= 3
        ? `${typesUsed.size} different types used: ${Array.from(typesUsed).join(', ')}.`
        : `Only ${typesUsed.size} type(s) used: ${Array.from(typesUsed).join(', ')}. Noticing development is one-sided.`,
  });

  const mllScenarios = allScenarios.filter((s) => s.is_mll);
  const mllRatio = allScenarios.length > 0 ? mllScenarios.length / allScenarios.length : 0;
  r.push({
    id: 'mll-primacy',
    category: 'Moves',
    name: 'MLL scenarios are at least 25% of total',
    status: mllRatio >= 0.25 ? 'pass' : 'warn',
    message: `${mllScenarios.length} of ${allScenarios.length} scenarios are MLL (${Math.round(mllRatio * 100)}%). ${mllRatio < 0.25 ? 'MLL primacy weakens below 25%.' : ''}`.trim(),
  });

  const activityMllCoverage = lesson.decision_guide.activities.filter((a) =>
    a.scenarios.some((s) => s.is_mll)
  );
  r.push({
    id: 'mll-per-activity',
    category: 'Moves',
    name: 'Every activity has at least one MLL scenario',
    status:
      activityMllCoverage.length === lesson.decision_guide.activities.length ? 'pass' : 'warn',
    message:
      activityMllCoverage.length === lesson.decision_guide.activities.length
        ? 'Every activity covers MLL.'
        : `${lesson.decision_guide.activities.length - activityMllCoverage.length} activities have no MLL scenario.`,
    details: lesson.decision_guide.activities
      .filter((a) => !a.scenarios.some((s) => s.is_mll))
      .map((a) => `Activity ${a.activity_id}`),
  });

  // MLL scenarios must have proficiency_moves with all three populated
  const mllStructuralIssues: string[] = [];
  for (const s of mllScenarios) {
    if (!s.proficiency_moves) {
      mllStructuralIssues.push(`Activity ${s.activity_id}: MLL scenario missing proficiency_moves`);
      continue;
    }
    if (!s.proficiency_moves.entering.move) mllStructuralIssues.push(`Activity ${s.activity_id}: Entering move missing`);
    if (!s.proficiency_moves.developing.move) mllStructuralIssues.push(`Activity ${s.activity_id}: Developing move missing`);
    if (!s.proficiency_moves.bridging.move) mllStructuralIssues.push(`Activity ${s.activity_id}: Bridging move missing`);
  }
  r.push({
    id: 'mll-proficiency-populated',
    category: 'Moves',
    name: 'MLL scenarios have all three proficiency moves',
    status: mllStructuralIssues.length === 0 ? 'pass' : 'fail',
    message:
      mllStructuralIssues.length === 0
        ? 'All MLL scenarios have Entering / Developing / Bridging populated.'
        : `${mllStructuralIssues.length} MLL completeness issues.`,
    details: mllStructuralIssues,
  });

  // MLL Entering moves MUST have nonverbal populated
  const enteringWithoutNonverbal = mllScenarios.filter(
    (s) => s.proficiency_moves && (!s.proficiency_moves.entering.nonverbal || s.proficiency_moves.entering.nonverbal.length < 10)
  );
  r.push({
    id: 'entering-nonverbal',
    category: 'Moves',
    name: 'Every MLL Entering move has a non-verbal action',
    status: enteringWithoutNonverbal.length === 0 ? 'pass' : 'fail',
    message:
      enteringWithoutNonverbal.length === 0
        ? 'All Entering moves have non-verbal actions — framework requirement met.'
        : `${enteringWithoutNonverbal.length} MLL scenarios missing Entering non-verbal. Framework requirement violated.`,
    details: enteringWithoutNonverbal.map((s) => `Activity ${s.activity_id}: ${s.label.slice(0, 80)}...`),
  });

  // Non-MLL scenarios must have flat_move
  const nonMllWithoutFlatMove = allScenarios.filter((s) => !s.is_mll && !s.flat_move);
  r.push({
    id: 'flat-move-populated',
    category: 'Moves',
    name: 'Non-MLL scenarios have a flat move',
    status: nonMllWithoutFlatMove.length === 0 ? 'pass' : 'fail',
    message:
      nonMllWithoutFlatMove.length === 0
        ? 'All non-MLL scenarios have flat moves.'
        : `${nonMllWithoutFlatMove.length} non-MLL scenarios missing flat_move — Move card will be empty.`,
    details: nonMllWithoutFlatMove.map((s) => `Activity ${s.activity_id}: ${s.label.slice(0, 80)}...`),
  });

  // Every scenario has an interpretation
  const missingInterpretation = allScenarios.filter((s) => s.interpretation.length < 50);
  r.push({
    id: 'interpretation-present',
    category: 'Moves',
    name: 'Every scenario has an interpretation',
    status: missingInterpretation.length === 0 ? 'pass' : 'fail',
    message:
      missingInterpretation.length === 0
        ? 'All scenarios have interpretations — the noticing-development step is intact.'
        : `${missingInterpretation.length} scenarios missing or short interpretations.`,
    details: missingInterpretation.map((s) => `Activity ${s.activity_id}: ${s.label.slice(0, 80)}...`),
  });

  // Avoid line is the hard discipline — every move needs it
  const missingAvoid: string[] = [];
  for (const s of allScenarios) {
    if (s.flat_move && (!s.flat_move.avoid || s.flat_move.avoid.length < 20)) {
      missingAvoid.push(`Activity ${s.activity_id}: ${s.label.slice(0, 60)}...`);
    }
    if (s.proficiency_moves) {
      if (!s.proficiency_moves.entering.avoid || s.proficiency_moves.entering.avoid.length < 20) {
        missingAvoid.push(`Activity ${s.activity_id}: Entering — ${s.label.slice(0, 60)}...`);
      }
      if (!s.proficiency_moves.developing.avoid || s.proficiency_moves.developing.avoid.length < 20) {
        missingAvoid.push(`Activity ${s.activity_id}: Developing — ${s.label.slice(0, 60)}...`);
      }
      if (!s.proficiency_moves.bridging.avoid || s.proficiency_moves.bridging.avoid.length < 20) {
        missingAvoid.push(`Activity ${s.activity_id}: Bridging — ${s.label.slice(0, 60)}...`);
      }
    }
  }
  r.push({
    id: 'avoid-populated',
    category: 'Moves',
    name: 'Every move has an "avoid" line',
    status: missingAvoid.length === 0 ? 'pass' : 'fail',
    message:
      missingAvoid.length === 0
        ? 'All moves include an avoid line.'
        : `${missingAvoid.length} moves missing the avoid line.`,
    details: missingAvoid.slice(0, 10),
  });

  return r;
}

function registerChecks(lesson: LessonData): CheckResult[] {
  const r: CheckResult[] = [];

  const allText: { label: string; text: string }[] = [
    { label: 'arc_statement', text: lesson.arc_statement },
    { label: 'destination', text: lesson.destination },
    { label: 'mathematical_purpose', text: lesson.adaptation_guardrails.mathematical_purpose },
    { label: 'rigor_check', text: lesson.adaptation_guardrails.rigor_check },
  ];
  for (const a of lesson.activities) {
    allText.push({ label: `${a.id} function_summary`, text: a.function_summary });
    if (a.causal_link) allText.push({ label: `${a.id} causal_link`, text: a.causal_link });
  }
  for (const a of lesson.decision_guide.activities) {
    for (const s of a.scenarios) {
      allText.push({ label: `${a.activity_id} interpretation: ${s.label.slice(0, 40)}`, text: s.interpretation });
    }
  }

  const flagged: string[] = [];
  for (const { label, text } of allText) {
    const found = findFlagsInText(text);
    if (found.length > 0) {
      flagged.push(`${label}: ${found.join(', ')}`);
    }
  }

  r.push({
    id: 'register-red-flags',
    category: 'Register',
    name: 'No academic or deficit-framing phrases',
    status: flagged.length === 0 ? 'pass' : 'warn',
    message:
      flagged.length === 0
        ? 'No register red flags detected.'
        : `${flagged.length} field(s) contain phrases that may signal too-academic register or deficit framing.`,
    details: flagged.slice(0, 10),
  });

  // Length checks — extremely long strings often signal verbose register
  const longArc = lesson.arc_statement.length > 1500;
  r.push({
    id: 'arc-length',
    category: 'Register',
    name: 'Arc statement length is reasonable (under 1500 chars)',
    status: longArc ? 'warn' : 'pass',
    message: longArc
      ? `Arc statement is ${lesson.arc_statement.length} chars — may be too long for novice teacher pre-class read.`
      : `Arc statement is ${lesson.arc_statement.length} chars.`,
  });

  return r;
}

function mlrChecks(lesson: LessonData): CheckResult[] {
  const r: CheckResult[] = [];

  // mlr_inference exists and covers every activity
  const activityIds = lesson.activities.map((a) => a.id);
  const inferredIds = lesson.mlr_inference.activities.map((a) => a.activity_id);
  const missing = activityIds.filter((id) => !inferredIds.includes(id));
  r.push({
    id: 'mlr-inference-covers-activities',
    category: 'MLR',
    name: 'MLR inference block covers every activity',
    status: missing.length === 0 ? 'pass' : 'fail',
    message:
      missing.length === 0
        ? `${inferredIds.length} activities covered.`
        : `Missing mlr_inference for activities: ${missing.join(', ')}`,
  });

  // Orphan MLLs: items flagged MLL but missing MLR anchor
  const orphans: string[] = [];

  for (const a of lesson.activities) {
    a.friction_points.forEach((fp, i) => {
      if ((fp.type === 'language' || fp.type === 'language-math') && !fp.mlr) {
        orphans.push(`Pathway ${a.id} friction[${i}] (${fp.type})`);
      }
    });
  }

  for (const a of lesson.anticipated_thinking.activities) {
    a.patterns.forEach((p, i) => {
      if (p.is_mll_specific && !p.mlr) {
        orphans.push(`Thinking ${a.activity_id} pattern[${i}] (MLL-specific)`);
      }
    });
  }

  for (const a of lesson.decision_guide.activities) {
    a.scenarios.forEach((s, i) => {
      if (s.is_mll && !s.mlr) {
        orphans.push(`Moves ${a.activity_id} scenario[${i}] (MLL)`);
      }
    });
  }

  r.push({
    id: 'mlr-no-orphan-mll',
    category: 'MLR',
    name: 'Every MLL-flagged item has an MLR anchor',
    status: orphans.length === 0 ? 'pass' : 'fail',
    message:
      orphans.length === 0
        ? 'No orphan MLL items.'
        : `${orphans.length} orphan MLL item(s) missing MLR anchor.`,
    details: orphans.length > 0 ? orphans : undefined,
  });

  // Hallucinated routine numbers
  const allMlrs: { location: string; number: unknown }[] = [];
  for (const a of lesson.activities) {
    a.friction_points.forEach((fp, i) => fp.mlr && allMlrs.push({ location: `Pathway ${a.id} friction[${i}]`, number: fp.mlr.number }));
    a.teacher_moves.forEach((m, i) => m.mlr && allMlrs.push({ location: `Pathway ${a.id} teacher_move[${i}]`, number: m.mlr.number }));
  }
  for (const a of lesson.anticipated_thinking.activities) {
    a.patterns.forEach((p, i) => p.mlr && allMlrs.push({ location: `Thinking ${a.activity_id} pattern[${i}]`, number: p.mlr.number }));
    a.sentence_frames.forEach((f, i) => f.mlr && allMlrs.push({ location: `Thinking ${a.activity_id} frame[${i}]`, number: f.mlr.number }));
  }
  for (const a of lesson.decision_guide.activities) {
    a.scenarios.forEach((s, i) => s.mlr && allMlrs.push({ location: `Moves ${a.activity_id} scenario[${i}]`, number: s.mlr.number }));
  }
  for (const a of lesson.wristband.activities) {
    a.tiles.forEach((t, i) => t.mlr && allMlrs.push({ location: `Quick Read ${a.activity_id} tile[${i}]`, number: t.mlr.number }));
  }
  const invalid = allMlrs.filter((x) => !isValidMlrNumber(x.number));
  r.push({
    id: 'mlr-no-hallucinated-routines',
    category: 'MLR',
    name: 'Every MLR reference is one of MLR 1-8',
    status: invalid.length === 0 ? 'pass' : 'fail',
    message:
      invalid.length === 0
        ? `${allMlrs.length} MLR references, all valid.`
        : `${invalid.length} invalid MLR number(s) detected.`,
    details: invalid.length > 0 ? invalid.map((x) => `${x.location} → ${String(x.number)}`) : undefined,
  });

  // Wristband word-count caps
  const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
  const wbViolations: string[] = [];

  if (lesson.wristband.arc_one_line && wordCount(lesson.wristband.arc_one_line) > 12) {
    wbViolations.push(`arc_one_line: ${wordCount(lesson.wristband.arc_one_line)} words (cap 12)`);
  }
  lesson.wristband.top_signals.forEach((s, i) => {
    if (wordCount(s) > 10) wbViolations.push(`top_signals[${i}]: ${wordCount(s)} words (cap ~10)`);
  });
  lesson.wristband.top_frictions.forEach((s, i) => {
    if (wordCount(s) > 10) wbViolations.push(`top_frictions[${i}]: ${wordCount(s)} words (cap ~10)`);
  });
  lesson.wristband.activities.forEach((a) => {
    if (a.tiles.length > 3) wbViolations.push(`Quick Read ${a.activity_id}: ${a.tiles.length} tiles (cap 3)`);
    a.tiles.forEach((t, i) => {
      if (wordCount(t.observation_short) > 10)
        wbViolations.push(`Quick Read ${a.activity_id} tile[${i}] observation: ${wordCount(t.observation_short)} words (cap 10)`);
      if (wordCount(t.move_short) > 16)
        wbViolations.push(`Quick Read ${a.activity_id} tile[${i}] move: ${wordCount(t.move_short)} words (cap 16)`);
    });
  });

  r.push({
    id: 'wristband-word-counts',
    category: 'MLR',
    name: 'Quick Read tiles respect compression caps',
    status: wbViolations.length === 0 ? 'pass' : 'warn',
    message:
      wbViolations.length === 0
        ? 'All Quick Read compressions within caps.'
        : `${wbViolations.length} compression cap violations.`,
    details: wbViolations.length > 0 ? wbViolations : undefined,
  });

  return r;
}

export function runAllChecks(lesson: LessonData): CheckResult[] {
  return [
    ...structuralChecks(lesson),
    ...crossToolChecks(lesson),
    ...pathwayChecks(lesson),
    ...adaptChecks(lesson),
    ...thinkingChecks(lesson),
    ...movesChecks(lesson),
    ...mlrChecks(lesson),
    ...registerChecks(lesson),
  ];
}

export interface QASummary {
  total: number;
  passed: number;
  warnings: number;
  failures: number;
  ready: boolean;
}

export function summarize(results: CheckResult[]): QASummary {
  const passed = results.filter((r) => r.status === 'pass').length;
  const warnings = results.filter((r) => r.status === 'warn').length;
  const failures = results.filter((r) => r.status === 'fail').length;
  return {
    total: results.length,
    passed,
    warnings,
    failures,
    ready: failures === 0,
  };
}
