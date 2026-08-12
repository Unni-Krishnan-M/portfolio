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

export async function login(
  key: string,
  password: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!verifyAdminKey(key)) return { ok: false, error: "Not available." };

  if (!verifyPassword(password)) {
    // Costs an attacker a second per guess. Real rate limiting needs shared
    // state, which a static site on serverless functions does not have; the
    // password length minimum is what actually carries the weight here.
    await sleep(1000);
    return { ok: false, error: "Wrong password." };
  }

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
