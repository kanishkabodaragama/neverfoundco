"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/store/cart-provider";

export function CartLink() {
  const cart = useCart();
  const count = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link
      className="flex h-24 min-h-24 items-center gap-2.5 px-0 font-mono text-sm font-bold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-acid md:h-auto md:min-h-9 md:gap-2 md:px-3 md:text-xs"
      href="/cart"
      aria-label={`Cart with ${count} items`}
    >
      <ShoppingBag className="size-7 md:size-4" aria-hidden="true" />
      <span>{count}</span>
    </Link>
  );
}
