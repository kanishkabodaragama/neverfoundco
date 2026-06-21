import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseServerEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];
export type ProductWithImages = Product & {
  product_images: ProductImage[];
};

export async function listActiveProducts() {
  if (!hasSupabaseServerEnv()) return [];

  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .order("sort_order", {
      referencedTable: "product_images",
      ascending: true,
    });

  if (error) throw error;
  return (data ?? []) as ProductWithImages[];
}

export async function getActiveProductBySlug(slug: string) {
  if (!hasSupabaseServerEnv()) return null;

  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data as ProductWithImages;
}

export async function listAdminProducts() {
  if (!hasSupabaseServerEnv()) return [];

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ProductWithImages[];
}

export async function getAdminProduct(id: string) {
  if (!hasSupabaseServerEnv()) return null;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as ProductWithImages;
}
