import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseServerEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export type ShippingAreaOverride =
  Database["public"]["Tables"]["shipping_area_overrides"]["Row"];
export type ShippingCountry =
  Database["public"]["Tables"]["shipping_countries"]["Row"] & {
    shipping_area_overrides: ShippingAreaOverride[];
  };

export async function getShippingFee() {
  if (!hasSupabaseServerEnv()) return 0;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("shipping_settings")
    .select("default_shipping_fee")
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return Number(data?.default_shipping_fee ?? 0);
}

export async function listShippingCountries() {
  if (!hasSupabaseServerEnv()) {
    return [
      {
        id: "local-lk",
        country_name: "Sri Lanka",
        country_code: "LK",
        default_fee: 400,
        currency: "LKR",
        is_active: true,
        created_at: "",
        updated_at: "",
        shipping_area_overrides: [
          {
            id: "local-colombo",
            country_id: "local-lk",
            area_name: "Colombo",
            fee: 350,
            created_at: "",
            updated_at: "",
          },
        ],
      },
    ] satisfies ShippingCountry[];
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("shipping_countries")
    .select("*, shipping_area_overrides(*)")
    .order("country_name", { ascending: true })
    .order("area_name", {
      referencedTable: "shipping_area_overrides",
      ascending: true,
    });

  if (error) throw error;
  return (data ?? []) as ShippingCountry[];
}

export async function getShippingFeeForAddress(countryCode?: string, district?: string) {
  if (!hasSupabaseServerEnv()) {
    const fallback = await listShippingCountries();
    const country = fallback.find((item) => item.country_code === (countryCode || "LK"));
    const override = country?.shipping_area_overrides.find(
      (item) => item.area_name.toLowerCase() === (district ?? "").toLowerCase(),
    );

    return Number(override?.fee ?? country?.default_fee ?? 0);
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("shipping_countries")
    .select("*, shipping_area_overrides(*)")
    .eq("country_code", countryCode || "LK")
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;

  const country = data as ShippingCountry | null;
  const override = country?.shipping_area_overrides.find(
    (item) => item.area_name.toLowerCase() === (district ?? "").toLowerCase(),
  );

  return Number(override?.fee ?? country?.default_fee ?? 0);
}
