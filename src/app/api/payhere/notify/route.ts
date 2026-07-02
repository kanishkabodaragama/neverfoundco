import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  cancelExpiredPendingOrder,
  deductPaidOrderStock,
  isMissingPayHereQuoteColumnError,
} from "@/lib/db/orders";
import { verifyPayHereNotificationSignature } from "@/lib/payhere";

type PayHereNotifyOrder = {
  id: string;
  payment_status: string;
  order_status: string;
  payhere_amount_lkr?: number | null;
};

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

  await cancelExpiredPendingOrder(orderId);

  const supabase = getSupabaseAdminClient();
  const { order, error: orderError } = await getOrderForPayHereNotify(orderId);

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  if (!order || !amountsMatch(parsedPayHereAmount, order.payhere_amount_lkr)) {
    return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
  }

  if (order.payment_status === "cancelled" || order.order_status === "cancelled") {
    return NextResponse.json({ error: "Order payment window expired" }, { status: 409 });
  }

  const paymentStatus = mapPaymentStatus(statusCode);
  const orderStatus =
    paymentStatus === "paid"
      ? "processing"
      : paymentStatus === "pending"
        ? "pending"
        : "cancelled";
  const updatePayload: Record<string, string | number> = {
    payment_status: paymentStatus,
    order_status: orderStatus,
    payhere_payment_id: String(formData.get("payment_id") ?? ""),
    payhere_order_id: orderId,
    payhere_method: String(formData.get("method") ?? ""),
  };

  if (order.payhere_amount_lkr !== undefined) {
    updatePayload.payhere_amount_lkr =
      order.payhere_amount_lkr ?? parsedPayHereAmount;
  }

  let { error } = await supabase
    .from("orders")
    .update(updatePayload)
    .eq("id", order.id);

  if (error && isMissingPayHereQuoteColumnError(error)) {
    delete updatePayload.payhere_amount_lkr;
    const fallback = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", order.id);
    error = fallback.error;
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (paymentStatus === "paid") {
    try {
      await deductPaidOrderStock(order.id);
    } catch (stockError) {
      console.error("Paid order stock deduction failed", stockError);
      return NextResponse.json(
        { error: "Payment saved, but stock deduction failed" },
        { status: 500 },
      );
    }
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

function amountsMatch(
  parsedPayHereAmount: number,
  quotedAmount: number | null | undefined,
) {
  if (quotedAmount === null || quotedAmount === undefined) return true;

  return Math.abs(parsedPayHereAmount - Number(quotedAmount)) < 0.01;
}

async function getOrderForPayHereNotify(orderId: string) {
  const supabase = getSupabaseAdminClient();
  const withQuote = await supabase
    .from("orders")
    .select("id, payment_status, order_status, payhere_amount_lkr")
    .eq("order_number", orderId)
    .maybeSingle();

  if (!withQuote.error) {
    return {
      order: withQuote.data as PayHereNotifyOrder | null,
      error: null,
    };
  }

  if (!isMissingPayHereQuoteColumnError(withQuote.error)) {
    return { order: null, error: withQuote.error };
  }

  const withoutQuote = await supabase
    .from("orders")
    .select("id, payment_status, order_status")
    .eq("order_number", orderId)
    .maybeSingle();

  return {
    order: withoutQuote.data
      ? ({ ...withoutQuote.data, payhere_amount_lkr: undefined } as PayHereNotifyOrder)
      : null,
    error: withoutQuote.error,
  };
}
