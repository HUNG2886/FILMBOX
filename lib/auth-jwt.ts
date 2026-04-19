import { SignJWT, jwtVerify } from "jose";

const COOKIE = "admin_session";

function getSecretBytes() {
  const fromEnv = process.env.AUTH_SECRET;
  if (process.env.NODE_ENV === "production") {
    if (!fromEnv || fromEnv.length < 32) {
      throw new Error("AUTH_SECRET is required in production (min 32 characters).");
    }
    return new TextEncoder().encode(fromEnv);
  }
  return new TextEncoder().encode(
    fromEnv ?? "landing-page-local-dev-auth-secret-min-32chars!",
  );
}

export async function signAdminToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretBytes());
}

export async function verifyAdminToken(token: string): Promise<{ sub: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretBytes());
    const sub = typeof payload.sub === "string" ? payload.sub : null;
    if (!sub) return null;
    return { sub };
  } catch {
    return null;
  }
}

export const adminSessionCookieName = COOKIE;
