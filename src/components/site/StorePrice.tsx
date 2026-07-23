"use client";

import { useStoreCurrency } from "@/components/store/currency-provider";
import { cn } from "@/lib/utils";

export function StorePrice({
  amountLkr,
  className,
  primaryClassName,
  secondaryClassName,
}: {
  amountLkr: number;
  className?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
}) {
  const { currency, formatAs } = useStoreCurrency();
  const secondaryCurrency = currency === "USD" ? "LKR" : "USD";

  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span className={cn("font-black", primaryClassName)}>
        {formatAs(amountLkr, currency)}
      </span>
      <span
        className={cn(
          "mt-1 text-[0.65em] font-bold opacity-60",
          secondaryClassName,
        )}
      >
        {formatAs(amountLkr, secondaryCurrency)}
      </span>
    </span>
  );
}
