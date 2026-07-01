import { NextResponse } from "next/server";
import { getUsdToLkrRate } from "@/lib/currency-rates";

export const dynamic = "force-dynamic";

export async function GET() {
  const { rate, source, updatedAt } = await getUsdToLkrRate();

  return NextResponse.json(
    {
      base: "USD",
      rates: {
        USD: 1,
        LKR: rate,
      },
      source,
      updatedAt,
      disclaimer:
        "Converted amounts use live currency rates. Actual bank buying and selling rates may differ slightly.",
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=900",
      },
    },
  );
}
