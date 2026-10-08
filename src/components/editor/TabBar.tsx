"use client";

import { X } from "lucide-react";
import { FileGlyph } from "@/components/icons/FileGlyph";
import { cn } from "@/lib/cn";
import { findNode } from "@/lib/workspace/queries";
import { outlineItems } from "@/lib/workspace/tree";
import { useWorkbench } from "@/state/workbench-context";

export function TabBar() {
  const { tabs, activeTabId, activateTab, closeTab } = useWorkbench();

  if (tabs.length === 0) {
    return <div className="h-10 border-b border-line bg-titlebar md:h-9" />;
  }

  return (
    <div className="flex h-10 shrink-0 items-stretch overflow-x-auto border-b border-line bg-[#181818] md:h-9">
      {tabs.map((id) => {
        const file = findNode(id);
        const post = outlineItems.find((item) => item.id === id);
        const name = file?.name ?? post?.name ?? id;
        const active = activeTabId === id;

        return (
          <div
            key={id}
            className={cn(
              "group flex min-w-[8.5rem] max-w-[70vw] items-center gap-2 border-r border-line px-3 text-[13px] md:min-w-[140px] md:max-w-[200px]",
              active
                ? "bg-editor text-fg shadow-[inset_0_1px_0_#ffffff]"
                : "bg-transparent text-dim hover:bg-[#1a1a1a] hover:text-muted",
            )}
          >
            <button
              type="button"
              onClick={() => activateTab(id)}
              className="flex min-w-0 flex-1 items-center gap-2 text-left"
            >
              <FileGlyph
                kind="file"
                language={file?.language ?? "markdown"}
                className="size-3.5"
              />
              <span className="truncate">{name}</span>
            </button>
            <button
              type="button"
              title="Close"
              aria-label={`Close ${name}`}
              onClick={(event) => {
                event.stopPropagation();
                closeTab(id);
              }}
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded text-dim hover:bg-hover hover:text-fg md:size-auto md:p-0.5",
                active
                  ? "opacity-100"
                  : "opacity-100 md:opacity-0 md:group-hover:opacity-100",
              )}
            >
              <X className="size-3.5" strokeWidth={2} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
