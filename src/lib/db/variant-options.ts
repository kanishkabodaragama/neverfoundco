import { hasSupabaseServerEnv } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

export type VariantOption = Database["public"]["Tables"]["variant_options"]["Row"];

const fallbackOptions: VariantOption[] = [
  { id: "color-black", option_type: "color", name: "Black", color_value: "#111111", created_at: "", updated_at: "" },
  { id: "color-blue", option_type: "color", name: "Blue", color_value: "#bfd0e4", created_at: "", updated_at: "" },
  { id: "color-blush", option_type: "color", name: "Blush", color_value: "#f4c6ca", created_at: "", updated_at: "" },
  { id: "size-xs", option_type: "size", name: "XS", color_value: null, created_at: "", updated_at: "" },
  { id: "size-s", option_type: "size", name: "S", color_value: null, created_at: "", updated_at: "" },
  { id: "size-m", option_type: "size", name: "M", color_value: null, created_at: "", updated_at: "" },
  { id: "size-l", option_type: "size", name: "L", color_value: null, created_at: "", updated_at: "" },
  { id: "size-xl", option_type: "size", name: "XL", color_value: null, created_at: "", updated_at: "" },
  { id: "gender-male", option_type: "gender", name: "Male", color_value: null, created_at: "", updated_at: "" },
  { id: "gender-female", option_type: "gender", name: "Female", color_value: null, created_at: "", updated_at: "" },
  { id: "gender-unisex", option_type: "gender", name: "Unisex", color_value: null, created_at: "", updated_at: "" },
];

export async function listVariantOptions() {
  if (!hasSupabaseServerEnv()) return fallbackOptions;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("variant_options")
    .select("*")
    .order("option_type", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as VariantOption[];
}
