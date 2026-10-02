# DSST Brand

Source of truth for DSST Public Schools' visual identity, as used by the Premo DSST app.
When a color, logo, or "how do we use this?" question comes up, answer it here, then point here.
Kept deliberately thin: if a section stops earning its keep, delete it. (Matches the [COLLABORATION.md](./COLLABORATION.md) convention.)

---

## Provenance

- **Client:** DSST Public Schools (dual language) — https://www.dsstpublicschools.org
- **Official palette source:** DSST Brandfolder — https://brandfetch.com/f/dsstpublicschools
- **Downloaded assets:** `~/Downloads/DSST_Public_Schools/` (two "S" logos + one lifestyle photo)
- **Locked:** 2026-10-02 — three named brand colors (below)
- **Note on the logos:** the "S" glyph renders as a bright-blue + dark-charcoal split. That charcoal is a *neutral*, not a named brand color — the official palette is the three below.

---

## The Palette

Three named colors. This is the whole brand, not a starting point — do not grow it.

| Name | Hex | RGB | Role |
|---|---|---|---|
| **Cerulean** | `#008ED6` | 0, 142, 214 | **Primary.** Active states, primary actions, the "go" color. |
| **Blue Chill** | `#0D6F9D` | 13, 111, 157 | **Secondary / deep.** Hover & pressed states of Cerulean, secondary emphasis, text-on-light accents. The two tones of the "S." |
| **Twine** | `#BF8860` | 181, 136, 96 | **Warm accent.** Exactly one job (see Usage). The brand's sole warm tone. |

### Neutrals (carry over — do not redesign)

The app already runs on a warm cream surface (`--color-surface: #F4F2EC`) with charcoal ink (`--color-ink: #1A1916`). Keep that neutral scale as-is. Layer Cerulean / Blue Chill / Twine *on top* of it as the brand layer. Black is reserved for the reversed/flag logo treatment only.

---

## Usage Rules

These descend from the UI direction's Color Theory rule: **an accent must mean something.** A color that is everywhere is a color that means nothing.

- **One primary, shared by all tools.** All five tools use **Cerulean** for the *active* tab; inactive tabs are neutral gray. The current five-accent rainbow in `ToolNav.tsx` (`#00876C`, `#854F0B`, `#534AB7`, `#185FA5`, …) is off-brand and decorative — retire it. No unique hue per tab.
- **Blue Chill** owns all hover / pressed / secondary states. It never competes with Cerulean; it is Cerulean's darker self.
- **Twine does exactly one thing.** Reserve it for the **crux moment** — the point a lesson builds to (evidence collection). One loud warm beat per screen is the entire point of having a warm color. If you find yourself reaching for Twine for anything else, that something else doesn't deserve an accent.
- **Per-tool scannability** (if it ever becomes a real need) comes from *content* (math vs. language coding), not from nav chrome.

---

## Mobile Reconciliation

Robert's mobile prototype used green + orange and "worked" for him. Those were placeholders that map onto this palette: green ≈ **Blue Chill** family, orange ≈ **Twine**. Desktop and mobile therefore converge on the *same* three brand colors — only the visual weight differs. The mobile re-tint is a small change, not a redesign.

---

## Status

- ✅ Brand identified and locked (this file)
- ⬜ Wire into the app as themed tokens (`src/theme/` or `:root` CSS variables) — **separate task**, blocked on the theming-architecture discussion
- ⬜ Swap the `ToolNav.tsx` rainbow → single Cerulean active state (part of the theming pass)

---

> This is a **theme**, not a permanent fact. Premo may be pointed at other districts. Everything above is DSST-specific by design. The goal of the theming pass is that swapping clients = replacing the values in this file, *not* rewriting components.

— Sal, 2026-10-02