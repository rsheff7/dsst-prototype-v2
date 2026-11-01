# Gemini 3.6 Flash (Aug 3) vs Gemini 3.6 Pro — Quality Comparison

**Fixture:** Grade 6, Unit 2, Lesson 2 — Representing Ratios with Diagrams (Open Up Resources), 45 min, 4 activities
**Date:** 2026-08-22

## What We Compared

Two runs of the same lesson through the DSST pipeline: a Flash run from August 3 and a Pro run completed today. Both produced complete, valid lesson plans for all four activities.

| | **Gemini Flash** | **Gemini Pro** |
|---|---|---|
| Run date | Aug 3 | Aug 22 (today) |
| Model | gemini-3.7-flash | gemini-3.1-pro-preview |
| Thinking setting | default | medium |
| Total time to finish | ~2 min 10 sec | ~1 min 9 sec |
| File size | 58 KB | 45 KB |
| Output file | `benchmarks/runs/gemini-3.6-flash-default/output.dsst` | `benchmarks/runs/gemini-3.6-pro-default/lesson-plan-2026-08-22.dsst` |

### Important caveat

These are not a perfectly controlled head-to-head test. The Flash run was done about three weeks ago under an older version of our prompts, and the two models use different thinking settings. Treat this comparison as a useful read on what each model tends to produce, not an exact scientific A/B. If we need precision, rerun both models today with identical settings.

## Verdict at a Glance

**Pro is faster than Flash and more focused.** Flash writes *more* — larger files, extra detail in every section — but that extra volume is not all signal. In the single most important part of the plan (the core teaching moment), Pro makes the sharper call.

## Where They Land on the Bigger Picture

Both models nailed the structural big picture identically:

- Same lesson destination statement (in slightly different words)
- Same identification of activity 2.3 — the blue paint task — as the crux, where the day's real learning happens
- All four activities present with correct durations, groupings, and language-demand ratings
- Full support scaffolding in place (language analysis, accessibility moves, quick-reference cards, closing synthesis)

This tells us the pipeline is reliable: no missing sections, no malformed output, no crashes. Structurally, you get a complete plan either way.

## Quantity of Detail: Flash Writes More, Pro Cuts Fat

For each activity, the plan includes a list of things students might think or struggle with, plus coaching moves for the teacher. The volume differs:

| Per activity | Flash | Pro |
|---|---|---|
| Vocabulary terms flagged | 3 | 2 |
| Friction points anticipated | 2 | 1 |
| Success signals | 2 | 1 |
| Teacher moves | 2 (with accessibility tags) | 1 |
| Student-thinking patterns | 3 | 2–3 |
| Decision-guide scenarios | 3 (including tiered responses by student ability) | 2–3 (mostly a single response) |

The practical translation: Flash hands the teacher a fuller menu of options per activity — including differentiated moves for emerging, developing, and expanding students — while Pro gives them one carefully chosen move. Flash's approach hedges; Pro's trusts its judgment. For a new teacher working through this lesson for the first time, Flash's extra tiering may be more helpful. For an experienced teacher who wants the essential point without noise, Pro's tighter output reads cleaner.

## The Deciding Factor: Analysis of the Crux (Activity 2.3)

The blue paint task is where this lesson lives or dies. Here the two models diverge meaningfully:

**Flash's take:** The key idea is visually partitioning the paint diagram into equal groups to reveal the unit rate (1 cup white to 3 tablespoons blue). It emphasizes that grouping action throughout — in the planning, the anticipatory analysis, and even the closing synthesis it anchors the lesson on a lemonade powder/water summary diagram.

**Pro's take:** The real trouble spot is *the order of quantities in written sentences*. Students physically see "for every 1 there are 3" but write it backwards when they swap which quantity comes first. Its core insight is specifically about the reversed-order error in one of the seven statements, and its suggested fix is having students trace loops around shapes in the drawing to expose the hidden 1-to-3 groupings inside the bigger 2-to-6 total.

My read: **Pro's version is pedagogically more precise.** The inverted-ratio-order error is a genuinely hard, specific failure mode in this exact lesson, and Pro names it cleanly and gives a matching physical move. Flash's visual-grouping focus is also correct, but it leans on a theme repeated across the whole plan rather than zeroing in on the distinctive difficulty of *this* activity. If you only remember one thing from comparing these, remember this: on the crux, Pro saw further.

One honest counterpoint worth flagging to the team: Pro's closing synthesis references a 2-cup-white-to-6-tablespoons-blue diagram, while the source lesson uses a lemonade example in that slot — a minor drift that Flash actually matched to the original material more faithfully there. Small item, but worth a look before we ship anything.

## Accessibility Scaffolding (Universal Design Moves)

Both models assign standard accessibility supports to moments where students may freeze — discussion framing, chunking long text, collecting and displaying student language, critique-and-correct routines. Neither model invents bogus supports; the assignments track the identified friction points in a sensible way. No meaningful quality difference here between the two.

## Time and Cost Implication

Pro finished in about half the wall-clock time of Flash (~69 seconds versus ~130 seconds) while producing a smaller file. That means the higher-quality model is currently the *faster and cheaper* option on this workload — the opposite of what many people expect when trading up from Flash. For a product where teachers wait for a generated plan, that timing matters directly.

## Bottom Line and Recommendation

**Gemini Pro wins this comparison.** It is faster, smaller on disk, and delivers the sharper pedagogical insight on the lesson's most critical moment. Flash produces a bulkier document with more differentiated scaffolding options per activity, which has real value for newer teachers — so I would not retire Flash outright. A reasonable product posture:

1. **Default to Pro** for plan generation, especially on complex lessons.
2. Keep **Flash available as a fast/cheap option**, and consider surfacing its stronger differentiated-move density wherever the plan includes ability-tiered responses.
3. Before treating this as final proof, rerun both models today with identical settings and prompts to remove the three-week gap noted above. One clean re-run will make the case airtight.

Suggested next step: fold this into the Monday sprint call agenda as the data point behind a "which model do we ship by default" decision.