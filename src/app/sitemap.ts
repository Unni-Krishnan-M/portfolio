import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE,
      lastModified: new Date("2026-08-07"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
