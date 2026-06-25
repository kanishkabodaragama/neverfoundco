import { NextResponse } from "next/server";
import { getLatestOrderForCustomer } from "@/lib/db/orders";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const orderNumber = String(formData.get("order_number") ?? "").trim();

  if (!email || !orderNumber) {
    return NextResponse.redirect(new URL("/account/login?error=Enter your email and latest order number.", request.url), 303);
  }

  const latestOrder = await getLatestOrderForCustomer(email);

  if (!latestOrder || latestOrder.order_number.toUpperCase() !== orderNumber.toUpperCase()) {
    return NextResponse.redirect(new URL("/account/login?error=Login details do not match your latest order.", request.url), 303);
  }

  const response = NextResponse.redirect(new URL("/account", request.url), 303);
  response.cookies.set("nf_customer_email", email, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  response.cookies.set("nf_customer_order", latestOrder.order_number, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}
