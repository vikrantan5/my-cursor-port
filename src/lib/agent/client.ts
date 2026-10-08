import type { AgentMessage, AgentReply } from "./types";

async function readReply(response: Response): Promise<AgentReply> {
  const data = (await response.json()) as AgentReply & { error?: string };
  if (!response.ok) {
    throw new Error(data.error || `chat ${response.status}`);
  }
  return data;
}

export async function fetchAgentQuota(): Promise<AgentReply> {
  const response = await fetch("/api/chat", { method: "GET" });
  return readReply(response);
}

export async function sendAgentMessages(
  messages: AgentMessage[],
): Promise<AgentReply> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  return readReply(response);
}
