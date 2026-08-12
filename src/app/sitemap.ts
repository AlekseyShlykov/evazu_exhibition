import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, "");
  return ["", "/exhibition/", "/guestbook/"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date("2025-01-01"),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : .8
  }));
}
