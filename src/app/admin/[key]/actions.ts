"use server";

/**
 * Every action here is a public POST endpoint — Next's docs are explicit that
 * rendering a form behind a password is not a security boundary, because the
 * action can be invoked without ever loading the UI. So each one re-checks the
 * path secret and (for writes) the session, and validates its input, rather than
 * trusting that it was called from the studio.
 */

import { revalidatePath } from "next/cache";
import {
  endSession,
  hasSession,
  startSession,
  verifyAdminKey,
  verifyPassword,
} from "@/lib/admin/auth";
import { commitContent } from "@/lib/admin/github";
import { validateContent } from "@/lib/admin/schema";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Failed-attempt throttle, held in module scope.
 *
 * Fluid Compute reuses a function instance across requests, so this survives
 * between attempts and is real friction rather than decoration — though an
 * attacker whose request lands on a cold instance starts from zero, so treat it
 * as a speed bump, not a lockout. It matters because the path segment is short
 * enough to guess, which leaves the password carrying the whole load.
 */
const LOCK_AFTER = 5;
const LOCK_MS = 5 * 60 * 1000;
let failures = 0;
let lockedUntil = 0;

export async function login(
  key: string,
  password: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!verifyAdminKey(key)) return { ok: false, error: "Not available." };

  const now = Date.now();
  if (now < lockedUntil) {
    const seconds = Math.ceil((lockedUntil - now) / 1000);
    return { ok: false, error: `Too many attempts. Try again in ${seconds}s.` };
  }

  if (!verifyPassword(password)) {
    failures += 1;
    if (failures >= LOCK_AFTER) {
      lockedUntil = now + LOCK_MS;
      failures = 0;
      return { ok: false, error: "Too many attempts. Locked for 5 minutes." };
    }
    // A second per guess on top of the lockout.
    await sleep(1000);
    return { ok: false, error: "Wrong password." };
  }

  failures = 0;
  lockedUntil = 0;
  await startSession();
  return { ok: true };
}

export async function logout(key: string): Promise<{ ok: boolean }> {
  if (!verifyAdminKey(key)) return { ok: false };
  await endSession();
  return { ok: true };
}

export type SaveResult =
  | { ok: true; commit: string; url: string }
  | { ok: false; error: string; problems?: string[] };

export async function saveContent(key: string, doc: unknown): Promise<SaveResult> {
  if (!verifyAdminKey(key)) return { ok: false, error: "Not available." };
  if (!(await hasSession())) {
    return { ok: false, error: "Your session expired. Reload the page and sign in again." };
  }

  const problems = validateContent(doc);
  if (problems.length) {
    return { ok: false, error: "The content did not validate, so nothing was saved.", problems };
  }

  const json = JSON.stringify(doc, null, 2) + "\n";
  if (json.length > 1_500_000) {
    return { ok: false, error: "That document is unreasonably large; nothing was saved." };
  }

  const result = await commitContent(json, "Update site content from the studio");
  if (!result.ok) return { ok: false, error: result.error };

  // Refreshes this deployment's render. The published site updates when Vercel
  // finishes rebuilding from the commit, which takes about a minute.
  revalidatePath("/", "layout");

  return { ok: true, commit: result.commit, url: result.url };
}
