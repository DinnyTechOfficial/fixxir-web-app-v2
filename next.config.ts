import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === "development" ? {
    allowedDevOrigins: [
      ...Object.values(networkInterfaces()).flatMap((addresses) =>
        addresses?.filter((address) => address.family === "IPv4" && !address.internal).map((address) => address.address) ?? []
      ),
      ...(process.env.NEXT_DEV_ALLOWED_ORIGINS || "")
      .split(",")
      .map((origin) => {
        const value = origin.trim();
        if (!value) return "";
        try {
          const url = new URL(value.includes("://") ? value : `http://${value}`);
          return ["http:", "https:"].includes(url.protocol) ? url.hostname : "";
        } catch {
          return "";
        }
      })
      .filter(Boolean),
    ],
    async rewrites() {
      return [{ source: "/repair/track/:pickupCode", destination: "/repair/track" }];
    },
  } : {}),
  output: "export",
  distDir: "dist",
};

export default nextConfig;
