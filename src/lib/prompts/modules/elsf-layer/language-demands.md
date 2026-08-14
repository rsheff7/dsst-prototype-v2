# THE ELSF LANGUAGE LAYER (ADDITIONAL REASONING)

ELSF — the English Learners Success Forum Guidelines for Improving Math Materials for English Learners — is an ADDITIONAL reasoning layer that sharpens two specific things in your guidance:

  1. Identifying the key LANGUAGE DEMANDS of each activity.
  2. Surfacing the FUNCTIONAL LANGUAGE students need to engage the task.

ELSF does NOT replace the MLR layer; it deepens the language reasoning that downstream guidance (friction points, proficiency adaptations, sentence frames) draws on. The two layers work together: ELSF diagnoses what language work an activity demands; MLRs name the response vocabulary the teacher uses for language-rich moments.

For each activity in the lesson, you must produce an elsf_inference entry with two structured blocks.

LANGUAGE_DEMANDS — name the kinds of language work the activity requires:
  - receptive: what students must read, listen to, or interpret to engage the task
  - productive: what students must say or write to demonstrate their thinking
  - interactive: what back-and-forth language work happens with peers
  - everyday_to_academic_bridge: where students' informal/home language sits in relation to the academic register the task requires (this IS the bridge ELSF Guideline 1c and 6c name explicitly)
  - elsf_guidelines_applied: which of the 15 ELSF guideline numbers informed this reasoning (most relevant for this lens: 1, 2, 6 — but you may cite others)

FUNCTIONAL_LANGUAGE — name the specific language students must USE:
  - language_functions: 2-4 functions (e.g., "explain reasoning", "describe a relationship", "compare quantities", "justify a conjecture", "translate between forms"). These are FUNCTIONS, not topics.
  - example_phrases: 2-4 concrete academic English forms students need to PRODUCE. Distinct from the sentence_frames field elsewhere — these are the forms; sentence_frames are the scaffolds.
  - l1_bridge: 1-2 sentences naming where home language or everyday English can be leveraged; null if not applicable
  - elsf_guidelines_applied: which ELSF guideline numbers (most relevant for this lens: 1, 3, 7, 12)

The ELSF reasoning must inform what you produce downstream. Specifically:
  - by_proficiency adaptations should reflect the bridge each level needs (Emerging students need more receptive scaffolding; Expanding students need finer functional-language work)
  - sentence_frames should match the functional language identified
  - friction_points should cite the receptive/productive/interactive demand they sit at
  - the orientation card in anticipated_thinking should reflect the everyday-to-academic bridge at the lesson level

REASONING ORDER: elsf_inference MUST be the FIRST field in your output. mlr_inference SECOND. Everything else flows from those two named layers.

${ELSF_GUIDELINES}

