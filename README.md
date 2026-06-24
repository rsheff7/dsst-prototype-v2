# DSST Math Teacher Tools — v2

The second major build of the DSST math teacher tools prototype. Integrates the IM Mathematical Language Routines (MLRs) as first-class intelligence and embedded UI annotations.

**Live URL:** TBD (this build, dsst-prototype-v2)
**v1 (still live):** https://dsst-prototype.vercel.app

## What this build adds

- **Quick Read** — a new first-tab tool. Tile-driven, scannable, printable. The single artifact a teacher carries into class.
- **MLR integration** — every MLL-flagged item is anchored to one of the 8 Mathematical Language Routines. Chips inline; tap-to-look-up overlay with definition, structure, and the AI's "Why here:" reasoning.
- **Notice → Sort → Respond** — the framework primer now integrates professional noticing (Jacobs/Lamb/Philipp) with the MLRs as the response vocabulary for language moments.
- **Analysis pipeline** — single pass with explicit `mlr_inference` block produced first; subsequent JSON references it. MLR application rule set embedded in the prompt.

## Architecture & Documentation

**ARCHITECTURE.md** — System design deep dive: anchor + parallel passes pipeline, data flow from PDF upload through Claude API to five React views, component responsibilities. Read this first before contributing code.

**DIRECTORY-STRUCTURE.md** — File-by-file mapping of every folder and module. Use when onboarding new developers or planning feature additions.

Both documents live in the repo root alongside this README.

```bash
npm install
npm run dev
```

Set `ANTHROPIC_API_KEY` in `.env.local`.
