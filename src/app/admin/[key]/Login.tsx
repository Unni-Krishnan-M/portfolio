"use client";

import { useState } from "react";
import { login } from "./actions";

export default function Login({ keySegment }: { keySegment: string }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await login(keySegment, password);
      if (res.ok) {
        // The page re-renders server-side with the session cookie present.
        window.location.reload();
        return;
      }
      setError(res.error ?? "Sign-in failed.");
    } catch {
      setError("Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-5">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-line bg-bg-2 p-6 shadow-soft"
      >
        <h1 className="text-[1.25rem] font-extrabold tracking-[-0.03em] text-ink">
          Studio<span className="text-blue">.</span>
        </h1>
        <p className="mt-1.5 text-[0.85rem] text-muted">
          Enter the studio password to edit the site.
        </p>

        <label className="mt-6 block space-y-1.5">
          <span className="font-mono text-[0.68rem] font-medium tracking-[0.1em] text-muted uppercase">
            Password
          </span>
          <input
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-[0.9rem] text-ink outline-none transition-colors focus:border-blue focus:ring-2 focus:ring-blue/20"
          />
        </label>

        {error ? <p className="mt-3 text-[0.8rem] text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={busy || password.length === 0}
          className="mt-5 w-full rounded-lg bg-blue px-4 py-2.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? "Checking…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
