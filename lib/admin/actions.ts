"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { logAuthEvent } from "@/lib/auth-log";
import { adminSessionCookieName, signAdminToken } from "@/lib/auth-jwt";
import { normalizeImageUrl } from "@/lib/image-url";
import { normalizePlaybackUrl } from "@/lib/playback-url";
import { prisma } from "@/lib/prisma";
import { MOVIE_STATUS } from "@/lib/movie-status";
import { allowRateLimit } from "@/lib/rate-limit-memory";
import { getRequestIp } from "@/lib/request-ip";
import { safeNextPathOrDefault } from "@/lib/safe-redirect";
import { slugify } from "@/lib/slug";
import { getAdminSession } from "@/lib/session";

/** Mọi request POST đăng nhập theo IP (chống spam / brute-force quy mô lớn). */
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_PER_IP = 50;
/** Thử sai mật khẩu / email không tồn tại theo cặp IP + email. */
const MAX_FAIL_PER_PAIR = 12;

async function ensureAdmin() {
  const u = await getAdminSession();
  if (!u) {
    const locale = await getLocale();
    redirect(`/${locale}/admin/login`);
  }
  return u;
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function parseIntSafe(v: FormDataEntryValue | null, fallback: number) {
  const n = Number.parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

export async function loginAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "vi");
  const emailRaw = String(formData.get("email") ?? "").trim();
  const email = emailRaw.toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "").trim();

  const ip = await getRequestIp();
  const q = new URLSearchParams();
  if (nextPath) q.set("next", nextPath);

  if (!allowRateLimit(`rl:login:ip:${ip}`, MAX_LOGIN_PER_IP, LOGIN_WINDOW_MS)) {
    logAuthEvent("login_rate_limited", { ip, reason: "ip_window" });
    q.set("e", "ratelimit");
    redirect(`/${locale}/admin/login?${q.toString()}`);
  }

  if (!email || !password) {
    logAuthEvent("login_missing", { ip, email: email || undefined });
    q.set("e", "missing");
    redirect(`/${locale}/admin/login?${q.toString()}`);
  }

  const failKey = `rl:login:fail:${ip}|${email}`;
  const rejectBadCredentials = (reason: "unknown_user" | "bad_password") => {
    if (!allowRateLimit(failKey, MAX_FAIL_PER_PAIR, LOGIN_WINDOW_MS)) {
      logAuthEvent("login_rate_limited", { ip, email, reason: "credential_pair" });
      q.set("e", "ratelimit");
    } else {
      logAuthEvent("login_fail", { ip, email, reason });
      q.set("e", "invalid");
    }
    redirect(`/${locale}/admin/login?${q.toString()}`);
  };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    rejectBadCredentials("unknown_user");
    throw new Error("unreachable");
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    rejectBadCredentials("bad_password");
    throw new Error("unreachable");
  }

  logAuthEvent("login_success", { ip, email });

  const token = await signAdminToken(user.id);
  const jar = await cookies();
  jar.set(adminSessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  const fallback = `/${locale}/admin/movies`;
  redirect(safeNextPathOrDefault(nextPath, locale, fallback));
}

export async function logoutAction() {
  const locale = await getLocale();
  const jar = await cookies();
  jar.delete(adminSessionCookieName);
  redirect(`/${locale}/admin/login`);
}

export async function createMovieAction(formData: FormData) {
  await ensureAdmin();
  const locale = await getLocale();

  const title = String(formData.get("title") ?? "").trim();
  const bookId = String(formData.get("bookId") ?? "").trim();
  const playbackType = String(formData.get("playbackType") ?? "").trim();
  const playbackUrlRaw = String(formData.get("playbackUrl") ?? "").trim();
  const playbackUrl = normalizePlaybackUrl(playbackUrlRaw, playbackType);
  let slug = String(formData.get("slug") ?? "").trim();
  if (!slug && title) slug = slugify(title);
  if (!title || !bookId || !slug) {
    redirect(`/${locale}/admin/movies/new?e=required`);
  }

  const exists = await prisma.movie.findUnique({
    where: { bookId_slug: { bookId, slug } },
  });
  if (exists) {
    redirect(`/${locale}/admin/movies/new?e=duplicate`);
  }

  await prisma.movie.create({
    // Accept raw Drive sharing URLs and convert to direct image links.
    data: {
      bookId,
      slug,
      title,
      synopsis: String(formData.get("synopsis") ?? ""),
      episodes: parseIntSafe(formData.get("episodes"), 1),
      tag: String(formData.get("tag") ?? "").trim() || null,
      posterSrc:
        normalizeImageUrl(String(formData.get("posterSrc") ?? "").trim()) ||
        "https://picsum.photos/seed/new/400/600",
      playbackType: playbackType || null,
      playbackUrl: playbackUrl || null,
      exclusive: bool(formData, "exclusive"),
      status: String(formData.get("status") ?? MOVIE_STATUS.DRAFT),
      showCarousel: bool(formData, "showCarousel"),
      showRecommended: bool(formData, "showRecommended"),
      showTrending: bool(formData, "showTrending"),
      showHidden: bool(formData, "showHidden"),
      shelfOrder: parseIntSafe(formData.get("shelfOrder"), 0),
    },
  });

  revalidatePath(`/${locale}`, "layout");
  redirect(`/${locale}/admin/movies`);
}

export async function updateMovieAction(formData: FormData) {
  await ensureAdmin();
  const locale = await getLocale();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect(`/${locale}/admin/movies`);

  const title = String(formData.get("title") ?? "").trim();
  const bookId = String(formData.get("bookId") ?? "").trim();
  const playbackType = String(formData.get("playbackType") ?? "").trim();
  const playbackUrlRaw = String(formData.get("playbackUrl") ?? "").trim();
  const playbackUrl = normalizePlaybackUrl(playbackUrlRaw, playbackType);
  let slug = String(formData.get("slug") ?? "").trim();
  if (!slug && title) slug = slugify(title);
  if (!title || !bookId || !slug) {
    redirect(`/${locale}/admin/movies/${id}/edit?e=required`);
  }

  const other = await prisma.movie.findFirst({
    where: {
      bookId,
      slug,
      id: { not: id },
    },
  });
  if (other) {
    redirect(`/${locale}/admin/movies/${id}/edit?e=duplicate`);
  }

  await prisma.movie.update({
    where: { id },
    data: {
      bookId,
      slug,
      title,
      synopsis: String(formData.get("synopsis") ?? ""),
      episodes: parseIntSafe(formData.get("episodes"), 1),
      tag: String(formData.get("tag") ?? "").trim() || null,
      posterSrc: normalizeImageUrl(String(formData.get("posterSrc") ?? "").trim()),
      playbackType: playbackType || null,
      playbackUrl: playbackUrl || null,
      exclusive: bool(formData, "exclusive"),
      status: String(formData.get("status") ?? MOVIE_STATUS.DRAFT),
      showCarousel: bool(formData, "showCarousel"),
      showRecommended: bool(formData, "showRecommended"),
      showTrending: bool(formData, "showTrending"),
      showHidden: bool(formData, "showHidden"),
      shelfOrder: parseIntSafe(formData.get("shelfOrder"), 0),
    },
  });

  revalidatePath(`/${locale}`, "layout");
  redirect(`/${locale}/admin/movies`);
}

export async function archiveMovieAction(formData: FormData) {
  await ensureAdmin();
  const locale = await getLocale();
  const id = String(formData.get("id") ?? "");
  if (!id) redirect(`/${locale}/admin/movies`);

  await prisma.movie.update({
    where: { id },
    data: { status: MOVIE_STATUS.ARCHIVED },
  });

  revalidatePath(`/${locale}`, "layout");
  redirect(`/${locale}/admin/movies`);
}
