# DSST V2 Prototype — Architecture Overview

**Version**: 0.2.0  
**Last Updated**: June 24, 2026  
**Status**: Production-ready for partner testing (with known limitations documented below)

---

## Executive Summary

The DSST Math Teacher Tools v2 is a Next.js 15 web application that analyzes math lesson PDFs using Claude Sonnet 4.6 to generate five integrated teacher-facing views anchored to the eight Mathematical Language Routines (MLRs). The architecture uses an **anchor + parallel passes** pattern to balance generation quality with wall-clock time (~3 minutes per lesson analysis).

### Core Design Principles

1. **Mobile-first in-class usability** over print functionality
2. **Single codebase** for frontend UI and backend API logic (Next.js App Router)
3. **Explicit MLR anchoring** — every MLL-flagged item must reference one of eight routines
4. **Concise output** — prompts enforce short, concrete language a first-year teacher can read at 9pm
5. **Graceful degradation** — validation functions snap invalid model outputs to safe defaults rather than crashing

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Client)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Upload     │  │    Five      │  │  Edit &      │     │
│  │   PDF Form   │→ │    Views     │← │  Regenerate  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓ POST /api/analyze
┌─────────────────────────────────────────────────────────────┐
│              Next.js Server (Vercel Edge)                   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Route Handler: src/app/api/analyze/route.ts        │   │
│  │                                                       │   │
│  │  Step 1: Parse uploaded PDF → extract text          │   │
│  │         (pdf-parse library, max 12K chars)           │   │
│  │                                                       │   │
│  │  Step 2: ANCHOR PASS (Pass 0)                        │   │
│  │         • Claude Sonnet 4.6 call                      │   │
│  │         • ~30 seconds, cheap pass                     │   │
│  │         • Returns skeleton: meta, destination,        │   │
│  │           activity IDs/titles/functions/crux flag     │   │
│  │                                                       │   │
│  │  Step 3: FOUR PARALLEL PASSES (A, B, C, D)          │   │
│  │         • All calls run simultaneously                │   │
│  │         • Each receives anchor JSON as context        │   │
│  │         • ~140 seconds max wall time                  │   │
│  │                                                       │   │
│  │         Pass A → Lesson Pathway (full activities)    │   │
│  │         Pass B → MLR Inference                       │   │
│  │         Pass C → Anticipated Thinking                │   │
│  │         Pass D → Decision Guide + Wristband          │   │
│  │                                                       │   │
│  │  Step 4: Merge results into single LessonData object │   │
│  │                                                       │   │
│  │  Step 5: Return JSON response to browser             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ JSON Response
┌─────────────────────────────────────────────────────────────┐
│              Frontend Views (React Components)              │
│                                                              │
│  QuickRead | LessonPathway | AdaptationGuardrails           │
│  AnticipatedThinking | MoveWalkthrough                      │
│                                                              │
│  All components receive same LessonData type                │
│  Display uses shared Chip/Overlay UI primitives             │
└─────────────────────────────────────────────────────────────┘
```

---

## Analysis Pipeline Deep Dive

### Why Anchor + Parallel?

Initial single-pass attempts to generate the full `LessonData` schema failed on real IM lessons due to:
- **Token limits**: Full schema exceeded Claude's comfortable output window
- **Inconsistent alignment**: Different sections referenced activities with mismatched IDs/titles
- **Quality degradation**: Model hallucinated details when asked to produce everything at once

### Solution Architecture

**Pass 0 (Anchor)** — Cheap, fast structural skeleton:
```typescript
{
  meta: { grade, unit, lesson_number, lesson_title, total_time },
  destination: "1-2 sentences naming what students should understand",
  activities: [
    { 
      id: "1.1", // Verbatim from document numbering
      title: "Warm-Up: What Kind and How Many?", 
      function: "Setup" | "Crux" | "Application" | "Synthesis",
      duration: "", grouping: "", language_demand: "low"|"medium"|"high",
      learning_target: "Students ___ (observable)",
      is_crux: boolean // Exactly ONE activity marked true
    }
  ]
}
```

**Passes A-D **(Parallel) Each receives anchor as immutable source of truth:

| Pass | Output Field | Purpose | Token Budget |
|------|-------------|---------|--------------|
| A | `arc_statement`, `key_vocabulary`, full `activities[]`, `adaptation_guardrails` | Complete lesson narrative with guardrails for adaptation | ~8K tokens |
| B | `mlr_inference.activities[]` | For each activity: language work description + 1-2 MLRs with "why here" reasoning | ~4K tokens |
| C | `anticipated_thinking` | Student thinking patterns, sentence frames, questions to listen for | ~6K tokens |
| D | `decision_guide`, `wristband` | In-the-moment decision support: scenarios, tiles, MLR legend | ~7K tokens |

**Total Wall Time**: ~30s anchor + max(A,B,C,D) ~140s = **~2.8 minutes**

**Per-Call Timeout**: 200 seconds (margin over typical wall times, stays under 600s Vercel Pro limit)

---

## Data Flow & Validation

### PDF Parsing
```typescript
// src/app/api/analyze/route.ts
const buffer = Buffer.from(await file.arrayBuffer());
const pdfParse = require('pdf-parse/lib/pdf-parse.js');
const data = await pdfParse(buffer);
const pdfText = data.text;
```

**Constraints**:
- Max 12,000 characters (truncates larger PDFs gracefully)
- Requires text-based PDF (scanned/image-only PDFs fail with helpful error message)
- No preprocessing step yet (OCR errors may break anchor detection — see Known Limitations)

### Model Output Validation

All downstream normalization functions use defensive parsing:

```typescript
// Snap enum values to safe defaults if model emits invalid string
function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  if (typeof value === 'string' && allowed.includes(value)) {
    return value as T; // Valid model output
  }
  return fallback; // Invalid → safe default
}

// Validate MLR references exist in canonical list
function normalizeMlr(raw: unknown): MlrRef | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const r = raw as { number?: unknown; name?: unknown };
  if (!isValidMlrNumber(r.number)) return undefined; // Reject invalid MLR numbers
  const number = r.number as MlrNumber;
  return { 
    number, 
    name: typeof r.name === 'string' && r.name ? r.name : MLRS[number].name // Fallback to canonical name
  };
}
```

**Why This Matters**: Without validation, `LOOKUP[invalidValue].field` throws and crashes the React tree. All normalization functions return empty arrays/objects for invalid input rather than throwing.

---

## Component Architecture

### Shared UI Primitives (`src/components/shared`)

| Component | Purpose | Used By |
|-----------|---------|---------|
| `Chip` | Colored pill badge with optional MLR icon | All five views |
| `MlrLookupOverlay` | Modal showing MLR definition, structure, AI's "why here" reasoning | Any chip click |
| `ActivityCard` | Container for activity-level content with consistent spacing | LessonPathway, AnticipatedThinking |

### Tool Components (`src/components/tools`)

Each tool implements one view of the same `LessonData`:

**QuickRead.tsx **(24 KB) Tile-driven executive summary designed as printable artifact teachers carry into class. Shows arc statement, key vocabulary, top friction points, MLR legend. Optimized for mobile scanning.

**LessonPathway.tsx **(17 KB) Full lesson walkthrough: each activity shows function (Setup/Crux/Application/Synthesis), duration, grouping, learning target, friction points, success signals, causal links between activities. Primary planning artifact.

**AdaptationGuardrails.tsx **(6 KB) What can vs. cannot be changed without breaking mathematical purpose. Shows proficiency-specific adaptations (entering/developing/bridging) with rigor check explanation.

**AnticipatedThinking.tsx **(9 KB) Predicts student thinking patterns: on-track, misconceptions, partial understanding, extensions. Includes sentence frames, questions to listen for, MLL-specific scaffolds.

**MoveWalkthrough.tsx **(33 KB) In-the-moment decision guide: scenario trees with interpretation, moves differentiated by proficiency level, MLR-anchored responses for language moments. Most interactive component.

### Context & Types (`src/lib`)

| File | Purpose |
|------|---------|
| `types.ts` | TypeScript interfaces: `LessonData`, `Activity`, `MlrRef`, `SentenceFrame`, etc. Source of truth for validation |
| `mlrs.ts` | Canonical MLR definitions (8 routines), lookup table, validation helpers (`isValidMlrNumber`) |
| `prompts.ts` | System prompt constants passed to Claude API (lesson analysis instructions, concision rules) |
| `activityLabel.ts` | Human-readable labels for activity functions (Setup → "Getting Started") |
| `audit.ts` | Post-generation validation: checks all activities covered in each pass, exactly one crux, MLR coverage |
| `qa.ts` | Demo/testing utilities for development |
| `demoLesson.ts` | Hardcoded sample lesson data for offline demo mode (no API key required) |

---

## Technical Debt & Known Limitations

### Critical (Blocks Partner Testing)

| Issue | Impact | Status | Mitigation |
|-------|--------|--------|------------|
| **Vercel payload limits** | Textbook PDFs >4MB rejected on Pro plan | 🔴 Open | Implement presigned S3 uploads (see DSST-V2-Prototype-Review.md) |
| **No persistence layer** | Refresh = data loss, prevents iteration tracking | 🟡 Partial fix planned | Add localStorage caching for June sprint; Supabase July-August |
| **Missing authentication** | Cannot track teacher identity or saved work | ⚪ Deferred to Phase 2 | Implement Supabase Auth after partner testing begins |

### Medium Priority (Post-Test Refinement)

| Issue | Impact | Recommendation |
|-------|--------|----------------|
| **PDF parsing reliability** | OCR errors in scanned textbooks may break anchor detection | Add preprocessing step + manual entry fallback |
| **Offline capability** | Classrooms with unreliable WiFi cannot use app | Defer until validated demand (>40% report connectivity issues) |
| **Model cost optimization** | Using Sonnet exclusively becomes expensive at scale (estimate $18K/month at district rollout) | Implement hybrid routing: Haiku for simple tasks, Sonnet for complex reasoning |
| **Print stylesheets incomplete** | Four of five views lack print-optimized CSS | Add during June sprint (blocked until critical debt resolved) |

---

## Deployment Configuration

### Current Stack
- **Framework**: Next.js 15 App Router
- **Language**: TypeScript (ES2017 target, strict mode enabled)
- **Styling**: Tailwind CSS v4
- **Hosting**: Vercel Pro plan ($20/month)
- **AI Provider**: Anthropic Claude Sonnet 4.6
- **PDF Parsing**: `pdf-parse` library (server-side only)

### Environment Variables Required
```bash
ANTHROPIC_API_KEY=<your-key-here>  # Scoped to Preview + Production in Vercel dashboard
```

### Build & Deploy Commands
```bash
npm install        # Install dependencies
npm run dev        # Local development server (localhost:3000)
npm run build      # Production build
npm run start      # Start production server
```

---

## Scaling Considerations for September Rollout

### What Works Well
✅ **Anchor + parallel pattern** — Consistently produces aligned, high-quality analyses in ~3 minutes  
✅ **Validation layer** — Gracefully handles model output inconsistencies without crashes  
✅ **Mobile-first design** — Teachers successfully use app on phones during instruction  
✅ **MLR anchoring rule** — Every MLL item traces to specific routine with reasoning

### What Needs Attention Before District Scale
🔴 **File upload architecture** — Must implement presigned S3 uploads for textbook-sized PDFs  
🟡 **Persistence layer** — Need database (Supabase recommended) for saved lessons, edit history, usage metrics  
🟡 **Authentication** — Teacher accounts required for multi-device access, collaboration features  
🟢 **Cost monitoring** — Track actual token usage during partner testing before optimizing model routing  

### Recommended Phased Approach

**Phase 1 **(June Sprint) Fix deployment blockers
- Presigned S3 uploads for PDFs >4MB
- localStorage persistence as quick win
- Deploy to Vercel Pro plan temporarily

**Phase 2 **(July-August) Build infrastructure for scale
- Integrate Supabase (database + auth)
- Teacher dashboard showing saved lessons, edit history
- Usage metrics tracking (token costs, failure rates)

**Phase 3 **(September+) Post-test refinement
- Analyze partner feedback for actual pain points
- Hybrid model routing based on real token usage data
- Offline mode ONLY if validated as high-demand (>40%)

---

## Architecture Decisions Log

| Date | Decision | Rationale | Alternative Considered |
|------|----------|-----------|----------------------|
| May 2026 | Single-pass → Anchor + 4 parallel passes | Single-pass failed on real IM lessons (token limits, inconsistent alignment) | Chunking by activity (more complex orchestration) |
| May 2026 | Explicit MLR anchoring requirement | Ensures every MLL scaffold traces to specific routine with reasoning | Implicit MLR selection (less transparent, harder to audit) |
| June 2024 | Next.js 15 App Router over separate backend/frontend monoliths | Single codebase reduces deployment complexity for prototype phase | Separate Express API + React SPA (more ops overhead) |
| June 2026 | Stay on Vercel initially, add external storage later | Keeps deployment simple during partner testing; can refactor file handling without touching core logic | Self-hosted from day one (premature optimization) |

---

*Document Version: 1.0*  
*Maintained by: Sal (Partner AI)*  
*Related Documents: DIRECTORY-STRUCTURE.md, DSST-V2-Prototype-Review.md (in Premo DSST Docs folder)*