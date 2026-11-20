import type { NextConfig } from "next";

const isCloudflarePagesExport =
  process.env.CF_PAGES === "1" || process.env.NEXT_OUTPUT_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  ...(isCloudflarePagesExport
    ? {
        images: {
          unoptimized: true
        },
        output: "export" as const,
        trailingSlash: true
      }
    : {})
};

export default nextConfig;
