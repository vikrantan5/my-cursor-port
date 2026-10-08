"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAgentQuota, sendAgentMessages } from "./client";
import { AGENT_MESSAGE_LIMIT, BROKE_MESSAGE } from "./copy";
import type { AgentCloseReason, AgentMessage } from "./types";

export type UiMessage = AgentMessage & { id: string };

const EMPTY: UiMessage[] = [];

export function useAgentChat(seed: UiMessage[] = EMPTY) {
  const [messages, setMessages] = useState<UiMessage[]>(seed);
  const [remaining, setRemaining] = useState(AGENT_MESSAGE_LIMIT);
  const [closed, setClosed] = useState(false);
  const [closeReason, setCloseReason] = useState<AgentCloseReason>();
  const [pending, setPending] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetchAgentQuota()
      .then((quota) => {
        if (cancelled) return;
        setRemaining(quota.remaining);
        if (quota.closed) {
          setClosed(true);
          setCloseReason(quota.reason ?? "broke");
        }
      })
      .catch(() => {
        // Stay optimistic if the quota endpoint is down.
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const send = useCallback(
    async (text: string) => {
      const prompt = text.trim();
      if (!prompt || !ready || pending || closed || remaining <= 0) return;

      const history: UiMessage[] = [
        ...messages,
        { id: crypto.randomUUID(), role: "user", content: prompt },
      ];
      setMessages(history);
      setPending(true);

      try {
        const payload = history.map(({ role, content }) => ({ role, content }));
        const reply = await sendAgentMessages(payload);
        setRemaining(reply.remaining);
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: reply.message,
          },
        ]);
        if (reply.closed) {
          setClosed(true);
          setCloseReason(reply.reason);
        }
      } catch {
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              "OpenRouter ghosted us. Iresh probably fat-fingered the key, or the hobbies already ate the budget. Try once more.",
          },
        ]);
      } finally {
        setPending(false);
      }
    },
    [closed, messages, pending, ready, remaining],
  );

  const reset = useCallback(() => {
    if (closeReason === "broke" || remaining <= 0) return;
    setMessages(seed);
    setClosed(false);
    setCloseReason(undefined);
  }, [closeReason, remaining, seed]);

  const exhausted = remaining <= 0 || closeReason === "broke";
  const banner = exhausted ? BROKE_MESSAGE : undefined;

  return {
    messages,
    remaining,
    closed,
    closeReason,
    pending,
    ready,
    exhausted,
    banner,
    send,
    reset,
  };
}
