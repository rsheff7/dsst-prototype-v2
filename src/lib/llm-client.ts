import Anthropic from '@anthropic-ai/sdk';
import { MODELS, ThinkingLevel } from './model-presets';

export interface LLMResponse {
  text: string;
  stopReason: string;
  inputTokens: number;
  outputTokens: number;
  thinkingTokens?: number;
}

export interface LLMClient {
  run(systemPrompt: string, userMessage: string, maxTokens: number, thinkingLevel?: ThinkingLevel): Promise<LLMResponse>;
}

// Claude extended thinking token budgets mapped from universal ThinkingLevel values.
const CLAUDE_THINKING_TOKENS: Record<Exclude<ThinkingLevel, 'off'>, number> = {
  minimal: 4096,
  low: 8192,
  medium: 16384,
  high: 32768,
} as const;

export class AnthropicClient implements LLMClient {
  private client: Anthropic;
  private modelName: string;
  private defaultThinking: ThinkingLevel;

  constructor(apiKey?: string, modelName?: string, defaultThinking?: ThinkingLevel) {
    this.client = new Anthropic({
      apiKey: apiKey ?? process.env.ANTHROPIC_API_KEY,
      timeout: 200_000,
      maxRetries: 0,
    });
    this.modelName = modelName ?? MODELS.claudeSonnet;
    this.defaultThinking = defaultThinking ?? 'off';
  }

  async run(systemPrompt: string, userMessage: string, maxTokens: number, thinkingLevel?: ThinkingLevel): Promise<LLMResponse> {
    const effectiveThinking = thinkingLevel ?? this.defaultThinking;

    // Build request body. Add extended_thinking if enabled.
    const body: Record<string, unknown> = {
      model: this.modelName,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    };

    // Extended thinking uses a token budget. Map ThinkingLevel to budget_tokens.
    if (effectiveThinking !== 'off') {
      body.extended_thinking = { budget_tokens: CLAUDE_THINKING_TOKENS[effectiveThinking] };
    }

    const message = await this.client.messages.create(body as any);

    const block = message.content.find((b) => b.type === 'text');
    if (!block || block.type !== 'text') {
      throw new Error(`Anthropic returned no text block. stop_reason: ${message.stop_reason ?? 'unknown'}`);
    }

    return {
      text: block.text,
      stopReason: message.stop_reason ?? 'unknown',
      inputTokens: message.usage?.input_tokens ?? 0,
      outputTokens: message.usage?.output_tokens ?? 0,
    };
  }
}

export class GeminiClient implements LLMClient {
  private apiKey: string;
  private modelName: string;
  private defaultThinking: ThinkingLevel;

  constructor(apiKey?: string, modelName?: string, defaultThinking?: ThinkingLevel) {
    this.apiKey = apiKey ?? (process.env.GEMINI_API_KEY ?? '');
    this.modelName = modelName ?? MODELS.geminiPro;
    this.defaultThinking = defaultThinking ?? 'medium';
  }

  async run(systemPrompt: string, userMessage: string, maxTokens: number, thinkingLevel?: ThinkingLevel): Promise<LLMResponse> {
    const effectiveThinking = thinkingLevel ?? this.defaultThinking;

    // Gemini doesn't understand markdown <img> tags. Extract base64 images
    // and convert them to inlineData parts, interleaved with plain text blocks.
    const parts = this.parseUserMessage(userMessage);

    // Gemini 3.x uses the Interactions API with a different request shape.
    // system_instruction is a plain string; input handles text/multimodal content.
    // thinking_level uses lowercase values: minimal | low | medium | high
    const body: Record<string, unknown> = {
      model: this.modelName,
      system_instruction: systemPrompt || null,
      input: parts.map((p) => {
        // Map parts to the Interactions API input format.
        if ('inlineData' in p) {
          const id = p.inlineData;
          // PDFs use the `document` type with base64 data + mime_type
          if (id.mimeType === 'application/pdf') {
            return { type: 'document', data: id.data, mime_type: id.mimeType };
          }
          // Images use snake_case `mime_type` inside inline_data
          return { type: 'image', inline_data: { mime_type: id.mimeType, data: id.data } };
        }
        // Plain text parts
        if ('text' in p) {
          return { type: 'text', text: p.text };
        }
        return { type: 'text', text: '' };
      }),
    };

    // Only add thinking_level if not 'off'. Gemini disables thinking when absent.
    if (effectiveThinking !== 'off') {
      body.generation_config = {
        max_output_tokens: maxTokens,
        thinking_level: effectiveThinking.toLowerCase(),
      };
    } else {
      body.generation_config = {
        max_output_tokens: maxTokens,
      };
    }

    // Remove system_instruction if null to keep the payload clean.
    if (!systemPrompt) {
      delete body.system_instruction;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/interactions?key=${this.apiKey}`;

    console.log(`[GEMINI] REQUEST → model=${this.modelName} maxOutputTokens=${maxTokens} thinkingLevel=${effectiveThinking} parts=${parts.length}`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data: Record<string, unknown> = await response.json();

      // Check for API errors first.
      if (data.error) {
        throw new Error(`Gemini API error: ${JSON.stringify(data.error)}`);
      }

      // Interactions API returns a `steps` array with typed content blocks.
      // Extract text from `model_output` steps.
      const steps = Array.isArray(data.steps) ? (data.steps as Array<{ type: string; content?: Array<{ type: string; text?: string }> }>) : [];
      let outputText = '';
      for (const step of steps) {
        if (step.type === 'model_output') {
          for (const block of (step.content || [])) {
            if (block.type === 'text' && block.text) outputText += block.text;
          }
        }
      }
      if (!outputText) {
        throw new Error('Gemini returned no text content');
      }

      // Usage metadata — the Interactions API returns usage at top level.
      // See: https://ai.google.dev/gemini-api/docs/thinking#signatures
      const usage = (data.usage || {}) as Record<string, unknown>;
      const inputTokens = (usage.total_input_tokens as number) ?? 0;
      const outputTokens = (usage.total_output_tokens as number) ?? 0;
      const thinkingTokens = (usage.total_thought_tokens as number) ?? 0;

      console.log(`[GEMINI] RESPONSE ← output_tokens=${outputTokens} input_tokens=${inputTokens} thinking_tokens=${thinkingTokens}`);

      return {
        text: outputText,
        stopReason: 'stop',
        inputTokens,
        outputTokens,
        thinkingTokens,
      };
    } catch (error) {
      console.error('[GEMINI] Runtime error:', error);
      throw error;
    }
  }

  /**
   * Parse a user message that may contain markdown <img> tags with base64
   * data URIs. Returns an array of Gemini content parts — text blocks for
   * prose and inlineData blocks for images, preserving original order.
   */
  private parseUserMessage(message: string): Array<{ type: 'text'; text: string } | { type: 'image'; inlineData: { mimeType: string; data: string } }> {
    // Matches: <img src="data:<mime>;base64,<base64>" ...>
    const imgRegex = /<img[^>]+src="data:([^;]+);base64,([^"]+)"[^>]*>/gi;
    const parts: Array<{ type: 'text'; text: string } | { type: 'image'; inlineData: { mimeType: string; data: string } }> = [];
    let lastIndex = 0;
    let match;

    while ((match = imgRegex.exec(message)) !== null) {
      // Add text before this image
      if (match.index > lastIndex) {
        const textBefore = message.slice(lastIndex, match.index).trim();
        if (textBefore) {
          parts.push({ type: 'text', text: textBefore });
        }
      }

      // Add the image as inlineData
      const mimeType = match[1];
      const base64Data = match[2];
      parts.push({ type: 'image', inlineData: { mimeType, data: base64Data } });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the last image
    if (lastIndex < message.length) {
      const textAfter = message.slice(lastIndex).trim();
      if (textAfter) {
        parts.push({ type: 'text', text: textAfter });
      }
    }

    // If no images found, return the whole message as a single text part
    if (parts.length === 0) {
      parts.push({ type: 'text', text: message });
    }

    return parts;
  }
}

export function createLLMClient(
  provider: string,
  modelName?: string,
  defaultThinking?: ThinkingLevel,
): LLMClient {
  switch (provider.toLowerCase()) {
    case 'gemini':
      return new GeminiClient(undefined, modelName, defaultThinking);
    case 'anthropic':
    default:
      return new AnthropicClient(undefined, modelName, defaultThinking);
  }
}