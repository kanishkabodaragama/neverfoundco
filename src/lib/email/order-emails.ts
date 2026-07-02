import { normalizeOrigin, resolvePublicAppOrigin } from "@/lib/app-origin";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAdminOrderEmail, sendEmail } from "@/lib/email/mailer";
import {
  type OrderEmailLineItem,
  type OrderEmailViewModel,
  renderOrderEmail,
} from "@/lib/email/order-template";

type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  district: string;
  postal_code: string | null;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total: number;
  payment_status: string;
  order_status: string;
};

type OrderItemRow = {
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type ProductRow = {
  id: string;
  main_image_url: string | null;
};

type OrderEmailEvent = "placed" | "status" | "cancelled";

function getEmailOrigin(request?: Request) {
  try {
    return resolvePublicAppOrigin(request);
  } catch {
    return (
      normalizeOrigin(process.env.PAYHERE_APP_URL) ??
      normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL) ??
      "https://neverfoundco.com"
    );
  }
}

function toAbsoluteUrl(value: string | null, origin: string) {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return `${origin}${value}`;
  return `${origin}/${value}`;
}

function getStatusIntro(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "processing") {
    return "Your order is now being prepared. We will keep you posted as it moves through fulfilment.";
  }

  if (normalized === "shipped") {
    return "Your order has shipped. Reply to this email if you need help with delivery details.";
  }

  if (normalized === "completed") {
    return "Your order has been completed. Thank you for shopping with Never Found.";
  }

  if (normalized === "cancelled") {
    return "Your order has been cancelled. If payment was collected, refund handling follows the refund policy linked below.";
  }

  return "Your order status has been updated. The latest order details are below.";
}

export async function getOrderEmailSnapshot(
  orderId: string,
  origin = getEmailOrigin(),
): Promise<OrderEmailViewModel | null> {
  const supabase = getSupabaseAdminClient();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (orderError) throw orderError;
  if (!order) return null;

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("product_id, product_name, quantity, unit_price, total_price")
    .eq("order_id", orderId);

  if (itemsError) throw itemsError;

  const productIds = [
    ...new Set(
      (items ?? [])
        .map((item) => item.product_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];
  const { data: products, error: productsError } = productIds.length
    ? await supabase
        .from("products")
        .select("id, main_image_url")
        .in("id", productIds)
    : { data: [], error: null };

  if (productsError) throw productsError;

  const productMap = new Map(
    ((products ?? []) as ProductRow[]).map((product) => [product.id, product]),
  );
  const orderRow = order as OrderRow;
  const lineItems: OrderEmailLineItem[] = ((items ?? []) as OrderItemRow[]).map(
    (item) => ({
      productName: item.product_name,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unit_price),
      totalPrice: Number(item.total_price),
      imageUrl: toAbsoluteUrl(
        item.product_id
          ? (productMap.get(item.product_id)?.main_image_url ?? null)
          : null,
        origin,
      ),
    }),
  );

  return {
    orderNumber: orderRow.order_number,
    customerName: orderRow.customer_name,
    customerEmail: orderRow.customer_email,
    customerPhone: orderRow.customer_phone,
    address: [
      orderRow.address_line_1,
      orderRow.address_line_2,
      orderRow.city,
      orderRow.district,
      orderRow.postal_code,
    ]
      .filter(Boolean)
      .join(", "),
    subtotal: Number(orderRow.subtotal),
    shippingFee: Number(orderRow.shipping_fee),
    discountAmount: Number(orderRow.discount_amount ?? 0),
    total: Number(orderRow.total),
    paymentStatus: orderRow.payment_status,
    orderStatus: orderRow.order_status,
    items: lineItems,
    origin,
  };
}

export async function sendOrderPlacedEmails(orderId: string, request?: Request) {
  await sendOrderLifecycleEmails(orderId, "placed", request);
}

export async function sendOrderStatusUpdatedEmails(
  orderId: string,
  status: string,
  request?: Request,
) {
  await sendOrderLifecycleEmails(orderId, status === "cancelled" ? "cancelled" : "status", request);
}

export async function sendOrderCancelledEmails(orderId: string, request?: Request) {
  await sendOrderLifecycleEmails(orderId, "cancelled", request);
}

async function sendOrderLifecycleEmails(
  orderId: string,
  event: OrderEmailEvent,
  request?: Request,
) {
  try {
    const origin = getEmailOrigin(request);
    const order = await getOrderEmailSnapshot(orderId, origin);

    if (!order) return;

    const template =
      event === "placed"
        ? {
            title: "Order received",
            eyebrow: "Never Found checkout",
            intro:
              "We have received your order. Keep this email for your order number, product list, and policy links.",
            subject: `Order received ${order.orderNumber}`,
          }
        : event === "cancelled"
          ? {
              title: "Order cancelled",
              eyebrow: "Never Found order update",
              intro: getStatusIntro("cancelled"),
              subject: `Order cancelled ${order.orderNumber}`,
            }
          : {
              title: "Order updated",
              eyebrow: "Never Found order update",
              intro: getStatusIntro(order.orderStatus),
              subject: `Order update ${order.orderNumber}: ${order.orderStatus}`,
            };

    const userEmail = renderOrderEmail({
      title: template.title,
      eyebrow: template.eyebrow,
      intro: template.intro,
      order,
    });
    const adminEmail = renderOrderEmail({
      title:
        event === "placed"
          ? "New order"
          : event === "cancelled"
            ? "Order cancelled"
            : "Order updated",
      eyebrow: "Never Found admin notice",
      intro: `${order.customerName} / ${order.customerEmail}`,
      note: `Current status: ${order.orderStatus}. Payment: ${order.paymentStatus}.`,
      order,
    });

    await Promise.all([
      sendEmail({
        to: order.customerEmail,
        subject: template.subject,
        ...userEmail,
      }),
      sendEmail({
        to: getAdminOrderEmail(),
        subject:
          event === "placed"
            ? `New order ${order.orderNumber}`
            : `${template.subject} / ${order.customerName}`,
        ...adminEmail,
      }),
    ]);
  } catch (error) {
    console.error("Order email failed", error);
  }
}
