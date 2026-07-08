import { connection } from "next/server";
import { hasSupabaseServerEnv } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ProductWithImages } from "@/lib/db/products";

export type YouMayAlsoLikeItem = {
  created_at: string;
  exclude_current_product: boolean;
  id: string;
  image_url: string;
  product_id: string;
  sort_order: number;
  storage_path: string | null;
  products: Pick<ProductWithImages, "id" | "name" | "slug" | "is_active"> | null;
};

const featureSelect = `
  *,
  products (
    id,
    name,
    slug,
    is_active
  )
`;

export async function listAdminYouMayAlsoLikeItems() {
  if (!hasSupabaseServerEnv()) return [];

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("you_may_also_like_items")
    .select(featureSelect)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as YouMayAlsoLikeItem[];
}

export async function listStorefrontYouMayAlsoLikeItems() {
  await connection();
  if (!hasSupabaseServerEnv()) return [];

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("you_may_also_like_items")
    .select(featureSelect)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return [];

  return ((data ?? []) as YouMayAlsoLikeItem[]).filter((item) => {
    return Boolean(item.products?.is_active);
  });
}
