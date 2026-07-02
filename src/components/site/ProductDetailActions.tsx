"use client";

import { useState } from "react";
import { useCart } from "@/components/store/cart-provider";

export function ProductDetailActions({
  productId,
  name,
  slug,
  unitPrice,
  soldOut,
}: {
  productId: string;
  name: string;
  slug: string;
  unitPrice: number;
  soldOut?: boolean;
}) {
  const cart = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    if (soldOut) return;
    cart.addItem({ productId, name, slug, unitPrice });
    setAdded(true);
  }

  return (
    <div className="grid gap-3">
      <button
        className="flex w-full items-center justify-center gap-3 bg-ink px-6 py-4 font-sans text-sm font-black italic uppercase tracking-normal text-acid transition-colors hover:bg-rust hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        disabled={soldOut}
        onClick={handleAddToCart}
        type="button"
      >
        {soldOut ? "Sold Out" : added ? "Added To Cart" : "Add To Cart"}
      </button>
      <button
        className="w-full border border-ink px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.28em] transition-colors hover:border-rust hover:text-rust"
        type="button"
      >
        Add To Wishlist
      </button>
    </div>
  );
}
