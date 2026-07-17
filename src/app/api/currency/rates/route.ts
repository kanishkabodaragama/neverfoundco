import { NextResponse } from "next/server";
import { getUsdToLkrRate } from "@/lib/currency-rates";

export const dynamic = "force-dynamic";

export async function GET() {
  const { rate, source, updatedAt } = await getUsdToLkrRate();

  return NextResponse.json(
    {
      base: "LKR",
      rates: {
        LKR: 1,
        USD: 1 / rate,
      },
      source,
      updatedAt,
      disclaimer:
        "USD display amounts use live currency rates. Checkout and all calculations remain in LKR.",
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=900",
      },
    },
  );
}
