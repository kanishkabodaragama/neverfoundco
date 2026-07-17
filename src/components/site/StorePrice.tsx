"use client";

import { useStoreCurrency } from "@/components/store/currency-provider";

export function StorePrice({ amountLkr }: { amountLkr: number }) {
  const { format } = useStoreCurrency();
  return <>{format(amountLkr)}</>;
}
