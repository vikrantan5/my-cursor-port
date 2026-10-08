"use client";

import { useEffect } from "react";
import { YouTubeLive } from "@/components/editor/YouTubeLive";
import { cn } from "@/lib/cn";
import { documents } from "@/lib/workspace/documents";
import { headingId } from "@/lib/workspace/slug";
import type { DocumentContent } from "@/lib/workspace/types";
import { useWorkbench } from "@/state/workbench-context";

const KEYWORDS = new Set([
  "export",
  "const",
  "type",
  "string",
  "boolean",
  "true",
  "false",
  "as",
]);

export function DocumentView({ id }: { id: string }) {
  const doc = documents[id];
  if (!doc) {
    return (
      <div className="p-6 text-[13px] text-dim">This file is still untracked.</div>
    );
  }

  if (doc.kind === "code") {
    return <CodeView doc={doc} />;
  }

  return <MarkdownView key={id} doc={doc} />;
}

function MarkdownView({
  doc,
}: {
  doc: Extract<DocumentContent, { kind: "markdown" }>;
}) {
  const { revealHeading, clearRevealHeading } = useWorkbench();

  useEffect(() => {
    if (!revealHeading) return;
    const node = document.getElementById(revealHeading);
    node?.scrollIntoView({ behavior: "smooth", block: "start" });
    const timeout = window.setTimeout(() => clearRevealHeading(), 1600);
    return () => window.clearTimeout(timeout);
  }, [revealHeading, clearRevealHeading]);
  return (
    <article className="mx-auto w-full max-w-[720px] px-5 py-8 md:px-8 md:py-10">
      <p className="mb-3 text-[11px] tracking-[0.14em] text-dim uppercase">
        {doc.status}
      </p>
      <h1 className="mb-5 border-b border-line pb-3 text-[24px] leading-tight font-semibold tracking-tight text-fg md:mb-6 md:text-[28px]">
        {doc.title}
      </h1>
      <div className="space-y-4 text-[15px] leading-7 text-muted">
        {doc.blocks.map((block, index) => {
          if (block.type === "callout") {
            return (
              <blockquote
                key={index}
                className="border-l-2 border-accent/70 bg-[#232323] px-4 py-3 text-[13px] text-muted"
              >
                {block.text}
              </blockquote>
            );
          }
          if (block.type === "quote") {
            return (
              <figure key={index} className="my-5">
                <blockquote className="border-l-2 border-[#d7ba7d]/80 pl-4 text-[15px] leading-7 text-fg italic">
                  {block.text}
                </blockquote>
                <figcaption className="mt-2 pl-4 text-[11px] tracking-[0.04em] text-dim">
                  {block.href ? (
                    <a
                      href={block.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent hover:underline"
                    >
                      {block.source}
                    </a>
                  ) : (
                    block.source
                  )}
                </figcaption>
              </figure>
            );
          }
          if (block.type === "h2") {
            const id = headingId(block.text);
            return (
              <h2
                key={index}
                id={id}
                className={cn(
                  "scroll-mt-4 border-b border-line pt-4 pb-1.5 text-[18px] font-semibold text-fg",
                  revealHeading === id && "bg-selection/60",
                )}
              >
                {block.text}
              </h2>
            );
          }
          if (block.type === "ul") {
            return (
              <ul key={index} className="list-disc space-y-1 pl-5">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          }
          if (block.type === "links") {
            return (
              <ul key={index} className="space-y-1.5 pt-1">
                {block.items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent hover:underline"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            );
          }
          if (block.type === "live") {
            return <YouTubeLive key={index} />;
          }
          return <p key={index}>{block.text}</p>;
        })}
      </div>
    </article>
  );
}

function CodeView({
  doc,
}: {
  doc: Extract<DocumentContent, { kind: "code" }>;
}) {
  return (
    <div className="flex min-h-full font-mono text-[13px] leading-[18px]">
      <div className="w-12 shrink-0 select-none border-r border-line pt-3 pr-3 text-right text-dim">
        {doc.lines.map((_, index) => (
          <div key={index}>{index + 1}</div>
        ))}
      </div>
      <pre className="min-w-0 flex-1 overflow-auto px-4 pt-3 pb-8">
        {doc.lines.map((line, index) => (
          <div key={index} className="min-h-[18px]">
            {highlightTs(line)}
          </div>
        ))}
      </pre>
    </div>
  );
}

function highlightTs(line: string) {
  if (line.trim().startsWith("//")) {
    return <span className="text-[#6a9955]">{line}</span>;
  }

  const tokens = line.split(/(\s+|[{\}:;,=[\]])/);
  return tokens.map((token, index) => {
    if (KEYWORDS.has(token)) {
      return (
        <span key={index} className="text-[#c586c0]">
          {token}
        </span>
      );
    }
    if (token.startsWith('"') || token.startsWith("'")) {
      return (
        <span key={index} className="text-[#ce9178]">
          {token}
        </span>
      );
    }
    if (token === "Project" || token === "status") {
      return (
        <span key={index} className="text-[#4ec9b0]">
          {token}
        </span>
      );
    }
    return <span key={index}>{token}</span>;
  });
}
