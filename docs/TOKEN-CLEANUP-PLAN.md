# Typography & Color Token Cleanup

## Context

The color rebrand introduced a clean CSS variable system in `globals.css` (surfaces, text, borders, semantic tokens, brand layer) and registered them as Tailwind theme colors via `@theme inline`. However, the component code was never fully migrated to consume those tokens through Tailwind classes. The result is three competing patterns for specifying color, plus one stray inline `fontSize`, which will cause maintenance drift as we onboard schools outside DSST.

This plan closes that gap so that a single config file (`globals.css`) is the sole source of truth for both colors and fonts, and every component consumes them through Tailwind utility classes only.

## Current State

| Property | Tailwind class | Inline `var()` | JS constant → `var()` | Tailwind default scale |
|----------|---------------|----------------|----------------------|----------------------|
| Color    | ~250 uses     | ~120 uses      | ~35 uses             | ~40 uses (gray/red/blue) |
| Font size| All (except 1 stray inline) | — | — | — |
| Font weight | All         | —              | —                    | — |

**JS color constants found:**

```ts
// These are all just string aliases for CSS variables:
const ACCENT = 'var(--color-brand-primary)'       // framework, how-to pages
const QR_ACCENT = 'var(--color-brand-primary)'    // QuickRead
const CRUX_ACCENT = 'var(--color-crux-accent)'    // QuickRead
const SYNTH_ACCENT = 'var(--color-synth-accent)'  // QuickRead, LessonPathway
const ACCENT = 'var(--color-pathway)'             // LessonPathway
const ACCENT = 'var(--color-moves)'               // MoveWalkthrough
const MLL_ACCENT = 'var(--color-thinking)'        // MoveWalkthrough
const WIDA_ACCENT = 'var(--color-thinking)'       // EldProficiencyView, WidaMobileSelector
const WIDA_INK = 'var(--color-developing-text)'   // EldProficiencyView, WidaMobileSelector
const DOC_ACCENT = 'var(--color-brand-primary)'   // DocElements
```

**Tailwind default palette usages (should be replaced with token classes):**

- `text-gray-900`, `text-gray-800`, `text-gray-700`, `text-gray-600`, `text-gray-500` → should map to `text-ink`, `text-ink-muted`, `text-ink-faint`
- `bg-white` → `bg-card`
- `border-gray-200`, `border-gray-100` → `border-line`, `border-line-subtle`
- `bg-blue-50`, `text-blue-600` → needs a token decision (likely `text-pathway` or a new semantic)
- `bg-gray-50`, `bg-gray-100` → `bg-surface` or `bg-line-subtle`
- `text-red-700`, `text-red-800` → likely `text-demand-high-text` or `text-crux-accent`

## Plan

### Phase 1: Define missing tokens (config-only, no component changes)

Audit the Tailwind default palette usages and add any missing tokens to `:root` + `@theme inline` in `globals.css`:

- Confirm `--color-card` covers all `bg-white` cases (it does — same value).
- Decide: do we need a `--color-info-bg` / `--color-info-text` pair to replace `bg-blue-50` + `text-blue-600`? Or is `--color-pathway` + `--color-surface-accent` sufficient?
- Decide: is there a "subtle fill" token for `bg-gray-50` / `bg-gray-100`? (`--color-line-subtle` at `#EDEBE5` may work; confirm visually.)
- If red is used for error/danger semantics, consider a `--color-danger` token vs. mapping to existing demand-high.

Deliverable: updated `globals.css` with any new tokens, documented in the existing `FONT-SYSTEM.md` (renamed to `DESIGN-TOKENS.md` or expanded).

### Phase 2: Replace Tailwind default palette classes with token classes

File-by-file, swap:

| Find | Replace with | Notes |
|------|-------------|-------|
| `text-gray-900` | `text-ink` | Near-black text |
| `text-gray-800` | `text-ink` | Same perceptual value |
| `text-gray-700` | `text-ink-muted` | |
| `text-gray-600` | `text-ink-muted` | |
| `text-gray-500` | `text-ink-faint` | |
| `bg-white` | `bg-card` | |
| `border-gray-200` | `border-line` | |
| `border-gray-100` | `border-line-subtle` | |
| `bg-gray-50` | `bg-surface` (or new token) | Confirm contrast |
| `bg-gray-100` | `bg-line-subtle` (or new token) | |
| `bg-blue-50` | Phase 1 decision | |
| `text-blue-600` | Phase 1 decision | |
| `text-red-700/800` | Phase 1 decision | |

Files affected (from grep): `MobileQuickRead.tsx`, `LessonHeader.tsx`, `EldProficiencyView.tsx`, `WidaMobileSelector.tsx`. Likely a handful more in mobile components.

### Phase 3: Eliminate inline `style={{ color: ... }}` and JS color constants

Two sub-steps:

**3a.** For static colors (the vast majority), convert `style={{ color: ACCENT }}` → `className="text-[token]"` using the Tailwind class that the token already maps to. Example:

```tsx
// Before
const ACCENT = 'var(--color-brand-primary)';
<span style={{ color: ACCENT }}>...</span>

// After
<span className="text-brand-primary">...</span>
```

Since `@theme inline` registers `--color-brand-primary` as a Tailwind theme color, `text-brand-primary` is a valid utility class. Same for all other tokens.

**3b.** For *dynamic* colors (e.g., `style={{ color: toolAccent }}` where `toolAccent` is computed at runtime from props), the inline style is unavoidable. Leave these but centralize the lookup:

```ts
// src/lib/tokens.ts
export const TOOL_COLOR_CLASSES: Record<string, string> = {
  pathway: 'text-pathway',
  adapt: 'text-adapt',
  thinking: 'text-thinking',
  moves: 'text-moves',
};
```

Then: `className={TOOL_COLOR_CLASSES[tool]}` instead of `style={{ color: toolAccent }}`.

This gives us class-based rendering (which supports responsive variants, hover states, etc.) while keeping the dynamic lookup.

Files affected: all 14 files with JS color constants (~200 inline style sites).

### Phase 4: Fix the one stray inline `fontSize`

`WidaMobileSelector.tsx:50` has `fontSize: '0.9rem'`. Replace with the appropriate Tailwind text size class.

### Phase 5: Guard against regression

Add an ESLint rule (or a simple grep-based CI check) that fails the build if:

1. `fontSize:` appears in a `style={{` object
2. A Tailwind default color class is used (`text-gray-`, `bg-gray-`, `border-gray-`, `text-red-`, `bg-blue-`, etc.) — whitelist any intentional exceptions with a comment
3. A `style={{ color: 'var(--` pattern appears (should be a class)

This ensures the cleanup doesn't silently rot.

### Phase 6: Update documentation

Expand `docs/FONT-SYSTEM.md` into `docs/DESIGN-TOKENS.md` covering:

- All token names, their roles, and example usage
- The rule: **all visual values (color, font, size) go through Tailwind classes that resolve to `globals.css` variables**
- The exception rule: inline styles are permitted only for truly dynamic values (computed from props/data), and must use a centralized class-lookup table
- The multi-school onboarding flow: what changes in `globals.css` per school, what stays

## Scope Summary

| Phase | Effort | Risk |
|-------|--------|------|
| 1 — Missing tokens | Small (10–20 lines in globals.css) | Low — additive only |
| 2 — Default palette → tokens | Small (~40 class swaps across 4–5 files) | Low — same visual result |
| 3 — Inline styles → classes | Medium (~200 sites across 14 files) | Low — mechanical, but volume is high |
| 4 — Stray fontSize | Trivial (1 line) | None |
| 5 — Regression guard | Small (ESLint rule or CI script) | Low |
| 6 — Docs | Small | None |

## Multi-School Implications

Once this is done, adding a new school's branding is a **single-file change**: edit the `:root` block in `globals.css` (or override via a school-specific CSS file imported conditionally). Every component picks up the new palette automatically because they all reference tokens through Tailwind classes. No component file edits needed for a rebrand.

Currently, that's not true — the ~120 inline `var()` references would also need updating if we ever wanted a per-school override mechanism that isn't just global `:root` swapping.

## Suggested Order

Do Phases 1 + 2 + 4 together (they're small and related), then Phase 3 as a focused mechanical pass (possibly automated with a codemod), then Phase 5 + 6. This gets the highest-leverage cleanup done first with minimal risk, and the regression guard prevents the work from degrading.