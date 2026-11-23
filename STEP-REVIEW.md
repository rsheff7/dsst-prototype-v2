# Step-by-Step UI/UX Review — Planning View

**Branch:** ws-plan-view (merged with main v1.1.0)
**Lesson under review:** 6.3.5
**Date:** November 23, 2026

---

## Step 1: Understand the end goal (4 min)

**Observations:**

1. **Back button (top left):** Good. Standard mobile UI.
2. **Lesson anchor (top):** Good. Unit + title clearly stated for orientation.
3. **House icon (top right):** Tells me "takes me home" but I'm unclear *where* home is. Back to planning overview? Back to lesson selection (one level up)? The icon is generic enough to be ambiguous.
4. **Horizontal progress bar:** Seven segments with a green indicator for current position. I understand its purpose (anchoring in a multi-step process) and its placement (top, persistent). But I'm not sold on horizontal here. We moved the planning overview to vertical because vertical works better on mobile. Having a horizontal bar at the top of the step view feels inconsistent with that decision. Needs discussion.
5. **Step title:** "Understand the end goal" — clear, large, labels the current step. Good.
6. **"The idea" box:** Good hierarchy — bold label, then smaller body copy. But the green text at the bottom ("IM's lesson narrative and goals") reads like a link. It's presumably Illustrative Mathematics' original prose about this lesson. Why is it here? How does it differ from the summary I just read above it? Cognitive friction — I can't tell if I need to engage with it or if it's reference material I can ignore.
7. **"The arc" (activity list):** Three boxes, each with a number (e.g. "5.1"), a title, a type label (Warm-up / Activity / Crux), and a description. Time markers on the left (5m, 15m, 15m). Problems:
   - No tap affordance. The boxes don't look interactive until the caption at the bottom tells me to "Tap any activity for IM's notes."
   - The numbering (5.1, 5.2, 5.3) is unexplained. Is that the day number? The activity index within the lesson?
   - The crux is indicated by a red outline, but nothing says "red = crux" until the caption. The caption does double duty: explaining selectability AND identifying the crux. Too much work for one line of small text.
8. **CTA button (bottom):** "Next: The language objective →". Large, green, prominent. But I'm unclear: is this the next *part* of this step, or the next *step*? The arrow implies forward motion but the label names a different step entirely. If it's a step transition, the button should make that explicit.
9. **Activity overlay (IM notes):** Tapping an activity opens a full-screen overlay. On closer inspection, the content *is* structured into labeled phases: WHAT IT'S FOR, LAUNCH, STUDENT TASK, STUDENT RESPONSE, ACTIVITY SYNTHESIS. But the labels are small, light gray, all-caps — they don't create enough visual contrast against the body copy. A teacher scanning sees a near-continuous text block with faint dividers, not distinct phases they can jump to. The content is organized; it's visually whispering instead of speaking. Also: the overlay header shows "5.1 · 5 MIN" which explains the arc box numbering, but the arc box itself still doesn't telegraph what "5.1" means without opening.
10. **Scope collision — the core problem.** Two unrelated frameworks are presented on one screen without a bridge:
    - The 7 steps = DSST's planning process (the tool's own structure)
    - 5.1–5.3 = IM's lesson structure (the content's internal organization)
    
    The teacher arrives oriented around "where am I in the 7-step process?" and immediately encounters "here are 3 activities inside Lesson 5." These answer different questions. One is *how you plan*, the other is *what you're planning*. The step never makes that distinction explicit.
    
    "The idea" copy mentions "Lesson 5" but buries it in descriptive prose. A teacher skimming for orientation won't parse that as a signal that the boxes below are activities-within-the-lesson rather than sub-steps-of-this-planning-step.
    
    This is an information architecture problem, not a styling problem. Every other observation on this step (#4, #6, #7) is a downstream symptom of this missing bridge.
11. **"The arc" needs a framing sentence.** Before the 3 activity boxes, there should be an explicit transition that says something like: "This lesson has 3 activities. Here's what each does and how long it runs." That one sentence resolves the mapping confusion. Without it, the teacher has to reverse-engineer the relationship between the 7-step process they were tracking and the 3 boxes they're now seeing.

**Decisions / actions:**

| # | Item | Direction |
|---|------|-----------|
| 3 | House icon | Clarify destination. Either add a tooltip/label or replace with a back-to-unit action that's unambiguous. |
| 4 | Progress bar orientation | Discuss: horizontal vs. vertical in step view. If we keep horizontal, justify the inconsistency with the overview page. If vertical, it eats vertical space on a phone. |
| 6 | "IM's lesson narrative" link | Decide: is this reference material the teacher needs? If yes, make the relationship to the summary explicit ("Full context" or "Why this lesson exists"). If no, remove or collapse. |
| 7 | Arc boxes — tap affordance | Add visual signal that boxes are tappable (chevron, subtle border change on press, or "tap for notes" microcopy on each box). Don't rely on a single caption line. |
| 7 | Arc numbering | Explain or remove the 5.1/5.2/5.3 numbers. If they're IM's internal card IDs, they're noise for the teacher. |
| 7 | Crux identification | The red outline + double-duty caption is doing too much. Consider: label the crux box explicitly ("This is your crux") and separate the "tap for notes" instruction. |
| 8 | CTA ambiguity | If it transitions to a new step, say so. "Next step: The language objective →" or use a distinct visual treatment for step-boundary CTAs vs. in-step actions. |
| 9 | IM notes overlay | The structure exists (phased labels) but is visually flat. Fix: increase label size/weight/contrast so phases are scannable at a glance. Consider a left border or background tint per section. The content is already organized — it just needs to *look* organized. Lower priority than I initially thought; this is a styling pass, not a content redesign. |
| 10 | Scope collision (steps vs. activities) | **Highest priority.** This step conflates the planning process structure with the lesson content structure. Needs an explicit bridge: either (a) a framing sentence before "The arc" that names the relationship ("This lesson breaks into 3 activities..."), or (b) restructure the step so "The idea" clearly scopes to the lesson while "The arc" is visually separated as a different kind of content. Until this is resolved, all other fixes on this step are cosmetic. |
| 11 | Arc framing sentence | Add one line before the boxes: "This lesson has 3 activities. Here's what each does and how long it runs." Cheap fix, high clarity payoff. Solves the "how do these map to the 7 steps?" confusion. |

---

## Step 2: The language objective (5 min)

**Observations:**

**Decisions / actions:**

---

## Step 3: Do the cool-down (5 min)

**Observations:**

**Decisions / actions:**

---

## Step 4: Choose activities (1 min)

**Observations:**

**Decisions / actions:**

---

## Step 5: Rehearse (10 min)

**Observations:**

**Decisions / actions:**

---

## Step 6: Lesson synthesis (3 min)

**Observations:**

**Decisions / actions:**

---

## Step 7: Carry it (2 min)

**Observations:**

**Decisions / actions:**

---

## Cross-cutting notes

(Anything that applies across multiple steps: navigation, spacing, typography, state persistence, etc.)

**Server persistence:** Current state is localStorage-only (`usePlanState` hook, keyed `dsst-plan:{lesson}`). All fields in `PlanState` (view, step, completed, levels, extra, clo, cool, synth, shown, said, ticks, flags, cells) will need server-backed equivalents when accounts land. Audit deferred until Robert's auth infrastructure is scoped — see daily status Nov 23.