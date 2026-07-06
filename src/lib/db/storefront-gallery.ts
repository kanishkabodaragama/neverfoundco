import { hasSupabaseServerEnv } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

export type StorefrontGalleryImage =
  Database["public"]["Tables"]["storefront_gallery_images"]["Row"];

export async function listStorefrontGalleryImages() {
  if (!hasSupabaseServerEnv()) return [];

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("storefront_gallery_images")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as StorefrontGalleryImage[];
}

