"use client";

import { ArrowUpDown, ChevronDown, ChevronRight, FoldVertical } from "lucide-react";
import { useMemo, useState } from "react";
import { SymbolGlyph } from "@/components/icons/SymbolGlyph";
import { cn } from "@/lib/cn";
import {
  expandableIds,
  outlineTree,
} from "@/lib/workspace/outline";
import type { OutlineSymbol } from "@/lib/workspace/types";
import { useWorkbench } from "@/state/workbench-context";

export function Outline() {
  const tree = outlineTree(false);
  const [oldestFirst, setOldestFirst] = useState(false);
  const symbols = useMemo(() => outlineTree(oldestFirst), [oldestFirst]);
  const [expanded, setExpanded] = useState(() => new Set(expandableIds(tree)));
  const { flashStatus } = useWorkbench();

  const toggle = (id: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div>
      <div className="flex h-6 items-center justify-end gap-0.5 px-2">
        <button
          type="button"
          title={oldestFirst ? "Sort by position (newest first)" : "Sort by date (oldest first)"}
          aria-label="Sort outline"
          onClick={() => setOldestFirst((value) => !value)}
          className="rounded p-0.5 text-dim hover:bg-hover hover:text-fg"
        >
          <ArrowUpDown className="size-3.5" strokeWidth={1.8} />
        </button>
        <button
          type="button"
          title="Collapse All"
          aria-label="Collapse All"
          onClick={() => {
            setExpanded(new Set());
            flashStatus("Outline folded. The career still happened.");
          }}
          className="rounded p-0.5 text-dim hover:bg-hover hover:text-fg"
        >
          <FoldVertical className="size-3.5" strokeWidth={1.8} />
        </button>
      </div>
      <ul>
        {symbols.map((symbol) => (
          <OutlineNode
            key={symbol.id}
            symbol={symbol}
            depth={0}
            expanded={expanded}
            onToggle={toggle}
          />
        ))}
      </ul>
    </div>
  );
}

function OutlineNode({
  symbol,
  depth,
  expanded,
  onToggle,
}: {
  symbol: OutlineSymbol;
  depth: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
}) {
  const { activeTabId, revealSymbolId, openFile } = useWorkbench();
  const kids = symbol.children ?? [];
  const hasChildren = kids.length > 0;
  const open = hasChildren && expanded.has(symbol.id);
  const active =
    revealSymbolId === symbol.id || activeTabId === symbol.id;

  return (
    <li>
      <div
        className={cn(
          "flex h-10 w-full items-center md:h-[22px]",
          active && "bg-selection text-fg",
          !active && "text-muted hover:bg-hover",
        )}
        style={{ paddingLeft: 4 + depth * 8 }}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-label={open ? "Collapse" : "Expand"}
            onClick={() => onToggle(symbol.id)}
            className="flex size-6 shrink-0 items-center justify-center text-dim md:size-4"
          >
            {open ? (
              <ChevronDown className="size-3.5" strokeWidth={2} />
            ) : (
              <ChevronRight className="size-3.5" strokeWidth={2} />
            )}
          </button>
        ) : (
          <span className="inline-block w-6 shrink-0 md:w-4" />
        )}
        <button
          type="button"
          title={symbol.detail ? `${symbol.label}  ${symbol.detail}` : symbol.label}
          onClick={() => {
            openFile(symbol.fileId, {
              heading: symbol.heading,
              symbolId: symbol.id,
            });
            if (hasChildren && !open) onToggle(symbol.id);
          }}
          className="flex min-w-0 flex-1 items-center gap-1 py-2 pr-2 text-left text-[14px] md:py-0 md:pr-2 md:text-[13px]"
        >
          <SymbolGlyph kind={symbol.kind} />
          <span className="min-w-0 flex-1 truncate">{symbol.label}</span>
          {symbol.detail ? (
            <span className="max-w-[46%] shrink-0 truncate text-[11px] text-dim">
              {symbol.detail}
            </span>
          ) : null}
        </button>
      </div>
      {open ? (
        <ul>
          {kids.map((child) => (
            <OutlineNode
              key={child.id}
              symbol={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
