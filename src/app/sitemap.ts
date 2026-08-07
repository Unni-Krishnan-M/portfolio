import type { MetadataRoute } from "next";

const SITE = "https://unni-krishnan.vercel.app";

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
