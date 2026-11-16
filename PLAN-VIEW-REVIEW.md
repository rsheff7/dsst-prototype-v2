# Planning View — UI Review Notes

Context: Solo teacher prepping for a lesson in under 30 minutes. No coach or peers.
Reviewer: Neil
Date started: 2026-11-04

---

## Observations

1. **No entry path to /plan.** The index page has no links pointing to it from anywhere else in the app. A teacher arriving here must already know the URL. If the intended flow is "teacher knows which lesson they're teaching tomorrow," then the primary entry should be the individual lesson page (`/plan/6.3.5`), not the index. The index feels like a reference tool with no discoverable home.

2. **Context gap on arrival.** Landing on `/plan` with no prior navigation context is disorienting. The breadcrumb (Grade 6, Unit 3, IM 6-8 Math) tells you where you are but not how you got here or what to do next. There's no implied "you are here because X" framing.

3. **"Before the unit" sits at the bottom.** This section contains IM's Check Your Readiness pre-test items — content a teacher would logically use *before* starting the unit. Placing it after all 17 lesson rows inverts the temporal sequence. A teacher scanning for "what do I need to know before I start?" has to scroll past the entire lesson list. Suggest moving it above the lesson sections, or at minimum adding a visual cue that it's prerequisite material.

4. **Purpose of the three bottom cards is unclear.** The three boxes at the bottom ("Before the unit," "How the language grows," "IM's unit narrative") read as reference material, but there's no framing that explains *why they're here* or *when a teacher would use them*. They look like an appendix that was appended rather than designed into the flow. For a 30-minute solo prep, a teacher needs to quickly judge: is this relevant to me right now? The current presentation doesn't help with that triage.

5. **"Plan →" label is ambiguous.** For a teacher unfamiliar with DSST, "Plan →" next to a lesson title doesn't clearly communicate what will happen when they click. Does it mean "create a plan"? "See the plan"? "Go to planning mode"? Given Robert's stated use case — "prep for a lesson in less than 30 minutes" — "Prep →" would map more directly to the teacher's mental model. Or "View prep →" if it's a pre-authored artifact they're reviewing rather than building. Worth confirming with Robert what action he expects the teacher to take.

6. **Visually flat — this is a design failure, not a neutral choice.** The 17-row list reads as a DOS-era table of contents. There are ten thousand ways to design a navigation page; this is not one of them. Visual interest is not fluff — it sets the reader's mindset. A tired teacher landing on a uniform gray list at 9pm receives the signal "this is a chore." The entire 30-minute prep experience starts here, and the opening frame should say "this will make your night easier," not "here is your to-do list." Specific issues: (a) all 17 rows get equal visual weight regardless of whether they're actionable; (b) the only differentiation between built and unbuilt is a faint background tint; (c) no use of hierarchy, type contrast, color, spacing rhythm, or any other device to guide the eye to what matters. The built lessons are the product. They should be the first and most visually compelling thing on the page.

7. **"All lessons" / "Start over" distinction unclear.** Both sit at the bottom with equal weight. Presumably both navigate back to the unit index, but the different labels imply different behaviors that aren't actually different. Pick one label or differentiate the actions.

8. **Attribution line ("Adapted from IM 6-8 Math, CC BY 4.0") carries equal visual weight to navigation elements.** It's legal metadata, not user-facing content. Should be the smallest, lightest text on the page.

---

## Individual lesson page (`/plan/6.3.5` — "Comparing Speeds and Prices")

Reviewed: 2026-11-09
Context: Solo teacher, 30 min, prepping tonight's lesson.

---

### What's working

- **Green box as mission frame.** Consistent across all lessons. Says "this is the point of the planning session." The CTA copy ("Resume: Understand the end goal") does real work — tells you exactly where you are. The step tabs show progress AND provide random access (click to jump into that step). Together they form a recognizable cockpit pattern. Keep.
- **Lesson title + time estimate** are immediately readable. "About 38 min · 7 steps" gives the teacher enough to judge whether they have time tonight.
- **Step list with durations** at the bottom. Clean. Useful for pacing.

---

### Issues

9. **WIDA selector — label and stacking behavior.** Currently labeled "Class ELD profile" but it's per-student designation with multi-select (teacher picks which of the 6 levels their students are in). The up-front placement is a client decision: forces teachers to think about class composition before planning. Teachers are expected to already know their students' WIDA levels.

    **Confirmed by Robert (Nov 9):** Multi-select works. Selecting multiple levels causes guidance to expand/stack in the affected steps. It's a lesson-level default.

    **Design implications:** (a) The label "Class ELD profile" is wrong — should reflect per-student multi-select. Suggest: "Student language levels" with a multi-select chip UI. (b) When multiple levels are selected, the stacked output gets longer — need to verify this doesn't make individual steps feel overwhelming on mobile. (c) Placement up front is intentional, so don't fight it — but make the spatial relationship to the CTA clearer (inside or adjacent to the green box). (d) Per-step override idea is still open but lower priority given the stacking behavior handles it.

10. **The lower zone (below green box) — limited dynamic content.** Confirmed by Robert: no bidirectional data flow between LICM and planning. Coaches do NOT leave notes for planning sessions. The two modalities are separate experiences. This simplifies the design significantly.

    | Visit state | Lower zone content |
    |-------------|-------------------|
    | First visit, never completed | Brief orientation: "Here's how this works. 7 steps, ~38 min total." Dismissible after first completion. |
    | Returning, any state | Step list only (the arc). Clean. |

    Principle: green box = structure that doesn't change. Lower zone = first-time onboarding only. Once dismissed, it's just the step list. No coach notes, no homework, no cross-modality artifacts.

11. **"Draft — not yet reviewed by DSST" — remove.** Confirmed by Robert: it's a dev artifact (Claude-generated placeholder). Should not appear in any production state. Action: strip from templates/components.

12. **Step tabs need a clearer click affordance.** They function as both progress indicators and navigation (jump-to-step). But visually they read as passive labels. A subtle underline, chevron, or hover/tap state would make the interactivity obvious to a first-time user.

13. **"Start over" is a destructive action with no confirmation guard.** Confirmed by Neil: it performs a full state wipe — WIDA selections, all step inputs, coaching plan output, everything resets to blank. CTA flips from "Resume" back to "Start Planning." On mobile-first, a single tap with no undo path. The current affordance presents this as low-stakes (small text link, no visual weight) but the consequence is total loss of session state. At minimum needs a confirm step. Ideally: label should be "Reset" or "Clear all" to set expectations, and the confirm dialog should enumerate what will be lost ("This clears your WIDA selections and all 7 steps").

---

### Confirmed by Robert (Nov 9 call)

- WIDA: multi-select, per-student designation. Changes guidance and expands/stacks based on number of levels selected. Up-front placement is a client decision.
- "Draft — not yet reviewed by DSST": dev artifact. Remove.
- Coach notes / cross-modality flow: not happening. No bidirectional data between LICM and planning.
- Five-lens view: already implemented.
- In-class mode: out of scope for pilot. In-class card (replaces QuickRead) is generated at step 7, mobile cheat sheet.
- Entire planning experience is mobile-first (phone only).
- Pilot content: 5 built lessons to start. Robert exploring 1–3 grade levels × ~4 units each. One PDF per unit → one-shot generation via Claude/Gemini.

### Still open

- Per-step WIDA override: still a design option but lower priority given stacking handles it.
- Lower zone content beyond first-time orientation: what (if anything) fills that space on repeat visits? Step list only, or something else?
- "All lessons" / "Start over" nav: resolved. "All lessons" becomes a standard back arrow (top-left, left of lesson title). "Start over" remains as destructive action with confirm guard (see observations 13, D-002).
- "Plan →" label: "Prep →" still recommended for teacher mental model mapping.
- Mobile-first constraint reframes several observations above (tap targets, viewport, etc.) — needs a dedicated mobile pass.