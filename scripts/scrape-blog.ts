import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { scrapeBlog } from "../src/lib/scrape-blog.ts";

const root = path.resolve(import.meta.dirname, "..");
const outFile = path.join(root, "src/data/blog.json");

const snapshot = await scrapeBlog();
await mkdir(path.dirname(outFile), { recursive: true });
await writeFile(outFile, `${JSON.stringify(snapshot, null, 2)}\n`);

const { publication, latest } = snapshot;
console.log(
  `Wrote ${outFile} — ${publication.posts} posts, ${publication.followers} followers, ${latest.length} latest`,
);
for (const post of latest) {
  console.log(`- ${post.title}`);
}
