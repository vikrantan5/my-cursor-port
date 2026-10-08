export type YoutubeChannel = {
  id: string;
  title: string;
  handle: string;
  url: string;
  subscribers: number | null;
  views: number;
  videos: number;
};

export type YoutubeVideo = {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  publishedAt: string;
  views: number | null;
  durationSeconds: number;
};

export type YoutubeSnapshot = {
  channel: YoutubeChannel;
  latest: YoutubeVideo[];
};

export function formatCount(value: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPublished(iso: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
  }
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}
