"use client";

import Link from "next/link";
import { DocumentView } from "@/components/editor/DocumentView";
import { PROJECT_PAGES } from "@/lib/projects";
import { WorkbenchProvider } from "@/state/workbench-context";

export function MobileProjectPage({ id }: { id: string }) {
  const project = PROJECT_PAGES.find((item) => item.id === id);

  return (
    <WorkbenchProvider initialFileId={id}>
      <div className="flex h-dvh max-h-dvh flex-col bg-editor pt-[env(safe-area-inset-top)]">
        <header className="flex shrink-0 items-center gap-2 border-b border-line px-4 py-3">
          <Link href="/" className="text-[13px] text-accent">
            iresharma
          </Link>
          <span className="text-dim">/</span>
          <span className="truncate text-[13px] text-muted">
            {project?.fileName ?? id}
          </span>
        </header>
        <div className="min-h-0 flex-1 overflow-auto pb-[env(safe-area-inset-bottom)]">
          <DocumentView id={id} />
        </div>
      </div>
    </WorkbenchProvider>
  );
}
