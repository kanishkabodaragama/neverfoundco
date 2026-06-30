"use client";

import {
  currencyOptions,
  type StoreCurrency,
  useStoreCurrency,
} from "@/components/store/currency-provider";

export function CurrencySelector() {
  const { currency, setCurrency } = useStoreCurrency();

  return (
    <label className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.2em]">
      <span className="sr-only">Currency</span>
      <select
        aria-label="Currency"
        className="max-w-[96px] border border-ink/30 bg-transparent px-2 py-2 text-[11px] uppercase text-ink outline-none transition hover:border-rust focus:border-rust"
        onChange={(event) => setCurrency(event.target.value as StoreCurrency)}
        value={currency}
      >
        {currencyOptions.map((option) => (
          <option className="bg-acid text-ink" key={option.code} value={option.code}>
            {option.flag} {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
