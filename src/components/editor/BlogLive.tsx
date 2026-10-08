"use client";

import { useEffect, useState } from "react";
import { formatCount, formatPublished } from "@/lib/youtube";
import type { BlogPost, BlogSnapshot } from "@/lib/blog";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; data: BlogSnapshot }
  | { status: "error" };

export function BlogLive() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetch("/api/blog")
      .then(async (response) => {
        if (!response.ok) return { status: "error" } as const;
        const data = (await response.json()) as BlogSnapshot;
        return { status: "ready", data } as const;
      })
      .then((next) => {
        if (!cancelled) setState(next);
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <div className="space-y-4">
        <MarkdownHeading>Stats</MarkdownHeading>
        <p className="text-[13px] text-dim italic">Scraping the homepage…</p>
        <StatsTable followers="—" posts="—" views="—" />
        <MarkdownHeading>Latest</MarkdownHeading>
        <ul className="space-y-3">
          {["a", "b", "c", "d"].map((key) => (
            <li key={key} className="flex gap-3">
              <div className="aspect-video w-[42%] max-w-[220px] shrink-0 rounded-md border border-line bg-[#232323]" />
              <div className="min-w-0 flex-1">
                <div className="h-4 w-3/4 rounded-sm bg-[#232323]" />
                <div className="mt-2 h-3 w-1/2 rounded-sm bg-[#232323]" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (state.status !== "ready") {
    return (
      <div className="space-y-4">
        <MarkdownHeading>Stats</MarkdownHeading>
        <p className="text-[13px] text-dim italic">
          Could not scrape blog.iresharma.com. The links below still work.
        </p>
      </div>
    );
  }

  const { publication, latest } = state.data;
  const posts = Array.isArray(latest) ? latest : [];

  return (
    <div className="space-y-4">
      <MarkdownHeading>Stats</MarkdownHeading>
      <p>
        <a
          href={publication.url}
          target="_blank"
          rel="noreferrer"
          className="text-accent hover:underline"
        >
          blog.iresharma.com
        </a>
        {" — "}
        {publication.title}
      </p>
      <StatsTable
        followers={formatCount(publication.followers)}
        posts={formatCount(publication.posts)}
        views={formatCount(publication.views)}
      />

      <MarkdownHeading>Latest</MarkdownHeading>
      <p className="text-[13px] text-dim italic">
        Scraped off the homepage. Hashnode can keep the GraphQL tax.
      </p>
      {posts.length > 0 ? (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li key={post.id}>
              <PostRow post={post} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[13px] text-dim italic">
          The scrape came back empty. Outrageous, but the archive is below.
        </p>
      )}
    </div>
  );
}

function PostRow({ post }: { post: BlogPost }) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noreferrer"
      className="group flex gap-3"
    >
      <span className="relative aspect-video w-[42%] max-w-[220px] shrink-0 overflow-hidden rounded-md border border-line bg-[#232323]">
        {post.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverUrl}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        ) : null}
      </span>
      <span className="min-w-0 py-0.5">
        <span className="block font-semibold text-accent group-hover:underline">
          {post.title}
        </span>
        <span className="mt-1 block text-[13px] text-dim italic">
          {post.publishedAt ? formatPublished(post.publishedAt) : null}
          {post.readTimeInMinutes > 0
            ? ` · ${post.readTimeInMinutes} min`
            : null}
          {post.views > 0 ? ` · ${formatCount(post.views)} views` : null}
        </span>
      </span>
    </a>
  );
}

function MarkdownHeading({ children }: { children: string }) {
  return (
    <h2 className="border-b border-line pt-4 pb-1.5 text-[18px] font-semibold text-fg">
      {children}
    </h2>
  );
}

function StatsTable({
  followers,
  posts,
  views,
}: {
  followers: string;
  posts: string;
  views: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[14px] leading-6">
        <thead>
          <tr className="bg-[#232323] text-left text-dim">
            <th className="border border-line px-3 py-1.5 font-medium">
              followers
            </th>
            <th className="border border-line px-3 py-1.5 font-medium">
              posts
            </th>
            <th className="border border-line px-3 py-1.5 font-medium">
              views
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-fg">
            <td className="border border-line px-3 py-1.5 font-semibold tabular-nums">
              {followers}
            </td>
            <td className="border border-line px-3 py-1.5 font-semibold tabular-nums">
              {posts}
            </td>
            <td className="border border-line px-3 py-1.5 font-semibold tabular-nums">
              {views}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
