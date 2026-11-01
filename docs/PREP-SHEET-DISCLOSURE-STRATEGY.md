# Prep Sheet Activity Card — Disclosure Strategy

## Context

The Prep Sheet is the teacher's central hub. It presents a lesson as a vertical timeline of activity cards. Each card must be dense enough to support at-a-glance planning but disciplined enough to avoid information overload. The five-lens views (Pathway, Anticipated Thinking, Moves, plus Adapt and Guardrails) serve a second audience: coaches, professional developers, and the user in their expert capacity.

This document defines what appears at each disclosure tier within an activity card, why, and how disclosure triggers are worded.

---

## Two-Context Architecture

| Context | Entry Point | Purpose |
|---------|------------|---------|
| Solo Teacher | Prep Sheet (default landing) | "What do I do, in what order, and what will students think?" |
| Coach / Developer | Five-lens views (navigated from card triggers) | "Why is this structured this way? What does the data say about student thinking at each move?" |

The Prep Sheet is not a summary of the five lenses. It is a purpose-built artifact for the teacher's decision-making loop: *set up, watch for friction, respond.*

---

## Content Inventory by View

Below is everything the application currently renders per activity, mapped to its source view.

| Content | Source View | Complexity |
|---------|------------|-----------|
| Function label (Setup / Crux / Application) | Pathway, Prep Sheet | Low |
| Activity title + duration | All views | Low |
| Learning target | Pathway, Prep Sheet | Low |
| Function summary (2–3 sentences) | Pathway | Low |
| Friction tiles (type, observe, do, avoid, MLR) | Pathway, Prep Sheet | Medium |
| Causal link ("Why this activity matters") | Pathway | Low |
| Success signals | Pathway | Low |
| Teacher moves (full detail with MLR rationale) | Moves, Pathway | High |
| Decision scenarios | Moves | High |
| Thinking patterns (on-track, misconception, off-track) | Anticipated Thinking | High |
| Language demand level + ELD-specific support | Pathway (proficiency toggle) | Medium |
| Synthesis prompt | Prep Sheet, Pathway | Low |
| WIDA-level differentiation | All views (via proficiency) | High |

---

## Three-Tier Disclosure Strategy

### Tier 1: Always Visible (No Interaction Required)

These elements form the card's resting state. A teacher scanning the timeline before class should see all of them without touching anything.

| Element | Rationale |
|---------|-----------|
| Numbered circle (canonical ID, e.g. 1.1) | Orientation in sequence |
| Function label (Setup / Crux / Application) | Structural meaning; consistent across app |
| Activity title (descriptive, no number) | Identity |
| Duration | Time budgeting |
| Learning target | The single most important sentence for the teacher |
| Friction tiles (condensed: type pill + observe + do + avoid + MLR chip) | Primary classroom decision-support |
| Synthesis prompt | Closes the arc; reminds teacher of the takeaway |

**Design principle:** A teacher in a hallway, phone in hand, 5 minutes before class, should be able to glance at one card and know: what it's called, how long it takes, what students are learning, what might go wrong, and what to do about it.

### Tier 2: Inline Expand (Click-to-Reveal, Stays in Card)

These elements add depth without requiring navigation. They expand within the card boundary and do not take the user to another view.

| Element | Teaser Copy Pattern | Rationale |
|---------|-------------------|-----------|
| Success signals | "What strong thinking looks like" | Low complexity; supports observation during the activity |
| Language demand | "Language: [level] · tap for support notes" | Medium complexity; relevant for MLL-heavy classes |
| Causal link | "Why this activity matters" | Low complexity; connects to the next activity's purpose |
| Function summary | "How this fits the lesson arc" | Low complexity; useful when a teacher is unsure why an activity exists |

**Design principle:** These are "nice to have" for most teachers but essential for some (e.g., language demands for a high-MLL section). They should never be hidden behind navigation that could feel like leaving the planning flow.

### Tier 3: Navigate to Lens (Leaves the Card)

These elements are complex, data-rich, and serve the coach/developer context. They are surfaced as teaser triggers on the card but resolve to their full lens view.

| Element | Teaser Copy Pattern | Destination |
|---------|-------------------|-------------|
| Thinking patterns | "N thinking patterns anticipated" | Anticipated Thinking |
| Decision scenarios | "N branching scenarios" | Moves Walkthrough |
| Full teacher moves | "N guided moves" | Moves Walkthrough |
| WIDA differentiation | "Level-specific adaptations available" | Adaptation / Pathway (with proficiency) |

**Design principle:** High-complexity content earns a navigation cost. The teaser creates a curiosity gap (specific count, specific name) that motivates the click for those who need it, while remaining invisible to teachers who don't.

---

## Teaser Copy Patterns

Disclosure triggers use **anticipation-based language** with concrete specificity. Avoid generic labels like "More details" or "View all."

### Principles

1. **Name what's there.** "3 thinking patterns" beats "Thinking details."
2. **Imply consequence.** "What students might get stuck on" beats "Misconceptions."
3. **Use the count when it's meaningful.** Counts create a sense of scope.
4. **Use plain verbs.** "See," "Explore," "Check." Not "Access," "Navigate," "Proceed."

### Examples by Tier

**Tier 2 (inline expand):**
- "Why this activity matters"
- "What strong thinking looks like"
- "Language demand: Medium — tap for scaffolding notes"
- "How this connects to the next activity"

**Tier 3 (navigate):**
- "3 thinking patterns to watch for →"
- "2 branching decisions where your response changes the trajectory →"
- "Explore the full move sequence →"
- "Adaptations for levels 1–6 →"

The arrow glyph (→) signals external destination. No arrow means stays in place.

---

## Why This Tier Assignment

### Friction stays visible (Tier 1) because:
- It is the highest-leverage content for real-time classroom decisions.
- A teacher mid-activity needs "observe X, do Y, avoid Z" in under 3 seconds.
- Collapsing friction into an expand would add a tap to the most time-sensitive moment.

### Success signals expand inline (Tier 2) because:
- Useful for post-activity reflection, not for live delivery.
- Lower urgency than friction; a teacher can miss the expand without derailing the lesson.
- Simple enough to render inline without crowding the card.

### Thinking patterns navigate (Tier 3) because:
- The full pattern set (on-track, misconception, off-track × MLR-specific) is 6–12 items per activity.
- Rendering all of them inline would triple card height and destroy scannability.
- The count teaser ("3 patterns") is sufficient for awareness; the full view is for deep preparation or coaching conversations.

### Teacher moves navigate (Tier 3) because:
- Moves are sequential and procedural. Their value is in the ordering and the decision branches between them.
- A card-level summary of moves is just "do these things in order" which the function label already communicates.
- The full walkthrough view provides the scenario branching that gives moves their instructional power.

---

## Card Anatomy (Resting State)

```
┌─────────────────────────────────────────────────┐
│ ○ 1.1                                         │
│   SETUP · ~10 min                            │
│   What Kind and How Many?                     │
│                                               │
│   LEARNING TARGET                             │
│   Students sort objects by category and count  │
│   pairs, building the foundation for ratio.   │
│                                               │
│   ┌───────────┐ ┌───────────┐                │
│   │ MATH      │ │ LANGUAGE  │                │
│   │ friction  │ │ friction  │                │
│   │ observe…  │ │ observe…  │                │
│   │ do…       │ │ do…       │                │
│   │ avoid…    │ │ avoid… [M]│                │
│   └───────────┘ └───────────┘                │
│                                               │
│   ✦ SYNTHESIS                                 │
│   "Students now see that comparing two        │
│    quantities means finding the relationship   │
│    between them, not just counting each."     │
│                                               │
│   ── Why this matters                         │
│   ── What strong thinking looks like          │
│   ── Language: Low                           │
│   ── 3 thinking patterns →                   │
│   ── 2 branching decisions →                 │
└─────────────────────────────────────────────────┘
```

Lines starting with `──` (no arrow) are Tier 2 inline expands. Lines with `→` are Tier 3 navigations.

---

## Integration Notes

- **PlanView** (`QuickRead.tsx`) is the component that renders this card structure.
- **LessonPathway.tsx** currently owns some of the Tier 2 content (success signals, causal link, function summary). If the Prep Sheet gains these, they may be extracted to a shared component or the Prep Sheet may import them directly.
- **AnticipatedThinking.tsx** and **MoveWalkthrough.tsx** remain the destinations for Tier 3 navigation. No changes needed there.
- The **InClassView** is being retired. Its functionality (live reflection prompts) is folded into the Prep Sheet's synthesis and friction content.

---

## Open Questions

1. **Friction tile count.** When an activity has 4+ friction points, do all render inline or do we cap at 3 with a "+N more" expand? Leaning toward: always show all, since friction is Tier 1.
2. **Language demand as a badge vs. a teaser.** At "low" demand, is it noise? Consider hiding the teaser entirely when demand is low, showing only at medium/high.
3. **Synthesis placement.** Currently at card bottom. If the card is very tall (many friction tiles), the synthesis scrolls below the fold. Alternative: pin synthesis to card top as a header block?
4. **WIDA differentiation teaser.** The current app shows differentiation via a proficiency-level toggle in the header. Should the Prep Sheet card offer a teaser that deep-links to the Proficiency view pre-filtered to the teacher's class composition?