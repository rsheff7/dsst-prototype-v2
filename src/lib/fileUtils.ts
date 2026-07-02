export function exportLessonToFile(lessonData: LessonData) {
  const jsonString = JSON.stringify(lessonData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `lesson-plan-${new Date().toISOString().split('T')[0]}.dsst`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function validateLessonData(data: unknown): data is LessonData {
  if (!data || typeof data !== 'object') return false;
  
  const lesson = data as Record<string, unknown>;
  
  // Check required top-level fields
  const requiredFields = [
    'meta',
    'arc_statement',
    'destination',
    'key_vocabulary',
    'activities',
    'adaptation_guardrails',
    'anticipated_thinking',
    'decision_guide',
    'mlr_inference',
    'wristband'
  ];
  
  for (const field of requiredFields) {
    if (!(field in lesson)) return false;
  }
  
  // Validate meta object
  if (typeof lesson.meta !== 'object' || lesson.meta === null) return false;
  const meta = lesson.meta as Record<string, unknown>;
  const metaFields = ['grade', 'unit', 'lesson_number', 'lesson_title', 'total_time'];
  for (const field of metaFields) {
    if (!(field in meta) || typeof meta[field] !== 'string') return false;
  }
  
  // Validate key_vocabulary is array
  if (!Array.isArray(lesson.key_vocabulary)) return false;
  
  // Validate activities is array with required fields
  if (!Array.isArray(lesson.activities)) return false;
  for (const activity of lesson.activities) {
    if (typeof activity !== 'object' || activity === null) return false;
    const act = activity as Record<string, unknown>;
    const activityFields = ['id', 'title', 'function', 'duration', 'grouping', 'language_demand', 'function_summary', 'learning_target', 'is_crux', 'friction_points', 'success_signals', 'teacher_moves', 'causal_link', 'extension'];
    for (const field of activityFields) {
      if (!(field in act)) return false;
    }
  }
  
  // Validate adaptation_guardrails
  if (typeof lesson.adaptation_guardrails !== 'object' || lesson.adaptation_guardrails === null) return false;
  const guardrails = lesson.adaptation_guardrails as Record<string, unknown>;
  const guardrailFields = ['mathematical_purpose', 'safe_to_change', 'do_not_remove', 'rigor_check', 'by_proficiency'];
  for (const field of guardrailFields) {
    if (!(field in guardrails)) return false;
  }
  
  // Validate anticipated_thinking
  if (typeof lesson.anticipated_thinking !== 'object' || lesson.anticipated_thinking === null) return false;
  const thinking = lesson.anticipated_thinking as Record<string, unknown>;
  if (!('orientation' in thinking) || !('activities' in thinking)) return false;
  
  // Validate decision_guide
  if (typeof lesson.decision_guide !== 'object' || lesson.decision_guide === null) return false;
  const guide = lesson.decision_guide as Record<string, unknown>;
  if (!('activities' in guide)) return false;
  
  // Validate mlr_inference
  if (typeof lesson.mlr_inference !== 'object' || lesson.mlr_inference === null) return false;
  const inference = lesson.mlr_inference as Record<string, unknown>;
  if (!('activities' in inference)) return false;
  
  // Validate wristband
  if (typeof lesson.wristband !== 'object' || lesson.wristband === null) return false;
  const wristband = lesson.wristband as Record<string, unknown>;
  const wristbandFields = ['arc_one_line', 'preflight', 'top_signals', 'top_frictions', 'activities', 'mlr_legend'];
  for (const field of wristbandFields) {
    if (!(field in wristband)) return false;
  }
  
  return true;
}

export async function importLessonFromFile(file: File): Promise<LessonData> {
  // Validate file type
  if (!file.name.toLowerCase().endsWith('.dsst')) {
    throw new Error('File must have .dsst extension');
  }
  
  if (file.type !== 'application/json' && file.type !== '') {
    throw new Error('File must be a JSON file (.dsst)');
  }
  
  // Read file content
  const text = await file.text();
  
  if (!text.trim()) {
    throw new Error('File is empty');
  }
  
  // Parse JSON
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error('This doesn\'t look like a valid DSST file. Make sure it\'s a properly formatted .dsst export.');
  }
  
  // Validate against LessonData schema
  if (!validateLessonData(data)) {
    throw new Error('This file doesn\'t contain valid lesson plan data. Make sure it\'s a .dsst file exported from the lesson planner.');
  }
  
  return data;
}