import { cn } from "@/lib/cn";
import type { SymbolKind } from "@/lib/workspace/types";

const KIND: Record<
  SymbolKind,
  { fill: string; label: string; dark?: boolean }
> = {
  class: { fill: "#ee9d28", label: "C" },
  method: { fill: "#b180d7", label: "M" },
  function: { fill: "#dcdcaa", label: "F", dark: true },
  module: { fill: "#cccccc", label: "{}", dark: true },
  property: { fill: "#9cdcfe", label: "P", dark: true },
  enum: { fill: "#ee9d28", label: "E" },
  constant: { fill: "#4fc1ff", label: "K", dark: true },
  markdown: { fill: "#519aba", label: "#" },
};

export function SymbolGlyph({
  kind,
  className,
}: {
  kind: SymbolKind;
  className?: string;
}) {
  const { fill, label, dark } = KIND[kind];
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("size-3.5 shrink-0", className)}
      aria-hidden
    >
      <rect x="1.5" y="2" width="13" height="12" rx="1.5" fill={fill} />
      <text
        x="8"
        y="10.5"
        textAnchor="middle"
        fontSize={label.length > 1 ? 6 : 8}
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fill={dark ? "#1a1a1a" : "#ffffff"}
      >
        {label}
      </text>
    </svg>
  );
}
