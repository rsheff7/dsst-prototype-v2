# DSST Visual Design Language

Reference for all contributors. When adding UI, check this document first.

---

## Principles

1. **One focal point per screen.** A single serif display element anchors the reader's eye. Everything else is sans.
2. **Size and color move together.** Ink at content size means "attend to this." Muted at metadata size means "read this second." Never mix them.
3. **Touch-first.** No hover-dependent affordances. Interactive elements must be identifiable without a pointer.
4. **One primary action per step.** Solid accent fill, full-width, bottom-anchored. Secondary actions are text links.
5. **Weight creates hierarchy within a size.** If two adjacent lines are the same size, weight (or color) must distinguish their roles.

---

## Fonts

| Token | Face | Use |
|-------|------|-----|
| `--font-dm-serif` | DM Serif Display | Headings only (h1, h2, h3) |
| `--font-dm-sans` | DM Sans | All body text, labels, UI chrome |

**Rule:** One serif element per screen. The step title. Nothing else.

---

## Type Scale

All sizes assume mobile viewport (375–430px wide).

| Tier | Size | Weight | Color | Case / Tracking | Used for |
|------|------|--------|-------|-----------------|----------|
| Display | 25px (h2) / 30px (h1) | 400 | ink | normal, -0.005em tracking | Page or step title |
| Primary | 17px | 500 | ink | normal | Main statement on a step (e.g., goal) |
| Supporting | 14px | 400 | ink | normal | Context beside primary; secondary explanation |
| Item heading | 15px | 700 | ink | normal | Activity titles, list item names |
| Body | 16px (default) | 400 | ink | normal | Default paragraph text |
| Metadata | 13.5px | 400 | muted | normal | Descriptions, sub-copy, watch-for notes |
| Label | 12px | 700 | muted | UPPERCASE, 0.08em tracking | Eyebrows, section headers |
| Label (prominent) | 14px | 700 | ink | UPPERCASE, 0.08em tracking | Section label when it must match its items |
| Pill | 12px | 700 | semantic color | normal, 0.02em tracking | Badges, status indicators |
| Interactive | 13px | 600 | accent-ink | normal | Links, expandable summaries, tap targets |
| Numeric | 12px | 600 | muted | tabular-nums | Time gutters, counts |
| Micro | 10–11.5px | 600–700 | muted | normal | Footer, helper text, step dots |

---

## Color Tokens

| Token | Role | Example use |
|-------|------|-------------|
| `--color-ink` | Primary text | Titles, goal, activity names |
| `--color-ink-muted` | Secondary text | Descriptions, labels, metadata |
| `--color-accent` | Primary action / active state | CTA button, current step highlight |
| `--color-surface-accent` | Tinted background for accent context | Active pill, selected chip |
| `--color-crux-accent` | The crux moment | Crux pill, crux timeline dot |
| `--color-crux-bg` | Crux tint | Crux pill background |
| `--color-flag` | Caution | Flag pill, needs-attention |
| `--color-demand-low-text` | Complete | Done pill |
| `--color-line` | Borders, dividers | Card borders, section rules |
| `--color-card` | Elevated surface | Cards, activity blocks |
| `--color-surface` | Page background | App canvas |
| `--color-surface-sunk` | Recessed surface | Pills, flat containers |

### Color rules

- **Ink** = the reader should attend to this.
- **Muted** = supplementary; read after the ink content.
- **Accent** = actionable or currently active.
- **Semantic colors** (crux, flag, done) = categorical meaning. Never use them for general emphasis.

---

## Surface Tiers

| Tier | Appearance | When to use |
|------|-----------|-------------|
| Content | No box, no border, no background | Paragraphs, goal, story, plain text |
| Tappable | 1px border + card background + subtle shadow + rounded corners | Any element the user can tap to open detail |
| Primary action | Solid accent fill, white text, full-width, ≥48px height | One per step, always bottom-anchored |
| Secondary action | Text only, accent-ink color, underlined or bold, no box | Back links, "view notes" links |

**Rule:** If it looks like a box, it must be tappable. If it's not tappable, don't box it.

---

## Layout

- Single column, phone-width (max 560px content area).
- Sections separated by 16–20px vertical gap or a 1px top border.
- Cards: 16px padding, 12px border-radius.
- Timeline gutter: 46px left column for time markers, 10px gap to content.
- CTA button: fixed to bottom of viewport, full-width minus safe-area padding.

---

## Component Patterns

### Step header

```
[eyebrow: STEP 1 · ABOUT 4 MIN]     ← 12px/700/muted/uppercase
Understand the end goal              ← 25px/400/ink/serif
```

### Activity block (timeline item)

```
[10m]  [── card with 1px border ──────────────]
       2.1 · Estimating Volume   [Warm-up]    ← 15px/700 + pill
       An estimate in length…                   ← 13.5px/muted
       View IM's notes                          ← 13px/600/accent-ink
```

### Section label + description

```
ACTIVITIES                              ← 14px/700/ink/uppercase
This lesson has 3 activities…           ← 13.5px/muted
```

### Key-value pair

```
FUNCTION          Reading             ← dt: 11.5px/700/muted/uppercase
                                  dd: 14.5px/400/ink
```

---

## What to Check Before Merging UI

- [ ] Is there exactly one serif element on this screen?
- [ ] Does every muted element sit at ≤13.5px?
- [ ] Does every ink element sit at ≥14px?
- [ ] Is there exactly one primary (solid accent) button?
- [ ] Are all interactive elements identifiable without hover?
- [ ] Do boxed elements correspond to tappable targets?
- [ ] Are uppercase + tracking used only on structural labels?
- [ ] Does the type scale match the table above?

---

## File Locations

| Concern | File |
|---------|------|
| Global tokens (colors, fonts) | `src/app/globals.css` |
| Phone layout, shared components | `src/components/prep/prep.module.css` |
| Plan-specific additions | `src/components/plan/plan.module.css` |
| Library tools (Tailwind) | `src/components/library/library.module.css` |

---

*Last updated: Nov 23, 2026*