import type { MetadataRoute } from "next";
import { PRODUCTION_APP_ORIGIN } from "@/lib/app-origin";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || PRODUCTION_APP_ORIGIN;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
