import type { NextConfig } from "next";

// Public host of the Cloudflare R2 bucket (R2_PUBLIC_URL in .env).
const r2Host = process.env.R2_PUBLIC_URL
  ? new URL(process.env.R2_PUBLIC_URL).hostname
  : null;

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  reactCompiler: true,
  images: {
    // In dev, never serve stale optimized images after a file in /public is
    // replaced under the same name. Production keeps the 4-hour default.
    minimumCacheTTL: process.env.NODE_ENV === "development" ? 0 : 14400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.shadcnspace.com",
      },
      ...(r2Host ? [{ protocol: "https" as const, hostname: r2Host }] : []),
    ],
  },
};

export default nextConfig;
