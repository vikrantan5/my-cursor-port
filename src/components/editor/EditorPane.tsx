"use client";

import { Breadcrumbs } from "@/components/editor/Breadcrumbs";
import { DocumentView } from "@/components/editor/DocumentView";
import { TabBar } from "@/components/editor/TabBar";
import { modifierLabel } from "@/lib/platform";
import { useWorkbench } from "@/state/workbench-context";

export function EditorPane() {
  const { activeTabId, tabs, setCommandPaletteOpen } = useWorkbench();
  const mod = modifierLabel();

  return (
    <section className="flex h-full min-w-0 flex-col bg-editor">
      <TabBar />
      {activeTabId && tabs.length > 0 ? (
        <>
          <Breadcrumbs />
          <div className="min-h-0 flex-1 overflow-auto">
            <DocumentView id={activeTabId} />
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-[15px] text-muted">No editors open.</p>
          <p className="max-w-sm text-[13px] text-dim">
            Open a file from the explorer. Or don&apos;t. I&apos;m not your
            manager.
          </p>
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="mt-2 rounded-md border border-line px-3 py-1.5 text-[12px] text-muted hover:bg-hover hover:text-fg"
          >
            Go to file {mod}P
          </button>
        </div>
      )}
    </section>
  );
}
