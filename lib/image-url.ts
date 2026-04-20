/**
 * Chuẩn hoá URL ảnh do admin nhập: tự convert link share Google Drive sang
 * dạng trực tiếp, và chặn scheme không an toàn (data:, javascript:, file:...).
 * Các URL http(s) khác được giữ nguyên để dùng với next/image (remotePatterns
 * trong next.config.ts cho phép mọi host HTTPS).
 */
export function normalizeImageUrl(raw: string): string {
  const input = raw.trim();
  if (!input) return input;

  if (/^[a-zA-Z0-9_-]{20,}$/.test(input)) {
    return `https://drive.google.com/uc?export=view&id=${input}`;
  }

  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return input.startsWith("/") ? input : "";
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return "";
  }

  const host = url.hostname.toLowerCase();

  if (host === "drive.google.com" && url.pathname === "/uc") {
    return input;
  }

  if (host === "drive.google.com") {
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
