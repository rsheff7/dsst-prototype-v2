/**
 * DEV-ONLY MODULE — Do not import from src/app/ or any server route.
 *
 * This composer resolves prompt modules (.md files in ./modules/) into a
 * single string at local-run time. It is used exclusively by:
 *   - Local benchmark scripts (benchmarks/)
 *   - generate-prompts.ts (one-shot regeneration utility)
 *   - Unit tests validating slot composition
 *
 * It relies on fs.readFileSync + __dirname path resolution, which works
 * under `next dev` / tsx but will FAIL in the Vercel production bundle
 * (loose .md files are not shipped; only imported JS is available).
 *
 * If you need to change the production prompt, edit ./modules/*.md,
 * run `npx tsx generate-prompts.ts`, then commit the updated
 * production-prompt.ts constant. Never import this file from src/app/.
 */
import fs from 'fs';
import path from 'path';
// Upward reference into src/ — intentional. This file lives OUTSIDE the
// Vercel bundle; only the generated production-prompt.ts crosses that line.
import { getProfile } from '../src/lib/prompts/profiles';
import { buildElsfReference } from '../src/lib/elsf';

// Resolve the modules directory relative to this file, regardless of how it's invoked.
const MODULES_DIR = path.join(__dirname, 'modules');

/**
 * Dynamic token resolver map. Any placeholder like `${TOKEN}` that needs runtime
 * resolution goes here. The composer replaces all instances after joining modules,
 * so every call path — routes, benchmarks, tests — gets fully resolved prompts.
 */
const DYNAMIC_TOKENS: Record<string, () => string> = {
  '${ELSF_GUIDELINES}': buildElsfReference,
};

export function buildSystemPrompt(profileId: string): string {
  const profile = getProfile(profileId);
  if (!profile) {
    throw new Error(`No prompt profile found for id: "${profileId}"`);
  }

  // Only read modules that are defined for this profile.
  const allModules = [profile.coreRole, profile.persona, profile.framework, profile.elsfLayer, profile.outputFormat];
  const modules = allModules.filter((m): m is string => typeof m === 'string');

  let prompt = modules.map(readModule).join('\n\n');

  // Resolve all dynamic placeholders globally.
  for (const [token, resolver] of Object.entries(DYNAMIC_TOKENS)) {
    prompt = prompt.replaceAll(token, resolver());
  }

  return prompt;
}

function readModule(relativePath: string): string {
  const fullPath = path.join(MODULES_DIR, relativePath + '.md');
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Module file not found: "${relativePath}.md" at ${fullPath}`);
  }
  return fs.readFileSync(fullPath, 'utf-8');
}

/**
 * Resolve dynamic placeholders in any arbitrary prompt string (e.g., from an external file).
 */
export function resolvePlaceholders(text: string): string {
  let result = text;
  for (const [token, resolver] of Object.entries(DYNAMIC_TOKENS)) {
    result = result.replaceAll(token, resolver());
  }
  return result;
}
