"use client";

import { MoreHorizontal } from "lucide-react";
import { FileTree } from "@/components/explorer/FileTree";
import { Outline } from "@/components/explorer/Outline";
import { SearchView } from "@/components/explorer/SearchView";
import { SourceControlView } from "@/components/explorer/SourceControlView";
import { SidebarSection } from "@/components/explorer/SidebarSection";
import { cn } from "@/lib/cn";
import { fileTree } from "@/lib/workspace/tree";
import { useWorkbench } from "@/state/workbench-context";

const titles = {
  explorer: "Explorer",
  search: "Search",
  scm: "Source Control",
};

export function Sidebar({ className }: { className?: string }) {
  const { sidebarView, flashStatus } = useWorkbench();

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col bg-sidebar text-[13px]",
        className,
      )}
    >
      <div className="flex h-9 items-center justify-between px-4">
        <h2 className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">
          {titles[sidebarView]}
        </h2>
        <button
          type="button"
          title="Views and More Actions..."
          aria-label="Views and More Actions"
          onClick={() => flashStatus("The ellipsis knows nothing extra. Yet.")}
          className="rounded p-0.5 text-dim hover:bg-hover hover:text-fg"
        >
          <MoreHorizontal className="size-4" strokeWidth={1.8} />
        </button>
      </div>

      {sidebarView === "explorer" ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-auto">
            <SidebarSection title={fileTree.name}>
              <FileTree nodes={fileTree.children ?? []} />
            </SidebarSection>
          </div>
          <div className="min-h-0 flex-1 overflow-auto border-t border-line">
            <SidebarSection title="Outline">
              <Outline />
            </SidebarSection>
          </div>
        </div>
      ) : null}

      {sidebarView === "search" ? <SearchView /> : null}
      {sidebarView === "scm" ? <SourceControlView /> : null}
    </div>
  );
}
