"use client";

import { ChevronRight } from "lucide-react";
import { FileGlyph } from "@/components/icons/FileGlyph";
import { findNode, getOpenable } from "@/lib/workspace/queries";
import { useWorkbench } from "@/state/workbench-context";

export function Breadcrumbs() {
  const { activeTabId } = useWorkbench();
  if (!activeTabId) return null;

  const openable = getOpenable(activeTabId);
  if (!openable) return null;

  const file = findNode(activeTabId);

  return (
    <div className="flex h-6 shrink-0 items-center gap-1 overflow-x-auto border-b border-line px-3 text-[12px] text-dim whitespace-nowrap">
      {openable.path.map((segment, index) => {
        const last = index === openable.path.length - 1;
        return (
          <span key={`${segment}-${index}`} className="flex items-center gap-1">
            {index > 0 ? (
              <ChevronRight className="size-3" strokeWidth={2} />
            ) : null}
            {last ? (
              <span className="flex items-center gap-1 text-muted">
                <FileGlyph
                  kind="file"
                  language={file?.language ?? "markdown"}
                  className="size-3.5"
                />
                {segment}
              </span>
            ) : (
              <span>{segment}</span>
            )}
          </span>
        );
      })}
    </div>
  );
}
