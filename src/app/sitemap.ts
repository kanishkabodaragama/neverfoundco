import type { MetadataRoute } from "next";
import { listActiveProducts } from "@/lib/db/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
  const products = await listActiveProducts();
  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/shop", priority: 0.9 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
    { path: "/returns", priority: 0.5 },
    { path: "/privacy", priority: 0.4 },
    { path: "/terms", priority: 0.4 },
    { path: "/sitemap", priority: 0.3 },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route.path}`,
      changeFrequency: route.path === "" || route.path === "/shop" ? "weekly" as const : "monthly" as const,
      priority: route.priority,
    })),
    ...products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      changeFrequency: "weekly" as const,
      lastModified: new Date(product.updated_at),
      priority: 0.8,
    })),
  ];
}
