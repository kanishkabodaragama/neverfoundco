import { NextResponse } from "next/server";
import { createPendingOrder, updateOrderPayHereQuote } from "@/lib/db/orders";
import { createPayHerePayload } from "@/lib/payhere";
import { checkoutSchema } from "@/lib/validation/checkout";

export async function POST(request: Request) {
  try {
    const payload = checkoutSchema.parse(await request.json());
    const { order, items } = await createPendingOrder(payload);
    const [firstName, ...rest] = order.customer_name.trim().split(" ");
    const { payhere, quote } = await createPayHerePayload({
      orderNumber: order.order_number,
      amountUsd: Number(order.total),
      firstName,
      lastName: rest.join(" ") || firstName,
      email: order.customer_email,
      phone: order.customer_phone,
      address: [order.address_line_1, order.address_line_2]
        .filter(Boolean)
        .join(", "),
      city: order.city,
      items: items.map((item) => item.product_name).join(", "),
    });
    await updateOrderPayHereQuote(order.id, quote);

    return NextResponse.json({
      orderNumber: order.order_number,
      payhere,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed." },
      { status: 400 },
    );
  }
}
