import path from 'path';
import fs from 'fs';
import { buildSystemPrompt, resolvePlaceholders } from './prompts/composer';
import { DEFAULT_PROFILE } from './prompts/profiles';

/* ------------------------------------------------------------------ */
/*  Prompt loading                                                     */
/* ------------------------------------------------------------------ */

// Load prompt from external file if DSST_PROMPT_FILE env var is set.
// Falls back to the modular composition system with optional profile override.
function loadPromptBase(profileId?: string): string {
  const filePath = process.env.DSST_PROMPT_FILE;
  if (filePath) {
    const absPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);
    try {
      const content = fs.readFileSync(absPath, 'utf-8');
      console.log(`[prompts] Loaded prompt template from: ${absPath}`);
      return resolvePlaceholders(content);
    } catch (err) {
      console.error(`[prompts] Failed to load prompt file: ${absPath}`, err);
      // Fall through to composed prompt
    }
  }
  return buildSystemPrompt(profileId ?? DEFAULT_PROFILE);
}

// Compose the system prompt with ELSF reference injected.
// Accepts optional profile ID to override the default ('math-lesson-baseline').
export function composeSystemPrompt(profileId?: string): string {
  return loadPromptBase(profileId);
}

// Export for route.ts compatibility — resolves once at module load.
export const LESSON_ANALYSIS_PROMPT = composeSystemPrompt();

// Snapshot the fully composed prompt (with ELSF injected) into a run folder.
// Call this once per benchmark run so the exact prompt text is archived alongside results.
export async function snapshotPrompt(runDir: string): Promise<void> {
  try {
    const fullPrompt = composeSystemPrompt();
    const targetPath = path.join(runDir, 'prompt_snapshot.md');
    fs.mkdirSync(runDir, { recursive: true });
    fs.writeFileSync(targetPath, fullPrompt, 'utf-8');
    console.log(`[prompts] Prompt snapshot written to ${targetPath}`);
  } catch (err) {
    console.error(`[prompts] Failed to snapshot prompt to ${runDir}:`, err);
  }
}