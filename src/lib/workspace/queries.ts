import { fileTree, outlineItems } from "./tree";
import { flattenOutline, outlineTree } from "./outline";
import type { OutlineItem, OutlineSymbol, WorkspaceNode } from "./types";

export function flattenFiles(node: WorkspaceNode = fileTree): WorkspaceNode[] {
  const files: WorkspaceNode[] = [];

  const walk = (current: WorkspaceNode) => {
    if (current.kind === "file") files.push(current);
    current.children?.forEach(walk);
  };

  walk(node);
  return files;
}

export function findNode(
  id: string,
  node: WorkspaceNode = fileTree,
): WorkspaceNode | undefined {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const match = findNode(id, child);
    if (match) return match;
  }
  return undefined;
}

export function getPathNames(
  id: string,
  node: WorkspaceNode = fileTree,
): string[] {
  const path: string[] = [];

  const walk = (current: WorkspaceNode, acc: string[]): boolean => {
    const next = [...acc, current.name];
    if (current.id === id) {
      path.push(...next);
      return true;
    }
    return (current.children ?? []).some((child) => walk(child, next));
  };

  walk(node, []);
  return path;
}

export function getAncestorIds(
  id: string,
  node: WorkspaceNode = fileTree,
): string[] {
  const ancestors: string[] = [];

  const walk = (current: WorkspaceNode, acc: string[]): boolean => {
    if (current.id === id) {
      ancestors.push(...acc);
      return true;
    }
    return (current.children ?? []).some((child) =>
      walk(child, [...acc, current.id]),
    );
  };

  walk(node, []);
  return ancestors;
}

export function getOpenable(
  id: string,
): { id: string; name: string; path: string[] } | undefined {
  const file = findNode(id);
  if (file?.kind === "file") {
    return { id: file.id, name: file.name, path: getPathNames(file.id) };
  }

  const post = outlineItems.find((item) => item.id === id);
  if (post) {
    return {
      id: post.id,
      name: post.name,
      path: [fileTree.name, "outline", post.name],
    };
  }

  return undefined;
}

export function searchWorkspace(query: string): Array<
  | { kind: "file"; node: WorkspaceNode; path: string[] }
  | { kind: "outline"; item: OutlineItem }
  | { kind: "symbol"; symbol: OutlineSymbol }
> {
  const needle = query.trim().toLowerCase();
  const files = flattenFiles().flatMap((node) => {
    const path = getPathNames(node.id);
    const haystack = `${node.name} ${path.join(" ")}`.toLowerCase();
    if (needle && !haystack.includes(needle)) return [];
    return [{ kind: "file" as const, node, path }];
  });

  const posts = outlineItems.flatMap((item) => {
    const haystack = `${item.name} ${item.hint}`.toLowerCase();
    if (needle && !haystack.includes(needle)) return [];
    return [{ kind: "outline" as const, item }];
  });

  const symbols = flattenOutline(outlineTree()).flatMap((symbol) => {
    if (outlineItems.some((item) => item.id === symbol.id)) return [];
    const haystack = `${symbol.label} ${symbol.detail ?? ""}`.toLowerCase();
    if (needle && !haystack.includes(needle)) return [];
    return [{ kind: "symbol" as const, symbol }];
  });

  return [...files, ...symbols, ...posts];
}
