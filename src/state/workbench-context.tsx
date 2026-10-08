"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { isModKey } from "@/lib/platform";
import type { SidebarView } from "@/lib/workspace/types";
import { DEFAULT_EXPANDED, DEFAULT_OPEN_FILE } from "@/lib/workspace/tree";
import { getAncestorIds, getOpenable } from "@/lib/workspace/queries";

type WorkbenchState = {
  tabs: string[];
  activeTabId: string | null;
  expandedIds: string[];
  sidebarView: SidebarView;
  sidebarOpen: boolean;
  chatOpen: boolean;
  commandPaletteOpen: boolean;
  statusMessage: string | null;
  searchQuery: string;
  revealHeading: string | null;
  revealSymbolId: string | null;
};

type Action =
  | { type: "open-file"; id: string; heading?: string; symbolId?: string }
  | { type: "clear-reveal" }
  | { type: "clear-reveal-heading" }
  | { type: "close-tab"; id: string }
  | { type: "activate-tab"; id: string }
  | { type: "toggle-expanded"; id: string }
  | { type: "set-sidebar-view"; view: SidebarView }
  | { type: "toggle-sidebar" }
  | { type: "set-sidebar-open"; open: boolean }
  | { type: "toggle-chat" }
  | { type: "set-chat-open"; open: boolean }
  | { type: "set-command-palette"; open: boolean }
  | { type: "set-status"; message: string | null }
  | { type: "set-search"; query: string };

const initialState: WorkbenchState = {
  tabs: [DEFAULT_OPEN_FILE],
  activeTabId: DEFAULT_OPEN_FILE,
  expandedIds: DEFAULT_EXPANDED,
  sidebarView: "explorer",
  sidebarOpen: true,
  chatOpen: true,
  commandPaletteOpen: false,
  statusMessage: null,
  searchQuery: "",
  revealHeading: null,
  revealSymbolId: null,
};

function unique(ids: string[]): string[] {
  return [...new Set(ids)];
}

function reducer(state: WorkbenchState, action: Action): WorkbenchState {
  switch (action.type) {
    case "open-file": {
      if (!getOpenable(action.id)) return state;
      const ancestors = getAncestorIds(action.id);
      const tabs = state.tabs.includes(action.id)
        ? state.tabs
        : [...state.tabs, action.id];
      return {
        ...state,
        tabs,
        activeTabId: action.id,
        expandedIds: unique([...state.expandedIds, ...ancestors]),
        commandPaletteOpen: false,
        revealHeading: action.heading ?? null,
        revealSymbolId: action.symbolId ?? null,
      };
    }
    case "close-tab": {
      const index = state.tabs.indexOf(action.id);
      if (index === -1) return state;
      const tabs = state.tabs.filter((id) => id !== action.id);
      const nextActive =
        state.activeTabId === action.id
          ? (tabs[index] ?? tabs[index - 1] ?? null)
          : state.activeTabId;
      return { ...state, tabs, activeTabId: nextActive };
    }
    case "clear-reveal":
      return { ...state, revealHeading: null, revealSymbolId: null };
    case "clear-reveal-heading":
      return { ...state, revealHeading: null };
    case "activate-tab":
      return {
        ...state,
        activeTabId: action.id,
        revealHeading: null,
        revealSymbolId: null,
      };
    case "toggle-expanded": {
      const expanded = state.expandedIds.includes(action.id)
        ? state.expandedIds.filter((id) => id !== action.id)
        : [...state.expandedIds, action.id];
      return { ...state, expandedIds: expanded };
    }
    case "set-sidebar-view":
      return {
        ...state,
        sidebarView: action.view,
        sidebarOpen: true,
      };
    case "toggle-sidebar":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case "set-sidebar-open":
      return { ...state, sidebarOpen: action.open };
    case "toggle-chat":
      return { ...state, chatOpen: !state.chatOpen };
    case "set-chat-open":
      return { ...state, chatOpen: action.open };
    case "set-command-palette":
      return { ...state, commandPaletteOpen: action.open };
    case "set-status":
      return { ...state, statusMessage: action.message };
    case "set-search":
      return { ...state, searchQuery: action.query, sidebarView: "search" };
    default:
      return state;
  }
}

type WorkbenchContextValue = WorkbenchState & {
  openFile: (id: string, options?: { heading?: string; symbolId?: string }) => void;
  closeTab: (id: string) => void;
  activateTab: (id: string) => void;
  toggleExpanded: (id: string) => void;
  setSidebarView: (view: SidebarView) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleChat: () => void;
  setChatOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  flashStatus: (message: string) => void;
  setSearchQuery: (query: string) => void;
  clearReveal: () => void;
  clearRevealHeading: () => void;
};

const WorkbenchContext = createContext<WorkbenchContextValue | null>(null);

export function WorkbenchProvider({
  children,
  initialFileId,
}: {
  children: ReactNode;
  initialFileId?: string;
}) {
  const startId =
    initialFileId && getOpenable(initialFileId)
      ? initialFileId
      : DEFAULT_OPEN_FILE;
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    tabs: [startId],
    activeTabId: startId,
    expandedIds: unique([
      ...DEFAULT_EXPANDED,
      ...getAncestorIds(startId),
    ]),
  });

  const flashStatus = useCallback((message: string) => {
    dispatch({ type: "set-status", message });
  }, []);

  useEffect(() => {
    if (!state.statusMessage) return;
    const timeout = window.setTimeout(() => {
      dispatch({ type: "set-status", message: null });
    }, 2400);
    return () => window.clearTimeout(timeout);
  }, [state.statusMessage]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (isModKey(event) && key === "p") {
        event.preventDefault();
        dispatch({ type: "set-command-palette", open: true });
        return;
      }
      if (isModKey(event) && key === "b") {
        event.preventDefault();
        dispatch({ type: "toggle-sidebar" });
        return;
      }
      if (isModKey(event) && key === "l") {
        event.preventDefault();
        dispatch({ type: "toggle-chat" });
        return;
      }
      if (isModKey(event) && key === "w") {
        event.preventDefault();
        if (state.activeTabId) {
          dispatch({ type: "close-tab", id: state.activeTabId });
        }
        return;
      }
      if (event.key === "Escape") {
        dispatch({ type: "set-command-palette", open: false });
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [state.activeTabId]);

  const value = useMemo<WorkbenchContextValue>(
    () => ({
      ...state,
      openFile: (id, options) =>
        dispatch({
          type: "open-file",
          id,
          heading: options?.heading,
          symbolId: options?.symbolId,
        }),
      closeTab: (id) => dispatch({ type: "close-tab", id }),
      activateTab: (id) => dispatch({ type: "activate-tab", id }),
      toggleExpanded: (id) => dispatch({ type: "toggle-expanded", id }),
      setSidebarView: (view) => dispatch({ type: "set-sidebar-view", view }),
      toggleSidebar: () => dispatch({ type: "toggle-sidebar" }),
      setSidebarOpen: (open) => dispatch({ type: "set-sidebar-open", open }),
      toggleChat: () => dispatch({ type: "toggle-chat" }),
      setChatOpen: (open) => dispatch({ type: "set-chat-open", open }),
      setCommandPaletteOpen: (open) =>
        dispatch({ type: "set-command-palette", open }),
      flashStatus,
      setSearchQuery: (query) => dispatch({ type: "set-search", query }),
      clearReveal: () => dispatch({ type: "clear-reveal" }),
      clearRevealHeading: () => dispatch({ type: "clear-reveal-heading" }),
    }),
    [state, flashStatus],
  );

  return (
    <WorkbenchContext.Provider value={value}>
      {children}
    </WorkbenchContext.Provider>
  );
}

export function useWorkbench() {
  const context = useContext(WorkbenchContext);
  if (!context) {
    throw new Error("useWorkbench must be used within WorkbenchProvider");
  }
  return context;
}
