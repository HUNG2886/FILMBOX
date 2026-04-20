/**
 * Normalize common Google Drive share links into direct image URLs.
 * This helps Next/Image load posters from Drive-hosted files.
 */
export function normalizeImageUrl(raw: string): string {
  const input = raw.trim();
  if (!input) return input;

  // Direct file id input (rare): treat as Drive file id.
  if (/^[a-zA-Z0-9_-]{20,}$/.test(input)) {
    return `https://drive.google.com/uc?export=view&id=${input}`;
  }

  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return input;
  }

  const host = url.hostname.toLowerCase();

  // If already direct-drive style, keep it as-is.
  if (host === "drive.google.com" && url.pathname === "/uc") {
    return input;
  }

  if (host === "drive.google.com") {
    // Patterns:
    // - /file/d/<id>/view
    // - /open?id=<id>
    // - /thumbnail?id=<id>...
    const parts = url.pathname.split("/").filter(Boolean);
    const dIndex = parts.findIndex((p) => p === "d");
    const fromPath =
      dIndex >= 0 && parts[dIndex + 1] ? parts[dIndex + 1] : null;
    const fromQuery = url.searchParams.get("id");
    const fileId = fromPath ?? fromQuery;
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }

  return input;
}
