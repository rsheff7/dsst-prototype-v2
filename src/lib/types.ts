import { MlrNumber } from './mlrs';
import { ELSFGuidelineNumber } from './elsf';

export interface MlrRef {
  number: MlrNumber;
  name: string;
}

export interface LessonMeta {
  grade: string;
  unit: string;
  lesson_number: string;
  lesson_title: string;
  total_time: string;
}

export interface KeyVocabularyTerm {
  term: string;
  definition: string;
}

export interface FrictionPoint {
  description: string;
  type: 'math' | 'language' | 'language-math';
  mlr?: MlrRef;
}

export type ActivityFunction = 'Setup' | 'Crux' | 'Application' | 'Synthesis';

export interface ActivityTeacherMove {
  text: string;
  mlr?: MlrRef;
}

export interface Activity {
  id: string;
  title: string;
  function: ActivityFunction;
  duration: string;
  grouping: string;
  language_demand: 'low' | 'medium' | 'high';
  function_summary: string;
  learning_target: string;
  synthesis_prompt: string;
  is_crux: boolean;
  friction_points: FrictionPoint[];
  success_signals: string[];
  teacher_moves: ActivityTeacherMove[];
  causal_link: string | null;
  extension: string | null;
}

export interface ProficiencyAdaptation {
  text: string;
  mlr?: MlrRef;
}

export interface AdaptationProficiencyLevels {
  emerging: ProficiencyAdaptation;
  developing: ProficiencyAdaptation;
  expanding: ProficiencyAdaptation;
}

export interface DoNotRemoveItem {
  text: string;
  mlr?: MlrRef;
}

export interface AdaptationGuardrails {
  mathematical_purpose: string;
  safe_to_change: string[];
  do_not_remove: DoNotRemoveItem[];
  rigor_check: string;
  by_proficiency: AdaptationProficiencyLevels;
}

export interface ThinkingPattern {
  label: string;
  frequency: 'most students' | 'some students' | 'watch for this';
  type: 'on-track' | 'misconception' | 'partial' | 'extension' | 'language-math';
  description: string;
  move: string;
  is_mll_specific: boolean;
  mlr?: MlrRef;
}

export interface SentenceFrame {
  frame: string;
  mlr?: MlrRef;
}

export interface AnticipatedThinkingActivity {
  activity_id: string;
  patterns: ThinkingPattern[];
  sentence_frames: SentenceFrame[];
  questions_to_listen_for: string[];
}

export interface AnticipatedThinking {
  orientation: string;
  activities: AnticipatedThinkingActivity[];
}

export interface TeacherMove {
  move: string;
  say: string | null;
  nonverbal: string | null;
  avoid: string;
}

export interface ProficiencyMoves {
  emerging: TeacherMove;
  developing: TeacherMove;
  expanding: TeacherMove;
}

export type ScenarioType =
  | 'common-error'
  | 'productive-insight'
  | 'on-track'
  | 'partial-understanding'
  | 'productive-struggle';

export interface DecisionScenario {
  scenario_type: ScenarioType;
  label: string;
  interpretation: string;
  is_mll: boolean;
  flat_move: TeacherMove | null;
  proficiency_moves: ProficiencyMoves | null;
  mll_framework_note: string | null;
  mlr?: MlrRef;
  proficiency_divergence_note?: string | null;
}

export interface DecisionGuideActivity {
  activity_id: string;
  scenarios: DecisionScenario[];
}

export interface DecisionGuide {
  activities: DecisionGuideActivity[];
}

export interface MlrInferenceMlrItem {
  number: MlrNumber;
  name: string;
  why_here: string;
}

export interface MlrInferenceActivity {
  activity_id: string;
  language_work: string;
  mlrs: MlrInferenceMlrItem[];
}

export interface MlrInference {
  activities: MlrInferenceActivity[];
}

// ---------------- ELSF reasoning layer ----------------
// Premo's ELSF layer sharpens two specific aspects of the generated guidance:
// (1) identifying the LANGUAGE DEMANDS of each activity, and
// (2) surfacing the FUNCTIONAL LANGUAGE students need to engage the task.
// The two blocks below capture that reasoning per activity, citing which
// ELSF guidelines (1-15) informed the reasoning.

export interface LanguageDemandsForActivity {
  // What students must read or listen to in order to engage the task
  receptive: string;
  // What students must say or write to demonstrate their thinking
  productive: string;
  // What students must discuss with peers; the back-and-forth language work
  interactive: string;
  // The gap between students' everyday/home language and the academic register the task requires
  everyday_to_academic_bridge: string;
  // Which of the 15 ELSF guidelines were applied in this reasoning (citation, not free text)
  elsf_guidelines_applied: ELSFGuidelineNumber[];
}

export interface FunctionalLanguageForActivity {
  // The language FUNCTIONS students must use (e.g., "explain reasoning",
  // "describe a relationship", "justify a conjecture", "compare quantities")
  language_functions: string[];
  // Concrete academic English phrases or sentence forms students need to PRODUCE
  // (distinct from sentence_frames, which are fill-in scaffolds)
  example_phrases: string[];
  // Where home language (L1) or everyday English can be leveraged; null if not applicable
  l1_bridge: string | null;
  // Which ELSF guidelines informed this
  elsf_guidelines_applied: ELSFGuidelineNumber[];
}

export interface ELSFInferenceActivity {
  activity_id: string;
  language_demands: LanguageDemandsForActivity;
  functional_language: FunctionalLanguageForActivity;
}

export interface ELSFInference {
  activities: ELSFInferenceActivity[];
}

export interface WristbandTile {
  observation_short: string;
  friction_type: 'math' | 'language' | 'language-math';
  mlr?: MlrRef;
  move_short: string;
  avoid_short?: string;
  is_crux_moment?: boolean;
  has_proficiency_variants?: boolean;
  glyph_observation?: string;
  glyph_move?: string;
}

export interface WristbandActivity {
  activity_id: string;
  tiles: WristbandTile[];
  synthesis_short: string;
}

export interface WristbandLegendEntry {
  mlr: MlrRef;
  one_line_cue: string;
}

export interface Wristband {
  arc_one_line: string;
  preflight: string[];
  top_signals: string[];
  top_frictions: string[];
  activities: WristbandActivity[];
  mlr_legend: WristbandLegendEntry[];
  lesson_synthesis_short: string;
}

export interface LessonSynthesis {
  prompt: string;
  builds_on: string[];
}

export interface LessonData {
  meta: LessonMeta;
  arc_statement: string;
  destination: string;
  key_vocabulary: KeyVocabularyTerm[];
  activities: Activity[];
  adaptation_guardrails: AdaptationGuardrails;
  anticipated_thinking: AnticipatedThinking;
  decision_guide: DecisionGuide;
  elsf_inference: ELSFInference;
  mlr_inference: MlrInference;
  lesson_synthesis: LessonSynthesis;
  wristband: Wristband;
}

export type ToolId = 'quickread' | 'pathway' | 'adapt' | 'thinking' | 'moves';
