"use client";

import { useStoreCurrency } from "@/components/store/currency-provider";
import { cn } from "@/lib/utils";

export function StorePrice({
  amountLkr,
  className,
}: {
  amountLkr: number;
  className?: string;
}) {
  const { format } = useStoreCurrency();

  return (
    <span className={cn("inline-block font-black leading-none", className)}>
      {format(amountLkr)}
    </span>
  );
}
