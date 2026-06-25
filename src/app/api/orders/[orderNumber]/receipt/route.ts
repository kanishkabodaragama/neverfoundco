import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { listCustomerOrders } from "@/lib/db/orders";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  const { orderNumber } = await params;
  const cookieStore = await cookies();
  const email = cookieStore.get("nf_customer_email")?.value;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await listCustomerOrders(email);
  const order = orders.find((item) => item.order_number === orderNumber);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const lines = [
    "Never Found Co Receipt",
    `Order: ${order.order_number}`,
    `Date: ${new Date(order.created_at).toLocaleString("en-US")}`,
    `Payment: ${order.payment_status}`,
    `Status: ${order.order_status}`,
    "",
    ...order.order_items.map(
      (item) => `${item.quantity} x ${item.product_name} - USD ${Number(item.total_price).toFixed(2)}`,
    ),
    "",
    `Subtotal: USD ${Number(order.subtotal).toFixed(2)}`,
    `Discount: USD ${Number(order.discount_amount ?? 0).toFixed(2)}`,
    `Shipping: USD ${Number(order.shipping_fee).toFixed(2)}`,
    `Total: USD ${Number(order.total).toFixed(2)}`,
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Disposition": `attachment; filename="${order.order_number}-receipt.txt"`,
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
