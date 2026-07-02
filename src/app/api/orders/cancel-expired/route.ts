import { NextResponse } from "next/server";
import { cancelExpiredPendingOrders } from "@/lib/db/orders";

export async function GET(request: Request) {
  const unauthorized = authorizeCronRequest(request);
  if (unauthorized) return unauthorized;

  await cancelExpiredPendingOrders();
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  return GET(request);
}

function authorizeCronRequest(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) return null;

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (token === secret) return null;

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
