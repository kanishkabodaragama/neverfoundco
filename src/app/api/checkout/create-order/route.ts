import { NextResponse } from "next/server";
import {
  createPendingOrder,
  getOrderPaymentExpiresAt,
  updateOrderPayHereQuote,
} from "@/lib/db/orders";
import { getCheckoutPaymentTimeoutMinutes } from "@/lib/db/site-settings";
import { resolvePublicAppOrigin } from "@/lib/app-origin";
import { sendOrderPlacedEmails } from "@/lib/email/order-emails";
import { createPayHerePayload } from "@/lib/payhere";
import { checkoutSchema } from "@/lib/validation/checkout";

export async function POST(request: Request) {
  try {
    const payload = checkoutSchema.parse(await request.json());
    const { order, items } = await createPendingOrder(payload);
    const paymentTimeoutMinutes = await getCheckoutPaymentTimeoutMinutes();
    const publicOrigin = resolvePublicAppOrigin(request);
    const [firstName, ...rest] = order.customer_name.trim().split(" ");
    const { payhere, quote } = await createPayHerePayload({
      orderNumber: order.order_number,
      amountUsd: Number(order.total),
      publicOrigin,
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
    await sendOrderPlacedEmails(order.id, request);

    return NextResponse.json({
      orderNumber: order.order_number,
      expiresAt: getOrderPaymentExpiresAt(order.created_at, paymentTimeoutMinutes),
      paymentTimeoutMinutes,
      payhere,
    });
  } catch (error) {
    console.error("Checkout order creation failed", error);

    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 },
    );
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return "Checkout failed.";
}
