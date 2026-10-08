export type BlogPublication = {
  title: string;
  url: string;
  followers: number;
  posts: number;
  views: number;
};

export type BlogPost = {
  id: string;
  title: string;
  url: string;
  brief: string;
  coverUrl: string | null;
  publishedAt: string;
  readTimeInMinutes: number;
  views: number;
};

export type BlogSnapshot = {
  scrapedAt: string;
  publication: BlogPublication;
  latest: BlogPost[];
};

export const BLOG_URL = "https://blog.iresharma.com";
export const BLOG_LATEST_COUNT = 4;

const USER_AGENT =
  "iresharma-portfolio/1.0 (+https://iresharma.com; blog scrape)";

type RawPost = {
  id?: string;
  title?: string;
  slug?: string;
  url?: string;
  brief?: string;
  publishedAt?: string;
  readTimeInMinutes?: number;
  views?: number;
  coverImage?: { url?: string } | string | null;
};

function decodeFlightChunk(raw: string): string {
  try {
    return JSON.parse(`"${raw}"`) as string;
  } catch {
    return raw.replace(/\\"/g, '"').replace(/\\n/g, "\n");
  }
}

function flightPayload(html: string): string {
  const chunks: string[] = [];
  const push = /self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g;
  for (const match of html.matchAll(push)) {
    chunks.push(decodeFlightChunk(match[1]));
  }
  return chunks.join("");
}

function extractBalanced(source: string, start: number): string | null {
  const open = source[start];
  const close = open === "[" ? "]" : open === "{" ? "}" : null;
  if (!close) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (char === "[" || char === "{") depth += 1;
    if (char === "]" || char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }

  return null;
}

function coverUrl(value: RawPost["coverImage"]): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value.url || null;
}

function toPost(raw: RawPost, index: number): BlogPost | null {
  const title = raw.title?.trim();
  const url =
    raw.url ||
    (raw.slug ? `${BLOG_URL.replace(/\/$/, "")}/${raw.slug}` : undefined);
  if (!title || !url) return null;

  return {
    id: raw.id || raw.slug || url || String(index),
    title,
    url,
    brief: raw.brief?.trim() ?? "",
    coverUrl: coverUrl(raw.coverImage),
    publishedAt: raw.publishedAt || new Date(0).toISOString(),
    readTimeInMinutes: Number(raw.readTimeInMinutes ?? 0),
    views: Number(raw.views ?? 0),
  };
}

function postsFromFlight(payload: string): RawPost[] {
  const marker = '"posts":[';
  const at = payload.indexOf(marker);
  if (at === -1) return [];
  const blob = extractBalanced(payload, at + '"posts":'.length);
  if (!blob) return [];
  try {
    const parsed = JSON.parse(blob) as unknown;
    return Array.isArray(parsed) ? (parsed as RawPost[]) : [];
  } catch {
    return [];
  }
}

function firstInt(payload: string, key: string): number {
  const match = new RegExp(`"${key}":(\\d+)`).exec(payload);
  return match ? Number(match[1]) : 0;
}

function maxInt(payload: string, key: string): number {
  const values = [...payload.matchAll(new RegExp(`"${key}":(\\d+)`, "g"))].map(
    (match) => Number(match[1]),
  );
  return values.length ? Math.max(...values) : 0;
}

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function tag(block: string, name: string): string {
  const match = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i").exec(
    block,
  );
  return match ? decodeXml(match[1]).trim() : "";
}

function attr(block: string, name: string, attrName: string): string {
  const match = new RegExp(`<${name}[^>]*\\s${attrName}="([^"]+)"`, "i").exec(
    block,
  );
  return match?.[1] ?? "";
}

function postsFromRss(xml: string): BlogPost[] {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].flatMap(
    (match, index) => {
      const item = match[1];
      const title = tag(item, "title");
      const url = tag(item, "link");
      if (!title || !url) return [];
      const pubDate = tag(item, "pubDate");
      return [
        {
          id: tag(item, "guid") || url || String(index),
          title,
          url,
          brief: tag(item, "description"),
          coverUrl: attr(item, "enclosure", "url") || null,
          publishedAt: pubDate ? new Date(pubDate).toISOString() : "",
          readTimeInMinutes: 0,
          views: 0,
        } satisfies BlogPost,
      ];
    },
  );
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "User-Agent": USER_AGENT,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} (${response.status})`);
  }
  return response.text();
}

export async function scrapeBlog(
  origin = BLOG_URL,
): Promise<BlogSnapshot> {
  const html = await fetchText(origin);
  const payload = flightPayload(html);
  const rawPosts = postsFromFlight(payload);
  let latest = rawPosts
    .flatMap((post, index) => {
      const mapped = toPost(post, index);
      return mapped ? [mapped] : [];
    })
    .slice(0, BLOG_LATEST_COUNT);

  if (latest.length === 0) {
    const rss = await fetchText(`${origin.replace(/\/$/, "")}/rss.xml`);
    latest = postsFromRss(rss).slice(0, BLOG_LATEST_COUNT);
  }

  const views = rawPosts.reduce((sum, post) => sum + Number(post.views ?? 0), 0);

  return {
    scrapedAt: new Date().toISOString(),
    publication: {
      title: /"title":"(WatchIreshStruggle)"/.exec(payload)?.[1] || "WatchIreshStruggle",
      url: origin,
      followers: firstInt(payload, "followersCount"),
      posts: Math.max(rawPosts.length, maxInt(payload, "totalDocuments")),
      views,
    },
    latest,
  };
}
