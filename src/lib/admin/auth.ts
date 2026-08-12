/**
 * Studio access control.
 *
 * Two independent gates: a secret path segment (ADMIN_KEY) so the route is not
 * discoverable, and a password (ADMIN_PASSWORD) so knowing the URL is not enough.
 * The secret alone was the original ask, but a URL leaks easily — shared-machine
 * history, a screenshot, a referrer header — and this endpoint can rewrite the
 * whole site, so the password is deliberately not optional.
 *
 * Sessions are a signed cookie rather than server state, because Vercel functions
 * do not share memory. The signing key is derived from the password when
 * ADMIN_SESSION_SECRET is unset, so changing the password logs everyone out.
 */

import { cookies } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "bm_studio";
const TTL_SECONDS = 8 * 60 * 60;

/** Minimums below which the studio refuses to switch on at all. */
export const MIN_KEY_LENGTH = 16;
export const MIN_PASSWORD_LENGTH = 12;

const env = (name: string) => (process.env[name] ?? "").trim();

export const adminKey = () => env("ADMIN_KEY");

/**
 * Why the studio is off, or null when it is on. The reason is only ever shown in
 * development — in production a misconfigured studio 404s without explanation.
 */
export function adminDisabledReason(): string | null {
  const key = env("ADMIN_KEY");
  const password = env("ADMIN_PASSWORD");
  if (!key) return "ADMIN_KEY is not set.";
  if (key.length < MIN_KEY_LENGTH) {
    return `ADMIN_KEY must be at least ${MIN_KEY_LENGTH} characters (it is ${key.length}).`;
  }
  if (!password) return "ADMIN_PASSWORD is not set.";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters (it is ${password.length}).`;
  }
  return null;
}

export const adminEnabled = () => adminDisabledReason() === null;

/** Constant-time compare that tolerates differing lengths. */
function sameSecret(a: string, b: string): boolean {
  if (!a || !b) return false;
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function verifyAdminKey(key: string): boolean {
  return adminEnabled() && sameSecret(key, env("ADMIN_KEY"));
}

export function verifyPassword(password: string): boolean {
  return adminEnabled() && sameSecret(password, env("ADMIN_PASSWORD"));
}

function signingSecret(): string {
  const explicit = env("ADMIN_SESSION_SECRET");
  if (explicit) return explicit;
  return createHash("sha256")
    .update(`bm|${env("ADMIN_PASSWORD")}|${env("ADMIN_KEY")}`)
    .digest("hex");
}

const sign = (payload: string) =>
  createHmac("sha256", signingSecret()).update(payload).digest("hex");

export async function startSession(): Promise<void> {
  const expiry = String(Date.now() + TTL_SECONDS * 1000);
  const store = await cookies();
  store.set(COOKIE, `${expiry}.${sign(expiry)}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function hasSession(): Promise<boolean> {
  if (!adminEnabled()) return false;
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;
  const at = raw.lastIndexOf(".");
  if (at < 1) return false;
  const expiry = raw.slice(0, at);
  const signature = raw.slice(at + 1);
  if (!/^\d+$/.test(expiry) || Number(expiry) < Date.now()) return false;
  return sameSecret(signature, sign(expiry));
}
