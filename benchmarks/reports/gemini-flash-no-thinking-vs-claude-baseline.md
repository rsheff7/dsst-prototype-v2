# Gemini 3.6 Flash (Minimal) vs Claude 3.5 Sonnet — Quality Comparison

**Fixture:** Grade 6, Unit 2, Lesson 2 — Dividing by a Fraction (paint cups, snap cubes, spaghetti sauce)
**Date:** 2026-08-06

## Telemetry Summary

| Metric | Gemini 3.6 Flash (minimal) | Claude 3.5 Sonnet (default) |
|---|---|---|
| Output Tokens | 12,165 | ~8,000+ |
| Thinking Tokens | 0 | N/A |
| Pipeline Wall Clock | 26.6s | Baseline |
| Passes | 5 (anchor + A/B/C/D) | Single pass |
| Format | Free-form prose markdown | Structured DSST JSON |

## Quality Assessment

### Decision Guide

Claude produces extremely dense, highly specific decision guides with `flat_move` plus `proficiency_moves` (emerging/developing/expanding) for every scenario. Each tier includes `say`, `nonverbal`, and `avoid` fields that feel like they were written by someone who has actually stood in a classroom.

Gemini hits the schema keys but the content inside is thinner. Many `proficiency_moves: null` where Claude provided differentiated moves. The moves that do exist tend toward abstraction — "Record student mental strategies side-by-side on the board, drawing explicit arrows" — rather than Claude's grounded specificity: "If students think one sentence is more correct, ask 'Does the diagram change depending on which sentence I write?'"

### Anticipated Thinking Patterns

Claude writes 3–4 patterns per activity covering on-track thinking, common misconceptions, partial understanding, and MLL-specific language-math friction. Every pattern includes a grounded description tied to the lesson's actual content (paint cups, snap cubes, spaghetti sauce).

Gemini produces fewer patterns and they read more generic: "Confuses additive and multiplicative changes" vs Claude's "Students add or subtract instead of multiplying or dividing — treating the numbers as separate counts rather than as factors." The difference is between a label and a diagnostic.

### ELSF Inference (Language Support)

Claude's receptive/productive/interactive language demands are detailed descriptions of what students actually do with the language. Functional language includes 4+ example phrases per activity. L1 bridges name specific language connections — e.g., Spanish "por cada" maps to English "for every."

Gemini's language demands read like dictionary definitions ("Receptive: Read multiple ratio statements") rather than functional descriptions of classroom language use. MLL-specific patterns are fewer and less differentiated by proficiency level.

### Wristband Artifacts

Claude's wristband entries have tight one-liners that function as in-the-moment prompts: "ADDITIVE NOT MULTIPLICATIVE" as a glyph observation, preflight items that read like actual teacher prep notes.

Gemini produces presentable wristband content but it lacks the compression and vividness that makes a wristband card actually useful when you're standing at a whiteboard with 28 students watching you.

### The Core Gap

The higher token count from Gemini is mostly structural verbosity — longer titles ("Warm-Up: 2.1: Number Talk" vs "Number Talk: Dividing by 4"), more boilerplate phrasing in function summaries. It says more words but delivers less signal per token.

**Bottom line:** Gemini minimal thinking gets you to roughly 70% of Claude's quality on this task. The pedagogical reasoning is present, but it lacks the granularity that makes a DSST artifact actually coachable for a teacher in the moment. If we're evaluating whether this model can replace Claude as a baseline, minimal thinking doesn't cut it yet.

## Implications for Next Steps

- Worth running Gemini with LOW or MEDIUM thinking to see if additional reasoning depth closes the gap
- The direct API implementation is working correctly; quality gaps are model/parameter issues, not pipeline bugs
- If higher thinking levels meaningfully improve output density, the 10–15s additional latency per pass may be acceptable