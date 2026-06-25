import { NextResponse } from "next/server";
import { z } from "zod";
import { getCouponDiscount } from "@/lib/db/coupons";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { toMoney } from "@/lib/utils";
import { cartItemSchema } from "@/lib/validation/checkout";

const cartCouponSchema = z.object({
  couponCode: z.string().min(1),
  items: z.array(cartItemSchema).min(1),
});

export async function POST(request: Request) {
  try {
    const payload = cartCouponSchema.parse(await request.json());
    const productIds = payload.items.map((item) => item.productId);
    const supabase = getSupabaseAdminClient();
    const { data: products, error } = await supabase
      .from("products")
      .select("id, price, sale_price, is_active")
      .in("id", productIds);

    if (error) throw error;

    const productMap = new Map((products ?? []).map((product) => [product.id, product]));
    const subtotal = toMoney(
      payload.items.reduce((total, item) => {
        const product = productMap.get(item.productId);

        if (!product || !product.is_active) {
          throw new Error("One or more products are unavailable.");
        }

        return total + Number(product.sale_price ?? product.price) * item.quantity;
      }, 0),
    );
    const coupon = await getCouponDiscount(
      payload.couponCode,
      productIds,
      subtotal,
    );

    return NextResponse.json({
      couponCode: coupon.couponCode,
      discountAmount: coupon.discountAmount,
      subtotal,
      total: toMoney(Math.max(0, subtotal - coupon.discountAmount)),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to apply coupon.",
      },
      { status: 400 },
    );
  }
}
