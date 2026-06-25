import { hasSupabaseServerEnv } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

export type ProductCategory = Database["public"]["Tables"]["product_categories"]["Row"];

const fallbackCategories: ProductCategory[] = [
  { id: "cat-t-shirts", name: "T-Shirts", slug: "t-shirts", description: "Core tee drops.", display_order: 10, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-hoodies", name: "Hoodies", slug: "hoodies", description: "Warm layers and fleece.", display_order: 20, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-shirts", name: "Shirts", slug: "shirts", description: "Button shirts and camp collars.", display_order: 30, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-pants", name: "Pants", slug: "pants", description: "Bottoms and relaxed fits.", display_order: 40, is_active: true, created_at: "", updated_at: "" },
  { id: "cat-accessories", name: "Accessories", slug: "accessories", description: "Small goods and add-ons.", display_order: 50, is_active: true, created_at: "", updated_at: "" },
];

export async function listProductCategories() {
  if (!hasSupabaseServerEnv()) return fallbackCategories;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as ProductCategory[];
}
