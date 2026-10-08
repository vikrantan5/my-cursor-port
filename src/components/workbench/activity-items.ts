import { Files, GitBranch, Search, type LucideIcon } from "lucide-react";
import type { SidebarView } from "@/lib/workspace/types";

export const ACTIVITY_ITEMS: Array<{
  id: SidebarView;
  label: string;
  icon: LucideIcon;
}> = [
  { id: "explorer", label: "Explorer", icon: Files },
  { id: "search", label: "Search", icon: Search },
  { id: "scm", label: "Source Control", icon: GitBranch },
];
