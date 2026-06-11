import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSecret(): string {
  const fromEnv = process.env.ADMIN_PASSWORD?.trim();
  return fromEnv || "changeme";
}

export function createSessionToken(): string {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_MAX_AGE * 1000 });
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

export function verifySessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const dotIndex = decoded.lastIndexOf(".");
    if (dotIndex === -1) return false;

    const payload = decoded.slice(0, dotIndex);
    const sig = decoded.slice(dotIndex + 1);
    const expected = createHmac("sha256", getSecret())
      .update(payload)
      .digest("hex");

    const sigBuf = Buffer.from(sig, "hex");
    const expectedBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expectedBuf.length) return false;
    if (!timingSafeEqual(sigBuf, expectedBuf)) return false;

    const { exp } = JSON.parse(payload) as { exp: number };
    return Date.now() < exp;
  } catch {
    return false;
  }
}

export function verifyPassword(password: string): boolean {
  const secret = getSecret();
  const a = Buffer.from(password.trim());
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export function sessionCookieOptions(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}

export function clearSessionCookieOptions() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}
