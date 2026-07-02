import { hasSupabaseServerEnv } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const CHECKOUT_PAYMENT_TIMEOUT_SETTING_KEY =
  "checkout_payment_timeout_minutes";

export const DEFAULT_CHECKOUT_PAYMENT_TIMEOUT_MINUTES = 15;

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

function normalizeCheckoutPaymentTimeoutMinutes(value: unknown) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return DEFAULT_CHECKOUT_PAYMENT_TIMEOUT_MINUTES;

  return Math.min(120, Math.max(1, Math.round(parsed)));
}
