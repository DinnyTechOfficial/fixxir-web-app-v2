import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === "development" ? {
    allowedDevOrigins: (process.env.NEXT_DEV_ALLOWED_ORIGINS || "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean),
    async rewrites() {
      return [{ source: "/repair/track/:pickupCode", destination: "/repair/track" }];
    },
  } : {}),
  output: "export",
  distDir: "dist",
};

export default nextConfig;
