import { buildSystemPrompt } from './src/lib/prompts/composer';
import fs from 'fs';
import path from 'path';

const outDir = './benchmarks/outputs';
fs.mkdirSync(outDir, { recursive: true });

// Generate composed prompts for each profile
const profiles = ['math-lesson-baseline', 'math-lesson-analysis'];

for (const id of profiles) {
  try {
    const output = buildSystemPrompt(id);
    const filePath = path.join(outDir, `${id}.md`);
    fs.writeFileSync(filePath, output);
    console.log(`✓ ${id} -> ${filePath} (${output.length} chars)`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`✗ ${id}:`, msg);
  }
}