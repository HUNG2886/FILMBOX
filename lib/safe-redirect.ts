import { routing } from "@/i18n/routing";

const locales = routing.locales as readonly string[];

/**
 * Chỉ cho phép đường dẫn nội bộ sau locale, tránh open redirect.
 */
export function isSafeInternalPath(path: string, locale: string): boolean {
  if (!path.startsWith("/")) return false;
  if (!locales.includes(locale)) return false;
  if (!path.startsWith(`/${locale}/`)) return false;
  if (path.includes("//")) return false;
  if (path.includes("..")) return false;
  if (path.includes("\\")) return false;
  if (/^[a-zA-Z][a-zA-Z+\-.]*:/.test(path)) return false;
  return true;
}

export function safeNextPathOrDefault(nextPath: string, locale: string, fallback: string): string {
  const trimmed = nextPath.trim();
  if (!trimmed) return fallback;
  return isSafeInternalPath(trimmed, locale) && !trimmed.includes("/admin/login")
    ? trimmed
    : fallback;
}
