import { codeloomReceiptsText } from "@/lib/codeloom";
import { documents } from "@/lib/workspace/documents";
import type { DocumentContent, MarkdownBlock } from "@/lib/workspace/types";
import { SITE_DESCRIPTION } from "@/lib/site";

export function CrawlerContent({ ids }: { ids?: string[] }) {
  const entries = ids
    ? ids.flatMap((id) => {
        const doc = documents[id];
        return doc ? ([[id, doc]] as const) : [];
      })
    : Object.entries(documents);

  return (
    <section className="sr-only" aria-hidden="true">
      <p>{SITE_DESCRIPTION}</p>
      {entries.map(([id, doc]) => (
        <article key={id}>
          <DocumentArticle doc={doc} />
        </article>
      ))}
    </section>
  );
}

function DocumentArticle({ doc }: { doc: DocumentContent }) {
  if (doc.kind === "code") {
    return (
      <>
        <h2>projects.ts</h2>
        <pre>
          <code>{doc.lines.join("\n")}</code>
        </pre>
      </>
    );
  }

  return (
    <>
      <h2>{doc.title}</h2>
      {doc.blocks.map((block, index) => (
        <Block key={`${doc.title}-${index}`} block={block} />
      ))}
    </>
  );
}

function Block({ block }: { block: MarkdownBlock }) {
  switch (block.type) {
    case "h2":
      return <h3>{block.text}</h3>;
    case "p":
    case "callout":
      return <p>{block.text}</p>;
    case "quote":
      return (
        <blockquote>
          <p>{block.text}</p>
          <p>
            {block.href ? (
              <a href={block.href}>{block.source}</a>
            ) : (
              block.source
            )}
          </p>
        </blockquote>
      );
    case "ul":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "links":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      );
    case "live":
      if (block.source === "codeloom") {
        return <pre>{codeloomReceiptsText()}</pre>;
      }
      return (
        <p>
          Live {block.source} stats are shown in the editor window when
          JavaScript is available.
        </p>
      );
  }
}
