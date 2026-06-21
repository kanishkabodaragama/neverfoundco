import type { CheckoutInput } from "@/lib/validation/checkout";
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

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price, sale_price, stock_quantity, is_active")
    .in("id", productIds);

  if (productsError) throw productsError;

  const productMap = new Map((products ?? []).map((product) => [product.id, product]));
  const lineItems = input.items.map((item) => {
    const product = productMap.get(item.productId);

    if (!product || !product.is_active) {
      throw new Error("One or more products are unavailable.");
    }

    if (product.stock_quantity < item.quantity) {
      throw new Error(`${product.name} does not have enough stock.`);
    }

    const unitPrice = Number(product.sale_price ?? product.price);
    return {
      product_id: product.id,
      product_name: product.name,
      quantity: item.quantity,
      unit_price: toMoney(unitPrice),
      total_price: toMoney(unitPrice * item.quantity),
    };
  });

  const subtotal = toMoney(
    lineItems.reduce((total, item) => total + item.total_price, 0),
  );
  const shippingFee = toMoney(
    await getShippingFeeForAddress(input.countryCode, input.district),
  );
  const total = toMoney(subtotal + shippingFee);
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
      city: input.city,
      district: input.district,
      discount_amount: 0,
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

  return {
    order,
    items: lineItems,
  };
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
