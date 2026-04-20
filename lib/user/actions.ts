"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { logAuthEvent } from "@/lib/auth-log";
import { userSessionCookieName, signUserToken } from "@/lib/auth-user-jwt";
import { prisma } from "@/lib/prisma";
import { validatePasswordStrength } from "@/lib/password-policy";
import { allowRateLimit } from "@/lib/rate-limit-memory";
import { getRequestIp } from "@/lib/request-ip";
import { safeNextPathOrDefault } from "@/lib/safe-redirect";
import { getUserSession } from "@/lib/user-session";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_PER_IP = 80;
const MAX_FAIL_PER_PAIR = 15;
const REGISTER_WINDOW_MS = 60 * 60 * 1000;
const MAX_REGISTER_PER_IP = 10;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isLocale(x: string): x is "vi" | "en" {
  return x === "vi" || x === "en";
}

async function setUserCookie(userId: string) {
  const token = await signUserToken(userId);
  const jar = await cookies();
  jar.set(userSessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function loginUserAction(formData: FormData) {
  const localeRaw = String(formData.get("locale") ?? "vi");
  const locale = isLocale(localeRaw) ? localeRaw : "vi";
  const emailRaw = String(formData.get("email") ?? "").trim();
  const email = emailRaw.toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "").trim();

  const ip = await getRequestIp();
  const q = new URLSearchParams();
  if (nextPath) q.set("next", nextPath);

  if (!allowRateLimit(`rl:user-login:ip:${ip}`, MAX_LOGIN_PER_IP, LOGIN_WINDOW_MS)) {
    logAuthEvent("login_rate_limited", { ip, reason: "user_ip_window" });
    q.set("e", "ratelimit");
    redirect(`/${locale}/account/login?${q.toString()}`);
  }

  if (!email || !password) {
    logAuthEvent("login_missing", { ip, email: email || undefined });
    q.set("e", "missing");
    redirect(`/${locale}/account/login?${q.toString()}`);
  }

  const failKey = `rl:user-login:fail:${ip}|${email}`;
  const rejectBad = (reason: "unknown_user" | "bad_password" | "not_user") => {
    if (!allowRateLimit(failKey, MAX_FAIL_PER_PAIR, LOGIN_WINDOW_MS)) {
      logAuthEvent("login_rate_limited", { ip, email, reason: "user_credential_pair" });
      q.set("e", "ratelimit");
    } else {
      logAuthEvent("login_fail", { ip, email, reason });
      q.set("e", reason === "not_user" ? "notuser" : "invalid");
    }
    redirect(`/${locale}/account/login?${q.toString()}`);
  };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    rejectBad("unknown_user");
    throw new Error("unreachable");
  }
  if (user.role !== "user") {
    rejectBad("not_user");
    throw new Error("unreachable");
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    rejectBad("bad_password");
    throw new Error("unreachable");
  }

  logAuthEvent("login_success", { ip, email, reason: "user" });
  await setUserCookie(user.id);

  const fallback = `/${locale}/account`;
  redirect(safeNextPathOrDefault(nextPath, locale, fallback));
}

export async function registerUserAction(formData: FormData) {
  const localeRaw = String(formData.get("locale") ?? "vi");
  const locale = isLocale(localeRaw) ? localeRaw : "vi";
  const emailRaw = String(formData.get("email") ?? "").trim();
  const email = emailRaw.toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "").trim();

  const ip = await getRequestIp();
  const q = new URLSearchParams();
  if (nextPath) q.set("next", nextPath);
  if (email) q.set("email", email);

  const bail = (code: "missing" | "invalid_email" | "weak" | "short" | "exists" | "ratelimit") => {
    q.set("e", code);
    redirect(`/${locale}/account/register?${q.toString()}`);
  };

  if (!allowRateLimit(`rl:user-register:ip:${ip}`, MAX_REGISTER_PER_IP, REGISTER_WINDOW_MS)) {
    logAuthEvent("login_rate_limited", { ip, reason: "user_register_ip_window" });
    bail("ratelimit");
    throw new Error("unreachable");
  }

  if (!email || !password) {
    bail("missing");
    throw new Error("unreachable");
  }
  if (!EMAIL_RE.test(email)) {
    bail("invalid_email");
    throw new Error("unreachable");
  }
  const strength = validatePasswordStrength(password);
  if (!strength.ok) {
    bail(strength.code);
    throw new Error("unreachable");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    bail("exists");
    throw new Error("unreachable");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const created = await prisma.user.create({
    data: { email, passwordHash, role: "user" },
    select: { id: true },
  });

  logAuthEvent("login_success", { ip, email, reason: "user_register" });
  await setUserCookie(created.id);

  const fallback = `/${locale}/account`;
  redirect(safeNextPathOrDefault(nextPath, locale, fallback));
}

export async function logoutUserAction() {
  const locale = await getLocale();
  const jar = await cookies();
  jar.delete(userSessionCookieName);
  redirect(`/${locale}/account/login`);
}

export async function changePasswordUserAction(formData: FormData) {
  const locale = await getLocale();
  const session = await getUserSession();
  if (!session) {
    redirect(`/${locale}/account/login`);
  }

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");

  const q = new URLSearchParams();
  const bail = (code: "missing" | "weak" | "short" | "invalid") => {
    q.set("pwerr", code);
    redirect(`/${locale}/account?${q.toString()}`);
  };

  if (!current || !next) {
    bail("missing");
    throw new Error("unreachable");
  }
  const strength = validatePasswordStrength(next);
  if (!strength.ok) {
    bail(strength.code);
    throw new Error("unreachable");
  }

  const row = await prisma.user.findUnique({ where: { id: session.id } });
  if (!row) {
    redirect(`/${locale}/account/login`);
  }
  const ok = await bcrypt.compare(current, row.passwordHash);
  if (!ok) {
    bail("invalid");
    throw new Error("unreachable");
  }
  const passwordHash = await bcrypt.hash(next, 10);
  await prisma.user.update({ where: { id: session.id }, data: { passwordHash } });

  const q2 = new URLSearchParams();
  q2.set("pwok", "1");
  redirect(`/${locale}/account?${q2.toString()}`);
}
