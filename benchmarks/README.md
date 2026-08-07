# Benchmarks

Systematic comparison of LLM providers, models, and configurations for the DSST pipeline.

## Structure

```
benchmarks/
├── README.md              ← this file (tracked)
├── fixtures/              ← test PDFs (tracked)
├── runs/                  ← test outputs (gitignored)
│   ├── gemini-3.6-flash-default/
│   │   ├── config.json    ← model, thinking budgets, max tokens
│   │   ├── output.dsst    ← generated DSST file
│   │   └── telemetry.jsonl ← telemetry from this run only
│   └── claude-3.5-sonnet-default/
│       ├── config.json
│       ├── output.dsst
│       └── telemetry.jsonl
└── reports/               ← analysis docs (tracked)
    └── gemini-vs-claude-2026-08-03.md
```

## How to Run

1. Set environment variables:
   - `MODEL_PROVIDER=gemini` or `anthropic` (defaults to anthropic)
   - `DSST_TELEMETRY_DIR=benchmarks/runs/<run-name>/telemetry.jsonl` (optional, defaults to shared log)
   - `DSST_TELEMETRY_ENABLED=true`

2. Upload a test PDF from `fixtures/` to the app

3. After the run completes:
   - Copy the output `.dsst` file into `benchmarks/runs/<run-name>/`
   - Extract telemetry entries from the shared log into `<run-name>/telemetry.jsonl`
   - Update `config.json` with the exact parameters used

4. Write a report in `reports/` if the run informs a decision

## Naming Convention

`<provider>-<model>-<variant>`

Examples:
- `gemini-3.6-flash-default`
- `gemini-3.6-flash-high-thinking`
- `claude-3.5-sonnet-default`

## Current Baseline

See `reports/gemini-vs-claude-2026-08-03.md` for the initial comparison.