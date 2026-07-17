import { getFallbackUsdToLkrRate } from "@/lib/db/site-settings";

export type UsdToLkrRate = {
  rate: number;
  source: string;
  updatedAt: string;
};

export async function getUsdToLkrRate(): Promise<UsdToLkrRate> {
  const googleRate = await getGoogleFinanceRate("USD", "LKR");

  if (googleRate) return createRateResult(googleRate, "Google Finance");

  const exchangeRateApiRate = await getExchangeRateApiRate("USD", "LKR");

  if (exchangeRateApiRate) {
    return createRateResult(exchangeRateApiRate, "ExchangeRate API");
  }

  const adminFallbackRate = await getFallbackUsdToLkrRate();
  return createRateResult(adminFallbackRate, "Admin fallback rate");
}

function createRateResult(rate: number, source: string): UsdToLkrRate {
  return {
    rate,
    source,
    updatedAt: new Date().toISOString(),
  };
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
