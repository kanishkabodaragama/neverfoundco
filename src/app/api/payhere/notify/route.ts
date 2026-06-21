import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifyPayHereNotificationSignature } from "@/lib/payhere";

function mapPaymentStatus(statusCode: string) {
  if (statusCode === "2") return "paid";
  if (statusCode === "0") return "pending";
  if (statusCode === "-2") return "cancelled";
  return "failed";
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const merchantId = String(formData.get("merchant_id") ?? "");
  const orderId = String(formData.get("order_id") ?? "");
  const payhereAmount = String(formData.get("payhere_amount") ?? "");
  const payhereCurrency = String(formData.get("payhere_currency") ?? "");
  const statusCode = String(formData.get("status_code") ?? "");
  const md5sig = String(formData.get("md5sig") ?? "");

  const isValid = verifyPayHereNotificationSignature({
    merchantId,
    orderId,
    payhereAmount,
    payhereCurrency,
    statusCode,
    md5sig,
  });

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const paymentStatus = mapPaymentStatus(statusCode);
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: paymentStatus,
      order_status: paymentStatus === "paid" ? "processing" : "pending",
      payhere_payment_id: String(formData.get("payment_id") ?? ""),
      payhere_order_id: orderId,
      payhere_method: String(formData.get("method") ?? ""),
    })
    .eq("order_number", orderId)
    .eq("total", Number(payhereAmount));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

