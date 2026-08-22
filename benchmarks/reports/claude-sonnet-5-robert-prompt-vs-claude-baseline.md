# Benchmark Report: Claude Sonnet 5 vs. Claude 3.5 Sonnet (Default)

**Date:** August 19, 2026  
**Fixture:** Grade 6, Unit 2, Lesson 2 — "Representing Ratios with Diagrams" (`benchmarks/fixtures/grade6-u2-l2.pdf`)  
**New model:** `claude-sonnet-5` with Robert Voice prompt  
**Baseline model:** `claude-3.5-sonnet` with default prompt  

---

## Executive Summary

The new model produces a lesson that is structurally identical to the baseline but substantively different in its pedagogical intent. Where the old model taught students to *read and write* ratio language correctly, the new model teaches them to *confront and defend* their own mathematical reasoning against equivalence claims. The shift is from linguistic precision to conceptual confrontation. Total duration expands from ~45 min to ~55 min, driven primarily by a longer Number Talk and Card Sort.

---

## Section-by-Section Comparison

### Destination / Big Idea

| | Baseline (3.5 Sonnet) | New (Sonnet 5 + Robert) |
|---|---|---|
| **Text** | "Students can draw and interpret diagrams that represent ratios, and write multiple correct ratio statements from a single diagram." | "Students understand that a diagram of discrete objects (like snap cubes or circles/squares/triangles) can represent a ratio, and that the same diagram supports multiple correct sentences describing the ratio in different but equivalent ways." |

**Shift:** The baseline frames this as a *skill* (draw, interpret, write). The new version frames it as an *understanding* (the diagram *supports* multiple descriptions; they are *equivalent*). The word "equivalent" is doing real work here — it plants the seed for the crux activity where students must distinguish true from false statements about the same diagram. The new version also names concrete examples (snap cubes, circles, squares, triangles), making the abstraction less opaque.

---

### Arc Statement

Both versions describe the same four-beat structure: warm-up → snap cube drawing → paint mixture (crux) → card sort. The differences are tonal and rhetorical:

- **Baseline** uses formal, slightly abstract language: "sharpening mental multiplication and division—the same multiplicative thinking ratios require," "exposing that word order in a ratio statement matters."
- **New** uses plainer, more student-facing language: "warming up mental math," "the real turn happens with the paint mixture," "some tempting sentences get the numbers or the order wrong."

The new arc reads like something you could say to a teacher at a staff meeting. The baseline reads like a curriculum document. Neither is wrong; they serve different audiences. The new version's use of "the real turn" gives the arc a narrative shape that the baseline's flatter enumeration lacks.

---

### Key Vocabulary

| Term (Baseline) | Term (New) | Change |
|---|---|---|
| ratio | Ratio | Capitalized |
| diagram | Diagram | Capitalized |
| for every | For every | Capitalized |
| ratio statement | **Equivalent ratio statement** | Renamed |

The first three terms have nearly identical definitions (minor wording tweaks). The critical change is the fourth term: **"ratio statement" → "Equivalent ratio statement."** This reframes the vocabulary around the *relationship between* statements rather than the individual statement itself. It tells the student upfront that the point isn't just to produce a sentence, but to recognize when two sentences say the same thing.

Capitalization throughout suggests the new model treats these as proper nouns in the classroom lexicon — a small but consistent stylistic choice.

---

### Activities

| # | Activity | Baseline Duration | New Duration | Delta |
|---|----------|-------------------|--------------|-------|
| 1 | Number Talk: Dividing by 4 and Multiplying by | ~5 min | ~10 min | +5 |
| 2 | A Collection of Snap Cubes | ~10 min | ~10 min | 0 |
| 3 | Blue Paint and Art Paste (crux) | ~15 min | ~15 min | 0 |
| 4 | Card Sort: Spaghetti Sauce | ~12 min | ~15 min | +3 |
| 5 | Lesson Synthesis / Summary | ~3 min | ~5 min | +2 |
| | **Total** | **~45 min** | **~55 min** | **+10** |

The new model gives more time to the warm-up and the application phase. The crux activity stays at 15 minutes in both. The rename from "Lesson Synthesis" to "Lesson Summary" is minor but signals a slightly less formal register.

---

### Adaptation Guardrails

This is where the most consequential divergence appears.

**Baseline "Do Not Remove":**
- Partner talk during the snap cube activity
- The act of writing out ratio statements in full sentences
- The requirement that students explain *why* a statement is true or false

**New "Do Not Remove":**
- The moment where students must confront that a statement that *looks* right can be *wrong* (specifically, the tautological statement that restates the diagram without comparison)
- Student-to-student circulation and challenge of each other's reasoning
- The physical act of matching cards to diagrams (not just verbalizing)

**Interpretation:** The baseline protects *language production* — the habit of writing complete sentences and explaining in words. The new model protects *conceptual confrontation* — the discomfort of discovering your own statement was wrong, and the social process of catching a peer's error. These are genuinely different pedagogical commitments. The baseline worries about whether students will *say* the right thing; the new model worries about whether students will *think* the right thing even when it contradicts what they said first.

---

### Anticipated Thinking (Crux Activity)

This section reveals the deepest difference in how each model understands what students will actually do.

**Baseline (3.5 Sonnet):**
- Predicts students will be "on track" if they correctly identify the ratio from the diagram
- Teacher moves are meta-level: "Circulate and listen for students who can articulate the relationship in words"
- Sentence frames are generic scaffolds: "For every ___, there are ___." / "I think this statement is ___ because ___."

**New (Sonnet 5 + Robert):**
- Predicts a specific, concrete error: students will circulate a tautological statement (e.g., "There are 2 white cups for every 2 white cups") and treat it as valid because the numbers match the diagram
- Teacher moves are physical and diagnostic: "Hold up the tautology card and ask the room: 'Does this tell us anything about the *relationship* between the two quantities?'"
- Sentence frames are structurally mathematical: "This statement compares ___ to itself, so it doesn't tell us about the relationship." / "A ratio statement needs two *different* quantities being compared."

**Why this matters:** The baseline anticipates a *performance* problem (can the student produce the right words?) and responds with encouragement and generic scaffolding. The new model anticipates a *conceptual* error (will the student mistake identity for comparison?) and responds with a targeted intervention that names the exact failure mode. This is a meaningfully better prediction of sixth-grade cognition. Students don't struggle to say "for every 2, there are 2" — they struggle to notice that saying it proves nothing.

---

## Structural Observations

- Both outputs use identical JSON schemas (same top-level keys, same per-activity fields). The Robert prompt does not alter the output format, only the content within it.
- The new model's prose is consistently ~15–20% longer per field. This is not padding; it adds specificity (naming the exact error, the exact card, the exact question). But it does mean the .dsst file is larger and the UI rendering will need to handle longer text blocks.
- The `meta.total_time` field says "~45 min" in both files, but the sum of activity durations in the new file is ~55 min. This is an internal inconsistency in the new output worth flagging.

---

## Recommendations

1. **Adopt the new model's guardrail philosophy.** Protecting conceptual confrontation over language production is the more defensible pedagogical choice for this age group. The baseline's "do not remove partner talk" is fine but generic; the new model's "do not remove the moment students discover their own error" is surgically precise.

2. **Fix the duration mismatch.** Either update `meta.total_time` to reflect the actual sum, or constrain the prompt to keep total ≤ 45 min. As-is, a teacher following the plan would run 10 minutes long without realizing why.

3. **Keep the "Equivalent Ratio Statement" vocabulary rename.** It's a small change that does disproportionate work for the crux activity.

4. **Consider the arc statement register.** If this text surfaces in the teacher-facing UI, the new model's plainer language ("the real turn happens with...") is more usable than the baseline's academic register. If it's for a curriculum alignment document, the baseline may be preferred. Worth deciding which audience the arc serves.

5. **The anticipated thinking section is the strongest differentiator.** This is where the new model demonstrates genuine pedagogical insight beyond template-filling. It should be highlighted in any stakeholder demo.

---

## Appendix: Files Compared

- **New output:** `benchmarks/runs/claude-sonnet-5-robert/output.dsst` (generated 2026-08-20)
- **Baseline output:** `benchmarks/runs/claude-3.5-sonnet-default/output.dsst`
- **Fixture PDF:** `benchmarks/fixtures/grade6-u2-l2.pdf`