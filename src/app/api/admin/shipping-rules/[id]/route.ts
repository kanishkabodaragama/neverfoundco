import { adminRedirect } from "@/lib/admin-forms";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { shippingRuleSchema } from "@/lib/validation/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  const formData = await request.formData();
  const method = formData.get("_method");
  const supabase = getSupabaseAdminClient();

  if (method === "DELETE") {
    const { error } = await supabase.from("shipping_rules").delete().eq("id", id);

    if (error) return adminRedirect(request, "/admin/settings/shipping", { error: error.message });
    return adminRedirect(request, "/admin/settings/shipping", { success: "Shipping rule deleted." });
  }

  const ruleType = String(formData.get("rule_type") ?? "country_default");
  const regionIds = formData.getAll("region_ids").map(String).filter(Boolean);
  const parsed = shippingRuleSchema.safeParse({
    rule_type: ruleType,
    country_id: formData.get("country_id") || null,
    region_ids: regionIds,
    fee: formData.get("fee"),
    currency: "LKR",
    is_active: formData.get("is_active") !== "false",
  });

  if (!parsed.success) {
    return adminRedirect(request, "/admin/settings/shipping", {
      error: parsed.error.issues[0]?.message ?? "Invalid shipping rule.",
    });
  }

  const payload = {
    ...parsed.data,
    country_id: parsed.data.rule_type === "international_default" ? null : parsed.data.country_id,
    region_ids: parsed.data.rule_type === "country_region_override" ? parsed.data.region_ids : [],
  };
  const { error } = await supabase.from("shipping_rules").update(payload).eq("id", id);

  if (error) return adminRedirect(request, "/admin/settings/shipping", { error: error.message });
  return adminRedirect(request, "/admin/settings/shipping", { success: "Shipping rule saved." });
}
