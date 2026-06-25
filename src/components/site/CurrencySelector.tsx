"use client";

import {
  currencyOptions,
  type StoreCurrency,
  useStoreCurrency,
} from "@/components/store/currency-provider";

export function CurrencySelector() {
  const { currency, setCurrency } = useStoreCurrency();

  return (
    <label className="font-pixel flex items-center gap-2 text-sm uppercase">
      <span className="sr-only">Currency</span>
      <select
        aria-label="Currency"
        className="max-w-[92px] border border-[#FFF9EF]/30 bg-transparent px-2 py-2 text-xs uppercase text-[#FFF9EF] outline-none transition hover:border-[#F05267] focus:border-[#F05267]"
        onChange={(event) => setCurrency(event.target.value as StoreCurrency)}
        value={currency}
      >
        {currencyOptions.map((option) => (
          <option className="bg-[#070B12] text-[#FFF9EF]" key={option.code} value={option.code}>
            {option.flag} {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
