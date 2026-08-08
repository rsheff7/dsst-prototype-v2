# Gemini 3.6 Flash (Medium Thinking) vs Claude 3.5 Sonnet — Quality Comparison

**Fixture:** Grade 6, Unit 2, Lesson 2 — Representing Ratios with Diagrams (paint cups, snap cubes, spaghetti sauce)
**Date:** 2026-08-07

## Telemetry Summary

| Metric | Gemini 3.6 Flash (medium) | Claude 3.5 Sonnet (default) |
|---|---|---|
| Output Tokens | 13,750 | ~8,000+ |
| Thinking Tokens | 15,963 | N/A |
| Pipeline Wall Clock | 56s | Baseline |
| Passes | 5 (anchor + A/B/C/D) | Single pass |
| Format | Structured DSST JSON | Structured DSST JSON |

## Quality Assessment

### Arc & Destination Statements

Claude's arc statement is a single, dense sentence that captures the lesson's mathematical journey: "Students open by sharpening mental multiplication and division—the same multiplicative thinking ratios require." It shows the *why* behind each activity.

Gemini's arc is more descriptive but reads like a procedural walkthrough: "Students start by drawing simple shape or cube diagrams to represent ratios between two groups of items." The destination statement is functional but lacks the precision of Claude's phrasing.

**Verdict:** Claude's arc statement is something a teacher could actually say to a colleague to explain the lesson in 10 seconds. Gemini's requires re-reading to extract the mathematical purpose.

### Decision Guide (Pass D)

This is where the gap is most visible.

Claude produces extremely dense decision guides with `flat_move` plus `proficiency_moves` (emerging/developing/expanding) for every scenario. Each tier includes `say`, `nonverbal`, and `avoid` fields. The language feels like it was written by someone who has stood in a classroom:

> "If students think one sentence is more correct, ask 'Does the diagram change depending on which sentence I write?'"

Gemini's decision guide has more scenarios overall (11 vs 9) and fills the schema keys, but the content inside is thinner. The moves tend toward abstraction:

> "Record student mental strategies side-by-side on the board, drawing explicit arrows"

Versus Claude's grounded specificity. Gemini also leaves more `proficiency_moves` as null where Claude provided differentiated scaffolding for each level.

**Verdict:** Gemini gets to about 75% of Claude's density. The structure is there, but the coaching precision isn't.

### Anticipated Thinking Patterns

Claude writes 3–4 patterns per activity covering on-track thinking, common misconceptions, partial understanding, and MLL-specific language-math friction. Every pattern includes a grounded description tied to the lesson's actual content (paint cups, snap cubes).

Gemini produces fewer patterns and they read more generic: "Confuses additive and multiplicative changes" vs Claude's "Students add or subtract instead of multiplying or dividing — treating the numbers as separate counts rather than as factors." The difference between a label and a diagnostic.

Medium thinking did improve this slightly from the minimal run — Gemini now includes at least one MLL-specific pattern per activity, where minimal had none. But the descriptions still read like annotations on a rubric rather than observations from a classroom.

**Verdict:** Improvement over minimal, but still not at Claude's diagnostic depth. The patterns are presentable but don't help a teacher anticipate *how* students will think through specific problems.

### ELSF Inference (Language Support)

Claude's receptive/productive/interactive language demands are detailed descriptions of what students actually do with the language. Functional language includes 4+ example phrases per activity. L1 bridges name specific language connections — e.g., Spanish "por cada" maps to English "for every."

Gemini's language demands read more like dictionary definitions: "Receptive: Read multiple ratio statements." Even with medium thinking, the functional language section is thinner and the L1 bridge examples are less specific.

**Verdict:** Gemini's ELSF work is structurally complete but lacks the specificity that makes it useful for actual MLL instruction. Claude wins clearly here.

### Wristband Artifacts

Claude's wristband entries are tight one-liners that function as in-the-moment prompts: "ADDITIVE NOT MULTIPLICATIVE" as a glyph observation, preflight items that read like actual teacher prep notes.

Gemini produces presentable wristband content but it lacks the compression and vividness. The tiles are longer and less actionable — more like mini-scenarios than quick-reference cards you'd actually wear on your wrist.

**Verdict:** Claude's wristband is something you can glance at mid-lesson. Gemini's requires reading a paragraph to extract the signal.

## The Core Gap

The higher token count from Gemini (13,750 vs ~8,000) reflects both the thinking tokens and more verbose output prose. But verbosity is not density.

Medium thinking closed part of the gap from the minimal run — we now get actual thinking tokens (15,963), and the MLL-specific patterns improved. The model is doing *something* with that reasoning time. But the fundamental difference remains: Claude's output reads like a coach wrote it for a teacher who needs to make decisions under pressure. Gemini's reads like a competent analysis of the lesson plan.

**Bottom line:** Gemini medium thinking gets you to roughly 78% of Claude's quality on this task. The pedagogical reasoning is present, but it lacks the granularity that makes a DSST artifact actually coachable for a teacher in the moment. The improvement from minimal → medium is real but modest — mostly in MLL pattern coverage and wristband structure.

## Implications for Next Steps

- Medium thinking helps but doesn't close the quality gap with Claude
- The 56s wall clock (including PDF extraction) is acceptable for benchmarking, but production pipelines would need to optimize pass timing
- If we're evaluating Gemini as a cost-effective alternative, the ~22% quality deficit may be worth the lower API costs — but only if the use case tolerates "good enough" vs "coachable"
- Worth testing with a harder fixture (e.g., a lesson with more MLL scaffolding demands) to see if the gap widens or narrows