"use client";

import { AlertCircle, Bell, Bot, GitBranch, Radio, TriangleAlert } from "lucide-react";
import { CODELOOM_SELF_PRS } from "@/lib/codeloom";
import { getOpenable } from "@/lib/workspace/queries";
import { useWorkbench } from "@/state/workbench-context";

export function StatusBar() {
  const { activeTabId, statusMessage, openFile } = useWorkbench();
  const active = activeTabId ? getOpenable(activeTabId) : null;
  const language =
    active?.name.endsWith(".ts")
      ? "TypeScript"
      : active?.name.endsWith(".json")
        ? "JSON"
        : "Markdown";

  return (
    <footer className="flex h-6 shrink-0 select-none items-center justify-between border-t border-line bg-status px-2 text-[12px] text-muted">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex items-center gap-1.5">
          <GitBranch className="size-3.5" strokeWidth={1.8} />
          main
        </span>
        <span className="flex items-center gap-2 text-dim">
          <span className="flex items-center gap-1">
            <AlertCircle className="size-3.5" strokeWidth={1.8} />0
          </span>
          <span className="flex items-center gap-1 text-warning">
            <TriangleAlert className="size-3.5" strokeWidth={1.8} />
            14
          </span>
        </span>
        <button
          type="button"
          onClick={() => openFile("codeloom")}
          title="The agent has been busy. Open major-projects/codeloom.md"
          className="flex shrink-0 items-center gap-1.5 rounded-sm px-1 text-fg hover:bg-hover"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#89d185] opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-[#89d185]" />
          </span>
          <Bot className="size-3.5" strokeWidth={1.8} />
          codeloom
          <span className="hidden text-dim lg:inline">
            · {CODELOOM_SELF_PRS.merged} PRs merged into itself
          </span>
        </button>
        <span className="min-w-0 truncate">
          {statusMessage ?? (
            <span className="hidden sm:inline">
              0 errors, 14 personality warnings
            </span>
          )}
        </span>
      </div>
      <div className="hidden items-center gap-3 text-dim md:flex">
        <span>Ln 1, Col 1</span>
        <span>Spaces: 2</span>
        <span>UTF-8</span>
        <span>{language}</span>
        <span className="flex items-center gap-1">
          <Radio className="size-3.5" strokeWidth={1.8} />
          Cursor Tab
        </span>
        <Bell className="size-3.5" strokeWidth={1.8} />
      </div>
    </footer>
  );
}
