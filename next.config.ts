import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === "development" ? {
    async rewrites() {
      return [{ source: "/repair/track/:pickupCode", destination: "/repair/track" }];
    },
  } : {}),
  output: "export",
  distDir: "dist",
};

export default nextConfig;
