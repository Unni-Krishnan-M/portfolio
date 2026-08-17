import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // /admin is the content studio. The path segment under it is secret, so it is
    // not listed here — naming it in a public file would defeat the point — but
    // the prefix is disallowed so no crawler follows a leaked link into it.
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
