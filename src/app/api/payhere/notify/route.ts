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
  const merchantId = getPayHereValue(formData, "merchant_id");
  const orderId = getPayHereValue(formData, "order_id");
  const payhereAmount = getPayHereValue(formData, "payhere_amount");
  const payhereCurrency = getPayHereValue(formData, "payhere_currency");
  const statusCode = getPayHereValue(formData, "status_code");
  const md5sig = getPayHereValue(formData, "md5sig");
  const parsedPayHereAmount = parsePayHereAmount(payhereAmount);

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

  if (parsedPayHereAmount === null) {
    return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, payhere_amount_lkr")
    .eq("order_number", orderId)
    .maybeSingle();

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  if (!order || !amountsMatch(parsedPayHereAmount, order.payhere_amount_lkr)) {
    return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
  }

  const paymentStatus = mapPaymentStatus(statusCode);
  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: paymentStatus,
      order_status: paymentStatus === "paid" ? "processing" : "pending",
      payhere_payment_id: String(formData.get("payment_id") ?? ""),
      payhere_order_id: orderId,
      payhere_method: String(formData.get("method") ?? ""),
      payhere_amount_lkr: order.payhere_amount_lkr ?? parsedPayHereAmount,
    })
    .eq("id", order.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

function getPayHereValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function parsePayHereAmount(payhereAmount: string) {
  const normalized = payhereAmount.replace(/,/g, "");
  const parsedPayHereAmount = Number(normalized);

  if (!Number.isFinite(parsedPayHereAmount)) return null;

  return parsedPayHereAmount;
}

function amountsMatch(parsedPayHereAmount: number, quotedAmount: number | null) {
  if (quotedAmount === null) return true;

  return Math.abs(parsedPayHereAmount - Number(quotedAmount)) < 0.01;
}
