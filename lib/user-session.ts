import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { userSessionCookieName, verifyUserToken } from "@/lib/auth-user-jwt";

export type AppUser = {
  id: string;
  email: string;
  role: string;
  vipUntil: Date | null;
};

export async function getUserSession(): Promise<AppUser | null> {
  const jar = await cookies();
  const token = jar.get(userSessionCookieName)?.value;
  if (!token) return null;
  const v = await verifyUserToken(token);
  if (!v) return null;
  const user = await prisma.user.findUnique({
    where: { id: v.sub },
    select: { id: true, email: true, role: true, vipUntil: true },
  });
  if (!user) return null;
  if (user.role !== "user") return null;
  return user;
}

export async function requireUserSession(): Promise<AppUser> {
  const s = await getUserSession();
  if (!s) {
    throw new Error("Unauthorized");
  }
  return s;
}
