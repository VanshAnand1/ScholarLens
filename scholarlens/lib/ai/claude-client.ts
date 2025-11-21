import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("Missing ANTHROPIC_API_KEY environment variable");
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const CLAUDE_MODEL = "claude-3-5-sonnet-20241022";

/**
 * Helper to make a non-streaming Claude API call
 */
export async function createMessage(params: {
  messages: Anthropic.MessageParam[];
  system?: string;
  max_tokens?: number;
  temperature?: number;
}) {
  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: params.max_tokens || 4096,
      temperature: params.temperature || 0.7,
      system: params.system,
      messages: params.messages,
    });

    return response;
  } catch (error) {
    console.error("Claude API error:", error);
    throw error;
  }
}

/**
 * Helper to stream Claude API responses
 */
export async function* streamMessage(params: {
  messages: Anthropic.MessageParam[];
  system?: string;
  max_tokens?: number;
  temperature?: number;
}) {
  try {
    const stream = await anthropic.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: params.max_tokens || 4096,
      temperature: params.temperature || 0.7,
      system: params.system,
      messages: params.messages,
    });

    for await (const chunk of stream) {
      yield chunk;
    }
  } catch (error) {
    console.error("Claude API streaming error:", error);
    throw error;
  }
}

/**
 * Extract text content from Claude response
 */
export function extractTextContent(response: Anthropic.Message): string {
  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock && textBlock.type === "text" ? textBlock.text : "";
}

/**
 * Parse JSON from Claude response with error handling
 */
export function parseJSONResponse<T>(response: Anthropic.Message): T {
  const text = extractTextContent(response);

  // Try to extract JSON from markdown code blocks if present
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
  const jsonText = jsonMatch ? jsonMatch[1] : text;

  try {
    return JSON.parse(jsonText) as T;
  } catch {
    console.error("Failed to parse JSON from Claude response:", text);
    throw new Error("Invalid JSON response from Claude");
  }
}
