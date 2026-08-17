"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CONTENT_SPEC, SECTIONS, validateContent } from "@/lib/admin/schema";
import { logout, saveContent, type SaveResult } from "./actions";
import Field from "./Fields";

type Doc = Record<string, unknown>;

export default function Studio({
  initial,
  keySegment,
  canCommit,
}: {
  initial: Doc;
  keySegment: string;
  canCommit: boolean;
}) {
  const [doc, setDoc] = useState<Doc>(() => structuredClone(initial));
  /**
   * What is currently published. Tracked separately from the `initial` prop,
   * which is fixed for the life of the page: without this, a successful publish
   * still reads as "unsaved changes", Discard rolls back to the pre-publish
   * state, and undoing an edit after publishing makes the document match
   * `initial` again — which silently disables Publish and strands the change.
   */
  const [baseline, setBaseline] = useState<Doc>(() => structuredClone(initial));
  const [active, setActive] = useState(SECTIONS[0].key);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<SaveResult | null>(null);

  const dirty = useMemo(
    () => JSON.stringify(doc) !== JSON.stringify(baseline),
    [doc, baseline],
  );
  const problems = useMemo(() => validateContent(doc), [doc]);

  // Losing a page of rewritten copy to a stray refresh is a bad afternoon.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const section = SECTIONS.find((s) => s.key === active) ?? SECTIONS[0];

  const update = useCallback(
    (key: string, next: unknown) => setDoc((prev) => ({ ...prev, [key]: next })),
    [],
  );

  async function onSave() {
    setSaving(true);
    setResult(null);
    const submitted = structuredClone(doc);
    try {
      const res = await saveContent(keySegment, submitted);
      // Only the submitted snapshot is published — anything typed while the
      // request was in flight stays dirty rather than being marked as saved.
      if (res.ok) setBaseline(submitted);
      setResult(res);
    } catch (cause) {
      setResult({
        ok: false,
        error: cause instanceof Error ? cause.message : "The save request failed.",
      });
    } finally {
      setSaving(false);
    }
  }

  function download() {
    const blob = new Blob([JSON.stringify(doc, null, 2) + "\n"], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-bg-2/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <div className="mr-auto flex items-baseline gap-2.5">
            <span className="text-[1.05rem] font-extrabold tracking-[-0.03em]">
              Studio<span className="text-blue">.</span>
            </span>
            <span className="font-mono text-[0.65rem] tracking-[0.1em] text-muted uppercase">
              {dirty ? "unsaved changes" : "in sync"}
            </span>
            {dirty ? <span className="size-1.5 rounded-full bg-blue" /> : null}
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-line px-3 py-1.5 text-[0.8rem] text-muted transition-colors hover:border-blue hover:text-blue"
          >
            View site ↗
          </a>
          <button
            type="button"
            onClick={download}
            className="rounded-lg border border-line px-3 py-1.5 text-[0.8rem] text-muted transition-colors hover:border-blue hover:text-blue"
          >
            Download JSON
          </button>
          <button
            type="button"
            onClick={() => setDoc(structuredClone(baseline))}
            disabled={!dirty || saving}
            className="rounded-lg border border-line px-3 py-1.5 text-[0.8rem] text-muted transition-colors hover:border-blue hover:text-blue disabled:cursor-not-allowed disabled:opacity-40"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!dirty || saving || problems.length > 0 || !canCommit}
            title={canCommit ? undefined : "GitHub is not configured on the server."}
            className="rounded-lg bg-blue px-4 py-1.5 text-[0.85rem] font-semibold text-white shadow-soft transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? "Publishing…" : "Publish"}
          </button>
          <button
            type="button"
            onClick={async () => {
              await logout(keySegment);
              window.location.reload();
            }}
            className="rounded-lg px-2 py-1.5 text-[0.8rem] text-muted transition-colors hover:text-ink"
          >
            Sign out
          </button>
        </div>

        {!canCommit ? (
          <Banner tone="warn">
            Editing works, but publishing is off: the server has no GitHub token. Set{" "}
            <code className="font-mono">GITHUB_TOKEN</code> and{" "}
            <code className="font-mono">GITHUB_REPO</code>, or use Download JSON and commit the
            file yourself.
          </Banner>
        ) : null}

        {problems.length ? (
          <Banner tone="error">
            {problems.length} field{problems.length > 1 ? "s" : ""} need fixing before you can
            publish: {problems.slice(0, 3).join(" ")}
            {problems.length > 3 ? " …" : ""}
          </Banner>
        ) : null}

        {result?.ok ? (
          <Banner tone="ok">
            Published as{" "}
            {result.url ? (
              <a className="underline" href={result.url} target="_blank" rel="noreferrer">
                {result.commit}
              </a>
            ) : (
              result.commit
            )}
            . Vercel is rebuilding — the live site updates in about a minute.
          </Banner>
        ) : null}

        {result && !result.ok ? (
          <Banner tone="error">
            {result.error}
            {result.problems?.length ? ` ${result.problems.slice(0, 3).join(" ")}` : ""}
          </Banner>
        ) : null}
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
        <nav className="lg:sticky lg:top-24 lg:h-fit lg:w-60 lg:shrink-0">
          <ul className="flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {SECTIONS.map((s) => {
              const isActive = s.key === active;
              return (
                <li key={s.key} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    onClick={() => setActive(s.key)}
                    className={`w-full rounded-lg px-3 py-2 text-left text-[0.85rem] transition-colors ${
                      isActive
                        ? "bg-soft font-semibold text-blue"
                        : "text-muted hover:bg-soft/60 hover:text-ink"
                    }`}
                  >
                    {s.label}
                    <span className="ml-2 font-mono text-[0.6rem] text-muted/60">
                      {countOf(doc[s.key])}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <main className="min-w-0 flex-1">
          <div className="mb-5">
            <h1 className="text-[1.4rem] font-extrabold tracking-[-0.03em]">{section.label}</h1>
            <p className="mt-1 text-[0.85rem] text-muted">{section.blurb}</p>
          </div>

          <div className="rounded-2xl border border-line bg-bg-2 p-4 shadow-soft sm:p-5">
            <Field
              spec={CONTENT_SPEC[section.key]}
              value={doc[section.key]}
              onChange={(next) => update(section.key, next)}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

function countOf(value: unknown): string {
  return Array.isArray(value) ? String(value.length) : "";
}

function Banner({
  tone,
  children,
}: {
  tone: "ok" | "warn" | "error";
  children: React.ReactNode;
}) {
  const tones = {
    ok: "border-blue/30 bg-soft text-deep",
    warn: "border-amber-300 bg-amber-50 text-amber-900",
    error: "border-red-300 bg-red-50 text-red-900",
  };
  return (
    <div className={`border-t px-4 py-2 text-[0.8rem] sm:px-6 ${tones[tone]}`}>{children}</div>
  );
}
