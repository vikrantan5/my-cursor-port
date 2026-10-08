"use client";

import {
  PanelLeft,
  PanelRight,
  Search,
} from "lucide-react";
import type { ReactNode } from "react";
import { modifierLabel } from "@/lib/platform";
import { cn } from "@/lib/cn";
import { getOpenable } from "@/lib/workspace/queries";
import { useWorkbench } from "@/state/workbench-context";

export function TitleBar() {
  const {
    activeTabId,
    sidebarOpen,
    chatOpen,
    toggleSidebar,
    toggleChat,
    setCommandPaletteOpen,
    flashStatus,
    setChatOpen,
  } = useWorkbench();

  const active = activeTabId ? getOpenable(activeTabId) : null;
  const mod = modifierLabel();

  return (
    <header className="flex h-11 shrink-0 select-none items-center gap-2 border-b border-line bg-titlebar px-3 md:h-10 md:gap-0">
      <div className="flex shrink-0 items-center md:w-[140px]">
        <div className="flex items-center gap-[7px] pl-0.5 md:pl-1">
          <TrafficLight
            color="#ff5f57"
            title="Close"
            onClick={() =>
              flashStatus("process.exit is not allowed in the browser")
            }
          />
          <TrafficLight
            color="#febc2e"
            title="Minimize"
            onClick={() => setChatOpen(false)}
          />
          <TrafficLight
            color="#28c840"
            title="Full screen"
            onClick={() => {
              if (!document.fullscreenElement) {
                void document.documentElement.requestFullscreen();
              } else {
                void document.exitFullscreen();
              }
            }}
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 justify-center md:px-4">
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="flex h-8 w-full max-w-[420px] items-center gap-2 rounded-md border border-line bg-[#2a2a2a] px-3 text-[13px] text-dim transition-colors hover:border-[#3d3d3d] hover:text-muted md:h-7 md:text-[12px]"
        >
          <Search className="size-3.5 shrink-0" strokeWidth={1.8} />
          <span className="min-w-0 flex-1 truncate text-left">
            {active?.name ?? "iresharma"}
          </span>
          <kbd className="hidden rounded border border-line bg-[#1f1f1f] px-1.5 py-px font-mono text-[10px] text-dim sm:inline">
            {mod}P
          </kbd>
        </button>
      </div>

      <div className="hidden w-[140px] items-center justify-end gap-0.5 md:flex">
        <IconButton
          label={`Toggle Explorer (${mod}B)`}
          active={sidebarOpen}
          onClick={toggleSidebar}
        >
          <PanelLeft className="size-4" strokeWidth={1.7} />
        </IconButton>
        <IconButton
          label={`Toggle Chat (${mod}L)`}
          active={chatOpen}
          onClick={toggleChat}
        >
          <PanelRight className="size-4" strokeWidth={1.7} />
        </IconButton>
      </div>
    </header>
  );
}

function TrafficLight({
  color,
  title,
  onClick,
}: {
  color: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className="size-[12px] rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

function IconButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex size-7 items-center justify-center rounded-md text-dim hover:bg-hover hover:text-fg",
        active && "text-fg",
      )}
    >
      {children}
    </button>
  );
}
