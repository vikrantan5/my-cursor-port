"use client";

import { ArrowUp, History, RotateCcw } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { BROKE_MESSAGE } from "@/lib/agent/copy";
import { useAgentChat } from "@/lib/agent/use-agent-chat";
import { cn } from "@/lib/cn";
import { useWorkbench } from "@/state/workbench-context";

const STARTERS = [
  "Walk me through Vikrant's career",
  "What has Vikrant actually shipped?",
  "What has Vikrant won?",
];

export function ChatPanel({ className }: { className?: string }) {
  const { flashStatus } = useWorkbench();
  const {
    messages,
    remaining,
    closed,
    closeReason,
    pending,
    ready,
    exhausted,
    send,
    reset,
  } = useAgentChat();

  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to the newest message
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  // Focus the textarea once the agent is ready
  useEffect(() => {
    if (ready) textareaRef.current?.focus();
  }, [ready]);

  const canSend =
    ready && !pending && !closed && !exhausted && draft.trim().length > 0;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSend) return;
    const text = draft.trim();
    setDraft("");
    try {
      await send(text);
    } catch {
      flashStatus?.("Something went wrong. Try again.");
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) form.requestSubmit();
    }
  }

  function handleStarter(text: string) {
    setDraft(text);
    textareaRef.current?.focus();
  }

  return (
    <div className={cn("flex h-full flex-col bg-background", className)}>
      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-3"
        aria-live="polite"
      >
        {messages.length === 0 && ready && (
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider opacity-60">
              Try asking
            </p>
            {STARTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleStarter(s)}
                className="block w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-left text-sm transition hover:bg-muted"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {!ready && (
          <div className="text-sm opacity-60">Warming up the agent…</div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap",
              m.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-muted text-foreground",
            )}
          >
            {m.content}
          </div>
        ))}

        {pending && (
          <div className="flex items-center gap-2 text-xs opacity-60">
            <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
            Thinking…
          </div>
        )}

        {closed && (
          <div className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {closeReason ?? BROKE_MESSAGE}
          </div>
        )}

        {exhausted && !closed && (
          <div className="rounded-lg bg-muted px-3 py-2 text-xs opacity-70">
            You&apos;ve reached the message limit for this session.
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-border bg-background/80 p-3 backdrop-blur"
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              closed || exhausted ? "Chat unavailable" : "Ask about Vikrant…"
            }
            rows={1}
            disabled={!ready || closed || exhausted}
            className="min-h-[40px] max-h-40 flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs opacity-60">
          <span>
            {remaining != null
              ? `${remaining} message${remaining === 1 ? "" : "s"} remaining`
              : ""}
          </span>
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1 rounded px-1 transition hover:opacity-100"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}