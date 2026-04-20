import { SignJWT, jwtVerify } from "jose";

const COOKIE = "user_session";
const AUDIENCE = "user";

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

export async function signUserToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecretBytes());
}

export async function verifyUserToken(token: string): Promise<{ sub: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretBytes(), {
      audience: AUDIENCE,
    });
    const sub = typeof payload.sub === "string" ? payload.sub : null;
    if (!sub) return null;
    return { sub };
  } catch {
    return null;
  }
}

export const userSessionCookieName = COOKIE;
