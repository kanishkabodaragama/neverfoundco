import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { couponSchema } from "@/lib/validation/admin";

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const formData = await request.formData();
  const productIds = formData.getAll("product_ids").map(String).filter(Boolean);
  const parsed = couponSchema.parse({
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

  const supabase = getSupabaseAdminClient();
  const { data: coupon, error } = await supabase
    .from("coupons")
    .insert({
      code: parsed.code,
      description: parsed.description,
      discount_type: parsed.discount_type,
      discount_value: parsed.discount_value,
      usage_limit: parsed.usage_limit,
      starts_at: parsed.starts_at || null,
      ends_at: parsed.ends_at || null,
      is_active: parsed.is_active,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (parsed.product_ids?.length) {
    const { error: productError } = await supabase.from("coupon_products").insert(
      parsed.product_ids.map((productId) => ({
        coupon_id: coupon.id,
        product_id: productId,
      })),
    );

    if (productError) {
      return NextResponse.json({ error: productError.message }, { status: 400 });
    }
  }

  return NextResponse.redirect(new URL("/admin/coupons", request.url), 303);
}
