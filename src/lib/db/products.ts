import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseServerEnv } from "@/lib/env";
import { connection } from "next/server";
import type { Database } from "@/types/database";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];
export type ProductVariant = Database["public"]["Tables"]["product_variants"]["Row"];
export type ProductWithImages = Product & {
  product_images: ProductImage[];
  product_variants?: ProductVariant[];
};

export async function listActiveProducts() {
  await connection();
  if (!hasSupabaseServerEnv()) return [];

  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), product_variants(*)")
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
  await connection();
  if (!hasSupabaseServerEnv()) return null;

  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), product_variants(*)")
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
    .select("*, product_images(*), product_variants(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ProductWithImages[];
}

export async function getAdminProduct(id: string) {
  if (!hasSupabaseServerEnv()) return null;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_images(*), product_variants(*)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as ProductWithImages;
}
