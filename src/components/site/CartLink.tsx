"use client";

import Link from "next/link";
import { useCart } from "@/components/store/cart-provider";

export function CartLink() {
  const cart = useCart();
  const count = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link
      className="font-pixel flex items-center gap-3 text-sm uppercase transition hover:text-[#F05267]"
      href="/cart"
    >
      Cart ({count})
      <span className="pixel-blink text-[#F05267]">▣</span>
    </Link>
  );
}
