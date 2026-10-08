"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { type ReactNode, useState } from "react";
import { cn } from "@/lib/cn";

type SidebarSectionProps = {
  title: string;
  defaultOpen?: boolean;
  actions?: ReactNode;
  children: ReactNode;
};

export function SidebarSection({
  title,
  defaultOpen = true,
  actions,
  children,
}: SidebarSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="shrink-0">
      <div className="flex h-8 items-center gap-0.5 px-2 md:h-6">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex min-w-0 flex-1 items-center gap-0.5 text-left text-[11px] font-semibold tracking-[0.08em] text-muted uppercase"
        >
          {open ? (
            <ChevronDown className="size-4 shrink-0 md:size-3.5" strokeWidth={2} />
          ) : (
            <ChevronRight className="size-4 shrink-0 md:size-3.5" strokeWidth={2} />
          )}
          <span className="truncate">{title}</span>
        </button>
        {actions}
      </div>
      {open ? children : null}
    </section>
  );
}

export function SidebarRow({
  depth,
  active,
  onClick,
  children,
  title,
}: {
  depth: number;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{ paddingLeft: 8 + depth * 12 }}
      className={cn(
        "flex h-10 w-full items-center gap-1 pr-3 text-left text-[14px] text-muted hover:bg-hover md:h-[22px] md:pr-2 md:text-[13px]",
        active && "bg-selection text-fg hover:bg-selection",
      )}
    >
      {children}
    </button>
  );
}
