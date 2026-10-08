import { NextResponse } from "next/server";
import {
  AGENT_MESSAGE_LIMIT,
  BROKE_MESSAGE,
  OFF_TOPIC_FALLBACK,
} from "@/lib/agent/copy";
import { askOpenRouter, OpenRouterConfigError } from "@/lib/agent/openrouter";
import {
  consumeQuota,
  readQuota,
  withQuotaCookie,
} from "@/lib/agent/quota";
import type { AgentMessage, AgentReply } from "@/lib/agent/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGES = 12;
const MAX_CHARS = 2000;

function asReply(
  message: string,
  remaining: number,
  extra: Partial<Pick<AgentReply, "closed" | "reason">> = {},
): AgentReply {
  return {
    message,
    remaining,
    limit: AGENT_MESSAGE_LIMIT,
    reason: extra.reason,
    closed: remaining <= 0 || extra.closed === true,
  };
}

function json(reply: AgentReply, quota: ReturnType<typeof readQuota>) {
  return withQuotaCookie(NextResponse.json(reply), quota);
}

function parseMessages(body: unknown): AgentMessage[] | null {
  if (!body || typeof body !== "object") return null;
  const messages = (body as { messages?: unknown }).messages;
  if (!Array.isArray(messages) || messages.length === 0) return null;
  if (messages.length > MAX_MESSAGES) return null;

  const parsed: AgentMessage[] = [];
  for (const item of messages) {
    if (!item || typeof item !== "object") return null;
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;
    const text = content.trim();
    if (!text || text.length > MAX_CHARS) return null;
    parsed.push({ role, content: text });
  }

  if (parsed.at(-1)?.role !== "user") return null;
  return parsed;
}

export async function GET(request: Request) {
  const quota = readQuota(request);
  return json(
    asReply(quota.exhausted ? BROKE_MESSAGE : "", quota.remaining, {
      closed: quota.exhausted,
      reason: quota.exhausted ? "broke" : undefined,
    }),
    quota,
  );
}

export async function POST(request: Request) {
  const quota = readQuota(request);
  if (quota.exhausted) {
    return json(asReply(BROKE_MESSAGE, 0, { reason: "broke" }), quota);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const messages = parseMessages(body);
  if (!messages) {
    return NextResponse.json({ error: "bad messages" }, { status: 400 });
  }

  try {
    const result = await askOpenRouter(messages);
    const next = consumeQuota(request);
    const offTopic = result.offTopic;
    const message = offTopic
      ? result.message || OFF_TOPIC_FALLBACK
      : result.message;

    if (offTopic) {
      return json(
        asReply(message, next.remaining, {
          closed: true,
          reason: "off-topic",
        }),
        next,
      );
    }

    if (next.exhausted) {
      return json(asReply(message, 0, { closed: true, reason: "broke" }), next);
    }

    return json(asReply(message, next.remaining), next);
  } catch (error) {
    if (error instanceof OpenRouterConfigError) {
      return NextResponse.json({ error: "unconfigured" }, { status: 503 });
    }
    const detail = error instanceof Error ? error.message : "upstream";
    console.error("agent chat failed:", detail);
    return NextResponse.json(
      {
        error: "upstream",
        detail: process.env.NODE_ENV === "development" ? detail : undefined,
      },
      { status: 502 },
    );
  }
}
