"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FileGlyph } from "@/components/icons/FileGlyph";
import { SymbolGlyph } from "@/components/icons/SymbolGlyph";
import { cn } from "@/lib/cn";
import { searchWorkspace } from "@/lib/workspace/queries";
import { useWorkbench } from "@/state/workbench-context";

export function CommandPalette() {
  const { commandPaletteOpen } = useWorkbench();
  if (!commandPaletteOpen) return null;
  return <CommandPaletteDialog />;
}

function CommandPaletteDialog() {
  const { setCommandPaletteOpen, openFile } = useWorkbench();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchWorkspace(query), [query]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const openIndex = (index: number) => {
    const item = results[index];
    if (!item) return;
    if (item.kind === "file") openFile(item.node.id);
    else if (item.kind === "outline") openFile(item.item.id);
    else {
      openFile(item.symbol.fileId, {
        heading: item.symbol.heading,
        symbolId: item.symbol.id,
      });
    }
  };

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-black/50 md:items-start md:bg-black/40 md:px-4 md:pt-[12vh]"
      onMouseDown={() => setCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-[560px] overflow-hidden rounded-t-2xl border border-line bg-[#1f1f1f] shadow-2xl md:rounded-lg"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex justify-center pt-2 md:hidden">
          <span className="h-1 w-10 rounded-full bg-[#3d3d3d]" />
        </div>
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((index) =>
                results.length === 0 ? 0 : (index + 1) % results.length,
              );
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((index) =>
                results.length === 0
                  ? 0
                  : (index - 1 + results.length) % results.length,
              );
            }
            if (event.key === "Enter") {
              event.preventDefault();
              openIndex(activeIndex);
            }
          }}
          placeholder="Go to file"
          className="h-12 w-full border-b border-line bg-transparent px-4 text-base text-fg outline-none placeholder:text-dim md:h-11 md:text-[13px]"
        />
        <ul className="max-h-[min(60dvh,420px)] overflow-auto py-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:max-h-[320px] md:pb-1">
          {results.length === 0 ? (
            <li className="px-4 py-6 text-center text-[13px] text-dim">
              No matching files. The repo is small. This is on you.
            </li>
          ) : (
            results.map((item, index) => {
              const id =
                item.kind === "file"
                  ? item.node.id
                  : item.kind === "outline"
                    ? item.item.id
                    : item.symbol.id;
              const name =
                item.kind === "file"
                  ? item.node.name
                  : item.kind === "outline"
                    ? item.item.name
                    : item.symbol.label;
              const subtitle =
                item.kind === "file"
                  ? item.path.slice(0, -1).join("/") || "iresharma"
                  : item.kind === "outline"
                    ? "outline"
                    : item.symbol.detail ?? "career.md";
              return (
                <li key={`${item.kind}-${id}`}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => openIndex(index)}
                    className={cn(
                      "flex min-h-12 w-full items-center gap-2 px-4 py-3 text-left text-[15px] md:min-h-0 md:px-3 md:py-1.5 md:text-[13px]",
                      index === activeIndex ? "bg-selection text-fg" : "text-muted",
                    )}
                  >
                    {item.kind === "symbol" ? (
                      <SymbolGlyph kind={item.symbol.kind} />
                    ) : (
                      <FileGlyph
                        kind="file"
                        language={
                          item.kind === "file" ? item.node.language : "markdown"
                        }
                      />
                    )}
                    <span className="min-w-0 flex-1 truncate">{name}</span>
                    <span className="truncate text-[11px] text-dim">
                      {subtitle}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
