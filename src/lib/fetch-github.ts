import type {
  GithubPrAction,
  GithubPrState,
  GithubSnapshot,
  GithubTimelineItem,
} from "@/lib/github";

const API = "https://api.github.com";
const REVALIDATE_SECONDS = 5 * 60;
const TIMELINE_LIMIT = 40;
const REPO_LOOKBACK_MS = 90 * 24 * 60 * 60 * 1000;
const USER_AGENT =
  "iresharma-portfolio/1.0 (+https://github.com/iresharma/cursor-portfolio)";

type GithubUser = {
  login: string;
  name?: string | null;
  html_url: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
};

type GithubRepo = {
  full_name: string;
  html_url: string;
  description?: string | null;
  created_at: string;
  pushed_at?: string;
};

type GithubEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    action?: string;
    number?: number;
    ref?: string | null;
    ref_type?: string;
    master_branch?: string;
    description?: string | null;
    head?: string;
    before?: string;
    pull_request?: {
      number?: number;
      merged?: boolean;
      html_url?: string;
      title?: string;
      state?: string;
      merged_at?: string | null;
    };
  };
};

type SearchIssuesResponse = {
  items?: Array<{
    number: number;
    title: string;
    html_url: string;
    state: string;
    created_at: string;
    closed_at?: string | null;
    repository_url: string;
    pull_request?: { merged_at?: string | null };
  }>;
};

type SearchCommitsResponse = {
  items?: Array<{
    sha: string;
    html_url: string;
    commit?: {
      message?: string;
      author?: { date?: string };
      committer?: { date?: string };
    };
    repository?: { full_name?: string };
  }>;
};

function usernameFromEnv(): string {
  return process.env.GITHUB_USERNAME?.trim() || "iresharma";
}

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": USER_AGENT,
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function githubGet<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const url = new URL(`${API}${path}`);
  for (const [name, value] of Object.entries(params ?? {})) {
    url.searchParams.set(name, value);
  }

  const response = await fetch(url, {
    headers: githubHeaders(),
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`GitHub ${path} failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

async function githubGetOptional<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T | null> {
  try {
    return await githubGet<T>(path, params);
  } catch {
    return null;
  }
}

function firstLine(message: string): string {
  return message.split("\n")[0]?.trim() || message.trim();
}

function branchName(ref: string | null | undefined): string | undefined {
  if (!ref) return undefined;
  return ref.replace(/^refs\/heads\//, "").replace(/^refs\/tags\//, "");
}

function repoFromApiUrl(url: string): string {
  return url.replace("https://api.github.com/repos/", "");
}

function isZeroSha(sha: string | undefined): boolean {
  return Boolean(sha && /^0+$/.test(sha));
}

function prActionFromEvent(
  action: string | undefined,
  merged: boolean | undefined,
): GithubPrAction | null {
  if (action === "opened" || action === "reopened" || action === "merged") {
    return action;
  }
  if (action === "closed") return merged ? "merged" : "closed";
  return null;
}

function prStateFromAction(action: GithubPrAction): GithubPrState {
  if (action === "opened" || action === "reopened") return "open";
  if (action === "merged") return "merged";
  return "closed";
}

function isRepoBirth(event: GithubEvent): boolean {
  const { ref_type, ref, master_branch } = event.payload;
  if (ref_type === "repository") return true;
  return ref_type === "branch" && Boolean(ref) && ref === master_branch;
}

function commitUrl(repo: string, event: GithubEvent, htmlUrl?: string): string {
  if (htmlUrl) return htmlUrl;
  const head = event.payload.head;
  const before = event.payload.before;
  if (head && before && !isZeroSha(before)) {
    return `https://github.com/${repo}/compare/${before.slice(0, 12)}...${head.slice(0, 12)}`;
  }
  if (head) return `https://github.com/${repo}/commit/${head}`;
  return `https://github.com/${repo}`;
}

function fromEvents(
  events: GithubEvent[],
  commitsBySha: Map<string, { title: string; url: string }>,
  prsByKey: Map<string, { title: string; url: string; merged: boolean }>,
): GithubTimelineItem[] {
  const items: GithubTimelineItem[] = [];

  for (const event of events) {
    const repo = event.repo.name;
    const at = event.created_at;

    if (event.type === "PushEvent") {
      const sha = event.payload.head;
      const matched = sha ? commitsBySha.get(sha.toLowerCase()) : undefined;
      const branch = branchName(event.payload.ref);
      items.push({
        id: `push-${event.id}`,
        kind: "commit",
        title: matched?.title || (branch ? `Pushed to ${branch}` : "Pushed commits"),
        repo,
        url: commitUrl(repo, event, matched?.url),
        at,
        branch,
        sha,
      });
      continue;
    }

    if (event.type === "PullRequestEvent") {
      const number = event.payload.number ?? event.payload.pull_request?.number;
      if (number == null) continue;
      const action = prActionFromEvent(
        event.payload.action,
        event.payload.pull_request?.merged,
      );
      if (!action) continue;
      const key = `${repo}#${number}`;
      const matched = prsByKey.get(key);
      const verb =
        action === "merged"
          ? "Merged"
          : action === "opened"
            ? "Opened"
            : action === "reopened"
              ? "Reopened"
              : "Closed";
      const title = matched?.title
        ? `${verb} #${number}: ${matched.title}`
        : `${verb} #${number}`;
      items.push({
        id: `pr-${event.id}`,
        kind: "pull_request",
        title,
        repo,
        url:
          matched?.url ||
          event.payload.pull_request?.html_url ||
          `https://github.com/${repo}/pull/${number}`,
        at,
        prNumber: number,
        prAction: action,
        prState: prStateFromAction(action),
      });
      continue;
    }

    if (event.type === "CreateEvent" && isRepoBirth(event)) {
      const name = repo.split("/")[1] || repo;
      items.push({
        id: `create-${event.id}`,
        kind: "repo",
        title: `Created ${name}`,
        repo,
        url: `https://github.com/${repo}`,
        at,
      });
      continue;
    }

    if (event.type === "PublicEvent") {
      const name = repo.split("/")[1] || repo;
      items.push({
        id: `public-${event.id}`,
        kind: "repo",
        title: `Published ${name}`,
        repo,
        url: `https://github.com/${repo}`,
        at,
      });
    }
  }

  return items;
}

function addMissingRepos(
  items: GithubTimelineItem[],
  repos: GithubRepo[],
): GithubTimelineItem[] {
  const seen = new Set(
    items.filter((item) => item.kind === "repo").map((item) => item.repo),
  );
  const extra: GithubTimelineItem[] = [];
  const cutoff = Date.now() - REPO_LOOKBACK_MS;

  for (const repo of repos) {
    if (seen.has(repo.full_name)) continue;
    if (Date.parse(repo.created_at) < cutoff) continue;
    const name = repo.full_name.split("/")[1] || repo.full_name;
    extra.push({
      id: `repo-${repo.full_name}`,
      kind: "repo",
      title: `Created ${name}`,
      repo: repo.full_name,
      url: repo.html_url,
      at: repo.created_at,
    });
    seen.add(repo.full_name);
  }

  return extra;
}

function addMissingSearchItems(
  items: GithubTimelineItem[],
  commits: SearchCommitsResponse["items"],
  pullRequests: SearchIssuesResponse["items"],
): GithubTimelineItem[] {
  const commitShas = new Set(
    items.flatMap((item) => (item.sha ? [item.sha.toLowerCase()] : [])),
  );
  const prKeys = new Set(
    items
      .filter((item) => item.kind === "pull_request" && item.prNumber != null)
      .map((item) => `${item.repo}#${item.prNumber}`),
  );
  const extra: GithubTimelineItem[] = [];

  for (const commit of commits ?? []) {
    const sha = commit.sha.toLowerCase();
    if (commitShas.has(sha)) continue;
    const message = commit.commit?.message;
    const at = commit.commit?.author?.date || commit.commit?.committer?.date;
    if (!message || !at) continue;
    extra.push({
      id: `commit-${commit.sha}`,
      kind: "commit",
      title: firstLine(message),
      repo: commit.repository?.full_name || "github",
      url: commit.html_url,
      at,
      sha: commit.sha,
    });
    commitShas.add(sha);
  }

  for (const pull of pullRequests ?? []) {
    const repo = repoFromApiUrl(pull.repository_url);
    const key = `${repo}#${pull.number}`;
    if (prKeys.has(key)) continue;
    const merged = Boolean(pull.pull_request?.merged_at);
    const action: GithubPrAction = merged
      ? "merged"
      : pull.state === "open"
        ? "opened"
        : "closed";
    extra.push({
      id: `search-pr-${repo}-${pull.number}`,
      kind: "pull_request",
      title: `${action === "merged" ? "Merged" : action === "opened" ? "Opened" : "Closed"} #${pull.number}: ${pull.title}`,
      repo,
      url: pull.html_url,
      at:
        pull.pull_request?.merged_at ||
        pull.closed_at ||
        pull.created_at,
      prNumber: pull.number,
      prAction: action,
      prState: prStateFromAction(action),
    });
    prKeys.add(key);
  }

  return extra;
}

export async function getGithubSnapshot(): Promise<GithubSnapshot> {
  const login = usernameFromEnv();

  const [user, events, repos, commitSearch, prSearch] = await Promise.all([
    githubGet<GithubUser>(`/users/${login}`),
    githubGetOptional<GithubEvent[]>(`/users/${login}/events/public`, {
      per_page: "100",
    }),
    githubGetOptional<GithubRepo[]>(`/users/${login}/repos`, {
      sort: "created",
      direction: "desc",
      per_page: "10",
      type: "owner",
    }),
    githubGetOptional<SearchCommitsResponse>("/search/commits", {
      q: `author:${login}`,
      sort: "author-date",
      order: "desc",
      per_page: "30",
    }),
    githubGetOptional<SearchIssuesResponse>("/search/issues", {
      q: `author:${login} type:pr`,
      sort: "updated",
      order: "desc",
      per_page: "30",
    }),
  ]);

  const commitsBySha = new Map<string, { title: string; url: string }>();
  for (const commit of commitSearch?.items ?? []) {
    const message = commit.commit?.message;
    if (!message) continue;
    commitsBySha.set(commit.sha.toLowerCase(), {
      title: firstLine(message),
      url: commit.html_url,
    });
  }

  const prsByKey = new Map<
    string,
    { title: string; url: string; merged: boolean }
  >();
  for (const pull of prSearch?.items ?? []) {
    const repo = repoFromApiUrl(pull.repository_url);
    prsByKey.set(`${repo}#${pull.number}`, {
      title: pull.title,
      url: pull.html_url,
      merged: Boolean(pull.pull_request?.merged_at),
    });
  }

  const eventItems = fromEvents(events ?? [], commitsBySha, prsByKey);
  const items = [...eventItems];

  if (eventItems.length === 0) {
    items.push(
      ...addMissingSearchItems([], commitSearch?.items, prSearch?.items),
    );
  }

  items.push(...addMissingRepos(items, repos ?? []));

  items.sort((a, b) => Date.parse(b.at) - Date.parse(a.at));

  return {
    profile: {
      login: user.login,
      name: user.name ?? null,
      url: user.html_url,
      avatarUrl: user.avatar_url,
      repos: user.public_repos,
      followers: user.followers,
    },
    fetchedAt: new Date().toISOString(),
    items: items.slice(0, TIMELINE_LIMIT),
  };
}
