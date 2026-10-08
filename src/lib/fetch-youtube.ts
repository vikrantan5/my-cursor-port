import type { YoutubeSnapshot, YoutubeVideo } from "@/lib/youtube";

const API = "https://www.googleapis.com/youtube/v3";
const REVALIDATE_SECONDS = 60 * 60;

type ThumbnailSet = Partial<
  Record<"maxres" | "standard" | "high" | "medium" | "default", { url?: string }>
>;

type ChannelListResponse = {
  items?: Array<{
    id: string;
    snippet?: {
      title?: string;
      customUrl?: string;
    };
    statistics?: {
      viewCount?: string;
      subscriberCount?: string;
      hiddenSubscriberCount?: boolean;
      videoCount?: string;
    };
    contentDetails?: {
      relatedPlaylists?: {
        uploads?: string;
      };
    };
  }>;
};

type PlaylistItemsResponse = {
  items?: Array<{
    snippet?: {
      title?: string;
      publishedAt?: string;
      resourceId?: { videoId?: string };
      thumbnails?: ThumbnailSet;
    };
    contentDetails?: {
      videoId?: string;
    };
  }>;
};

type VideoListResponse = {
  items?: Array<{
    id?: string;
    snippet?: {
      title?: string;
      description?: string;
      publishedAt?: string;
      thumbnails?: ThumbnailSet;
    };
    contentDetails?: {
      duration?: string;
    };
    statistics?: {
      viewCount?: string;
    };
  }>;
};

const UPLOADS_TO_SCAN = 50;
const LONG_FORM_COUNT = 4;
const SHORTS_MAX_SECONDS = 3 * 60;

function requiredEnv(name: "YOUTUBE_API_KEY"): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new YoutubeConfigError(`${name} is not set`);
  }
  return value;
}

export class YoutubeConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "YoutubeConfigError";
  }
}

function handleFromEnv(): string {
  const raw = process.env.YOUTUBE_HANDLE?.trim() || "iresharma";
  return raw.replace(/^@/, "");
}

function pickThumbnail(thumbnails: ThumbnailSet | undefined, videoId: string): string {
  return (
    thumbnails?.maxres?.url ||
    thumbnails?.standard?.url ||
    thumbnails?.high?.url ||
    thumbnails?.medium?.url ||
    thumbnails?.default?.url ||
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
  );
}

function durationSeconds(iso: string | undefined): number {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso ?? "");
  if (!match) return 0;
  return (
    Number(match[1] || 0) * 3600 +
    Number(match[2] || 0) * 60 +
    Number(match[3] || 0)
  );
}

function isShort(title: string, description: string, seconds: number): boolean {
  if (seconds > 0 && seconds <= SHORTS_MAX_SECONDS) return true;
  return /#shorts\b/i.test(`${title}\n${description}`);
}

async function youtubeGet<T>(
  path: string,
  params: Record<string, string>,
  key: string,
): Promise<T> {
  const url = new URL(`${API}/${path}`);
  for (const [name, value] of Object.entries({ ...params, key })) {
    url.searchParams.set(name, value);
  }

  const response = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`YouTube ${path} failed with ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getYoutubeSnapshot(): Promise<YoutubeSnapshot> {
  const key = requiredEnv("YOUTUBE_API_KEY");
  const handle = handleFromEnv();

  const channels = await youtubeGet<ChannelListResponse>(
    "channels",
    {
      part: "snippet,statistics,contentDetails",
      forHandle: handle,
    },
    key,
  );

  const channel = channels.items?.[0];
  if (!channel?.id) {
    throw new Error(`No YouTube channel found for @${handle}`);
  }

  const customUrl = channel.snippet?.customUrl?.replace(/^@/, "") || handle;
  const uploadsId = channel.contentDetails?.relatedPlaylists?.uploads;
  const hiddenSubs = Boolean(channel.statistics?.hiddenSubscriberCount);

  const snapshot: YoutubeSnapshot = {
    channel: {
      id: channel.id,
      title: channel.snippet?.title || `@${customUrl}`,
      handle: customUrl,
      url: `https://www.youtube.com/@${customUrl}`,
      subscribers: hiddenSubs
        ? null
        : Number(channel.statistics?.subscriberCount ?? 0),
      views: Number(channel.statistics?.viewCount ?? 0),
      videos: Number(channel.statistics?.videoCount ?? 0),
    },
    latest: [],
  };

  if (!uploadsId) return snapshot;

  const playlist = await youtubeGet<PlaylistItemsResponse>(
    "playlistItems",
    {
      part: "snippet,contentDetails",
      playlistId: uploadsId,
      maxResults: String(UPLOADS_TO_SCAN),
    },
    key,
  );

  const playlistIds = (playlist.items ?? []).flatMap((item) => {
    const videoId =
      item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;
    return videoId ? [videoId] : [];
  });

  if (playlistIds.length === 0) return snapshot;

  const videos = await youtubeGet<VideoListResponse>(
    "videos",
    {
      part: "snippet,contentDetails,statistics",
      id: playlistIds.join(","),
    },
    key,
  );

  const byId = new Map(
    (videos.items ?? []).flatMap((item) =>
      item.id ? ([[item.id, item]] as const) : [],
    ),
  );

  const latest: YoutubeVideo[] = [];
  for (const videoId of playlistIds) {
    const item = byId.get(videoId);
    const title = item?.snippet?.title;
    const publishedAt = item?.snippet?.publishedAt;
    if (!item || !title || !publishedAt) continue;

    const seconds = durationSeconds(item.contentDetails?.duration);
    if (isShort(title, item.snippet?.description ?? "", seconds)) continue;

    latest.push({
      id: videoId,
      title,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnailUrl: pickThumbnail(item.snippet?.thumbnails, videoId),
      publishedAt,
      views:
        item.statistics?.viewCount != null
          ? Number(item.statistics.viewCount)
          : null,
      durationSeconds: seconds,
    });

    if (latest.length >= LONG_FORM_COUNT) break;
  }

  snapshot.latest = latest;
  return snapshot;
}
