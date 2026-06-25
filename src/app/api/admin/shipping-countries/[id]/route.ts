import { adminRedirect } from "@/lib/admin-forms";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { shippingCountrySchema } from "@/lib/validation/admin";

const countryChoices: Record<string, { name: string; currency: string }> = {
  US: { name: "United States", currency: "USD" },
  LK: { name: "Sri Lanka", currency: "USD" },
  GB: { name: "United Kingdom", currency: "GBP" },
  CA: { name: "Canada", currency: "CAD" },
  AU: { name: "Australia", currency: "AUD" },
  IN: { name: "India", currency: "INR" },
  AE: { name: "United Arab Emirates", currency: "AED" },
  SG: { name: "Singapore", currency: "SGD" },
  MY: { name: "Malaysia", currency: "MYR" },
  DE: { name: "Germany", currency: "EUR" },
  FR: { name: "France", currency: "EUR" },
  IT: { name: "Italy", currency: "EUR" },
  NL: { name: "Netherlands", currency: "EUR" },
  JP: { name: "Japan", currency: "JPY" },
};

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
    const { error } = await supabase.from("shipping_countries").delete().eq("id", id);

    if (error) {
      return adminRedirect(request, "/admin/settings/shipping", {
        error: error.message,
      });
    }

    return adminRedirect(request, "/admin/settings/shipping", {
      success: "Country deleted.",
    });
  }

  const countryCode = String(formData.get("country_code") ?? "US").toUpperCase();
  const countryChoice = countryChoices[countryCode];
  const parsed = shippingCountrySchema.safeParse({
    country_name: countryChoice?.name || formData.get("country_name"),
    country_code: countryCode,
    default_fee: formData.get("default_fee"),
    currency: formData.get("currency") || countryChoice?.currency || "USD",
    is_active: formData.get("is_active") === "true",
  });

  if (!parsed.success) {
    return adminRedirect(request, "/admin/settings/shipping", {
      error: parsed.error.issues[0]?.message ?? "Invalid country details.",
    });
  }

  const { error } = await supabase
    .from("shipping_countries")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    return adminRedirect(request, "/admin/settings/shipping", {
      error: error.message,
    });
  }

  const regions = String(formData.get("regions") ?? "")
    .split(/\n|,/)
    .map((region) => region.trim())
    .filter(Boolean);

  const { error: deleteRegionsError } = await supabase
    .from("shipping_regions")
    .delete()
    .eq("country_id", id);

  if (deleteRegionsError) {
    return adminRedirect(request, "/admin/settings/shipping?tab=countries", {
      error: deleteRegionsError.message,
    });
  }

  if (regions.length) {
    const { error: regionError } = await supabase.from("shipping_regions").insert(
      regions.map((region_name) => ({
        country_id: id,
        region_name,
      })),
    );

    if (regionError) {
      return adminRedirect(request, "/admin/settings/shipping?tab=countries", {
        error: regionError.message,
      });
    }
  }

  return adminRedirect(request, "/admin/settings/shipping?tab=countries", {
    success: "Country saved.",
  });
}
