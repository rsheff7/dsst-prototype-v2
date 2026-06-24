# DSST V2 Prototype — Directory Structure

**Version**: 0.2.0  
**Last Updated**: June 24, 2026  

This document maps every folder and file in the repository to its purpose and responsibilities. Use this when onboarding new developers or planning feature additions.

---

## Repository Root

```
dsst-prototype-v2/
├── src/                          # Application source code (TypeScript + React)
│   ├── app/                      # Next.js App Router routes & API endpoints
│   ├── components/               # Reusable React UI components
│   └── lib/                      # Shared utilities, types, prompts
├── .env.example                  # Template for required environment variables
├── .gitignore                    # Files excluded from version control
├── ARCHITECTURE.md               # System design, data flow, scaling considerations ← READ THIS FIRST
├── DEMO-GUIDE.md                 # User-facing walkthrough for partner testing
├── DIRECTORY-STRUCTURE.md        # This file — what everything does
├── eslint.config.mjs             # Linter configuration
├── next.config.ts                # Next.js build configuration
├── package.json                  # Dependencies & npm scripts
├── postcss.config.mjs            # CSS processing configuration
├── README.md                     # Project overview, quick start guide
└── tsconfig.json                 # TypeScript compiler options
```

---

## `src/app/` — Next.js App Router

Next.js 15 uses the **App Router** paradigm: folder structure defines URL routes. Each directory can contain a `page.tsx` (React component) or `route.ts` (API endpoint).

### Route Hierarchy

| Folder | URL Path | Purpose |
|--------|----------|---------|
| `/src/app/page.tsx` | `/` | Landing page — upload PDF form with demo mode toggle |
| `/src/app/lesson/page.tsx` | `/lesson` | Main analysis view — displays five integrated teacher tools |
| `/src/app/api/analyze/route.ts` | `POST /api/analyze` | Serverless function: accepts PDF, runs Claude pipeline, returns LessonData |
| `/src/app/framework/` | `/framework` | MLR reference documentation (tap-to-look-up overlay content) |
| `/src/app/how-to/` | `/how-to` | Teacher guidance pages (professional noticing framework integration) |
| `/src/app/qa/` | `/qa` | Development/testing utilities (not exposed in production) |

### Key Files

**`globals.css` **(2 KB) Global Tailwind v4 styles. Includes print media queries for Quick Read artifact optimization.

**`layout.tsx` **(1 KB) Root layout wrapping all pages. Provides shared navigation header, consistent typography, mobile-responsive container.

---

## `src/components/` — UI Components

Organized into two subdirectories based on scope and reusability.

### `shared/` — Cross-Cutting Primitives

Components used across multiple views. Designed to be maximally generic with configurable props.

| Component | File | Purpose |
|-----------|------|---------|
| `Chip` | `Chip.tsx` | Colored pill badge with optional MLR icon. Used for vocabulary terms, friction points, proficiency levels |
| `MlrLookupOverlay` | `MlrLookupOverlay.tsx` | Modal showing MLR definition, routine structure, AI's "why here" reasoning. Triggered by chip click |
| `ActivityCard` | `ActivityCard.tsx` | Container for activity-level content with consistent spacing, border radius, shadow elevation |

### `tools/` — Five Teacher Views

Each tool implements one view of the same `LessonData` type. Components are intentionally opinionated (specific to DSST pedagogy) rather than generic.

| Component | File Size | What It Displays |
|-----------|-----------|------------------|
| `QuickRead.tsx` | 24 KB | Tile-driven executive summary designed as printable artifact teachers carry into class. Shows arc statement, key vocabulary, top friction points, MLR legend |
| `LessonPathway.tsx` | 17 KB | Full lesson walkthrough: each activity shows function (Setup/Crux/Application/Synthesis), duration, grouping, learning target, friction points, success signals, causal links between activities |
| `AdaptationGuardrails.tsx` | 6 KB | What can vs. cannot be changed without breaking mathematical purpose. Shows proficiency-specific adaptations (entering/developing/bridging) with rigor check explanation |
| `AnticipatedThinking.tsx` | 9 KB | Predicts student thinking patterns: on-track, misconceptions, partial understanding, extensions. Includes sentence frames, questions to listen for, MLL-specific scaffolds |
| `MoveWalkthrough.tsx` | 33 KB | In-the-moment decision guide: scenario trees with interpretation, moves differentiated by proficiency level, MLR-anchored responses for language moments. Most interactive component |

---

## `src/lib/` — Shared Utilities & Data

Pure TypeScript modules with no React dependencies. Can be imported by both client components and server API routes.

### Domain Types

**`types.ts` **(4 KB) TypeScript interfaces defining the complete `LessonData` schema:
- `LessonData` — Top-level type containing meta, destination, activities[], adaptation_guardrails, anticipated_thinking, decision_guide, mlr_inference, wristband
- `Activity` — Individual lesson activity with id, title, function, duration, grouping, language_demand, learning_target, is_crux, friction_points, success_signals, teacher_moves, causal_link, extension
- `MlrRef` — MLR reference object { number: MlrNumber, name: string }
- `SentenceFrame` — Scaffolded sentence frame with optional MLR anchor { frame: string, mlr?: MlrRef }
- Additional supporting types: `DoNotRemoveItem`, `ProficiencyAdaptation`, `ActivityTeacherMove`, etc.

**`mlrs.ts` **(6 KB) Canonical Mathematical Language Routines data:
- `MLRS` constant — Lookup table mapping MLR numbers (1-8) to { name, description, structure } objects
- `MlrNumber` type — Union type `'1' | '2' | ... | '8'` for strict enum validation
- `isValidMlrNumber(value)` — Runtime validator returning boolean
- All eight routines: Routine 1 (Collective Vocabulary), Routine 2 (Compare and Contrast), Routine 3 (I've Seen It Before), Routine 4 (Think-Pair-Share), Routine 5 (Choral Reading), Routine 6 (Info Gap), Routine 7 (Graph, Table, or Data Match), Routine 8 (Tug of War: Yes, No, Maybe)

### Prompts & Analysis Logic

**`prompts.ts` **(16 KB) System prompt constants passed to Claude API:
- `LESSON_ANALYSIS_PROMPT` — Main system instruction describing the five-pass architecture, JSON output requirements, concision rules, MLR anchoring mandate
- Prompt engineering embedded directly in code (not external files) for version control consistency

**`audit.ts` **(8 KB) Post-generation validation functions:
- Checks all activities covered in each pass
- Validates exactly one activity marked as crux
- Ensures MLR coverage meets minimum threshold
- Returns error list if any checks fail (logged but doesn't block response)

### Supporting Modules

**`activityLabel.ts` **(1 KB) Human-readable labels for activity functions:
```typescript
const ACTIVITY_LABELS = {
  Setup: 'Getting Started',
  Crux: 'Core Work',
  Application: 'Practice & Apply',
  Synthesis: 'Wrap Up'
};
```

**`lessonContext.tsx` **(1 KB) React Context provider for passing `LessonData` down component tree without prop drilling. Usage: `<LessonProvider value={analysis}>{children}</LessonProvider>`

**`qa.ts` **(30 KB) Development/testing utilities:
- Mock lesson data generators
- Validation test cases
- Token usage estimation helpers
- Not imported in production builds

**`demoLesson.ts` **(48 KB) Hardcoded sample lesson analysis for offline demo mode (no API key required). Represents realistic Eureka Math Grade 3 lesson with all five views populated.

---

## Configuration Files

### Build & Deployment

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js build configuration. Sets `maxDuration: 600` for Vercel Pro plan (allows up to 800s runtime) |
| `tsconfig.json` | TypeScript compiler options. Targets ES2017, enables strict mode, uses `"next"` plugin for automatic path aliases (`@/lib/types` → `src/lib/types`) |
| `postcss.config.mjs` | CSS processing pipeline (Tailwind v4 integration) |
| `eslint.config.mjs` | Linter rules. Enforces TypeScript best practices, catches common React anti-patterns |

### Dependencies

**`package.json` **(1 KB) Key dependencies:
- `next@15.x` — Web framework with App Router
- `react`, `react-dom` — UI library
- `tailwindcss@v4` — Utility-first CSS framework
- `@anthropic-ai/sdk` — Claude API client
- `pdf-parse` — Server-side PDF text extraction
- TypeScript dev dependencies (`typescript`, `@types/node`, etc.)

**npm Scripts**:
```bash
npm run dev      # Start local development server (localhost:3000) with hot reload
npm run build    # Compile production bundle
npm run start    # Run production server (after build)
npm run lint     # Check code quality with ESLint
```

### Environment Variables

**`.env.local`** (not in repo — you create this locally):
```bash
ANTHROPIC_API_KEY=your-key-here
```

Set via Vercel dashboard for deployments: Project → Settings → Environment Variables → Scope: Preview + Production

---

## Adding New Features

### For a New Teacher View Tool

1. Create component in `src/components/tools/NewView.tsx`
2. Add corresponding route in `src/app/new-view/page.tsx` if it needs its own URL
3. Import and display within existing lesson page, OR create separate route
4. Update `types.ts` if new data fields needed
5. Adjust prompts in `prompts.ts` if Claude should generate additional output

### For a New API Endpoint

1. Create folder under `src/app/api/feature-name/route.ts`
2. Export async `POST(req: NextRequest)` or `GET(req: NextRequest)` handler
3. Return `NextResponse.json({ data })` for success, `{ status: 400/500 }` for errors
4. Frontend calls via `fetch('/api/feature-name', { method: 'POST', body: ... })`

### For Shared UI Components

1. Generic primitives → `src/components/shared/ComponentName.tsx`
2. Tool-specific components → `src/components/tools/ComponentName.tsx`
3. Export from appropriate barrel file if creating index exports

---

## Known Limitations & Future Refactoring

### Current Technical Debt (See DSST-V2-Prototype-Review.md for details)

| Issue | Location | Impact | Fix Timeline |
|-------|----------|--------|--------------|
| **Vercel payload limits** | `src/app/api/analyze/route.ts` line 303 | Textbook PDFs >4MB rejected on Pro plan | June Sprint (presigned S3 uploads) |
| **No persistence layer** | Everything lives in browser memory | Refresh = data loss, prevents iteration tracking | July-August (Supabase integration) |
| **Missing authentication** | No auth middleware or user context | Cannot track teacher identity or saved work | Phase 2 (Supabase Auth) |

### Architectural Decisions Made

✅ **Single codebase for frontend + backend** — Next.js App Router keeps deployment simple during prototype phase  
✅ **Anchor + parallel passes** — More reliable than single-pass generation at scale  
✅ **Explicit MLR anchoring requirement** — Every MLL item must reference specific routine with reasoning  
⚠️ **PDF parsing in-memory** — Works for small files; will need presigned S3 uploads for textbook-sized PDFs

### Potential Future Refactors (Post-September)

- Separate Express API service if Vercel constraints become limiting factor
- Offline-first PWA architecture with IndexedDB caching + service workers
- Hybrid model routing (Haiku for simple tasks, Sonnet for complex reasoning)
- Self-hosted inference (Llama 3) if district compliance requires data sovereignty

---

*Document Version: 1.0*  
*Maintained by: Sal (Partner AI)*  
*Related Documents: ARCHITECTURE.md, DSST-V2-Prototype-Review.md (in Premo DSST Docs folder)*