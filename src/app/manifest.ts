import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: "NK Portfolio",
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fffdf8",
    theme_color: "#342416",
    categories: ["portfolio", "business", "productivity"],
    icons: [
      {
        src: "/assets/brand/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any"
      }
    ]
  };
}
