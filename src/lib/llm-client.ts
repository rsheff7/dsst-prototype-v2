import Anthropic from '@anthropic-ai/sdk';

export interface LLMResponse {
  text: string;
  stopReason: string;
  inputTokens: number;
  outputTokens: number;
  thinkingTokens?: number;
}

export interface LLMClient {
  run(systemPrompt: string, userMessage: string, maxTokens: number, thinkingLevel?: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH'): Promise<LLMResponse>;
}

export class AnthropicClient implements LLMClient {
  private client: Anthropic;

  constructor(apiKey?: string) {
    this.client = new Anthropic({
      apiKey: apiKey ?? process.env.ANTHROPIC_API_KEY,
      timeout: 200_000,
      maxRetries: 0,
    });
  }

  async run(systemPrompt: string, userMessage: string, maxTokens: number, _thinkingLevel?: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH'): Promise<LLMResponse> {
    // Model name — configurable via CLAUDE_MODEL env var (default: claude-sonnet-4-6).
    const modelName = process.env.CLAUDE_MODEL ?? 'claude-sonnet-4-6';

    // Anthropic counts thinking tokens separately from max_tokens.
    // _thinkingLevel is accepted for interface compatibility but ignored.
    const message = await this.client.messages.create({
      model: modelName,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

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

  constructor(apiKey?: string) {
    // Automatically reads from process.env.GEMINI_API_KEY if apiKey argument is omitted.
    this.apiKey = apiKey ?? (process.env.GEMINI_API_KEY ?? '');
  }

  async run(systemPrompt: string, userMessage: string, maxTokens: number, thinkingLevel?: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH'): Promise<LLMResponse> {
    // Model name — configurable via GEMINI_MODEL env var (default: gemini-3.6-flash).
    const modelName = process.env.GEMINI_MODEL ?? 'gemini-3.6-flash';

    // Gemini doesn't understand markdown <img> tags. Extract base64 images
    // and convert them to inlineData parts, interleaved with plain text blocks.
    const parts = this.parseUserMessage(userMessage);

    // Gemini 3.6 uses the Interactions API with a different request shape.
    // system_instruction is a plain string; input handles text/multimodal content.
    // thinking_level uses lowercase values: minimal | low | medium | high
    const level = (thinkingLevel ?? 'MINIMAL').toLowerCase();

    const body: Record<string, unknown> = {
      model: modelName,
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
      generation_config: {
        max_output_tokens: maxTokens,
        thinking_level: level,
      },
    };

    // Remove system_instruction if null to keep the payload clean.
    if (!systemPrompt) {
      delete body.system_instruction;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/interactions?key=${this.apiKey}`;

    console.log(`[GEMINI] REQUEST → model=${modelName} maxOutputTokens=${maxTokens} thinkingLevel=${level} parts=${parts.length}`);

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

      // Usage metadata — Interactions API uses flat `usage` object with snake_case keys.
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

export function createLLMClient(provider: string): LLMClient {
  switch (provider.toLowerCase()) {
    case 'gemini':
      return new GeminiClient();
    case 'anthropic':
    default:
      return new AnthropicClient();
  }
}