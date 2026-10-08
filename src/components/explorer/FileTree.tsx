"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { FileGlyph } from "@/components/icons/FileGlyph";
import { SidebarRow } from "@/components/explorer/SidebarSection";
import { cn } from "@/lib/cn";
import type { WorkspaceNode } from "@/lib/workspace/types";
import { useWorkbench } from "@/state/workbench-context";

export function FileTree({ nodes, depth = 0 }: { nodes: WorkspaceNode[]; depth?: number }) {
  return (
    <ul>
      {nodes.map((node) => (
        <FileTreeNode key={node.id} node={node} depth={depth} />
      ))}
    </ul>
  );
}

function FileTreeNode({
  node,
  depth,
}: {
  node: WorkspaceNode;
  depth: number;
}) {
  const { activeTabId, expandedIds, openFile, toggleExpanded } = useWorkbench();
  const expanded = expandedIds.includes(node.id);

  if (node.kind === "folder") {
    return (
      <li>
        <SidebarRow
          depth={depth}
          title={node.name}
          onClick={() => toggleExpanded(node.id)}
        >
          {expanded ? (
            <ChevronDown className="size-4 shrink-0 text-dim md:size-3.5" strokeWidth={2} />
          ) : (
            <ChevronRight className="size-4 shrink-0 text-dim md:size-3.5" strokeWidth={2} />
          )}
          <FileGlyph kind="folder" open={expanded} />
          <span className="truncate">{node.name}</span>
        </SidebarRow>
        {expanded && node.children ? (
          <FileTree nodes={node.children} depth={depth + 1} />
        ) : null}
      </li>
    );
  }

  return (
    <li>
      <SidebarRow
        depth={depth}
        active={activeTabId === node.id}
        title={node.name}
        onClick={() => openFile(node.id)}
      >
        <span className="inline-block w-3.5" />
        <FileGlyph kind="file" language={node.language} />
        <span className={cn("truncate", node.decoration && "text-[#e2c08d]")}>{node.name}</span>
        {node.decoration ? (
          <span
            title={node.decoration.title}
            className="ml-auto pl-2 text-[12px] font-semibold text-[#e2c08d]"
          >
            {node.decoration.letter}
          </span>
        ) : null}
      </SidebarRow>
    </li>
  );
}
