# prompt-dev/ — DEVELOPMENT ONLY

This folder is the modular prompt-composition system: the slot-based
`composer.ts` engine and its `.md` source-of-truth modules.

**It is never part of the deployed application.**

- Production runs on the frozen `PRODUCTION_SYSTEM_PROMPT` string in
  `src/lib/prompts/production-prompt.ts`. Nothing in `src/app/` imports
  anything from here.
- The only thing that *exits* this folder is the regeneration script:
  run `npx tsx generate-prompts.ts <profile-id>` from the repo root to
  re-bake the production constant after editing module wording.
- `composer.ts` uses `fs.readFileSync` + `__dirname` resolution, which
  works under local `tsx` / `next dev` but would fail in the flat Vercel
  server bundle (loose `.md` files are not shipped). Physical separation
  is the guardrail; a lint rule banning imports of this folder from
  `src/` is planned as tripwire insurance.

If you're looking at this while debugging a *deployed* behaviour: you
are almost certainly in the wrong place. Check the frozen constant.