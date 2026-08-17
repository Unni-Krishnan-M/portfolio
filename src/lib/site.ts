/**
 * The site's public origin — the single source of truth for canonical URLs,
 * OpenGraph tags, JSON-LD and the sitemap.
 *
 * This used to be a literal copied into four files, all of them pointing at a
 * domain that was never deployed, which meant every canonical URL and link
 * preview advertised a dead address. Resolution order:
 *
 *   1. NEXT_PUBLIC_SITE_URL      — set this to override, e.g. a custom domain
 *   2. VERCEL_PROJECT_PRODUCTION_URL — injected by Vercel; follows the project's
 *                                  production domain automatically, including
 *                                  after a custom domain is attached
 *   3. the current production URL — so a plain local build still resolves
 *
 * No trailing slash: callers build paths as `${SITE}/thing`.
 */

const FALLBACK = "https://portfolio-navy-one-nwrqjhghgs.vercel.app";

function resolve(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit;

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return vercel.startsWith("http") ? vercel : `https://${vercel}`;

  return FALLBACK;
}

export const SITE = resolve().replace(/\/+$/, "");
