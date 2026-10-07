import type { MetadataRoute } from "next";
import { SITE_URL } from "./site-url";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/repair/request`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
