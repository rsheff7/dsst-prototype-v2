import fs from 'fs';
import path from 'path';
import { getProfile } from './profiles';
import { buildElsfReference } from '../elsf';

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
