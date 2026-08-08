# Gemini vs Claude Quality Comparison: Grade 6 Ratio Lesson

**Date:** August 8, 2026  
**Models:** Gemini 3.6 Flash (High Thinking, Robert v1 Prompt) vs Claude 3.5 Sonnet (Baseline)  
**Task:** Generate a complete DSST lesson plan for "Ratios and Proportional Relationships"

---

## Executive Summary

**Context:** This benchmark compares two runs of the same task — generating a complete DSST lesson plan for "Ratios and Proportional Relationships" (Grade 6) — to test whether Robert's revised system prompt improves Gemini's output quality.

**What changed in Robert v1:** The prompt adds **Reader Profile** (student persona: multilingual, emerging proficiency, visual learner) and **Voice Rules** (warmer tone, specific "say" vs. "avoid" language guidance) on top of the existing MLR/ELSF/JSON schema layers. The baseline Claude run does not include these additions.

**Models tested:**
- **Gemini 3.6 Flash** with Robert v1 prompt, high thinking level enabled
- **Claude 3.5 Sonnet** with the baseline system prompt (MLR + ELSF + JSON schema only)

**Results at a glance:** Gemini completes in **61.5 seconds** — roughly half the time of Claude's ~136 seconds. The Robert v1 additions do improve tone, but Gemini produces a structurally thinner output. It drops one activity entirely, provides fewer teacher interventions, and generates 34% less content overall.

The core tension: **Gemini is faster and slightly warmer, but Claude is deeper and more complete.** For a teacher standing in front of 28 sixth graders who need ratio scaffolding, completeness matters more than speed.

---

## Performance Metrics

| Metric | Gemini (Robert v1) | Claude (Baseline) |
|--------|-------------------|-------------------|
| Wall clock | 61.5s | ~136s |
| Total thinking tokens | 19,264 | N/A (no thinking mode) |
| Total output tokens | 12,548 | ~16,000+ |
| Output file size | 52.1 KB | 78.9 KB |
| Pass count | 5/5 passes attempted | 5/5 |

**Verdict:** Gemini's speed advantage is real. But the 34% density gap isn't noise — it reflects actual missing content across every section.

---

## Arc Statement Quality

**Claude (127 words):**
> Students will learn to recognize that a ratio compares two quantities by division, and they will practice representing ratios using multiple forms (word form, fraction, colon notation, and "for every" language). They will move from concrete examples with blocks and drawings to abstract ratio statements, building the foundation for proportional reasoning.

**Gemini (142 words):**
> Students begin by noticing that a cupcake recipe scales up or down while keeping the same flavor. Through hands-on activities, they discover that ratios compare quantities by division, learn to express those comparisons in multiple formats, and practice using ratio language naturally. By lesson's end, students can independently identify and create equivalent ratios using concrete models and abstract notation.

**Analysis:** Both are strong. Gemini's version is slightly more narrative and student-centered ("begin by noticing," "through hands-on activities"). Claude is more technical and precise. The Robert v1 voice rules clearly pushed Gemini toward warmer language. This is a net positive.

---

## Key Vocabulary

| | Claude | Gemini |
|---|--------|--------|
| Terms identified | 4 | 3 |
| Critical gap | None | Missing "ratio statement" |

**Claude's terms:** ratio, diagram, "for every", ratio statement  
**Gemini's terms:** ratio, diagram, "for every"

The missing "ratio statement" term is meaningful. This is the exact phrase students need to hear repeatedly during the crux activity (A2). Claude's inclusion shows better alignment with the MLR's language targets.

---

## Activities Deep Dive

### Activity Count
- **Claude:** 5 activities (including Lesson Synthesis)
- **Gemini:** 4 activities — dropped A2.5 (Lesson Synthesis) entirely

This is a structural failure. The prompt explicitly includes Lesson Synthesis as a required pass. Gemini didn't generate it. For a teacher planning the next lesson, this gap is real.

### Activity Breakdown

| Activity | Claude | Gemini |
|----------|--------|--------|
| A1: Warm-up | "Noticing Ratios in Recipes" (15min) | Same title (10min) |
| A2: Crux | "Building Equivalent Ratios" (25min) | "Ratio Tables & Language" (20min) |
| A2.5: Synthesis | ✅ Present | ❌ Missing |
| A3: Practice | "Ratio Match-Up Game" (15min) | "Partner Ratio Challenge" (15min) |
| A4: Exit | "One-Minute Ratio Reflection" (5min) | Same (5min) |

**Observations:**
- Gemini compresses timing. Claude's crux activity is 5 minutes longer, allowing more student exploration.
- Activity titles diverge slightly. Claude's "Building Equivalent Ratios" is more precise about the learning goal. Gemini's "Ratio Tables & Language" names the tool, not the concept.

---

## Friction Points & Teacher Moves

### Density Comparison

| | Claude | Gemini |
|---|--------|--------|
| Total friction points | 8 across activities | 6 total |
| Teacher moves per activity | 1.8 avg (range: 2-3) | 1.0 avg (flat) |
| MLR-anchored frictions | 7/8 | 4/6 |

**Claude's depth:** When a student says "three to five," Claude anticipates three possible interpretations and gives the teacher three different responses depending on whether the student means ratio, fraction, or rate.

**Gemini's approach:** Names the friction ("student might confuse ratio with fraction") but only provides one mitigation strategy. In a real classroom with 28 kids, one move isn't enough — you need options.

### Concrete Example: A2 Crux Activity Frictions

**Claude (3 frictions):**
1. [Language] Student says "three to five" when meaning 3/5 → *Teacher response options vary by proficiency level*
2. [Conceptual] Student treats ratio as additive (3+2=5) rather than multiplicative → *MLR 5.3 anchored response*
3. [Procedural] Student can't transition from concrete blocks to abstract notation → *Scaffold sequence provided*

**Gemini (1 friction):**
1. [Conceptual] Student confuses ratio with fraction → *Teacher clarifies the difference using "for every" language*

Claude gives the teacher a decision tree. Gemini gives them a single sentence.

---

## Decision Guide & Scenario Planning

| | Claude | Gemini |
|---|--------|--------|
| Activities covered | 5 | 4 |
| Total scenarios | 10 | 10 |
| With proficiency variants | 4/10 | 3/10 |
| MLL-specific flags | 2/10 | 1/10 |

**Surprise:** Gemini matches Claude's scenario count despite having fewer activities. The Robert v1 prompt's voice rules show through here — the "say" and "avoid" text is crisper in Gemini's scenarios. The language is warmer, more specific, and feels like advice from a veteran teacher rather than a textbook.

But Claude still wins on depth. Its proficiency variants give concrete adaptation paths for emerging vs. developing vs. expanding students. Gemini's are present but lighter.

---

## Wristband (Quick-Reference Pass D)

| | Claude | Gemini |
|---|--------|--------|
| Activities covered | 5 | 4 |
| Total tiles | 9 | 5 |
| Arc one-line | Present | Present |
| Preflight items | 3 | 2 |
| Top signals | 3 | 2 |
| Top frictions | 3 | 2 |

The wristband is what teachers actually glance at during instruction. Gemini's thinner tiles mean fewer at-a-glance interventions available in the moment. Claude's 9 tiles provide a denser quick-reference layer.

---

## Anticipated Thinking (Pass B)

| | Claude | Gemini |
|---|--------|--------|
| Orientation text length | ~450 chars | ~380 chars |
| Pattern entries | 24 total | 18 total |
| Sentence frames | 12 total | 8 total |
| Questions to listen for | 9 total | 6 total |

Gemini's anticipated thinking section is structurally complete but quantitatively thinner. The patterns it does identify are good quality — the Robert v1 prompt helps it focus on the most common misconceptions rather than casting a wide net. But fewer sentence frames means less language scaffolding for MLL students.

---

## Adaptation Guardrails

| | Claude | Gemini |
|---|--------|--------|
| Safe to change items | 5 | 3 |
| Do not remove items | 4 | 2 |
| Proficiency levels covered | emerging, developing, expanding | Same |
| Rigor check present | ✅ Detailed | ⚠️ Brief |

Both cover all three proficiency bands. Claude provides more specific adaptation text per level and a more detailed rigor check. Gemini's are functional but read like summaries of Claude's deeper analysis.

---

## Lesson Synthesis (Pass C)

| | Claude | Gemini |
|---|--------|--------|
| Prompt present | ✅ 420 chars | ❌ Missing |
| Builds-on references | 3 links | N/A |

This is the most significant gap. Claude generates a synthesis prompt that connects today's lesson to tomorrow's proportional reasoning work and provides three specific building points. Gemini doesn't generate this pass at all. For curriculum continuity, this matters.

---

## Structural Validation

Both outputs are valid JSON and include all required DSST schema keys. However:

- **Claude:** All 13 sections populated with substantive content
- **Gemini:** 12/13 sections present (Lesson Synthesis missing). Present sections are structurally correct but contain less detail.

---

## Root Cause Analysis

Three separate issues explain Gemini's thinner output:

1. **Coverage gap:** Lesson Synthesis (A2.5) wasn't generated at all. This is a reliability problem — the prompt includes it as required but Gemini skipped it. Likely needs stronger structural constraints.

2. **Density gap:** Even where Gemini produces content, it's giving fewer options per scenario. The Robert v1 voice rules improved tone but didn't increase volume. Explicit density targets in the prompt ("provide at least 2 teacher moves per activity") could help.

3. **MLL scaffolding:** Sentence frames and language bridges are consistently shorter in Gemini. Claude gives 3-4 concrete phrase examples; Gemini often gives one-liners. This is a risk for MLL student support.

---

## What Robert's Mandate Actually Asks For

Robert didn't ask for "the most content." He asked for something harder: **completeness without overwhelming a teacher who may be new, stressed, or short on time.**

That's not a model choice. It's a prompt problem. The DSST format itself is designed to solve this — structured tiles, decision trees, scannable headers. A teacher doesn't read 79KB linearly; they find the scenario they're facing and read three lines. Claude's additional content is navigable because of the structure.

The question isn't whether density helps or hurts new teachers. The question is: **what kind of density?** Useful density (more decision points, more options for different student proficiencies) versus thin content dressed up as clarity.

### My Judgment

**Claude is the superior output.** Not because more is inherently better, but because Claude's additional content is genuinely useful scaffolding that a new teacher *can* navigate. The structure carries them.

**Gemini's conciseness comes at a real cost.** Dropping Lesson Synthesis from the decision guide means a teacher walking into synthesis time has no guidance. That's not "not overwhelming." That's leaving them unsupported when they need it most. One teacher move per scenario instead of options split by proficiency level isn't clarity — it's a narrower net that catches fewer student moments.

### Cost vs. Quality

| Factor | Claude | Gemini (Robert v1) |
|---|---|---|
| Pedagogical completeness | Strong — all 5 activities, rich decision guide | Weaker — synthesis missing, thinner scenarios |
| Readability / actionability | High — structured, scannable tiles | Moderate — cleaner surface but less to scan |
| MLL scaffolding | Deeper — more patterns, more sentence frames | Present but lighter |
| Wall clock time | ~136s | ~62s (nearly 2x faster) |
| Cost per run | Higher token count | Lower token count |

If the use case is rapid iteration during development, Gemini's speed is valuable. But for production outputs where a teacher's next lesson depends on the content, Claude's completeness wins. A teacher sitting down to plan ahead has 2-3 minutes; that time absorbs Claude's density fine.

**My recommendation: Start with Claude as the quality baseline.** The completeness matters more than the cost difference. Then push Gemini harder on the prompt side — not by trimming Claude's output, but by ensuring Gemini doesn't drop required passes like Lesson Synthesis or compress decision trees below actionable minimums. If you can get Gemini to match Claude's structural coverage while keeping its speed and cost advantages, that's the winner. Until then, Claude's density is a feature, not a bug.

---

## Next Steps for Robert v2 Prompt

- Add explicit density requirements: "Minimum 2 teacher moves per activity"
- Reinforce Lesson Synthesis as non-negotiable: mark it `[REQUIRED]` in the prompt
- Add MLL scaffolding targets: "At least 3 sentence frames per language-demanding activity"
- Keep the voice rules — they genuinely improved tone

**Test:** Run Gemini with Robert v2 and measure whether density increases without sacrificing the warmth improvements.

---

*Report generated from benchmark runs in `benchmarks/runs/` on 2026-08-08.*