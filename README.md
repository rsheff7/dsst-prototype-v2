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

**RULES.md** — Development guidelines for AI coding agents: viewport & stickiness rules, progressive disclosure patterns, mobile scope constraints. Read before making UI/layout changes to prevent common bugs.

All three documents live in the repo root alongside this README.

```bash
npm install
npm run dev
```

Set `ANTHROPIC_API_KEY` in `.env.local`.

## Runtime Configuration

The modular architecture is driven by three query parameters you can pass to `/api/analyze`:

- `?preset` — Model backend selection (e.g., `claude-sonnet`, `gemini-pro`). Falls back to your `DSST_MODEL_PRESET` environment variable if omitted.
- `?profile` — Prompt profile ID. Selects a pre-configured five-slot template (`coreRole`, `persona`, `framework`, `elsfLayer`, `outputFormat`). Defaults to `math-lesson-baseline`.
- `?thinking` — Reasoning budget override. Accepts `minimal`, `low`, `medium`, `high`, or `off`. Overrides the default thinking level for the chosen preset.

Example: `POST /api/analyze?preset=claude-sonnet&thinking=high`

The system prompt is always the frozen `PRODUCTION_SYSTEM_PROMPT` constant (Robert Voice profile). There is no runtime `?profile` parameter — profile selection happens at freeze time when regenerating `production-prompt.ts`. See `src/lib/prompts/profiles.ts` for available profiles and `ARCHITECTURE.md` § Prompt Architecture for details on how the five slots compose.

## Telemetry

Structured logging for the PDF inference pipeline. Disabled by default.

**Enable:** Set `DSST_TELEMETRY_ENABLED=true` in `.env.local` and restart the dev server.

**Logs:** `~/Library/Logs/DSST/dsst_structured.jsonl` — one JSON object per line.

**Format:** Each entry has `timestamp`, `level`, `category`, `event`, and `metadata`. See `ws-telemetry/README.md` for the full schema, event catalog, and developer guidelines.
