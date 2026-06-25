import type { CheckoutInput } from "@/lib/validation/checkout";
import { getCouponDiscount } from "@/lib/db/coupons";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getShippingFeeForAddress } from "@/lib/db/shipping";
import { toMoney } from "@/lib/utils";
import { randomUUID } from "node:crypto";

function createOrderNumber() {
  const date = new Date();
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = randomUUID().slice(0, 8).toUpperCase();
  return `NF-${ymd}-${suffix}`;
}

export async function createPendingOrder(input: CheckoutInput) {
  const supabase = getSupabaseAdminClient();
  const productIds = input.items.map((item) => item.productId);
  const variantIds = input.items
    .map((item) => item.variantId)
    .filter((id): id is string => Boolean(id));

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price, sale_price, unit_cost, stock_quantity, is_active")
    .in("id", productIds);

  if (productsError) throw productsError;

  const { data: variants, error: variantsError } = variantIds.length
    ? await supabase
        .from("product_variants")
        .select("id, product_id, price, sale_price, unit_cost, stock_quantity, gender, color, size")
        .in("id", variantIds)
    : { data: [], error: null };

  if (variantsError) throw variantsError;

  const productMap = new Map((products ?? []).map((product) => [product.id, product]));
  const variantMap = new Map((variants ?? []).map((variant) => [variant.id, variant]));
  const lineItems = input.items.map((item) => {
    const product = productMap.get(item.productId);
    const variant = item.variantId ? variantMap.get(item.variantId) : null;

    if (!product || !product.is_active) {
      throw new Error("One or more products are unavailable.");
    }

    if (item.variantId && (!variant || variant.product_id !== product.id)) {
      throw new Error(`${product.name} variant is unavailable.`);
    }

    const availableStock = variant?.stock_quantity ?? product.stock_quantity;
    if (availableStock < item.quantity) {
      throw new Error(`${product.name} does not have enough stock.`);
    }

    const unitPrice = Number(variant?.sale_price ?? variant?.price ?? product.sale_price ?? product.price);
    const unitCost = Number(variant?.unit_cost ?? product.unit_cost ?? 0);
    const variantLabel = variant
      ? ` (${[variant.gender, variant.color, variant.size].filter(Boolean).join(" / ")})`
      : "";

    return {
      product_id: product.id,
      product_name: `${product.name}${variantLabel}`,
      quantity: item.quantity,
      unit_price: toMoney(unitPrice),
      unit_cost: toMoney(unitCost),
      total_price: toMoney(unitPrice * item.quantity),
      profit: toMoney(Math.max(0, (unitPrice - unitCost) * item.quantity)),
    };
  });

  const subtotal = toMoney(
    lineItems.reduce((total, item) => total + item.total_price, 0),
  );
  const { couponCode, discountAmount } = await getCouponDiscount(
    input.couponCode,
    productIds,
    subtotal,
  );
  const shippingFee = toMoney(
    await getShippingFeeForAddress(input.countryCode, input.district),
  );
  const total = toMoney(Math.max(0, subtotal - discountAmount) + shippingFee);
  const orderNumber = createOrderNumber();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      customer_phone: input.customerPhone,
      address_line_1: input.addressLine1,
      address_line_2: input.addressLine2,
      country_code: input.countryCode,
      coupon_code: couponCode,
      city: input.city,
      district: input.district,
      discount_amount: discountAmount,
      postal_code: input.postalCode,
      subtotal,
      shipping_fee: shippingFee,
      total,
      payment_status: "pending",
      order_status: "pending",
      payhere_order_id: orderNumber,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const { error: itemsError } = await supabase.from("order_items").insert(
    lineItems.map((item) => ({
      ...item,
      order_id: order.id,
    })),
  );

  if (itemsError) throw itemsError;

  if (couponCode) {
    await incrementCouponUsage(couponCode);
  }

  return {
    order,
    items: lineItems,
  };
}

async function incrementCouponUsage(couponCode: string) {
  const supabase = getSupabaseAdminClient();
  const { data: coupon } = await supabase
    .from("coupons")
    .select("id, used_count")
    .eq("code", couponCode)
    .single();

  if (!coupon) return;

  await supabase
    .from("coupons")
    .update({ used_count: Number(coupon.used_count ?? 0) + 1 })
    .eq("id", coupon.id);
}

export async function getPublicOrderStatus(orderNumber: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("order_number, total, payment_status, order_status, created_at")
    .eq("order_number", orderNumber)
    .single();

  if (error) return null;
  return data;
}

export async function getLatestOrderForCustomer(email: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("order_number, customer_email, created_at")
    .ilike("customer_email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return null;
  return data as { order_number: string; customer_email: string; created_at: string } | null;
}

export async function listCustomerOrders(email: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .ilike("customer_email", email)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Array<{
    id: string;
    order_number: string;
    customer_email: string;
    total: number;
    subtotal: number;
    shipping_fee: number;
    discount_amount: number;
    payment_status: string;
    order_status: string;
    created_at: string;
    order_items: Array<{
      id: string;
      product_name: string;
      quantity: number;
      unit_price: number;
      total_price: number;
    }>;
  }>;
}
