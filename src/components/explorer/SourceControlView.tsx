"use client";

import {
  FolderGit2,
  GitCommitHorizontal,
  GitMerge,
  GitPullRequest,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SidebarSection } from "@/components/explorer/SidebarSection";
import { cn } from "@/lib/cn";
import {
  formatRelativeTime,
  shortRepoName,
  type GithubSnapshot,
  type GithubTimelineItem,
  type GithubTimelineKind,
} from "@/lib/github";
import { formatCount } from "@/lib/youtube";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; data: GithubSnapshot }
  | { status: "error" };

type Filter = "all" | GithubTimelineKind;

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "All" },
  { id: "commit", label: "Commits" },
  { id: "pull_request", label: "PRs" },
  { id: "repo", label: "Repos" },
];

async function fetchSnapshot(): Promise<LoadState> {
  const response = await fetch("/api/github");
  if (!response.ok) return { status: "error" };
  const data = (await response.json()) as GithubSnapshot;
  if (!data?.profile || !Array.isArray(data.items)) {
    return { status: "error" };
  }
  return { status: "ready", data };
}

export function SourceControlView() {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [now, setNow] = useState(() => Date.now());
  const requestId = useRef(0);

  useEffect(() => {
    const id = ++requestId.current;
    fetchSnapshot()
      .then((next) => {
        if (requestId.current !== id) return;
        setNow(Date.now());
        setState(next);
      })
      .catch(() => {
        if (requestId.current !== id) return;
        setState({ status: "error" });
      });
  }, []);

  const onRefresh = useCallback(() => {
    const id = ++requestId.current;
    setRefreshing(true);
    fetchSnapshot()
      .then((next) => {
        if (requestId.current !== id) return;
        setNow(Date.now());
        setState(next);
        setRefreshing(false);
      })
      .catch(() => {
        if (requestId.current !== id) return;
        setState({ status: "error" });
        setRefreshing(false);
      });
  }, []);

  const visible = useMemo(() => {
    const items = state.status === "ready" ? state.data.items : [];
    return filter === "all" ? items : items.filter((item) => item.kind === filter);
  }, [filter, state]);
  const busy = state.status === "loading" || refreshing;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Header
        state={state}
        now={now}
        busy={busy}
        onRefresh={onRefresh}
      />
      <div className="flex flex-wrap gap-1 px-3 pb-2">
        {FILTERS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setFilter(option.id)}
            className={cn(
              "rounded-sm px-1.5 py-0.5 text-[11px] tracking-wide",
              filter === option.id
                ? "bg-selection text-fg"
                : "text-dim hover:bg-hover hover:text-fg",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-auto pb-3">
        <SidebarSection title="Timeline">
          {state.status === "loading" ? <TimelineSkeleton /> : null}
          {state.status === "error" ? (
            <p className="px-4 py-3 text-[12px] text-dim italic">
              GitHub blinked. The history is still on github.com/iresharma.
            </p>
          ) : null}
          {state.status === "ready" && visible.length === 0 ? (
            <p className="px-4 py-3 text-[12px] text-dim italic">
              {filter === "all"
                ? "No public activity in the recent pile. Either a sabbatical or the API is shy."
                : "Nothing in this filter. GitHub has opinions about what counts."}
            </p>
          ) : null}
          {state.status === "ready" && visible.length > 0 ? (
            <ul>
              {visible.map((item) => (
                <li key={item.id}>
                  <TimelineRow
                    item={item}
                    login={state.data.profile.login}
                    now={now}
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </SidebarSection>
      </div>
    </div>
  );
}

function Header({
  state,
  now,
  busy,
  onRefresh,
}: {
  state: LoadState;
  now: number;
  busy: boolean;
  onRefresh: () => void;
}) {
  const profile = state.status === "ready" ? state.data.profile : null;
  const refreshed =
    state.status === "ready"
      ? formatRefreshed(state.data.fetchedAt, now)
      : null;

  return (
    <div className="flex items-start justify-between gap-2 px-3 pb-2 text-[12px] text-muted">
      <div className="min-w-0">
        {profile ? (
          <>
            <p>
              <a
                href={profile.url}
                target="_blank"
                rel="noreferrer"
                className="text-fg hover:underline"
              >
                {profile.login}
              </a>
              <span className="text-dim">
                {" · "}
                {formatCount(profile.repos)} repos
              </span>
            </p>
            <p className="text-dim">
              {formatCount(profile.followers)} followers
              {refreshed ? ` · ${refreshed}` : null}
            </p>
          </>
        ) : (
          <>
            <p>
              <span className="text-fg">iresharma</span>
              <span className="text-dim"> · asking GitHub…</span>
            </p>
            <p className="text-dim">Public timeline, last 90 days.</p>
          </>
        )}
      </div>
      <button
        type="button"
        title="Refresh timeline"
        aria-label="Refresh timeline"
        onClick={onRefresh}
        disabled={busy}
        className="rounded p-0.5 text-dim hover:bg-hover hover:text-fg disabled:opacity-50"
      >
        <RefreshCw
          className={cn("size-3.5", busy && "animate-spin")}
          strokeWidth={1.8}
        />
      </button>
    </div>
  );
}

function TimelineRow({
  item,
  login,
  now,
}: {
  item: GithubTimelineItem;
  login: string;
  now: number;
}) {
  const repo = shortRepoName(item.repo, login);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      title={item.title}
      className="flex w-full items-start gap-1.5 px-3 py-1.5 text-left hover:bg-hover md:py-1"
    >
      <TimelineIcon item={item} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] text-fg">{item.title}</span>
        <span className="block truncate text-[11px] text-dim">
          {kindLabel(item)}
          {" · "}
          {repo}
          {item.sha ? ` · ${item.sha.slice(0, 7)}` : null}
          {" · "}
          {formatRelativeTime(item.at, now)}
        </span>
      </span>
    </a>
  );
}

function TimelineSkeleton() {
  return (
    <ul className="px-3">
      {["a", "b", "c", "d", "e", "f", "g", "h"].map((key) => (
        <li key={key} className="flex items-start gap-1.5 py-1.5">
          <span className="mt-0.5 size-3.5 shrink-0 rounded-sm bg-[#2a2a2a]" />
          <span className="min-w-0 flex-1">
            <span className="block h-3 w-[88%] rounded-sm bg-[#2a2a2a]" />
            <span className="mt-1.5 block h-2.5 w-[52%] rounded-sm bg-[#232323]" />
          </span>
        </li>
      ))}
    </ul>
  );
}

function formatRefreshed(iso: string, now: number): string {
  const relative = formatRelativeTime(iso, now);
  return relative === "just now" ? "just now" : `fetched ${relative} ago`;
}

function TimelineIcon({ item }: { item: GithubTimelineItem }) {
  const className = cn("mt-0.5 size-3.5 shrink-0", iconClass(item));
  if (item.kind === "repo") {
    return <FolderGit2 className={className} strokeWidth={1.8} />;
  }
  if (item.kind === "commit") {
    return <GitCommitHorizontal className={className} strokeWidth={1.8} />;
  }
  if (item.prState === "merged" || item.prAction === "merged") {
    return <GitMerge className={className} strokeWidth={1.8} />;
  }
  return <GitPullRequest className={className} strokeWidth={1.8} />;
}

function iconClass(item: GithubTimelineItem): string {
  if (item.kind === "commit") return "text-[#7ee787]";
  if (item.kind === "repo") return "text-[#dcb67a]";
  if (item.prState === "merged" || item.prAction === "merged") {
    return "text-[#a371f7]";
  }
  if (item.prState === "closed") return "text-[#f85149]";
  return "text-accent";
}

function kindLabel(item: GithubTimelineItem): string {
  if (item.kind === "commit") return "commit";
  if (item.kind === "repo") return "repo";
  if (item.prAction === "merged") return "merged";
  if (item.prAction === "opened") return "opened";
  if (item.prAction === "reopened") return "reopened";
  return "pr";
}
