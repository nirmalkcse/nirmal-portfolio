import type { MetadataRoute } from "next";
import { absoluteUrl, publicRoutes } from "@/lib/seo";

export const dynamic = "force-static";

const lastModified = new Date("2026-06-04T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.path === "/" ? "weekly" : "monthly",
    priority: route.path === "/" ? 1 : route.path.startsWith("/projects/") ? 0.7 : 0.8
  }));
}
