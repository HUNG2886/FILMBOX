export type AuthLogEvent = "login_success" | "login_fail" | "login_rate_limited" | "login_missing";

function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 1) return "***";
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const shown = local.slice(0, 1);
  return `${shown}***@${domain}`;
}

/**
 * Log cấu trúc (JSON một dòng). Không ghi mật khẩu hay token.
 */
export function logAuthEvent(
  event: AuthLogEvent,
  detail: { email?: string; ip?: string; reason?: string },
) {
  const payload = {
    ts: new Date().toISOString(),
    event,
    ip: detail.ip ?? "unknown",
    email: detail.email ? maskEmail(detail.email) : undefined,
    reason: detail.reason,
  };
  if (process.env.NODE_ENV === "production") {
    console.info(JSON.stringify(payload));
  } else {
    console.info("[auth]", payload);
  }
}
