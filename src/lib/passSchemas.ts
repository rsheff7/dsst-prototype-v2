/* ------------------------------------------------------------------ */
/*  Response schemas — one per pass                                     */
/* ------------------------------------------------------------------ */
//
// These are sent to Gemini as `response_format.schema` so the model decodes
// against the schema instead of being asked for JSON in prose. Two things this
// buys us that prompt text did not:
//
//   1. Valid JSON, always. A 10-run baseline on 2026-08-19 failed 2/10 with
//      "Pass A returned text that was not valid JSON".
//   2. Cardinality. minItems pins a floor under the list lengths that drifted in
//      same baseline — teacher_moves 3-6, mlrs_assigned 4-7, tiles_with_mlr 3-5.
//      Every field that already had an explicit count in the prompt (top_signals,
//      top_frictions, builds_on) held at 0% variance; these bounds extend that
//      property to the fields that didn't.
//
// Keep the counts here in sync with the prompt text. The prompt explains the
// intent; the schema enforces it.
//
// TWO LIMITS OF THIS API SURFACE, both established empirically on 2026-08-19
// against gemini-3.7-flash (the docs list both features as supported):
//
//   * `maxItems` is rejected with "Request contains an invalid argument" once
//     arrays nest inside arrays. A flat array accepts it; ours do not. Only
//     minItems is used below, so these are floors, not ranges — the prompt text
//     carries the upper bound.
//   * There is a complexity ceiling on a whole schema that is not raw size or
//     depth alone. Pass D breaches it: `decision_guide` nests
//     activities[] -> scenarios[] -> flat_move/proficiency_moves objects, and is
//     rejected even with those collapsed to free-form `{ type: 'object' }`,
//     while the same schema minus them passes at a LARGER byte size. Pass D
//     therefore runs unconstrained for now. The fix is to flatten
//     decision_guide to a single scenarios[] array carrying activity_id, and
//     re-nest it in normalizeLesson — that removes one array level and should
//     bring it under the ceiling.

const MLR_REF = {
  type: 'object',
  properties: {
    number: { type: 'integer', minimum: 1, maximum: 8 },
    name: { type: 'string' },
  },
  required: ['number', 'name'],
} as const;

const TEACHER_MOVE = {
  type: 'object',
  properties: {
    move: { type: 'string' },
    say: { type: 'string' },
    nonverbal: { type: 'string' },
    avoid: { type: 'string' },
  },
  // `avoid` is required: voice rule 8 makes it the heaviest-carrying field, and
  // it is the one most often dropped when the model compresses.
  required: ['move', 'avoid'],
} as const;

const PROFICIENCY_MOVES = {
  type: 'object',
  properties: {
    emerging: TEACHER_MOVE,
    developing: TEACHER_MOVE,
    expanding: TEACHER_MOVE,
  },
  required: ['emerging', 'developing', 'expanding'],
} as const;

const ACTIVITY_SKELETON = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    function: {
      type: 'string',
      enum: ['Setup', 'Crux', 'Application', 'Synthesis'],
      description:
        'The activity\'s role in the lesson arc. Must agree with is_crux: exactly the activity marked is_crux carries function "Crux".',
    },
    duration: { type: 'string' },
    grouping: { type: 'string' },
    language_demand: { type: 'string', enum: ['low', 'medium', 'high'] },
    learning_target: { type: 'string' },
    is_crux: {
      type: 'boolean',
      description: 'The crux is the moment where the lesson succeeds or fails on the teacher\'s facilitation. Identify it from the published learning target and the lesson\'s scaffolding design, in this order: (1) it is where the learning target is first GENUINELY ATTEMPTED — not introduced, not rehearsed, not practised afterwards; (2) the scaffolding is at its thinnest there — students meet the new idea with less support than the earlier activities gave them; (3) what the teacher does in the moment — what they notice, what they ask, what they let pass — decides whether students reach the target. It is never the warm-up. It is NOT simply the longest or hardest activity: an activity students can grind through on their own is not the crux, while a short activity that collapses without the right teacher move is. Exactly ONE activity per lesson.',
    },
  },
  required: [
    'id',
    'title',
    'function',
    'duration',
    'grouping',
    'language_demand',
    'learning_target',
    'is_crux',
  ],
} as const;


// The anchor carries what outcome-first selection reads. Two of these fields do
// the deciding — `outcome_type` and `function` — and both are enums on purpose:
// enum fields have held at one distinct value across ten runs of a PDF while
// free text came back 8-9 distinct. `activity_outcome` is prose for the teacher
// to read; it must restate a published learning target and it decides nothing.
//
// The booleans describe the PRINTED MATERIALS, not pedagogy. "Is a wrong answer
// shown on the page" is checkable against the page in seconds, which is what
// makes them safe to generate — unlike "which routine fits", which is not.
const ANCHOR_ACTIVITY = {
  type: 'object',
  properties: {
    ...ACTIVITY_SKELETON.properties,
    activity_outcome: {
      type: 'string',
      description:
        'What students must be able to DO by the end of this activity, restating one of the lesson\'s published learning targets in this activity\'s terms. One sentence, observable.',
    },
    outcome_type: {
      type: 'string',
      enum: [
        'formulate_precisely',
        'justify_or_evaluate',
        'connect_representations',
        'interpret_situation',
        'communicate_precisely',
        'generalize_in_writing',
      ],
      description:
        'The language work this outcome demands. Classify by what students must PRODUCE with language, not by the mathematics. ' +
        'formulate_precisely — students must say or write something in accurate mathematical language: naming categories, describing what they notice, stating a relationship. This is the DEFAULT when the main student product is language about mathematics. ' +
        'justify_or_evaluate — students must judge whether something is correct, or defend a claim, and say why. ' +
        'connect_representations — students must relate two or more strategies, representations, or pieces of student work to each other. ' +
        'interpret_situation — students must get through a CONTEXT or WORD PROBLEM, a paragraph of prose or a real-world scenario, before the mathematics can start. Choose this ONLY when there is substantial text to comprehend. Do NOT choose it because students look at an image, sort objects, or notice things — that is formulate_precisely. ' +
        'communicate_precisely — students must convey information to a partner who CANNOT SEE what they hold, so wording alone carries the meaning. Choose this ONLY when the materials genuinely divide between partners. If students simply share or present finished work to others, that is connect_representations. ' +
        'generalize_in_writing — students must state a general rule in their own written words.',
    },
    flawed_sample_provided: {
      type: 'boolean',
      description: 'A wrong answer, incorrect statement, or flawed sample is PRINTED in the student materials.',
    },
    error_harvestable: {
      type: 'boolean',
      description: 'The activity has a pause, check-in, or circulate step where the teacher could capture a real student error.',
    },
    splittable_materials: {
      type: 'boolean',
      description: 'The materials divide into parts (e.g. two columns of cards) such that neither partner could complete the task alone.',
    },
    student_products_differ: {
      type: 'boolean',
      description: 'Students produce visibly different work from one another — different data, objects, or displays.',
    },
    public_share_step: {
      type: 'boolean',
      description: 'The activity ends with sharing, presenting, or displaying work to others.',
    },
    frames_already_printed: {
      type: 'boolean',
      description: 'Sentence frames or starters are already printed in the student materials for this activity.',
    },
    context_word_count: {
      type: 'integer',
      description: 'Approximate number of words of contextual prose a student must read in this activity. Symbolic-only tasks are near zero.',
    },
  },
  required: [
    ...ACTIVITY_SKELETON.required,
    'activity_outcome',
    'outcome_type',
    'flawed_sample_provided',
    'error_harvestable',
    'splittable_materials',
    'student_products_differ',
    'public_share_step',
    'frames_already_printed',
    'context_word_count',
  ],
} as const;

/* ---------------------------- Pass 0: anchor ---------------------------- */
// meta is all-strings here on purpose. Gemini emitted grade/unit/lesson_number
// as NUMBERS in half the baseline runs, which renders as "6 · 2 · 1" in the
// header and makes the exported .dsst fail validateLessonData on re-import.
export const ANCHOR_SCHEMA = {
  type: 'object',
  properties: {
    meta: {
      type: 'object',
      properties: {
        grade: { type: 'string' },
        unit: { type: 'string' },
        lesson_number: { type: 'string' },
        lesson_title: { type: 'string' },
        total_time: { type: 'string' },
      },
      required: ['grade', 'unit', 'lesson_number', 'lesson_title', 'total_time'],
    },
    destination: {
      type: 'string',
      description:
        'MUST begin with the exact words "Students can" followed by an observable verb. Never "Students understand" — the Quick Read card renders this under the eyebrow "By the end of the lesson, students can", so any other opening reads as a stutter.',
    },
    activities: { type: 'array', items: ANCHOR_ACTIVITY, minItems: 3 },
  },
  required: ['meta', 'destination', 'activities'],
} as const;

/* --------------------------- Pass A: structure --------------------------- */
const FRICTION_POINT = {
  type: 'object',
  properties: {
    description: { type: 'string' },
    type: { type: 'string', enum: ['math', 'language', 'language-math'] },
    mlr: MLR_REF,
  },
  required: ['description', 'type'],
} as const;

const FULL_ACTIVITY = {
  type: 'object',
  properties: {
    ...ACTIVITY_SKELETON.properties,
    function_summary: { type: 'string' },
    synthesis_prompt: { type: 'string' },
    friction_points: { type: 'array', items: FRICTION_POINT, minItems: 2 },
    success_signals: { type: 'array', items: { type: 'string' }, minItems: 2 },
    teacher_moves: {
      type: 'array',
      items: {
        type: 'object',
        properties: { text: { type: 'string' }, mlr: MLR_REF },
        required: ['text'],
      },
      minItems: 2,
    },
    causal_link: { type: 'string' },
    extension: { type: 'string' },
    avoid_guidance: { type: 'string' },
  },
  required: [
    ...ACTIVITY_SKELETON.required,
    'function_summary',
    'synthesis_prompt',
    'friction_points',
    'success_signals',
    'teacher_moves',
  ],
} as const;

export const PASS_A_SCHEMA = {
  type: 'object',
  properties: {
    arc_statement: { type: 'string' },
    key_vocabulary: {
      type: 'array',
      items: {
        type: 'object',
        properties: { term: { type: 'string' }, definition: { type: 'string' } },
        required: ['term', 'definition'],
      },
      minItems: 2,
    },
    activities: { type: 'array', items: FULL_ACTIVITY, minItems: 3 },
    adaptation_guardrails: {
      type: 'object',
      properties: {
        mathematical_purpose: { type: 'string' },
        safe_to_change: { type: 'array', items: { type: 'string' }, minItems: 3 },
        do_not_remove: {
          type: 'array',
          items: {
            type: 'object',
            properties: { text: { type: 'string' }, mlr: MLR_REF },
            required: ['text'],
          },
          minItems: 3,
        },
        rigor_check: { type: 'string' },
        by_proficiency: {
          type: 'object',
          properties: {
            emerging: {
              type: 'object',
              properties: { text: { type: 'string' }, mlr: MLR_REF },
              required: ['text'],
            },
            developing: {
              type: 'object',
              properties: { text: { type: 'string' }, mlr: MLR_REF },
              required: ['text'],
            },
            expanding: {
              type: 'object',
              properties: { text: { type: 'string' }, mlr: MLR_REF },
              required: ['text'],
            },
          },
          required: ['emerging', 'developing', 'expanding'],
        },
      },
      required: [
        'mathematical_purpose',
        'safe_to_change',
        'do_not_remove',
        'rigor_check',
        'by_proficiency',
      ],
    },
    lesson_synthesis: {
      type: 'object',
      properties: {
        prompt: { type: 'string' },
        builds_on: { type: 'array', items: { type: 'string' }, minItems: 3 },
      },
      required: ['prompt', 'builds_on'],
    },
  },
  required: ['arc_statement', 'key_vocabulary', 'activities', 'adaptation_guardrails', 'lesson_synthesis'],
} as const;

/* ---------------------- Pass B: MLR + ELSF inference ---------------------- */
// mlrs is pinned to exactly 2 per activity. The baseline produced 7 distinct
// assignment maps across 8 runs; fixing the count removes one of the two
// degrees of freedom. Which routines get picked is still the model's call —
// making that deterministic is a separate change (map it from elsf_inference
// in code rather than generating it).
const ELSF_GUIDELINE_LIST = {
  type: 'array',
  items: { type: 'integer', minimum: 1, maximum: 15 },
  minItems: 2,
} as const;

export const PASS_B_SCHEMA = {
  type: 'object',
  properties: {
    mlr_inference: {
      type: 'object',
      properties: {
        activities: {
          type: 'array',
          minItems: 3,
          items: {
            type: 'object',
            properties: {
              activity_id: { type: 'string' },
              language_work: { type: 'string' },
              mlrs: {
                type: 'array',
                minItems: 2,
                items: {
                  type: 'object',
                  properties: {
                    number: { type: 'integer', minimum: 1, maximum: 8 },
                    name: { type: 'string' },
                    why_here: { type: 'string' },
                  },
                  required: ['number', 'name', 'why_here'],
                },
              },
            },
            required: ['activity_id', 'language_work', 'mlrs'],
          },
        },
      },
      required: ['activities'],
    },
    elsf_inference: {
      type: 'object',
      properties: {
        activities: {
          type: 'array',
          minItems: 3,
          items: {
            type: 'object',
            properties: {
              activity_id: { type: 'string' },
              language_demands: {
                type: 'object',
                properties: {
                  receptive: { type: 'string' },
                  productive: { type: 'string' },
                  interactive: { type: 'string' },
                  everyday_to_academic_bridge: { type: 'string' },
                  elsf_guidelines_applied: ELSF_GUIDELINE_LIST,
                },
                required: [
                  'receptive',
                  'productive',
                  'interactive',
                  'everyday_to_academic_bridge',
                  'elsf_guidelines_applied',
                ],
              },
              functional_language: {
                type: 'object',
                properties: {
                  language_functions: {
                    type: 'array',
                    items: { type: 'string' },
                    minItems: 2,
                  },
                  example_phrases: {
                    type: 'array',
                    items: { type: 'string' },
                    minItems: 2,
                  },
                  l1_bridge: { type: 'string' },
                  elsf_guidelines_applied: ELSF_GUIDELINE_LIST,
                },
                required: ['language_functions', 'example_phrases', 'elsf_guidelines_applied'],
              },
            },
            required: ['activity_id', 'language_demands', 'functional_language'],
          },
        },
      },
      required: ['activities'],
    },
  },
  required: ['mlr_inference', 'elsf_inference'],
} as const;

/* ----------------------- Pass C: anticipated thinking ---------------------- */
export const PASS_C_SCHEMA = {
  type: 'object',
  properties: {
    anticipated_thinking: {
      type: 'object',
      properties: {
        orientation: { type: 'string' },
        activities: {
          type: 'array',
          minItems: 3,
          items: {
            type: 'object',
            properties: {
              activity_id: { type: 'string' },
              patterns: {
                type: 'array',
                minItems: 3,
                items: {
                  type: 'object',
                  properties: {
                    label: { type: 'string' },
                    frequency: {
                      type: 'string',
                      enum: ['most students', 'some students', 'watch for this'],
                    },
                    type: {
                      type: 'string',
                      enum: ['on-track', 'misconception', 'partial', 'extension', 'language-math'],
                    },
                    description: { type: 'string' },
                    move: { type: 'string' },
                    is_mll_specific: { type: 'boolean' },
                    mlr: MLR_REF,
                  },
                  required: [
                    'label',
                    'frequency',
                    'type',
                    'description',
                    'move',
                    'is_mll_specific',
                  ],
                },
              },
              sentence_frames: {
                type: 'array',
                minItems: 2,
                items: {
                  type: 'object',
                  properties: { frame: { type: 'string' }, mlr: MLR_REF },
                  required: ['frame'],
                },
              },
              questions_to_listen_for: {
                type: 'array',
                items: { type: 'string' },
                minItems: 2,
              },
            },
            required: ['activity_id', 'patterns', 'sentence_frames', 'questions_to_listen_for'],
          },
        },
      },
      required: ['orientation', 'activities'],
    },
  },
  required: ['anticipated_thinking'],
} as const;

/* -------------------- Pass D: decision guide + wristband ------------------- */
// Every tile requires an `mlr`. Chip coverage was the least stable thing in the
// baseline — 8 distinct placement maps across 8 runs, 2-4 tiles per run with no
// chip at all — and chips-at-the-point-of-need is the thing the IM reviewers
// validated on 2026-06-01.
const WRISTBAND_TILE = {
  type: 'object',
  properties: {
    observation_short: { type: 'string' },
    friction_type: { type: 'string', enum: ['math', 'language', 'language-math'] },
    mlr: MLR_REF,
    move_short: { type: 'string' },
    avoid_short: { type: 'string' },
    is_crux_moment: { type: 'boolean' },
    has_proficiency_variants: { type: 'boolean' },
    glyph_observation: { type: 'string' },
    glyph_move: { type: 'string' },
  },
  required: ['observation_short', 'friction_type', 'mlr', 'move_short'],
} as const;

// decision_guide is FLAT here — one scenarios[] array, each entry carrying its
// own activity_id — rather than activities[] -> scenarios[]. Removing that array
// level is what brings the schema under the complexity ceiling described at the
// top of this file. normalizeLesson's regroupScenarios() re-nests it, so nothing
// downstream sees the flat shape.
// Pass D was split into two calls (D1 decision guide, D2 wristband). Combined,
// its schema was rejected even after flattening decision_guide — the
// proficiency_moves object tree alone pushes it past the ceiling. Split, each
// half validates, and the wristband half is the one that matters most: it is
// where the MLR chips live.
//
// D1 keeps decision_guide FLAT — scenarios[] each carrying activity_id — which
// normalizeLesson's regroupScenarios() re-nests into the grouped shape
// everything downstream expects.
//
// flat_move / proficiency_moves must be spelled out in full. Declaring them as
// free-form `{ type: 'object' }` type-checks and validates, but constrained
// decoding then emits an empty `{}` — there are no properties to fill — which
// silently drops every proficiency move in the decision guide.
export const PASS_D1_SCHEMA = {
  type: 'object',
  properties: {
    decision_guide: {
      type: 'object',
      properties: {
        scenarios: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              activity_id: { type: 'string' },
              scenario_type: {
                type: 'string',
                enum: [
                  'common-error',
                  'productive-insight',
                  'on-track',
                  'partial-understanding',
                  'productive-struggle',
                ],
              },
              label: { type: 'string' },
              interpretation: { type: 'string' },
              is_mll: { type: 'boolean' },
              flat_move: TEACHER_MOVE,
              proficiency_moves: PROFICIENCY_MOVES,
              mll_framework_note: { type: 'string' },
              mlr: MLR_REF,
              proficiency_divergence_note: { type: 'string' },
            },
            required: ['activity_id', 'scenario_type', 'label', 'interpretation', 'is_mll'],
          },
        },
      },
      required: ['scenarios'],
    },
  },
  required: ['decision_guide'],
} as const;

// `mlr` is required on every tile. Chip placement was the least stable thing in
// the 2026-08-19 baseline — 8 distinct maps across 8 runs, 2-4 tiles per run
// with no chip at all — and chips-at-the-point-of-need is what the IM reviewers
// validated on 2026-06-01.
export const PASS_D2_SCHEMA = {
  type: 'object',
  properties: {
    wristband: {
      type: 'object',
      properties: {
        arc_one_line: { type: 'string' },
        preflight: { type: 'array', items: { type: 'string' }, minItems: 3 },
        top_signals: { type: 'array', items: { type: 'string' }, minItems: 3 },
        top_frictions: { type: 'array', items: { type: 'string' }, minItems: 3 },
        activities: {
          type: 'array',
          minItems: 3,
          items: {
            type: 'object',
            properties: {
              activity_id: { type: 'string' },
              tiles: { type: 'array', items: WRISTBAND_TILE, minItems: 2 },
              synthesis_short: { type: 'string' },
            },
            required: ['activity_id', 'tiles', 'synthesis_short'],
          },
        },
        mlr_legend: {
          type: 'array',
          minItems: 3,
          items: {
            type: 'object',
            properties: { mlr: MLR_REF, one_line_cue: { type: 'string' } },
            required: ['mlr', 'one_line_cue'],
          },
        },
        lesson_synthesis_short: { type: 'string' },
      },
      required: [
        'arc_one_line',
        'preflight',
        'top_signals',
        'top_frictions',
        'activities',
        'mlr_legend',
        'lesson_synthesis_short',
      ],
    },
  },
  required: ['wristband'],
} as const;

export const PASS_SCHEMAS: Record<string, unknown> = {
  anchor: ANCHOR_SCHEMA,
  A: PASS_A_SCHEMA,
  B: PASS_B_SCHEMA,
  C: PASS_C_SCHEMA,
  D1: PASS_D1_SCHEMA,
  D2: PASS_D2_SCHEMA,
};
