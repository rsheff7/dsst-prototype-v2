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

// Token budget mapping for Claude extended thinking (applied when the effective
// thinking level is non-off). Keys match ThinkingLevel values. Used by AnthropicClient.
export const CLAUDE_THINKING_TOKENS: Record<Exclude<ThinkingLevel, 'off'>, number> = {
  minimal: 4096,
  low: 8192,
  medium: 16384,
  high: 32768,
} as const;

// Canonical model IDs — the single source of truth for every consumer.
// Bump these when a new snapshot releases; nothing else should hardcode an ID.
export const MODELS = {
  claudeSonnet: 'claude-sonnet-5',
  claudeOpus: 'claude-opus-5',
  geminiPro: 'gemini-3.1-pro-preview',
  geminiFlash: 'gemini-3.7-flash',
} as const;

export const MODEL_PRESETS: Record<string, ModelPreset> = {
  'claude-sonnet': {
    provider: 'anthropic',
    model: MODELS.claudeSonnet,
    defaultThinking: 'off',
  },
  'claude-opus': {
    provider: 'anthropic',
    model: MODELS.claudeOpus,
    defaultThinking: 'off',
  },
  'gemini-pro': {
    provider: 'gemini',
    model: MODELS.geminiPro,
    defaultThinking: 'medium',
  },
  'gemini-flash': {
    provider: 'gemini',
    model: MODELS.geminiFlash,
    defaultThinking: 'medium',
  },
};