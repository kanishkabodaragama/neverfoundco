import { adminRedirect } from "@/lib/admin-forms";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { couponSchema } from "@/lib/validation/admin";

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
    const { error } = await supabase.from("coupons").delete().eq("id", id);

    if (error) {
      return adminRedirect(request, "/admin/coupons", { error: error.message });
    }

    return adminRedirect(request, "/admin/coupons", { success: "Coupon deleted." });
  }

  if (method === "TOGGLE_ACTIVE") {
    const { error } = await supabase
      .from("coupons")
      .update({ is_active: formData.get("is_active") === "true" })
      .eq("id", id);

    if (error) {
      return adminRedirect(request, "/admin/coupons", { error: error.message });
    }

    return adminRedirect(request, "/admin/coupons", {
      success: formData.get("is_active") === "true" ? "Coupon activated." : "Coupon paused.",
    });
  }

  const productIds = formData.getAll("product_ids").map(String).filter(Boolean);
  const parsed = couponSchema.safeParse({
    code: formData.get("code"),
    description: formData.get("description") || undefined,
    discount_type: formData.get("discount_type"),
    discount_value: formData.get("discount_value"),
    usage_limit: formData.get("usage_limit") || null,
    starts_at: formData.get("starts_at") || null,
    ends_at: formData.get("ends_at") || null,
    is_active: formData.get("is_active") === "true",
    product_ids: productIds,
  });

  if (!parsed.success) {
    return adminRedirect(request, `/admin/coupons/${id}/edit`, {
      error: parsed.error.issues[0]?.message ?? "Invalid coupon details.",
    });
  }

  const { error: updateError } = await supabase
    .from("coupons")
    .update({
      code: parsed.data.code,
      description: parsed.data.description,
      discount_type: parsed.data.discount_type,
      discount_value: parsed.data.discount_value,
      usage_limit: parsed.data.usage_limit,
      starts_at: parsed.data.starts_at || null,
      ends_at: parsed.data.ends_at || null,
      is_active: parsed.data.is_active,
    })
    .eq("id", id);

  if (updateError) {
    return adminRedirect(request, `/admin/coupons/${id}/edit`, {
      error: updateError.message,
    });
  }

  await supabase.from("coupon_products").delete().eq("coupon_id", id);

  if (parsed.data.product_ids?.length) {
    const { error: productError } = await supabase.from("coupon_products").insert(
      parsed.data.product_ids.map((productId) => ({
        coupon_id: id,
        product_id: productId,
      })),
    );

    if (productError) {
      return adminRedirect(request, `/admin/coupons/${id}/edit`, {
        error: productError.message,
      });
    }
  }

  return adminRedirect(request, `/admin/coupons/${id}/edit`, {
    success: "Coupon saved.",
  });
}
