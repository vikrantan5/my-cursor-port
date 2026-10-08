import type { AgentMessage } from "./types";
import { buildSystemPrompt } from "./prompt";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "anthropic/claude-haiku-4.5";

type OpenRouterResponse = {
  choices?: Array<{
    message?: { content?: unknown };
  }>;
  error?: { message?: string };
};

export class OpenRouterConfigError extends Error {
  constructor() {
    super("OPENROUTER_API_KEY is not set");
    this.name = "OpenRouterConfigError";
  }
}

function modelId(): string {
  return process.env.OPENROUTER_MODEL?.trim() || DEFAULT_MODEL;
}

function unwrapContent(content: unknown): string {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .map((part) => {
      if (
        part &&
        typeof part === "object" &&
        "text" in part &&
        typeof part.text === "string"
      ) {
        return part.text;
      }
      return "";
    })
    .join("")
    .trim();
}

export function parseAgentPayload(raw: string): {
  offTopic: boolean;
  message: string;
} {
  const trimmed = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/u, "")
    .trim();

  const tryParse = (text: string) => {
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object") return null;
    const record = parsed as { offTopic?: unknown; message?: unknown };
    if (typeof record.message !== "string" || !record.message.trim()) {
      return null;
    }
    return {
      offTopic:
        record.offTopic === true ||
        record.offTopic === "true" ||
        record.offTopic === 1,
      message: record.message.trim(),
    };
  };

  try {
    const direct = tryParse(trimmed);
    if (direct) return direct;
  } catch {
    // Fall through to brace-slicing.
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try {
      const sliced = tryParse(trimmed.slice(start, end + 1));
      if (sliced) return sliced;
    } catch {
      // Use the raw model text as an on-topic fallback.
    }
  }

  return { offTopic: false, message: trimmed || "…" };
}

export async function askOpenRouter(
  messages: AgentMessage[],
): Promise<{ offTopic: boolean; message: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) throw new OpenRouterConfigError();

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.OPENROUTER_SITE_URL?.trim() || "https://iresharma.com",
      "X-Title": "iresharma portfolio",
    },
    body: JSON.stringify({
      model: modelId(),
      temperature: 0.7,
      max_tokens: 450,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        ...messages,
      ],
    }),
  });

  let data: OpenRouterResponse;
  try {
    data = (await response.json()) as OpenRouterResponse;
  } catch {
    throw new Error(`OpenRouter ${response.status}`);
  }
  if (!response.ok) {
    throw new Error(data.error?.message || `OpenRouter ${response.status}`);
  }

  const text = unwrapContent(data.choices?.[0]?.message?.content);
  if (!text) throw new Error("OpenRouter returned an empty reply");
  return parseAgentPayload(text);
}
