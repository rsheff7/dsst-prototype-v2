# OUTPUT JSON SHAPE

The JSON has this shape. elsf_inference MUST be the FIRST field. mlr_inference SECOND. wristband MUST be the LAST field.

{
  "elsf_inference": {
    "activities": [{
      "activity_id": "1.1",
      "language_demands": {
        "receptive": "string — what students must read or listen to to engage the task",
        "productive": "string — what students must say or write to demonstrate their thinking",
        "interactive": "string — the back-and-forth language work that happens with peers",
        "everyday_to_academic_bridge": "string — where students' informal/home language sits in relation to the academic register the task requires",
        "elsf_guidelines_applied": [array of 1-15 numbers — which ELSF guidelines informed this; most relevant for language demands: 1, 2, 6]
      },
      "functional_language": {
        "language_functions": ["string — 2-4 functions students must use (explain reasoning, describe a relationship, compare quantities, etc.)"],
        "example_phrases": ["string — 2-4 concrete academic English forms students need to produce"],
        "l1_bridge": "string or null — where home language or everyday English can be leveraged",
        "elsf_guidelines_applied": [array of 1-15 numbers — most relevant for functional language: 1, 3, 7, 12]
      }
    }]
  },
  "mlr_inference": {
    "activities": [{
      "activity_id": "1.1",
      "language_work": "string — 1-2 sentences naming the kind of language work students do in this activity. Plain.",
      "mlrs": [{
        "number": 1-8,
        "name": "string — the routine's full name",
        "why_here": "string — 1-2 sentences explaining why THIS routine fits THIS activity, referencing the specific student behavior or prompt. This is what teachers see when they tap a chip — make it concrete."
      }]
    }]
  },
  "meta": { "grade", "unit", "lesson_number", "lesson_title", "total_time" },
  "arc_statement": "string — a short narrative paragraph (3-4 sentences) telling the story of the lesson: where students start, where they shift, where the math has to land, where it resolves. Concrete and plain.",
  "destination": "string — 1-2 sentences in plain language naming what students should understand by end of lesson",
  "key_vocabulary": [{ "term", "definition" }],
  "activities": [{
    "id": "1.1",
    "title": "string — the activity's heading as it appears in the source lesson, verbatim. Use the exact wording from the document (e.g., 'Warm-Up: What Kind and How Many?', 'Activity 1: The Teacher's Collection', 'Lesson Synthesis', 'Cool-Down: Sharing Diagrams'). Preserve the slot label followed by the heading the document uses. Do NOT paraphrase. If no heading exists, use the slot label alone.",
    "function": "Setup | Crux | Application | Synthesis",
    "duration": "~X min",
    "grouping": "Whole group | Small groups | Individual | Partners",
    "language_demand": "low | medium | high",
    "function_summary": "string — 2-3 sentences explaining what this activity is FOR in the lesson.",
    "learning_target": "string — 1 sentence in 'Students ___' voice naming what students will be able to do by the end of THIS activity. Concrete and observable. Aligns to but is narrower than the lesson destination.",
    "synthesis_prompt": "string — 1-2 sentences telling the teacher how to close THIS activity by pointing back to the activity's learning_target. Pattern: 'Synthesize toward [the learning_target] by [a concrete, lesson-specific move]'. Name the specific mathematical idea, the specific student work to surface, the specific question to ask. Must use this lesson's actual content (ratios, equivalent ratios, double number lines, the specific scenario in this lesson, etc.). NEVER generic like 'have students share what they learned' or 'reflect on the learning target' — those phrases are forbidden.",
    "is_crux": boolean,
    "friction_points": [{
      "description": "string — what the teacher will see",
      "type": "math | language | language-math",
      "mlr": { "number": 1-8, "name": "string" } or omit — REQUIRED when type is 'language' or 'language-math'; omit when type is 'math'
    }],
    "success_signals": ["string — observable signs the math is landing"],
    "teacher_moves": [{
      "text": "string — positioning move written as the routine in action when MLR-anchored; concrete and specific. NEVER generic.",
      "mlr": { "number": 1-8, "name": "string" } or omit — include only when this move executes a specific MLR
    }],
    "causal_link": "string or null — if this activity depends on or sets up another, name the dependency",
    "extension": "string or null"
  }],
  "adaptation_guardrails": {
    "mathematical_purpose": "string — what this lesson is fundamentally teaching, mathematically. Non-negotiable.",
    "safe_to_change": ["string"],
    "do_not_remove": [{
      "text": "string — a non-negotiable element. When the non-negotiable IS an MLR (e.g., 'Do not remove the partner share — without it, students never hear the precise language'), anchor it to the routine.",
      "mlr": { "number": 1-8, "name": "string" } or omit
    }],
    "rigor_check": "string — one specific question",
    "by_proficiency": {
      "emerging": { "text": "string — concrete move for Emerging ELs (ELSF proficiency level: limited receptive and productive English; need substantial nonverbal scaffolding and home-language bridges)", "mlr": { "number", "name" } or omit },
      "developing": { "text": "string — concrete move for Developing ELs (ELSF level: beyond newly-emerging; can use learned phrases; need continued targeted language support)", "mlr": { "number", "name" } or omit },
      "expanding": { "text": "string — concrete move for Expanding ELs (ELSF level: can communicate appropriately for task; refining academic English; need lighter linguistic supports)", "mlr": { "number", "name" } or omit }
    }
  },
  "anticipated_thinking": {
    "orientation": "string — 2 sentences orienting the teacher to the dominant pattern of student thinking for THIS lesson. Asset-based. Name what students will bring AND where their thinking will most likely take work.",
    "activities": [{
      "activity_id": "1.1",
      "patterns": [{
        "label": "string — short name",
        "frequency": "most students | some students | watch for this",
        "type": "on-track | misconception | partial | extension | language-math",
        "description": "string — what the teacher will see",
        "move": "string — what to do. When the pattern is MLL-specific (is_mll_specific: true), the move text MUST walk through the routine's actual steps for THIS specific pattern. Not 'use MLR 1'; instead 'Have them share the response with their elbow partner. Their partner asks: how do you know? Then write a stronger version that uses what they heard.'",
        "is_mll_specific": boolean,
        "mlr": { "number": 1-8, "name": "string" } or omit — REQUIRED when is_mll_specific is true
      }],
      "sentence_frames": [{
        "frame": "string — a fillable frame",
        "mlr": { "number": 1-8, "name": "string" } or omit — include when this frame is associated with a specific routine (e.g., MLR 1 first-draft/stronger-draft frames, MLR 8 discussion frames)
      }],
      "questions_to_listen_for": ["string"]
    }]
  },
  "decision_guide": {
    "activities": [{
      "activity_id": "1.1",
      "scenarios": [{
        "scenario_type": "common-error | productive-insight | on-track | partial-understanding | productive-struggle",
        "label": "string — observable classroom situation, specific",
        "interpretation": "string — 2-3 sentences naming what the observable behavior signals.",
        "is_mll": boolean,
        "flat_move": { "move", "say", "nonverbal", "avoid" } or null,
        "proficiency_moves": { "emerging": {...}, "developing": {...}, "expanding": {...} } or null,
        "mll_framework_note": "string or null — for MLL scenarios, briefly explain how the response adapts across proficiency levels",
        "mlr": { "number": 1-8, "name": "string" } or omit — REQUIRED when is_mll is true; this is the headline routine for the scenario,
        "proficiency_divergence_note": "string or null — when the routine for Emerging/Developing/Expanding meaningfully differs from the headline (e.g., 'For Emerging, this becomes MLR 8 — partner read-aloud carries the work'), name the divergence in prose; otherwise null"
      }]
    }]
  },
  "lesson_synthesis": {
    "prompt": "string — 2-3 sentences telling the teacher how to close the WHOLE lesson by pointing back to the lesson destination. Must consolidate the activity-level syntheses into one coherent landing. Name the specific mathematical idea students should leave holding, the specific student work or representation to surface as the anchor, and one specific question that drives the consolidation. Use this lesson's actual content. NEVER generic.",
    "builds_on": ["string — 2-3 short references (one per activity) showing how this closing builds on what each activity surfaced. Example: 'Activity 1: students named the two quantities' or 'Activity 2: students saw the multiplicative jump'. ~8-14 words each."]
  },
  "wristband": {
    "arc_one_line": "string — the lesson's arc compressed to 8-12 words. Strict.",
    "preflight": ["string — 3-4 pre-class cues a teacher should set up BEFORE the lesson begins (pre-pair students, identify who to call on first, prep displays). 8-12 words each. Pulled from adapt do_not_remove and by_proficiency where relevant."],
    "top_signals": ["string — top 3 signals of strong thinking across the lesson, ~7 words each, strict"],
    "top_frictions": ["string — top 3 frictions across the lesson, ~7 words each, strict"],
    "activities": [{
      "activity_id": "1.1",
      "tiles": [{
        "observation_short": "string — 8-15 words. Name the behavior AND a working diagnostic — what the teacher would also be reading into the moment. Example: 'Numbers flipped — defaulted to bigger-first; missed the word order.' NOT just 'Numbers in wrong order.'",
        "friction_type": "math | language | language-math",
        "mlr": { "number", "name" } or omit,
        "move_short": "string — 18-28 words. The move written as the routine actually running (named MLR mechanics — revoice, wait time, partner share, compare/connect) PLUS why it works (the math gain or the noticing gain). NOT generic advice. Example: 'Read aloud; ask which comes first. MLR 8 read-aloud lets them feel the mismatch without you naming it — they self-correct.'",
        "avoid_short": "string — 4-8 words. The most common over-helping trap a novice teacher falls into for this specific moment. The thing that would undo the move. Example: 'Fixing the order yourself.' or 'Saying great and moving on.'",
        "is_crux_moment": "boolean — true for ONE tile across the entire lesson, on the crux activity, marking the moment that — if missed — the lesson does not land. Usually a productive-insight moment, not an error. Exactly one tile should have this true.",
        "has_proficiency_variants": "boolean — true when this moment's response actually differs by Emerging/Developing/Expanding proficiency (signals the teacher to consult Moves for the side-by-side). Set true for MLL frictions where proficiency_moves are present in the corresponding decision_guide scenario.",
        "glyph_observation": "string — 2-4 word ALL-CAPS compression of the observation for the in-class view. Verb-noun or noun-only. Example: 'NUMBERS FLIPPED' or 'MLL FROZEN AT FRAME'.",
        "glyph_move": "string — 3-6 word verb-first cue for the in-class view. Use middle dots (·) to separate steps. Example: 'READ ALOUD · WHICH FIRST?' or 'POINT ITEM · POINT BLANK'."
      }],
      "synthesis_short": "string — 10-18 words. The activity-close synthesis compressed for the wristband. Verb-first. Names the specific student work to surface AND the specific consolidation question. Lesson-specific. NEVER 'have students synthesize' or 'reflect on learning'. Example: 'Surface the partner's diagram. Ask: where does the 3-to-2 ratio show up?'"
    }],
    "mlr_legend": [{
      "mlr": { "number", "name" },
      "one_line_cue": "string — 5-10 words: how to run the routine, in cue form"
    }],
    "lesson_synthesis_short": "string — 12-22 words. The lesson-close synthesis compressed for the wristband. Names the specific consolidating idea AND one specific anchor (a student strategy, a representation, a key question) the teacher pulls forward. Lesson-specific. Verb-first. NEVER generic reflection language."
  }
}

# CONTENT RULES

- mlr_inference comes first. Everything else must be consistent with it.
- Be specific to THIS lesson. Concrete observable behaviors and concrete responses. Never generic advice.
- Across every activity, produce a mix of scenarios in the decision_guide — NOT just errors. Include 1-2 common-error scenarios, 1 productive-insight, 1 on-track, and at least 1 productive-struggle or partial-understanding per activity. Total ~10-12 scenarios across the lesson.
- For MLL scenarios (is_mll: true), proficiency_moves must have all three (emerging, developing, expanding), each with a complete move. Emerging nonverbal field must be populated with a concrete physical action. Other proficiency levels may have nonverbal: null.
- For non-MLL scenarios (is_mll: false), use flat_move and set proficiency_moves: null and mll_framework_note: null.
- Every MLR-anchored item's move text must be execution-faithful. A teacher reading it should be running the routine, not learning about it.
- The "avoid" line on each move names the over-scaffolding traps a novice teacher would fall into.
- is_crux: exactly one activity should have is_crux: true.
- wristband: each tile and each legend entry must respect its word limit. If a thought needs more words, it does not belong on the wristband.
- wristband.activities should have 2-3 tiles per activity, max. The wristband is curated, not exhaustive.
- wristband.mlr_legend should list the 2-3 routines this lesson runs on most heavily, not all 8.
- Use plain language throughout. Asset-based throughout. No deficit framing.

# SYNTHESIS PROMPTS — CRITICAL

Synthesis is the move teachers skip most. The tool exists in part to make synthesis pronounced and hard to skip. These rules are non-negotiable:

1. EVERY activity must have a synthesis_prompt. It is the activity's closing landing, written as a directive to the teacher.
2. EVERY synthesis_prompt must reference the activity's own learning_target by content (not by the phrase "learning target") and tell the teacher how to drive students there. Pattern: "Synthesize toward [the specific math idea from the learning target] by [a specific lesson-grounded move]."
3. LESSON-SPECIFIC LANGUAGE ONLY. Use the actual quantities, terms, scenarios, representations, and student work patterns from THIS lesson. If the synthesis_prompt could be pasted into a different lesson without editing, it has failed.
4. FORBIDDEN PHRASES in any synthesis field (activity-level, lesson-level, or wristband short forms). Do not write: "have students share what they learned", "reflect on the learning target", "ask students what they noticed", "synthesize the activity", "wrap up the lesson", "discuss what was learned", "review the key idea", "students summarize their learning". These are the generic reminders the tool is designed to replace.
5. The lesson_synthesis must consolidate the activity-level syntheses into one landing. Reference what each activity surfaced (via builds_on) and name the specific representation, student strategy, or pivotal question that anchors the close. The lesson_synthesis prompt is what the teacher actually says or does at lesson close — concrete and lesson-grounded.
6. WRISTBAND SHORT FORMS (synthesis_short per activity, lesson_synthesis_short for the lesson) are the in-class compressions. They MUST stay verb-first, MUST name a specific student work or question, and MUST follow the same lesson-specific rule. They are NOT generic placeholders that hand off to the robust view.
7. Cohesion: the activity synthesis_prompts and the lesson_synthesis must trace a clear line into the lesson destination. A teacher reading the lesson_synthesis should feel it land BECAUSE the activity syntheses set it up.