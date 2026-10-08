"use client";

import { ArrowUp, AtSign, History, Plus } from "lucide-react";
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
  "Walk me through Iresh's career",
  "What has Iresh actually shipped?",
  "Roast Iresh's résumé",
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
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, pending]);

  const submit = (text: string) => {
    const prompt = text.trim();
    if (!prompt) return;
    setDraft("");
    void send(prompt);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit(draft);
  };

  const onComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit(draft);
    }
  };

  const locked = closed || remaining <= 0;

  return (
    <aside className={cn("flex h-full min-w-0 flex-col bg-chat", className)}>
      <header className="flex h-9 shrink-0 items-center justify-between border-b border-line px-3">
        <span className="text-[13px] font-medium text-fg">
          Agent
          <span className="ml-2 font-normal text-dim">
            {exhausted ? "broke" : ready ? `${remaining} left` : "…"}
          </span>
        </span>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            title="History"
            aria-label="History"
            onClick={() =>
              flashStatus(
                "No past chats. Five roasts, then amnesia. On purpose.",
              )
            }
            className="rounded p-1 text-dim hover:bg-hover hover:text-fg"
          >
            <History className="size-4" strokeWidth={1.7} />
          </button>
          <button
            type="button"
            title="New chat"
            aria-label="New chat"
            onClick={() => {
              if (exhausted) {
                flashStatus("Still broke. The hobbies won.");
                return;
              }
              reset();
              setDraft("");
            }}
            className="rounded p-1 text-dim hover:bg-hover hover:text-fg"
          >
            <Plus className="size-4" strokeWidth={1.7} />
          </button>
        </div>
      </header>

      <div ref={listRef} className="min-h-0 flex-1 overflow-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
            <p className="text-[15px] text-fg">
              {exhausted ? "Agent is broke" : "Ask about Iresh"}
            </p>
            <p className="max-w-[260px] text-[12px] leading-5 text-dim">
              {exhausted
                ? BROKE_MESSAGE
                : "Five replies. About Iresh Sharma only. Anything else and I close the chat. The bit is making fun of him."}
            </p>
            {!exhausted ? (
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {STARTERS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setDraft(prompt)}
                    className="rounded-full border border-line px-3 py-2 text-[12px] text-muted hover:bg-hover hover:text-fg md:px-2.5 md:py-1 md:text-[11px]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="text-[13px] leading-6">
                <p className="mb-1 text-[11px] tracking-wide text-dim uppercase">
                  {message.role === "user" ? "You" : "Agent"}
                </p>
                <p className="text-muted">{message.content}</p>
              </div>
            ))}
            {pending ? (
              <p className="text-[12px] text-dim">
                consulting the unfinished-repo pile…
              </p>
            ) : null}
          </div>
        )}
      </div>

      {locked ? (
        <div className="border-t border-line p-3 md:border-t-0">
          <p className="rounded-xl border border-line bg-[#1f1f1f] px-3 py-3 text-[12px] leading-5 text-dim">
            {closeReason === "off-topic" && !exhausted
              ? "Chat closed. That was not about Iresh. New chat if he still has tokens."
              : BROKE_MESSAGE}
          </p>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="border-t border-line p-3 md:border-t-0"
        >
          <div className="rounded-xl border border-line bg-[#1f1f1f] px-3 pt-3 pb-2">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onComposerKeyDown}
              rows={2}
              placeholder="Ask anything about Iresh"
              className="w-full resize-none bg-transparent text-base leading-6 text-fg outline-none placeholder:text-dim md:text-[13px] md:leading-5"
            />
            <div className="mt-1 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[12px] text-dim">
                <span className="flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-hover">
                  <AtSign className="size-3.5" strokeWidth={1.8} />
                  Agent
                </span>
                <span>Haiku</span>
              </div>
              <button
                type="submit"
                disabled={!draft.trim() || pending}
                aria-label="Send"
                className="flex size-8 items-center justify-center rounded-md bg-[#2b2b2b] text-fg disabled:text-dim md:size-7"
              >
                <ArrowUp className="size-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        </form>
      )}
    </aside>
  );
}
