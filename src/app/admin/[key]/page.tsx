import { notFound } from "next/navigation";
import type { Metadata } from "next";
import content from "@/data/content.json";
import { adminDisabledReason, hasSession, verifyAdminKey } from "@/lib/admin/auth";
import { githubConfigured } from "@/lib/admin/github";
import Login from "./Login";
import Studio from "./Studio";

/** Keep the studio out of search results even though the path is secret. */
export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false, nocache: true },
};

// Reads cookies and a request-time secret, so it must never be prerendered.
export const dynamic = "force-dynamic";

export default async function StudioPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;

  const disabled = adminDisabledReason();
  if (disabled) {
    // Log for the Vercel function logs, where the owner will actually look.
    console.error(`[studio] disabled: ${disabled}`);
    if (process.env.NODE_ENV !== "production") {
      return (
        <main className="mx-auto max-w-xl px-6 py-20 text-ink">
          <h1 className="text-xl font-bold">Studio is switched off</h1>
          <p className="mt-3 text-[0.9rem] text-muted">{disabled}</p>
          <p className="mt-3 text-[0.9rem] text-muted">
            Set the variables in <code className="font-mono">.env.local</code> (see{" "}
            <code className="font-mono">.env.example</code>) and restart the dev server. This
            hint only appears in development; in production the route 404s.
          </p>
        </main>
      );
    }
    notFound();
  }

  // A wrong secret is indistinguishable from a route that does not exist.
  if (!verifyAdminKey(key)) notFound();

  if (!(await hasSession())) return <Login keySegment={key} />;

  return <Studio initial={content} keySegment={key} canCommit={githubConfigured()} />;
}
