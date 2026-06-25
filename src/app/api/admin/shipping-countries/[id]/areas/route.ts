import { adminRedirect } from "@/lib/admin-forms";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { shippingAreaOverrideSchema } from "@/lib/validation/admin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  const formData = await request.formData();
  const parsed = shippingAreaOverrideSchema.safeParse({
    area_name: formData.get("area_name"),
    fee: formData.get("fee"),
  });

  if (!parsed.success) {
    return adminRedirect(request, "/admin/settings/shipping", {
      error: parsed.error.issues[0]?.message ?? "Invalid area override.",
    });
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("shipping_area_overrides").insert({
    country_id: id,
    area_name: parsed.data.area_name,
    fee: parsed.data.fee,
  });

  if (error) {
    return adminRedirect(request, "/admin/settings/shipping", {
      error: error.message,
    });
  }

  return adminRedirect(request, "/admin/settings/shipping", {
    success: "Area override added.",
  });
}
