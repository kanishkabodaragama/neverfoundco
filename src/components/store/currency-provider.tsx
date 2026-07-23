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
  { code: "LKR", country: "LK", flag: "🇱🇰", label: "LKR" },
  { code: "USD", country: "US", flag: "🇺🇸", label: "USD" },
];

type CurrencyContextValue = {
  currency: StoreCurrency;
  setCurrency: (currency: StoreCurrency) => void;
  format: (amountLkr: number) => string;
  formatAs: (amountLkr: number, currency: StoreCurrency) => string;
  selectedOption: (typeof currencyOptions)[number];
  rateSource: string;
  rateUpdatedAt: string | null;
  rateDisclaimer: string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);
const STORAGE_KEY = "neverfoundco-currency-usd-default-v2";
const DEFAULT_RATES: Record<StoreCurrency, number> = {
  LKR: 1,
  USD: 1 / 300,
};
const RATE_DISCLAIMER =
  "USD display amounts use live currency rates. Checkout and all calculations remain in LKR.";

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
            LKR: Number(data.rates?.LKR ?? 1),
            USD: Number(data.rates?.USD ?? DEFAULT_RATES.USD),
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
      currencyOptions.find((option) => option.code === currency) ??
      currencyOptions.find((option) => option.code === "USD")!;
    const formatAs = (amountLkr: number, targetCurrency: StoreCurrency) =>
      new Intl.NumberFormat(targetCurrency === "LKR" ? "en-LK" : "en-US", {
        style: "currency",
        currency: targetCurrency,
        currencyDisplay: "code",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amountLkr * (rates[targetCurrency] ?? 1));

    return {
      currency,
      setCurrency,
      selectedOption,
      rateSource,
      rateUpdatedAt,
      rateDisclaimer: RATE_DISCLAIMER,
      formatAs,
      format(amountLkr) {
        return formatAs(amountLkr, currency);
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
