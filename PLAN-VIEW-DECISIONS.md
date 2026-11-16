# Planning View — Design Decisions

Living document. Each entry records a decision, its rationale, and current status.
Evidence base: `PLAN-VIEW-REVIEW.md` (raw observations).

---

## D-001 — WIDA selection becomes a sequential gate

**Date:** 2026-11-09
**Status:** Agreed (Neil + Sal). Pending Robert confirmation.

**Decision:** Move the WIDA language-level selection from its current position (below the green box, visually separate from the steps) into a sequential gate that precedes the 7 numbered planning steps.

**Rationale:**
- Robert confirmed on the Nov 9 call that WIDA must be resolved *before* planning begins. It is a precondition, not an optional sidebar.
- The UI copy already states "Set once · sets the frames at the crux." It does not change per step. A student at Level 3 is at Level 3 for the whole lesson.
- Currently it reads as a ghost — a required action that lives outside the numbered structure. Making it sequential makes the dependency explicit.
- It is not "step 8." The green box still says "7 steps · about 38 min" because that's the actual planning work. WIDA is the doorway *into* those steps.

**Implementation direction:**
- Visually distinct from the numbered tabs (no number, or a different tab style / lock icon that resolves to a checkmark once completed).
- On first visit: expanded multi-select chip UI for the 6 levels. Teacher selects applicable levels.
- On return visits where class composition hasn't changed: collapses to a confirmed state (e.g., "Levels 2, 3, 4 ✓") and gets out of the way.
- Label change: "Class ELD profile" → "Student language levels" (or "Your students' language levels"). The existing body description copy is fine as-is.

**Client constraint:** Robert noted the up-front placement was a client decision (forces teachers to think about class composition). Our change honors that intent more faithfully by making it a true gate rather than a spatially ambiguous block. Worth confirming with Robert that moving it from "below the box" to "before the steps" doesn't conflict with the client's intent.

**Supersedes:** Observation 9 in PLAN-VIEW-REVIEW.md (which framed the issue as "mislabeled and misplaced" with a per-step override suggestion). The per-step override idea is retired — WIDA is set once, full stop.
---

## D-002 — "Start over" needs a confirmation guard

**Date:** 2026-11-09
**Status:** Agreed (Neil + Sal)

**Decision:** Add a confirmation step before state wipe. Label change and confirm copy are open to Robert's preference, but the action must not be a single unguarded tap.

**Rationale:**
- Full state wipe: WIDA selections, all 7 step inputs, coaching plan output. No undo.
- Mobile-first means one thumb, small targets, easy misclicks.
- Current affordance is low-visual-weight text that reads as a minor nav action. Consequence is total session loss.

**Implementation direction:**
- Label: consider "Reset" or "Clear all" instead of "Start over" (more explicit about scope).
- On tap: show inline confirm ("This clears your WIDA selections and all step inputs. Can't be undone.") with Confirm / Cancel.
- After confirm: CTA flips to "Start Planning," WIDA gate returns to unselected state, all steps reset to initial.

**Interaction with D-001:** The WIDA gate has three distinct states that the UI must differentiate clearly: (1) never set, (2) set and confirmed (collapsed), (3) wiped by Start Over (back to never set, but user *knows* they just lost it — maybe a brief toast or visual pulse on the gate to acknowledge the wipe happened).
---

## D-003 — "All lessons" replaced by standard back arrow

**Date:** 2026-11-09
**Status:** Agreed (Neil + Sal)

**Decision:** Remove the "All lessons" text link. Replace with a standard back arrow (chevron) in the top-left corner, positioned to the left of the lesson title / breadcrumb. Tapping it navigates to the unit index.

**Rationale:**
- Mobile-first: back arrow is the universal "go back" affordance on iOS and Android. Zero learning cost.
- Cleans up the header. The breadcrumb ("Grade 6 • Unit 3") already provides destination context.
- Eliminates the "All lessons" vs "Start over" ambiguity — now one nav element (arrow) and one destructive action (reset), clearly distinct in both placement and visual weight.

**Implementation:** Standard `<` chevron, tap target ≥ 44px, no label needed.
---

## D-004 — "Start over" becomes a reset icon within the CTA button

**Date:** 2026-11-09
**Status:** ⚠️ Pending Neil review — not finalized.

**Proposal:** Remove the standalone "Start over" text link. Place a small circular-arrow reset icon (~16px) at the trailing edge of the CTA button. Tapping the text area advances; tapping the icon triggers the confirm dialog from D-002.

**Rationale:**
- The CTA is the primary action element on the page. "Reset" is its logical inverse. Co-locating them makes the relationship visible without adding another UI element.
- Spatial separation (text vs. icon within the same button) preserves tap-target safety on mobile.
- If Robert objects to integrating a destructive action into the forward-moving button, fallback: small "Reset all steps" text link directly below the CTA.

**Interaction with D-002:** Confirm dialog unchanged. Label inside the button is just the icon — no text saying "Start over." The confirm copy carries the weight.

---

## D-005 — Lower zone collapses to attribution only

**Date:** 2026-11-09
**Status:** ⚠️ Pending Neil review — not finalized.

**Proposal:** Once WIDA moves into its own gate (D-001), "All lessons" becomes a back arrow (D-003), and "Start over" integrates into the CTA (D-004), the lower zone is down to the Creative Commons attribution line. Do not add new content there. Let it be one or two lines of small text.

**Rationale:**
- Adding a step-state display below the green card duplicates information the card already shows. Redundancy on a mobile viewport is noise.
- A one-time dismissible tip ("Tap any step to jump") might help first-time users, but if the vertical step list (D-006) has clear tap affordances, even that may be unnecessary.
- Principle: don't fill space for the sake of filling space. The page works as: header → WIDA gate → green card → step content → attribution.

**Caveat:** If Neil decides the first-visit orientation (from observation 10 in REVIEW) should live in this zone, it's a one-time thing that dismisses after first completion. Not a permanent addition.

---

## D-006 — Green card steps go vertical; "The Steps" section deleted

**Date:** 2026-11-09
**Status:** ⚠️ Pending Neil review — not finalized.

**Proposal:** Rethink the 7-step layout inside the green card from horizontal tabs to a vertical list. Each row shows: number, title, duration, status indicator (dot / checkmark / current). Rows are tappable — tapping scrolls to or expands that step's content below the card. Delete the "The Steps" instructional section at the bottom entirely.

**Resulting page structure (mobile):**

```
[←]  Grade 6 • Unit 3
Lesson title — About 38 min · 7 steps

[WIDA GATE]
  (collapsed: "Levels 2, 3, 4 ✓"  |  expanded: chip multi-select)

[GREEN CARD — vertical step list]
  1. Understand the end goal     5 min   ●
  2. Identify the crux           6 min   ✓
  3. Choose the frame            4 min   ○
  ...

[Active step content]

[CC attribution — small, 1-2 lines]
```

**Rationale:**
- Mobile-first means no horizontal scrolling. A 7-item horizontal tab row forces pinch-zoom or swipe on a phone. Vertical is native reading flow.
- The green card now does triple duty (mission frame, progress tracker, navigation) without feeling dense because vertical lists are natural on phones.
- Eliminates the "The Steps" section at the bottom — it was redundant with what the card shows.
- Resolves observation 12 (tap affordance) by design: each row is a full-width tappable target.

**Open sub-question:** Does the card scroll naturally with the page, or does a slim sticky bar appear at the top when the user scrolls past it? Leaning toward: let it scroll, add a slim sticky "Step 4 of 7" indicator at the top once the card is off-screen. This keeps the viewport clean during content work while preserving orientation.

---

*Note: D-004, D-005, and D-006 are proposals captured from Neil's thinking on Nov 9 evening. They interlock — each one simplifies the page in a way that makes the others more viable. Neil to review before implementation.*