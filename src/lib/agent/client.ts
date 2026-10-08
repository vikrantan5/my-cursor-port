import type { AgentMessage, AgentReply } from "./types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

async function readReply(response: Response): Promise<AgentReply> {
  const data = (await response.json()) as AgentReply & { error?: string };
  if (!response.ok) {
    throw new Error(data.error || `chat ${response.status}`);
  }
  return data;
}

export async function fetchAgentQuota(): Promise<AgentReply> {
  const response = await fetch(`${BACKEND_URL}/api/chat`, {
    method: "GET",
    credentials: "include",
  });
  return readReply(response);
}

export async function sendAgentMessages(
  messages: AgentMessage[],
): Promise<AgentReply> {
  const response = await fetch(`${BACKEND_URL}/api/chat`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  return readReply(response);
}
