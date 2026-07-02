"use client";

import {
  currencyOptions,
  type StoreCurrency,
  useStoreCurrency,
} from "@/components/store/currency-provider";

export function CurrencySelector({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { currency, setCurrency } = useStoreCurrency();
  const isDark = tone === "dark";

  return (
    <label className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.2em]">
      <span className="sr-only">Currency</span>
      <select
        aria-label="Currency"
        className={`max-w-[96px] border bg-transparent px-2 py-2 text-[11px] uppercase outline-none transition hover:border-rust focus:border-rust ${
          isDark
            ? "border-bone/35 text-bone"
            : "border-ink/30 text-ink"
        }`}
        onChange={(event) => setCurrency(event.target.value as StoreCurrency)}
        value={currency}
      >
        {currencyOptions.map((option) => (
          <option
            className={isDark ? "bg-ink text-bone" : "bg-acid text-ink"}
            key={option.code}
            value={option.code}
          >
            {option.flag} {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
