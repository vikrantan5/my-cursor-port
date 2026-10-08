import { getGithubSnapshot } from "@/lib/fetch-github";

export const revalidate = 300;

export async function GET() {
  try {
    const snapshot = await getGithubSnapshot();
    return Response.json(snapshot);
  } catch {
    return Response.json({ error: "upstream" }, { status: 502 });
  }
}
