export type AgentRole = "user" | "assistant";

export type AgentMessage = {
  role: AgentRole;
  content: string;
};

export type AgentCloseReason = "off-topic" | "broke";

export type AgentReply = {
  message: string;
  remaining: number;
  limit: number;
  closed: boolean;
  reason?: AgentCloseReason;
};

export type AgentQuotaSnapshot = {
  remaining: number;
  limit: number;
  closed: boolean;
  reason?: AgentCloseReason;
};
