# DSST Math Teacher Tools — v2

The second major build of the DSST math teacher tools prototype. Integrates the IM Mathematical Language Routines (MLRs) as first-class intelligence and embedded UI annotations.

**Live URL:** TBD (this build, dsst-prototype-v2)
**v1 (still live):** https://dsst-prototype.vercel.app

## What this build adds

- **Quick Read** — a new first-tab tool. Tile-driven, scannable, printable. The single artifact a teacher carries into class.
- **MLR integration** — every MLL-flagged item is anchored to one of the 8 Mathematical Language Routines. Chips inline; tap-to-look-up overlay with definition, structure, and the AI's "Why here:" reasoning.
- **Notice → Sort → Respond** — the framework primer now integrates professional noticing (Jacobs/Lamb/Philipp) with the MLRs as the response vocabulary for language moments.
- **Analysis pipeline** — single pass with explicit `mlr_inference` block produced first; subsequent JSON references it. MLR application rule set embedded in the prompt.

## Architecture

Same as v1: Next.js 15 App Router, Tailwind v4, Anthropic SDK with `claude-sonnet-4-6`. New: MLR constants module (`src/lib/mlrs.ts`), shared chip + overlay components.

## Development

```bash
npm install
npm run dev
```

Set `ANTHROPIC_API_KEY` in `.env.local`.
