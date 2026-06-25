import crypto from "node:crypto";
import { getPayHereEnv, isPayHereSandbox } from "@/lib/env";
import type { PayHereCheckoutPayload } from "@/types/commerce";

const CURRENCY = "LKR";

function md5(value: string) {
  return crypto.createHash("md5").update(value).digest("hex").toUpperCase();
}

export function formatPayHereAmount(amount: number) {
  return amount.toFixed(2);
}

export function createPayHereCheckoutHash(orderId: string, amount: number) {
  const env = getPayHereEnv();
  const merchantSecretHash = md5(env.PAYHERE_MERCHANT_SECRET);

  return md5(
    `${env.PAYHERE_MERCHANT_ID}${orderId}${formatPayHereAmount(
      amount,
    )}${CURRENCY}${merchantSecretHash}`,
  );
}

export function verifyPayHereNotificationSignature(params: {
  merchantId: string;
  orderId: string;
  payhereAmount: string;
  payhereCurrency: string;
  statusCode: string;
  md5sig: string;
}) {
  const env = getPayHereEnv();
  const merchantSecretHash = md5(env.PAYHERE_MERCHANT_SECRET);
  const expected = md5(
    `${params.merchantId}${params.orderId}${params.payhereAmount}${params.payhereCurrency}${params.statusCode}${merchantSecretHash}`,
  );

  return (
    params.merchantId === env.PAYHERE_MERCHANT_ID &&
    params.payhereCurrency === CURRENCY &&
    expected === params.md5sig.toUpperCase()
  );
}

export function createPayHerePayload(input: {
  orderNumber: string;
  amount: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  items: string;
}): PayHereCheckoutPayload {
  const env = getPayHereEnv();
  const actionUrl = isPayHereSandbox()
    ? "https://sandbox.payhere.lk/pay/checkout"
    : "https://www.payhere.lk/pay/checkout";

  return {
    sandbox: isPayHereSandbox(),
    actionUrl,
    fields: {
      merchant_id: env.PAYHERE_MERCHANT_ID,
      return_url: `${env.NEXT_PUBLIC_APP_URL}/checkout?order=${input.orderNumber}`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/checkout?order=${input.orderNumber}`,
      notify_url: `${env.NEXT_PUBLIC_APP_URL}/api/payhere/notify`,
      order_id: input.orderNumber,
      items: input.items,
      currency: CURRENCY,
      amount: formatPayHereAmount(input.amount),
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      phone: input.phone,
      address: input.address,
      city: input.city,
      country: "Sri Lanka",
      hash: createPayHereCheckoutHash(input.orderNumber, input.amount),
    },
  };
}
