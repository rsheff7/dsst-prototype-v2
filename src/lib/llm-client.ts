import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface LLMResponse {
  text: string;
  stopReason: string;
  inputTokens: number;
  outputTokens: number;
}

export interface LLMClient {
  run(systemPrompt: string, userMessage: string, maxTokens: number): Promise<LLMResponse>;
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

  async run(systemPrompt: string, userMessage: string, maxTokens: number): Promise<LLMResponse> {
    const message = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
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
  private model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>;

  constructor(apiKey?: string) {
    const genAI = new GoogleGenerativeAI(apiKey ?? process.env.GEMINI_API_KEY!);
    this.model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
  }

  async run(systemPrompt: string, userMessage: string, maxTokens: number): Promise<LLMResponse> {
    // Gemini doesn't understand markdown <img> tags. Extract base64 images
    // and convert them to inlineData parts, interleaved with plain text blocks.
    const parts = this.parseUserMessage(userMessage);

    const result = await this.model.generateContent({
      systemInstruction: { text: systemPrompt },
      contents: [{ role: 'user', parts }],
      generationConfig: {
        maxOutputTokens: maxTokens,
      },
    });

    const response = result.response;
    const text = response.text();

    if (!text) {
      throw new Error('Gemini returned no text');
    }

    const usage = response.usageMetadata;
    const candidate = response.candidates?.[0];
    const finishReason = candidate?.finishReason ?? 'unknown';

    console.log(`[Gemini] finish_reason: ${finishReason}, output_tokens: ${usage?.candidatesTokenCount ?? 0}`);

    return {
      text,
      stopReason: finishReason.toLowerCase().replace(/_/g, '-'),
      inputTokens: usage?.promptTokenCount ?? 0,
      outputTokens: usage?.candidatesTokenCount ?? 0,
    };
  }

  /**
   * Parse a user message that may contain markdown <img> tags with base64
   * data URIs. Returns an array of Gemini content parts — text blocks for
   * prose and inlineData blocks for images, preserving original order.
   */
  private parseUserMessage(message: string): Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> {
    // Matches: <img src="data:<mime>;base64,<base64>" ...>
    const imgRegex = /<img[^>]+src="data:([^;]+);base64,([^"]+)"[^>]*>/gi;
    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
    let lastIndex = 0;
    let match;

    while ((match = imgRegex.exec(message)) !== null) {
      // Add text before this image
      if (match.index > lastIndex) {
        const textBefore = message.slice(lastIndex, match.index).trim();
        if (textBefore) {
          parts.push({ text: textBefore });
        }
      }

      // Add the image as inlineData
      const mimeType = match[1];
      const base64Data = match[2];
      parts.push({ inlineData: { mimeType, data: base64Data } });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after the last image
    if (lastIndex < message.length) {
      const textAfter = message.slice(lastIndex).trim();
      if (textAfter) {
        parts.push({ text: textAfter });
      }
    }

    // If no images found, return the whole message as a single text part
    if (parts.length === 0) {
      parts.push({ text: message });
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