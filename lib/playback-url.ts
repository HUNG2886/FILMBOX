export const PLAYBACK_TYPES = ["drive", "mp4", "hls", "external"] as const;
export type PlaybackType = (typeof PLAYBACK_TYPES)[number];

export function normalizePlaybackUrl(raw: string, type: string): string {
  const input = raw.trim();
  if (!input) return "";

  if (type === "drive") {
    return normalizeDriveEmbedUrl(input);
  }

  return input;
}

function normalizeDriveEmbedUrl(input: string): string {
  // Allow file ID input directly.
  if (/^[a-zA-Z0-9_-]{20,}$/.test(input)) {
    return `https://drive.google.com/file/d/${input}/preview`;
  }

  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return input;
  }

  if (url.hostname !== "drive.google.com") {
    return input;
  }

  const parts = url.pathname.split("/").filter(Boolean);
  const dIndex = parts.findIndex((p) => p === "d");
  const fromPath = dIndex >= 0 ? parts[dIndex + 1] : null;
  const fromQuery = url.searchParams.get("id");
  const fileId = fromPath ?? fromQuery;

  if (!fileId) return input;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}
