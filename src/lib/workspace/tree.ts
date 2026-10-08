import type { WorkspaceNode } from "./types";

export { outlineItems } from "./outline";

export const WORKSPACE_NAME = "vikrantan5";

export const fileTree: WorkspaceNode = {
  id: "root",
  name: WORKSPACE_NAME,
  kind: "folder",
  children: [
    { id: "readme", name: "README.md", kind: "file", language: "markdown" },
    { id: "about", name: "about.md", kind: "file", language: "markdown" },
    { id: "career", name: "career.md", kind: "file", language: "markdown" },
    { id: "projects", name: "projects.ts", kind: "file", language: "typescript" },
    {
      id: "projects-dir",
      name: "major-projects",
      kind: "folder",
      children: [
        {
          id: "hireai",
          name: "hireai.md",
          kind: "file",
          language: "markdown",
          decoration: { letter: "M", title: "Modified — 100+ users and a Razorpay webhook since you last looked" },
        },
        { id: "movielab", name: "movielab.md", kind: "file", language: "markdown" },
      ],
    },
    {
      id: "extras",
      name: "extras",
      kind: "folder",
      children: [
        { id: "hobbies", name: "hobbies.md", kind: "file", language: "markdown" },
        { id: "achievements", name: "achievements.md", kind: "file", language: "markdown" },
        { id: "youtube", name: "youtube.md", kind: "file", language: "markdown" },
      ],
    },
  ],
};

export const DEFAULT_OPEN_FILE = "readme";
export const DEFAULT_EXPANDED = ["root", "projects-dir", "extras"];
