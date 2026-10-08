import seed from "@/data/blog.json";
import { scrapeBlog, type BlogSnapshot } from "@/lib/scrape-blog";

export const revalidate = 86400;

export async function GET() {
  try {
    const snapshot = await scrapeBlog();
    return Response.json(snapshot);
  } catch (error) {
    if (seed && typeof seed === "object" && "publication" in seed) {
      return Response.json(seed as BlogSnapshot);
    }
    return Response.json(
      { error: error instanceof Error ? error.message : "upstream" },
      { status: 502 },
    );
  }
}
