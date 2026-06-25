"use client";

import { useStoreCurrency } from "@/components/store/currency-provider";

export function StorePrice({ amountUsd }: { amountUsd: number }) {
  const { format } = useStoreCurrency();
  return <>{format(amountUsd)}</>;
}
