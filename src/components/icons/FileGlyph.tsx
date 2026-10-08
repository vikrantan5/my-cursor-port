import { cn } from "@/lib/cn";
import type { FileLanguage, NodeKind } from "@/lib/workspace/types";

type FileGlyphProps = {
  kind: NodeKind;
  language?: FileLanguage;
  open?: boolean;
  className?: string;
};

export function FileGlyph({
  kind,
  language,
  open = false,
  className,
}: FileGlyphProps) {
  if (kind === "folder") {
    return (
      <svg
        viewBox="0 0 16 16"
        className={cn("size-4 shrink-0", className)}
        aria-hidden
      >
        <path
          d={
            open
              ? "M1.5 3.5h5l1 1.5H14.5v7.5H1.5z"
              : "M1.5 3.5h5l1 1.5h7.5v7.5H1.5z"
          }
          fill={open ? "#dcb67a" : "#c09553"}
        />
      </svg>
    );
  }

  if (language === "typescript") {
    return <Badge className={className} fill="#3178c6" label="TS" />;
  }

  if (language === "json") {
    return <Badge className={className} fill="#cbcb41" label="{}" dark />;
  }

  return <Badge className={className} fill="#519aba" label="M" />;
}

function Badge({
  fill,
  label,
  dark = false,
  className,
}: {
  fill: string;
  label: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={cn("size-4 shrink-0", className)}
      aria-hidden
    >
      <rect x="1.5" y="2" width="13" height="12" rx="1.5" fill={fill} />
      <text
        x="8"
        y="10.5"
        textAnchor="middle"
        fontSize={label.length > 1 ? 6.5 : 8}
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fill={dark ? "#1a1a1a" : "#ffffff"}
      >
        {label}
      </text>
    </svg>
  );
}
