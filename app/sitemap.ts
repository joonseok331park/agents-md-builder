import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/defaults";
import { templateRoutes, coreRoutes } from "@/lib/routes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [...coreRoutes, ...templateRoutes].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
