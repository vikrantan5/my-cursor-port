import { codeloomReceiptsText } from "@/lib/codeloom";
import { documents } from "@/lib/workspace/documents";
import type { DocumentContent } from "@/lib/workspace/types";

function serializeDocument(id: string, doc: DocumentContent): string {
  if (doc.kind === "code") {
    return `# ${id}\n${doc.lines.join("\n")}`;
  }

  const lines: string[] = [`# ${doc.title}`];
  for (const block of doc.blocks) {
    switch (block.type) {
      case "p":
      case "callout":
        lines.push(block.text);
        break;
      case "quote":
        lines.push(`> ${block.text}`);
        lines.push(
          `  — ${block.source}${block.href ? ` (${block.href})` : ""}`,
        );
        break;
      case "h2":
        lines.push(`## ${block.text}`);
        break;
      case "ul":
        lines.push(...block.items.map((item) => `- ${item}`));
        break;
      case "links":
        lines.push(
          ...block.items.map((item) => `- ${item.label}: ${item.href}`),
        );
        break;
      case "live":
        if (block.source === "codeloom") {
          lines.push(codeloomReceiptsText());
          break;
        }
        lines.push(
          `(live ${block.source} widget on the site; treat counts as current-ish, jokes as cached)`,
        );
        break;
    }
  }
  return lines.join("\n");
}

export function buildKnowledgeBase(): string {
  return Object.entries(documents)
    .map(([id, doc]) => serializeDocument(id, doc))
    .join("\n\n");
}
