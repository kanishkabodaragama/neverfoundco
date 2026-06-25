import { adminRedirect } from "@/lib/admin-forms";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { shippingRuleSchema } from "@/lib/validation/admin";

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const formData = await request.formData();
  const ruleType = String(formData.get("rule_type") ?? "country_default");
  const regionIds = formData.getAll("region_ids").map(String).filter(Boolean);
  const parsed = shippingRuleSchema.safeParse({
    rule_type: ruleType,
    country_id: formData.get("country_id") || null,
    region_ids: regionIds,
    fee: formData.get("fee"),
    currency: formData.get("currency") || "USD",
    is_active: formData.get("is_active") !== "false",
  });

  if (!parsed.success) {
    return adminRedirect(request, "/admin/settings/shipping", {
      error: parsed.error.issues[0]?.message ?? "Invalid shipping rule.",
    });
  }

  if (parsed.data.rule_type !== "international_default" && !parsed.data.country_id) {
    return adminRedirect(request, "/admin/settings/shipping", {
      error: "Select a country for this shipping rule.",
    });
  }

  if (parsed.data.rule_type === "country_region_override" && !parsed.data.region_ids.length) {
    return adminRedirect(request, "/admin/settings/shipping", {
      error: "Select at least one region for the override.",
    });
  }

  const supabase = getSupabaseAdminClient();

  if (parsed.data.rule_type === "international_default") {
    const { data: existing, error: existingError } = await supabase
      .from("shipping_rules")
      .select("id")
      .eq("rule_type", "international_default")
      .eq("is_active", true)
      .maybeSingle();

    if (existingError) {
      return adminRedirect(request, "/admin/settings/shipping", { error: existingError.message });
    }

    if (existing) {
      return adminRedirect(request, "/admin/settings/shipping", {
        error: "Only one international default rule can be active.",
      });
    }
  }

  const payload = {
    ...parsed.data,
    country_id: parsed.data.rule_type === "international_default" ? null : parsed.data.country_id,
    region_ids: parsed.data.rule_type === "country_region_override" ? parsed.data.region_ids : [],
  };
  const { error } = await supabase.from("shipping_rules").insert(payload);

  if (error) {
    return adminRedirect(request, "/admin/settings/shipping", { error: error.message });
  }

  return adminRedirect(request, "/admin/settings/shipping", {
    success: "Shipping rule created.",
  });
}
