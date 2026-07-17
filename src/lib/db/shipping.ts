import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getWorldCountries } from "@/lib/world-countries";
import { hasSupabaseServerEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export type ShippingAreaOverride =
  Database["public"]["Tables"]["shipping_area_overrides"]["Row"];
export type ShippingRegion = Database["public"]["Tables"]["shipping_regions"]["Row"];
export type ShippingRule = Database["public"]["Tables"]["shipping_rules"]["Row"] & {
  shipping_countries?: Database["public"]["Tables"]["shipping_countries"]["Row"] | null;
};
export type ShippingCountry =
  Database["public"]["Tables"]["shipping_countries"]["Row"] & {
    shipping_area_overrides: ShippingAreaOverride[];
    shipping_regions?: ShippingRegion[];
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
        shipping_regions: [
          {
            id: "local-colombo-region",
            country_id: "local-lk",
            region_name: "Colombo",
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
    .select("*, shipping_area_overrides(*), shipping_regions(*)")
    .order("country_name", { ascending: true })
    .order("area_name", {
      referencedTable: "shipping_area_overrides",
      ascending: true,
    });

  if (error) throw error;
  return (data ?? []) as ShippingCountry[];
}

export async function listShippingRules() {
  if (!hasSupabaseServerEnv()) {
    return [
      {
        id: "local-lk-rule",
        rule_type: "country_default",
        country_id: "local-lk",
        region_ids: [],
        fee: 2400,
        currency: "LKR",
        is_active: true,
        created_at: "",
        updated_at: "",
        shipping_countries: {
          id: "local-lk",
          country_name: "Sri Lanka",
          country_code: "LK",
          default_fee: 2400,
          currency: "LKR",
          is_active: true,
          created_at: "",
          updated_at: "",
        },
      },
    ] satisfies ShippingRule[];
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("shipping_rules")
    .select("*, shipping_countries(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ShippingRule[];
}

export async function hasInternationalShippingDefault() {
  const rules = await listShippingRules();
  return rules.some((rule) => rule.rule_type === "international_default" && rule.is_active);
}

export async function listCheckoutCountries() {
  const [countries, rules] = await Promise.all([listShippingCountries(), listShippingRules()]);
  const activeCountries = countries.filter((country) => country.is_active);
  const internationalDefault = rules.find(
    (rule) => rule.rule_type === "international_default" && rule.is_active,
  );

  if (!internationalDefault) return activeCountries;

  const activeByCode = new Map(activeCountries.map((country) => [country.country_code, country]));
  const worldCountries = getWorldCountries()
    .filter((country) => !activeByCode.has(country.country_code))
    .map((country) => ({
      id: `world-${country.country_code}`,
      country_name: country.country_name,
      country_code: country.country_code,
      default_fee: Number(internationalDefault.fee),
      currency: country.currency,
      is_active: true,
      created_at: "",
      updated_at: "",
      shipping_area_overrides: [],
      shipping_regions: [],
    }));

  return [...activeCountries, ...worldCountries] satisfies ShippingCountry[];
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
  const countries = await listShippingCountries();
  const country = countries.find(
    (item) => item.country_code.toUpperCase() === (countryCode || "LK").toUpperCase(),
  );
  const { data: rules, error } = await supabase
    .from("shipping_rules")
    .select("*")
    .eq("is_active", true);

  if (error) throw error;

  const shippingRules = (rules ?? []) as Database["public"]["Tables"]["shipping_rules"]["Row"][];
  const region = country?.shipping_regions?.find(
    (item) => item.region_name.toLowerCase() === (district ?? "").toLowerCase(),
  );
  const regionOverride = shippingRules.find((rule) => {
    const ids = Array.isArray(rule.region_ids) ? rule.region_ids.map(String) : [];
    return (
      rule.rule_type === "country_region_override" &&
      rule.country_id === country?.id &&
      region?.id &&
      ids.includes(region.id)
    );
  });
  const countryDefault = shippingRules.find(
    (rule) => rule.rule_type === "country_default" && rule.country_id === country?.id,
  );
  const internationalDefault = shippingRules.find(
    (rule) => rule.rule_type === "international_default",
  );

  return Number(regionOverride?.fee ?? countryDefault?.fee ?? internationalDefault?.fee ?? 0);
}
