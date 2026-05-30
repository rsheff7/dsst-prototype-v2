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
}

export type ActivityFunction = 'Setup' | 'Crux' | 'Application' | 'Synthesis';

export interface Activity {
  id: string;
  title: string;
  function: ActivityFunction;
  duration: string;
  grouping: string;
  language_demand: 'low' | 'medium' | 'high';
  function_summary: string;
  is_crux: boolean;
  friction_points: FrictionPoint[];
  success_signals: string[];
  teacher_moves: string[];
  causal_link: string | null;
  extension: string | null;
}

export interface AdaptationProficiencyLevel {
  entering: string;
  developing: string;
  bridging: string;
}

export interface AdaptationGuardrails {
  mathematical_purpose: string;
  safe_to_change: string[];
  do_not_remove: string[];
  rigor_check: string;
  by_proficiency: AdaptationProficiencyLevel;
}

export interface ThinkingPattern {
  label: string;
  frequency: 'most students' | 'some students' | 'watch for this';
  type: 'on-track' | 'misconception' | 'partial' | 'extension' | 'language-math';
  description: string;
  move: string;
  is_mll_specific: boolean;
}

export interface AnticipatedThinkingActivity {
  activity_id: string;
  patterns: ThinkingPattern[];
  sentence_frames: string[];
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
}

export interface DecisionGuideActivity {
  activity_id: string;
  scenarios: DecisionScenario[];
}

export interface DecisionGuide {
  activities: DecisionGuideActivity[];
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
}
