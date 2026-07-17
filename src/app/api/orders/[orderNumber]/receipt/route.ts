import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { formatColomboDateTime } from "@/lib/date-time";
import { listCustomerOrders } from "@/lib/db/orders";
import { formatCurrency } from "@/lib/utils";

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
    `Date: ${formatColomboDateTime(order.created_at)}`,
    `Payment: ${order.payment_status}`,
    `Status: ${order.order_status}`,
    "",
    ...order.order_items.map(
      (item) => `${item.quantity} x ${item.product_name} - ${formatCurrency(Number(item.total_price))}`,
    ),
    "",
    `Subtotal: ${formatCurrency(Number(order.subtotal))}`,
    `Discount: ${formatCurrency(Number(order.discount_amount ?? 0))}`,
    `Shipping: ${formatCurrency(Number(order.shipping_fee))}`,
    `Total: ${formatCurrency(Number(order.total))}`,
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Disposition": `attachment; filename="${order.order_number}-receipt.txt"`,
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
