"use client";

import { useEffect, useState } from "react";
import {
  formatCount,
  formatDuration,
  formatPublished,
  type YoutubeSnapshot,
  type YoutubeVideo,
} from "@/lib/youtube";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; data: YoutubeSnapshot }
  | { status: "unconfigured" }
  | { status: "error" };

export function YouTubeLive() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetch("/api/youtube")
      .then(async (response) => {
        if (response.status === 503) return { status: "unconfigured" } as const;
        if (!response.ok) return { status: "error" } as const;
        const data = (await response.json()) as YoutubeSnapshot;
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
        <p className="text-[13px] text-dim italic">Pulling the channel JSON…</p>
        <StatsTable
          subscribers="—"
          views="—"
          videos="—"
        />
        <MarkdownHeading>Latest</MarkdownHeading>
        <p className="text-[13px] text-dim italic">
          Long form only. Scanning past the Shorts…
        </p>
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
          {state.status === "unconfigured"
            ? "YouTube stats are still untracked. Drop a Data API key in the env and this table will compile."
            : "The Data API blinked. Channel link still works below."}
        </p>
      </div>
    );
  }

  const { channel, latest } = state.data;
  const videos = Array.isArray(latest) ? latest : [];

  return (
    <div className="space-y-4">
      <MarkdownHeading>Stats</MarkdownHeading>
      <p>
        <a
          href={channel.url}
          target="_blank"
          rel="noreferrer"
          className="text-accent hover:underline"
        >
          youtube.com/@{channel.handle}
        </a>
        {" — "}
        {channel.title}
      </p>
      <StatsTable
        subscribers={
          channel.subscribers == null
            ? "hidden"
            : formatCount(channel.subscribers)
        }
        views={formatCount(channel.views)}
        videos={formatCount(channel.videos)}
      />

      <MarkdownHeading>Latest</MarkdownHeading>
      <p className="text-[13px] text-dim italic">
        Long form only. The 22-second ones have their own factory.
      </p>
      {videos.length > 0 ? (
        <ul className="space-y-3">
          {videos.map((video) => (
            <li key={video.id}>
              <VideoRow video={video} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[13px] text-dim italic">
          No long-form uploads in the recent pile. Shorts do not count.
        </p>
      )}
    </div>
  );
}

function VideoRow({ video }: { video: YoutubeVideo }) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noreferrer"
      className="group flex gap-3"
    >
      <span className="relative aspect-video w-[42%] max-w-[220px] shrink-0 overflow-hidden rounded-md border border-line bg-[#232323]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="h-full w-full object-cover"
        />
      </span>
      <span className="min-w-0 py-0.5">
        <span className="block font-semibold text-accent group-hover:underline">
          {video.title}
        </span>
        <span className="mt-1 block text-[13px] text-dim italic">
          {formatPublished(video.publishedAt)}
          {video.durationSeconds > 0
            ? ` · ${formatDuration(video.durationSeconds)}`
            : null}
          {video.views != null ? ` · ${formatCount(video.views)} views` : null}
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
  subscribers,
  views,
  videos,
}: {
  subscribers: string;
  views: string;
  videos: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[14px] leading-6">
        <thead>
          <tr className="bg-[#232323] text-left text-dim">
            <th className="border border-line px-3 py-1.5 font-medium">
              subscribers
            </th>
            <th className="border border-line px-3 py-1.5 font-medium">
              views
            </th>
            <th className="border border-line px-3 py-1.5 font-medium">
              videos
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-fg">
            <td className="border border-line px-3 py-1.5 font-semibold tabular-nums">
              {subscribers}
            </td>
            <td className="border border-line px-3 py-1.5 font-semibold tabular-nums">
              {views}
            </td>
            <td className="border border-line px-3 py-1.5 font-semibold tabular-nums">
              {videos}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
