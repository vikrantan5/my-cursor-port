"use client";

import { Group, Panel, Separator } from "react-resizable-panels";
import { useEffect } from "react";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { EditorPane } from "@/components/editor/EditorPane";
import { Sidebar } from "@/components/explorer/Sidebar";
import { ActivityBar } from "@/components/workbench/ActivityBar";
import { CommandPalette } from "@/components/workbench/CommandPalette";
import { StatusBar } from "@/components/workbench/StatusBar";
import { TitleBar } from "@/components/workbench/TitleBar";
import { cn } from "@/lib/cn";
import { isProjectFile } from "@/lib/projects";
import { useWorkbench, WorkbenchProvider } from "@/state/workbench-context";

export function Workbench({ initialFileId }: { initialFileId?: string }) {
  return (
    <WorkbenchProvider initialFileId={initialFileId}>
      <WorkbenchShell />
    </WorkbenchProvider>
  );
}

function WorkbenchShell() {
  const { sidebarOpen, chatOpen, activeTabId } = useWorkbench();

  useEffect(() => {
    const next =
      activeTabId && isProjectFile(activeTabId)
        ? `/projects/${activeTabId}`
        : "/";
    if (window.location.pathname !== next) {
      window.history.replaceState(window.history.state, "", next);
    }
  }, [activeTabId]);

  return (
    <div className="relative flex h-dvh max-h-dvh flex-col overflow-hidden bg-workbench text-fg">
      <TitleBar />
      <div className="flex min-h-0 flex-1">
        <ActivityBar />
        <Group orientation="horizontal" className="min-w-0 flex-1">
          {sidebarOpen ? (
            <>
              <Panel
                id="sidebar"
                defaultSize="22%"
                minSize="16%"
                maxSize="34%"
                className="min-h-0"
              >
                <Sidebar />
              </Panel>
              <ResizeHandle />
            </>
          ) : null}
          <Panel id="editor" minSize="30%" className="min-h-0">
            <EditorPane />
          </Panel>
          {chatOpen ? (
            <>
              <ResizeHandle />
              <Panel
                id="chat"
                defaultSize="28%"
                minSize="22%"
                maxSize="42%"
                className="min-h-0"
              >
                <ChatPanel />
              </Panel>
            </>
          ) : null}
        </Group>
      </div>
      <StatusBar />
      <CommandPalette />
    </div>
  );
}

function ResizeHandle() {
  return (
    <Separator
      className={cn(
        "relative w-1.5 bg-transparent",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-line",
        "hover:after:bg-accent data-[active]:after:bg-accent",
      )}
    />
  );
}
