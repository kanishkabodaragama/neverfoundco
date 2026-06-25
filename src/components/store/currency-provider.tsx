"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type StoreCurrency = "USD" | "LKR";

export const currencyOptions: Array<{
  code: StoreCurrency;
  country: string;
  flag: string;
  label: string;
}> = [
  { code: "USD", country: "US", flag: "🇺🇸", label: "USD" },
  { code: "LKR", country: "LK", flag: "🇱🇰", label: "LKR" },
];

type CurrencyContextValue = {
  currency: StoreCurrency;
  setCurrency: (currency: StoreCurrency) => void;
  format: (amountUsd: number) => string;
  selectedOption: (typeof currencyOptions)[number];
  rateSource: string;
  rateUpdatedAt: string | null;
  rateDisclaimer: string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);
const STORAGE_KEY = "neverfoundco-currency";
const DEFAULT_RATES: Record<StoreCurrency, number> = {
  USD: 1,
  LKR: 300,
};
const RATE_DISCLAIMER =
  "Converted amounts use Google currency rates. Actual bank buying and selling rates may differ slightly.";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<StoreCurrency>("USD");
  const [rates, setRates] = useState<Record<StoreCurrency, number>>(DEFAULT_RATES);
  const [rateSource, setRateSource] = useState("Google Finance");
  const [rateUpdatedAt, setRateUpdatedAt] = useState<string | null>(null);
  const [hasLoadedStoredCurrency, setHasLoadedStoredCurrency] = useState(false);

  useEffect(() => {
    window.setTimeout(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isStoreCurrency(stored)) setCurrency(stored);
      setHasLoadedStoredCurrency(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredCurrency) return;
    window.localStorage.setItem(STORAGE_KEY, currency);
  }, [currency, hasLoadedStoredCurrency]);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/currency/rates", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: CurrencyRateResponse) => {
        window.setTimeout(() => {
          if (!isMounted) return;
          setRates({
            USD: Number(data.rates?.USD ?? 1),
            LKR: Number(data.rates?.LKR ?? DEFAULT_RATES.LKR),
          });
          setRateSource(data.source ?? "Google Finance");
          setRateUpdatedAt(data.updatedAt ?? null);
        }, 0);
      })
      .catch(() => {
        window.setTimeout(() => {
          if (!isMounted) return;
          setRates(DEFAULT_RATES);
          setRateSource("Fallback rate");
          setRateUpdatedAt(null);
        }, 0);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<CurrencyContextValue>(() => {
    const selectedOption =
      currencyOptions.find((option) => option.code === currency) ?? currencyOptions[0];
    const rate = rates[currency] ?? 1;

    return {
      currency,
      setCurrency,
      selectedOption,
      rateSource,
      rateUpdatedAt,
      rateDisclaimer: RATE_DISCLAIMER,
      format(amountUsd) {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          minimumFractionDigits: currency === "LKR" ? 0 : 2,
          maximumFractionDigits: currency === "LKR" ? 0 : 2,
        }).format(amountUsd * rate);
      },
    };
  }, [currency, rateSource, rateUpdatedAt, rates]);

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useStoreCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useStoreCurrency must be used inside CurrencyProvider");
  }
  return context;
}

function isStoreCurrency(value: string | null): value is StoreCurrency {
  return value === "USD" || value === "LKR";
}

type CurrencyRateResponse = {
  rates?: Partial<Record<StoreCurrency, number>>;
  source?: string;
  updatedAt?: string | null;
};
