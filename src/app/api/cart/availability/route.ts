import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const availabilitySchema = z.object({
  items: z.array(
    z.object({
      itemKey: z.string().min(1),
      productId: z.uuid(),
      variantId: z.uuid().optional(),
      quantity: z.number().int().min(1).max(99),
    }),
  ),
});

export async function POST(request: Request) {
  try {
    const { items } = availabilitySchema.parse(await request.json());

    if (items.length === 0) {
      return NextResponse.json({ unavailableItemKeys: [] });
    }

    const supabase = getSupabaseAdminClient();
    const productIds = [...new Set(items.map((item) => item.productId))];
    const variantIds = [
      ...new Set(
        items
          .map((item) => item.variantId)
          .filter((id): id is string => Boolean(id)),
      ),
    ];
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select(
        "id, is_active, stock_quantity, stock_tracking_enabled, preorder_enabled",
      )
      .in("id", productIds);

    if (productsError) throw productsError;

    const { data: variants, error: variantsError } = variantIds.length
      ? await supabase
          .from("product_variants")
          .select("id, product_id, stock_quantity")
          .in("id", variantIds)
      : { data: [], error: null };

    if (variantsError) throw variantsError;

    const productMap = new Map(
      (products ?? []).map((product) => [product.id, product]),
    );
    const variantMap = new Map(
      (variants ?? []).map((variant) => [variant.id, variant]),
    );
    const unavailableItemKeys = items.flatMap((item) => {
      const product = productMap.get(item.productId);
      const variant = item.variantId ? variantMap.get(item.variantId) : null;

      if (
        !product ||
        !product.is_active ||
        (item.variantId && (!variant || variant.product_id !== product.id))
      ) {
        return [item.itemKey];
      }

      if (!product.stock_tracking_enabled || product.preorder_enabled) {
        return [];
      }

      const availableStock = variant?.stock_quantity ?? product.stock_quantity;
      return availableStock < item.quantity ? [item.itemKey] : [];
    });

    return NextResponse.json({ unavailableItemKeys });
  } catch (error) {
    console.error("Cart availability check failed", error);
    return NextResponse.json(
      { error: "Could not check item availability." },
      { status: 400 },
    );
  }
}
