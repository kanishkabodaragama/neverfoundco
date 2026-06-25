import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { toMoney } from "@/lib/utils";

export async function getCouponDiscount(
  rawCode: string | undefined,
  productIds: string[],
  subtotal: number,
) {
  const couponCode = rawCode?.trim().toUpperCase();
  if (!couponCode) return { couponCode: null, discountAmount: 0 };

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("coupons")
    .select("*, coupon_products(product_id)")
    .eq("code", couponCode)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    throw new Error("Coupon code is not valid.");
  }

  const coupon = data as {
    code: string;
    discount_type: "flat" | "percentage";
    discount_value: number;
    usage_limit: number | null;
    used_count: number;
    starts_at: string | null;
    ends_at: string | null;
    coupon_products?: { product_id: string }[];
  };
  const now = new Date();

  if (coupon.starts_at && new Date(coupon.starts_at) > now) {
    throw new Error("Coupon code is not active yet.");
  }

  if (coupon.ends_at && new Date(coupon.ends_at) < now) {
    throw new Error("Coupon code has expired.");
  }

  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    throw new Error("Coupon code has reached its usage limit.");
  }

  const restrictedProductIds =
    coupon.coupon_products?.map((item) => item.product_id) ?? [];

  if (
    restrictedProductIds.length > 0 &&
    !productIds.some((productId) => restrictedProductIds.includes(productId))
  ) {
    throw new Error("Coupon code does not apply to these products.");
  }

  const discountAmount =
    coupon.discount_type === "percentage"
      ? subtotal * (Number(coupon.discount_value) / 100)
      : Number(coupon.discount_value);

  return {
    couponCode,
    discountAmount: toMoney(Math.min(subtotal, discountAmount)),
  };
}
