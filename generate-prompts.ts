/**
 * generate-prompts.ts — DEV-ONLY regeneration utility.
 * ------------------------------------------------------------
 * Composes a registered prompt profile via the modular system
 * (composer.ts + modules/*.md) and OVERWRITES
 * src/lib/prompts/production-prompt.ts — the frozen constant that
 * /api/analyze consumes at runtime.
 *
 *   npx tsx generate-prompts.ts <profile-id>
 *
 * - <profile-id> is REQUIRED. The script composes exactly the profile
 *   you name and nothing else — choosing which profile ships is a human
 *   judgment call, not the script's. Missing or unknown ids list the
 *   registered profiles and exit 1.
 * - Output is deterministic: same modules, same bytes. Re-running with
 *   unchanged inputs produces a zero-diff file.
 *
 * The .md modules under src/lib/prompts/modules/ remain the single
 * source of truth for wording; this script closes the loop back into
 * the repo instead of expecting a manual paste.
 *
 * NOT imported by anything in src/app/. Never part of the Vercel
 * bundle. Nothing downstream calls it. Delete freely if you replace
 * it with something better.
 */
import fs from 'fs';
import path from 'path';
import { buildSystemPrompt } from './src/lib/prompts/composer';
import { getProfile, PROFILES } from './src/lib/prompts/profiles';

const profileArg = process.argv[2];
if (!profileArg) {
  console.error(
    '✗ Missing <profile-id>. Usage: npx tsx generate-prompts.ts <profile-id>\n' +
      '\nRegistered profiles:\n' +
      PROFILES.map((p) => `    ${p.id}  (${p.name})`).join('\n')
  );
  process.exit(1);
}
const profileId = profileArg;
const TARGET = path.join(__dirname, 'src', 'lib', 'prompts', 'production-prompt.ts');

const profile = getProfile(profileId);
if (!profile) {
  console.error(`✗ Unknown profile "${profileId}". Registered:`);
  for (const p of PROFILES) console.error(`    ${p.id}  (${p.name})`);
  process.exit(1);
}

const prompt = buildSystemPrompt(profileId);
console.log(`✓ Composed "${profile.name}" — ${prompt.length} chars`);

// --- Guard 1: every dynamic token must have been resolved -----------
const survivors: string[] = [];
for (const match of prompt.matchAll(/\$\{[A-Z0-9_]+\}/g)) {
  if (!survivors.includes(match[0])) survivors.push(match[0]);
}
if (survivors.length > 0) {
  console.error(
    `✗ REFUSED: ${survivors.length} unresolved token(s) would ship to the model:\n` +
      survivors.map((t) => `    ${t}`).join('\n') +
      '\n  Add resolvers to DYNAMIC_TOKENS in composer.ts, then re-run.'
  );
  process.exit(1);
}

// --- Guard 2: sanity floor ------------------------------------------
// A composed prompt below this length almost certainly means a module
// file was accidentally emptied.
if (prompt.length < 1000) {
  console.error(
    `✗ REFUSED: composed prompt is only ${prompt.length} chars (floor: 1,000).\n` +
      '  A module file may be truncated. Nothing written.'
  );
  process.exit(1);
}

// --- Write the generated module ---------------------------------------
// JSON.stringify escapes every backslash, quote, and newline correctly by
// construction — no regex chains, no template-literal backtick hazards.
// The model sees byte-for-byte what composer.ts resolves at runtime.

const HEADER = `/**
 * PRODUCTION PROMPT — Sole source of truth for /api/analyze at runtime.
 *
 * GENERATED FILE — do not edit by hand. Your changes will be silently
 * overwritten on the next regeneration.
 *
 * This frozen string ships inside the Vercel function bundle. No
 * filesystem reads, no dynamic composition, no ?profile param. The
 * route imports PRODUCTION_SYSTEM_PROMPT directly.
 *
 * HOW TO CHANGE IT:
 *   1. Edit the wording in ./modules/*.md (the modular source of truth)
 *   2. From the repo root:  npx tsx generate-prompts.ts <profile-id>
 *   3. Review:  git diff src/lib/prompts/production-prompt.ts
 *   4. Commit the result, then test the app normally (upload a PDF)
 */`;

fs.writeFileSync(
  TARGET,
  `${HEADER}\n\nexport const PRODUCTION_SYSTEM_PROMPT = ${JSON.stringify(prompt)};\n`
);
console.log(`✓ Wrote ${(TARGET.split('dsst-prototype-v2/')[1] ?? TARGET)} (${prompt.length} chars composed, ${fs.statSync(TARGET).size} bytes on disk)`);
console.log(`  Profile: ${profileId} ("${profile.name}")`);
console.log(`  Next: git diff src/lib/prompts/production-prompt.ts — review before committing.`);