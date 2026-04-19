import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { adminSessionCookieName, verifyAdminToken } from "@/lib/auth-jwt";

export type AdminUser = {
  id: string;
  email: string;
  role: string;
};

export async function getAdminSession(): Promise<AdminUser | null> {
  const jar = await cookies();
  const token = jar.get(adminSessionCookieName)?.value;
  if (!token) return null;
  const v = await verifyAdminToken(token);
  if (!v) return null;
  const user = await prisma.user.findUnique({
    where: { id: v.sub },
    select: { id: true, email: true, role: true },
  });
  return user;
}

export async function requireAdminSession(): Promise<AdminUser> {
  const s = await getAdminSession();
  if (!s) {
    throw new Error("Unauthorized");
  }
  return s;
}
