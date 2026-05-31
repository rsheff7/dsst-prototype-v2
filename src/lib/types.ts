import { MlrNumber } from './mlrs';

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
  entering: ProficiencyAdaptation;
  developing: ProficiencyAdaptation;
  bridging: ProficiencyAdaptation;
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
  entering: TeacherMove;
  developing: TeacherMove;
  bridging: TeacherMove;
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
  mlr_inference: MlrInference;
  wristband: Wristband;
}
