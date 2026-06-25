import { NextResponse } from "next/server";

const FALLBACK_USD_TO_LKR = 300;

export const dynamic = "force-dynamic";

export async function GET() {
  const googleRate = await getGoogleFinanceRate("USD", "LKR");
  const fallbackRate = googleRate ? null : await getExchangeRateApiRate("USD", "LKR");
  const rate = googleRate ?? fallbackRate ?? FALLBACK_USD_TO_LKR;
  const source = googleRate
    ? "Google Finance"
    : fallbackRate
      ? "ExchangeRate API"
      : "Fallback rate";

  return NextResponse.json(
    {
      base: "USD",
      rates: {
        USD: 1,
        LKR: rate,
      },
      source,
      updatedAt: new Date().toISOString(),
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

async function getGoogleFinanceRate(from: string, to: string) {
  try {
    const response = await fetch(
      `https://www.google.com/finance/quote/${from}-${to}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; NeverFoundCo/1.0; +https://neverfoundco.local)",
        },
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) return null;

    const html = await response.text();
    const match =
      html.match(/data-last-price="([^"]+)"/) ??
      html.match(/<div class="YMlKec fxKbKc">([^<]+)<\/div>/);
    const parsed = match ? Number(match[1].replace(/,/g, "")) : Number.NaN;

    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  } catch {
    return null;
  }
}

async function getExchangeRateApiRate(from: string, to: string) {
  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${from}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      result?: string;
      rates?: Record<string, number>;
    };
    const parsed = Number(data.rates?.[to]);

    return data.result === "success" && Number.isFinite(parsed) && parsed > 0
      ? parsed
      : null;
  } catch {
    return null;
  }
}
