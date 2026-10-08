"use client";

import { ArrowUp } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { BootScreen } from "@/components/mobile/BootScreen";
import { BROKE_MESSAGE } from "@/lib/agent/copy";
import { useAgentChat, type UiMessage } from "@/lib/agent/use-agent-chat";
import { cn } from "@/lib/cn";
import { ABOUT_MESSAGE, CHIPS } from "@/lib/mobile/content";

const SEED: UiMessage[] = [
  { id: "about", role: "assistant", content: ABOUT_MESSAGE },
];

export function MobileExperience() {
  const [booting, setBooting] = useState(true);
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
  } = useAgentChat(SEED);
  const [draft, setDraft] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = window.setTimeout(() => setBooting(false), reduced ? 0 : 1300);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, pending, exhausted]);

  const submit = (text: string) => {
    const prompt = text.trim();
    if (!prompt || pending || closed) return;
    setDraft("");
    void send(prompt);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit(draft);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit(draft);
    }
  };

  const locked = closed || remaining <= 0;
  const showChips = !locked && !pending;

  if (booting) {
    return (
      <div className="h-dvh max-h-dvh bg-workbench pt-[env(safe-area-inset-top)]">
        <BootScreen />
      </div>
    );
  }

  return (
    <div className="flex h-dvh max-h-dvh flex-col bg-workbench pt-[env(safe-area-inset-top)]">
      <header className="shrink-0 px-5 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-[#2a2a2a] text-[11px] font-semibold tracking-wide text-fg">
            IS
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-medium text-fg">Iresh Sharma</p>
            <p className="text-[12px] text-dim">
              Agent · {exhausted ? "broke" : ready ? `${remaining} left` : "…"}
            </p>
          </div>
        </div>
        <p className="mt-3 rounded-lg border border-line bg-[#1a1a1a] px-3 py-2 text-[12px] leading-5 text-muted">
          Better experience on a computer. The real portfolio is a Cursor
          window.
        </p>
      </header>

      <div ref={scrollerRef} className="min-h-0 flex-1 overflow-auto px-5 py-2">
        <div className="space-y-5">
          {messages.map((message, index) => (
            <div key={message.id}>
              <div
                className={cn(
                  "max-w-[92%] text-[15px] leading-6",
                  message.role === "user" ? "ml-auto" : "mr-auto",
                )}
              >
                {message.role === "user" ? (
                  <p className="rounded-2xl rounded-br-md bg-[#2a2a2a] px-3.5 py-2.5 text-fg">
                    {message.content}
                  </p>
                ) : (
                  <p className="text-muted">{message.content}</p>
                )}
              </div>
              {index === 0 && message.id === "about" && showChips ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {CHIPS.map((chip) => (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => submit(chip.prompt)}
                      className="rounded-full border border-line bg-[#1a1a1a] px-3.5 py-2 text-[13px] text-muted active:bg-hover"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          {pending ? (
            <p className="text-[13px] text-dim">
              thinking
              <span className="boot-cursor ml-1 inline-block h-[12px] w-[6px] translate-y-[1px] bg-dim" />
            </p>
          ) : null}
        </div>
      </div>

      <div className="shrink-0 px-5 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {showChips && messages.length > 1 ? (
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => submit(chip.prompt)}
                className="shrink-0 rounded-full border border-line bg-[#1a1a1a] px-3.5 py-2 text-[13px] text-muted active:bg-hover"
              >
                {chip.label}
              </button>
            ))}
          </div>
        ) : null}

        {locked ? (
          <div className="rounded-2xl border border-line bg-[#1f1f1f] px-3.5 py-3">
            <p className="text-[13px] leading-5 text-dim">
              {closeReason === "off-topic" && !exhausted
                ? "Chat closed. That was not about Iresh."
                : BROKE_MESSAGE}
            </p>
            {closeReason === "off-topic" && !exhausted ? (
              <button
                type="button"
                onClick={() => {
                  reset();
                  setDraft("");
                }}
                className="mt-2 text-[12px] text-muted underline-offset-2 hover:text-fg hover:underline"
              >
                New chat
              </button>
            ) : null}
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="flex items-end gap-2 rounded-2xl border border-line bg-[#1f1f1f] px-3 py-2">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Ask about Iresh"
                className="max-h-28 min-h-11 flex-1 resize-none bg-transparent py-2 text-base leading-5 text-fg outline-none placeholder:text-dim"
              />
              <button
                type="submit"
                disabled={!draft.trim() || pending}
                aria-label="Send"
                className="mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#2b2b2b] text-fg disabled:text-dim"
              >
                <ArrowUp className="size-4" strokeWidth={2.2} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
