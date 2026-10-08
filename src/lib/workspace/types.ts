export type FileLanguage = "markdown" | "typescript" | "json";

export type NodeKind = "file" | "folder";

export type WorkspaceNode = {
  id: string;
  name: string;
  kind: NodeKind;
  language?: FileLanguage;
  children?: WorkspaceNode[];
  decoration?: { letter: string; title: string };
};

export type OutlineItem = {
  id: string;
  name: string;
  hint: string;
};

export type SymbolKind =
  | "class"
  | "method"
  | "function"
  | "module"
  | "property"
  | "enum"
  | "constant"
  | "markdown";

export type OutlineSymbol = {
  id: string;
  label: string;
  detail?: string;
  kind: SymbolKind;
  fileId: string;
  heading?: string;
  children?: OutlineSymbol[];
};

export type MarkdownBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string }
  | {
      type: "quote";
      text: string;
      source: string;
      href?: string;
    }
  | { type: "links"; items: Array<{ label: string; href: string }> }
  | { type: "live"; source: "youtube" | "codeloom" };

export type DocumentContent =
  | {
      kind: "markdown";
      title: string;
      status: "draft" | "stub" | "live";
      blocks: MarkdownBlock[];
    }
  | {
      kind: "code";
      language: "typescript";
      lines: string[];
    };

export type SidebarView = "explorer" | "search" | "scm";