import { hasSupabaseServerEnv } from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const CHECKOUT_PAYMENT_TIMEOUT_SETTING_KEY =
  "checkout_payment_timeout_minutes";
export const PRODUCT_RECOMMENDATIONS_ENABLED_SETTING_KEY =
  "product_recommendations_enabled";
export const LEGAL_PAGE_DETAILS_SETTING_KEY = "legal_page_details";
export const FALLBACK_USD_TO_LKR_RATE_SETTING_KEY =
  "fallback_usd_to_lkr_rate";

export const DEFAULT_CHECKOUT_PAYMENT_TIMEOUT_MINUTES = 15;
export const DEFAULT_PRODUCT_RECOMMENDATIONS_ENABLED = true;
export const DEFAULT_FALLBACK_USD_TO_LKR_RATE = 300;

export type LegalPageSettings = {
  businessAddress: string;
  businessName: string;
  emailAddress: string;
  phoneNumber: string;
  returnAddress: string;
  updatedAt: string;
};

export type ResolvedLegalPageSettings = LegalPageSettings & {
  hasEmailAddress: boolean;
};

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

export async function getFallbackUsdToLkrRate() {
  if (!hasSupabaseServerEnv()) return DEFAULT_FALLBACK_USD_TO_LKR_RATE;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", FALLBACK_USD_TO_LKR_RATE_SETTING_KEY)
    .maybeSingle();

  if (error) return DEFAULT_FALLBACK_USD_TO_LKR_RATE;

  return normalizeFallbackUsdToLkrRate(data?.value);
}

export async function updateFallbackUsdToLkrRate(rate: number) {
  const normalizedRate = normalizeFallbackUsdToLkrRate(rate);
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("site_settings").upsert(
    {
      key: FALLBACK_USD_TO_LKR_RATE_SETTING_KEY,
      value: normalizedRate,
    },
    { onConflict: "key" },
  );

  if (error) throw error;
  return normalizedRate;
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

export async function getLegalPageSettings(): Promise<LegalPageSettings> {
  const fallback = normalizeLegalPageSettings({}, new Date().toISOString());
  if (!hasSupabaseServerEnv()) return fallback;

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value, updated_at")
    .eq("key", LEGAL_PAGE_DETAILS_SETTING_KEY)
    .maybeSingle();

  if (error || !data) return fallback;

  return normalizeLegalPageSettings(data.value, data.updated_at);
}

export async function updateLegalPageSettings(
  settings: Omit<LegalPageSettings, "updatedAt">,
) {
  const supabase = getSupabaseAdminClient();
  const value = {
    business_address: settings.businessAddress.trim(),
    business_name: settings.businessName.trim(),
    email_address: settings.emailAddress.trim(),
    phone_number: settings.phoneNumber.trim(),
    return_address: settings.returnAddress.trim(),
  };
  const { data, error } = await supabase
    .from("site_settings")
    .upsert(
      {
        key: LEGAL_PAGE_DETAILS_SETTING_KEY,
        value,
      },
      { onConflict: "key" },
    )
    .select("value, updated_at")
    .single();

  if (error) throw error;

  return normalizeLegalPageSettings(data.value, data.updated_at);
}

export function resolveLegalPageSettings(
  settings: LegalPageSettings,
): ResolvedLegalPageSettings {
  return {
    businessAddress:
      settings.businessAddress || "[Insert Business Address]",
    businessName: settings.businessName || "[Insert Business Name]",
    emailAddress: settings.emailAddress || "[Insert Email Address]",
    hasEmailAddress: Boolean(settings.emailAddress),
    phoneNumber: settings.phoneNumber || "[Insert Phone Number]",
    returnAddress: settings.returnAddress || "[Insert Return Address]",
    updatedAt: settings.updatedAt,
  };
}

export function formatLegalEffectiveDate(value: string) {
  const date = new Date(value);
  const validDate = Number.isNaN(date.getTime()) ? new Date() : date;

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    timeZone: "Asia/Colombo",
    year: "numeric",
  }).format(validDate);
}

function normalizeCheckoutPaymentTimeoutMinutes(value: unknown) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return DEFAULT_CHECKOUT_PAYMENT_TIMEOUT_MINUTES;

  return Math.min(120, Math.max(1, Math.round(parsed)));
}

function normalizeFallbackUsdToLkrRate(value: unknown) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 10000) {
    return DEFAULT_FALLBACK_USD_TO_LKR_RATE;
  }

  return Number(parsed.toFixed(6));
}

function normalizeProductRecommendationsEnabled(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "true";

  return DEFAULT_PRODUCT_RECOMMENDATIONS_ENABLED;
}

function normalizeLegalPageSettings(
  value: unknown,
  updatedAt: unknown,
): LegalPageSettings {
  const record =
    typeof value === "object" && value !== null
      ? (value as Record<string, unknown>)
      : {};

  return {
    businessAddress: normalizeSettingString(record.business_address),
    businessName: normalizeSettingString(record.business_name),
    emailAddress: normalizeSettingString(record.email_address),
    phoneNumber: normalizeSettingString(record.phone_number),
    returnAddress: normalizeSettingString(record.return_address),
    updatedAt:
      typeof updatedAt === "string" ? updatedAt : new Date().toISOString(),
  };
}

function normalizeSettingString(value: unknown) {
  return typeof value === "string" ? value : "";
}
