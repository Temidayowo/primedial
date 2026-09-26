import type { NextConfig } from "next";

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
    ],
  },
};

export default nextConfig;
