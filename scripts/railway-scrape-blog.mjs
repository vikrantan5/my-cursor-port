const BLOG_URL = "https://blog.iresharma.com";
const LATEST_COUNT = 4;
const USER_AGENT = "iresharma-portfolio-cron/1.0";

function decodeFlightChunk(raw) {
  try {
    return JSON.parse(`"${raw}"`);
  } catch {
    return raw.replace(/\\"/g, '"').replace(/\\n/g, "\n");
  }
}

function extractBalanced(source, start) {
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

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "*/*" },
  });
  if (!response.ok) throw new Error(`${url} -> ${response.status}`);
  return response.text();
}

const html = await fetchText(BLOG_URL);
const payload = [...html.matchAll(/self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g)]
  .map((match) => decodeFlightChunk(match[1]))
  .join("");

const postsAt = payload.indexOf('"posts":[');
const postsBlob =
  postsAt === -1 ? "[]" : extractBalanced(payload, postsAt + '"posts":'.length);
const rawPosts = JSON.parse(postsBlob || "[]");

const latest = rawPosts.slice(0, LATEST_COUNT).map((post, index) => ({
  id: post.id || post.slug || String(index),
  title: post.title,
  url: post.url,
  views: post.views ?? 0,
}));

console.log(
  JSON.stringify(
    {
      scrapedAt: new Date().toISOString(),
      followers: Number(/"followersCount":(\d+)/.exec(payload)?.[1] ?? 0),
      posts: rawPosts.length,
      latest,
    },
    null,
    2,
  ),
);

const portfolio = process.env.PORTFOLIO_URL || "https://iresharma.com";
try {
  const warm = await fetch(`${portfolio.replace(/\/$/, "")}/api/blog`, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!warm.ok) {
    console.warn(`Warm ${portfolio}/api/blog returned ${warm.status}`);
  } else {
    console.log(`Warmed ${portfolio}/api/blog`);
  }
} catch (error) {
  console.warn(`Warm skipped: ${error instanceof Error ? error.message : String(error)}`);
}
