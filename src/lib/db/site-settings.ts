import { hasSupabaseServerEnv } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const CHECKOUT_PAYMENT_TIMEOUT_SETTING_KEY =
  "checkout_payment_timeout_minutes";
export const PRODUCT_RECOMMENDATIONS_ENABLED_SETTING_KEY =
  "product_recommendations_enabled";

export const DEFAULT_CHECKOUT_PAYMENT_TIMEOUT_MINUTES = 15;
export const DEFAULT_PRODUCT_RECOMMENDATIONS_ENABLED = true;

export async function getCheckoutPaymentTimeoutMinutes() {
  if (!hasSupabaseServerEnv()) return DEFAULT_CHECKOUT_PAYMENT_TIMEOUT_MINUTES;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", CHECKOUT_PAYMENT_TIMEOUT_SETTING_KEY)
    .maybeSingle();

  if (error) return DEFAULT_CHECKOUT_PAYMENT_TIMEOUT_MINUTES;

  return normalizeCheckoutPaymentTimeoutMinutes(data?.value);
}

export async function updateCheckoutPaymentTimeoutMinutes(minutes: number) {
  const normalizedMinutes = normalizeCheckoutPaymentTimeoutMinutes(minutes);
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("site_settings").upsert(
    {
      key: CHECKOUT_PAYMENT_TIMEOUT_SETTING_KEY,
      value: normalizedMinutes,
    },
    { onConflict: "key" },
  );

  if (error) throw error;
  return normalizedMinutes;
}

export async function getProductRecommendationsEnabled() {
  if (!hasSupabaseServerEnv()) return DEFAULT_PRODUCT_RECOMMENDATIONS_ENABLED;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", PRODUCT_RECOMMENDATIONS_ENABLED_SETTING_KEY)
    .maybeSingle();

  if (error) return DEFAULT_PRODUCT_RECOMMENDATIONS_ENABLED;

  return normalizeProductRecommendationsEnabled(data?.value);
}

export async function updateProductRecommendationsEnabled(enabled: boolean) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("site_settings").upsert(
    {
      key: PRODUCT_RECOMMENDATIONS_ENABLED_SETTING_KEY,
      value: enabled,
    },
    { onConflict: "key" },
  );

  if (error) throw error;
  return enabled;
}

function normalizeCheckoutPaymentTimeoutMinutes(value: unknown) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return DEFAULT_CHECKOUT_PAYMENT_TIMEOUT_MINUTES;

  return Math.min(120, Math.max(1, Math.round(parsed)));
}

function normalizeProductRecommendationsEnabled(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "true";

  return DEFAULT_PRODUCT_RECOMMENDATIONS_ENABLED;
}
