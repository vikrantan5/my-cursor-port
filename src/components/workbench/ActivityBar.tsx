"use client";

import { Settings } from "lucide-react";
import { cn } from "@/lib/cn";
import { ACTIVITY_ITEMS } from "@/components/workbench/activity-items";
import { useWorkbench } from "@/state/workbench-context";

export function ActivityBar() {
  const { sidebarView, sidebarOpen, setSidebarView, flashStatus } =
    useWorkbench();

  return (
    <aside className="flex w-12 shrink-0 flex-col border-r border-line bg-activity">
      <nav className="flex flex-1 flex-col items-center gap-1 pt-1">
        {ACTIVITY_ITEMS.map((item) => {
          const active = sidebarOpen && sidebarView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              title={item.label}
              aria-label={item.label}
              aria-pressed={active}
              onClick={() => setSidebarView(item.id)}
              className={cn(
                "relative flex size-12 items-center justify-center text-dim transition-colors hover:text-fg",
                active && "text-fg",
              )}
            >
              <span
                className={cn(
                  "absolute inset-y-2 left-0 w-0.5 rounded-r bg-fg transition-opacity",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
              <Icon className="size-[22px]" strokeWidth={1.6} />
            </button>
          );
        })}
      </nav>
      <div className="flex flex-col items-center gap-1 pb-2">
        <button
          type="button"
          title="Account"
          aria-label="Account"
          onClick={() =>
            flashStatus("Signed in as iresharma. No SSO. Just vibes.")
          }
          className="flex size-12 items-center justify-center"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-[#3d3d3d] text-[10px] font-semibold tracking-wide text-fg">
            IS
          </span>
        </button>
        <button
          type="button"
          title="Settings"
          aria-label="Settings"
          onClick={() => flashStatus("Settings are just vibes right now.")}
          className="flex size-12 items-center justify-center text-dim hover:text-fg"
        >
          <Settings className="size-[22px]" strokeWidth={1.6} />
        </button>
      </div>
    </aside>
  );
}
