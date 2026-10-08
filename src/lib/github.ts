export type GithubTimelineKind = "commit" | "pull_request" | "repo";

export type GithubPrState = "open" | "merged" | "closed";

export type GithubPrAction = "opened" | "merged" | "closed" | "reopened";

export type GithubProfile = {
  login: string;
  name: string | null;
  url: string;
  avatarUrl: string;
  repos: number;
  followers: number;
};

export type GithubTimelineItem = {
  id: string;
  kind: GithubTimelineKind;
  title: string;
  repo: string;
  url: string;
  at: string;
  branch?: string;
  sha?: string;
  prNumber?: number;
  prState?: GithubPrState;
  prAction?: GithubPrAction;
};

export type GithubSnapshot = {
  profile: GithubProfile;
  fetchedAt: string;
  items: GithubTimelineItem[];
};

export function shortRepoName(fullName: string, login: string): string {
  const prefix = `${login}/`;
  return fullName.startsWith(prefix) ? fullName.slice(prefix.length) : fullName;
}

export function formatRelativeTime(iso: string, now = Date.now()): string {
  const deltaMs = now - new Date(iso).getTime();
  const seconds = Math.round(deltaMs / 1000);
  if (!Number.isFinite(seconds) || seconds < 45) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo`;
  return `${Math.round(months / 12)}y`;
}
