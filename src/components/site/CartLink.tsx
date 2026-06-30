"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/store/cart-provider";

export function CartLink() {
  const cart = useCart();
  const count = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link
      className="flex min-h-9 items-center gap-2 border border-ink/35 px-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-acid"
      href="/cart"
      aria-label={`Cart with ${count} items`}
    >
      <ShoppingBag className="size-4" aria-hidden="true" />
      <span>{count}</span>
    </Link>
  );
}
