import {
  getYoutubeSnapshot,
  YoutubeConfigError,
} from "@/lib/fetch-youtube";

export async function GET() {
  try {
    const snapshot = await getYoutubeSnapshot();
    return Response.json(snapshot);
  } catch (error) {
    if (error instanceof YoutubeConfigError) {
      return Response.json({ error: "unconfigured" }, { status: 503 });
    }

    return Response.json({ error: "upstream" }, { status: 502 });
  }
}
