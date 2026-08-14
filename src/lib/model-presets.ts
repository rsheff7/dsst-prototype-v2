/* ------------------------------------------------------------------ */
/*  Model Presets — provider + model ID + default thinking per preset  */
/* ------------------------------------------------------------------ */

export type ThinkingLevel = 'minimal' | 'low' | 'medium' | 'high' | 'off';
export type ModelProvider = 'anthropic' | 'gemini';

export interface ModelPreset {
  provider: ModelProvider;
  model: string;
  defaultThinking: ThinkingLevel;
}

// Token budget mapping for Claude extended thinking (when ?thinking overrides to non-off).
// Keys match ThinkingLevel values. Used by AnthropicClient.
export const CLAUDE_THINKING_TOKENS: Record<Exclude<ThinkingLevel, 'off'>, number> = {
  minimal: 4096,
  low: 8192,
  medium: 16384,
  high: 32768,
} as const;

export const MODEL_PRESETS: Record<string, ModelPreset> = {
  'claude-sonnet': {
    provider: 'anthropic',
    model: 'claude-sonnet-4-20250514',
    defaultThinking: 'off',
  },
  'claude-opus': {
    provider: 'anthropic',
    model: 'claude-opus-5-20250201',
    defaultThinking: 'off',
  },
  'gemini-pro': {
    provider: 'gemini',
    model: 'gemini-3.1-pro-preview-06-05',
    defaultThinking: 'medium',
  },
  'gemini-flash': {
    provider: 'gemini',
    model: 'gemini-3.7-flash-preview-09-2025',
    defaultThinking: 'medium',
  },
};