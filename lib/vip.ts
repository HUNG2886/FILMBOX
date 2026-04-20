export type VipBearer = {
  vipUntil: Date | null;
} | null | undefined;

export function isVipActive(user: VipBearer): boolean {
  if (!user || !user.vipUntil) return false;
  return user.vipUntil.getTime() > Date.now();
}

export function formatVipUntil(date: Date, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return date.toISOString();
  }
}
