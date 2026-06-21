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
        className="pixel-edge flex w-full items-center justify-center gap-3 bg-[#F05267] px-6 py-4 text-sm font-black uppercase text-[#FFF9EF] transition hover:translate-x-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={soldOut}
        onClick={handleAddToCart}
        type="button"
      >
        {soldOut ? "Sold Out" : added ? "Added To Cart" : "▶ Add To Cart"}
      </button>
      <button
        className="w-full border border-[#10131A] px-6 py-4 text-sm font-black uppercase transition hover:translate-x-0.5 hover:border-[#F05267] hover:text-[#F05267]"
        type="button"
      >
        ♡ Add To Wishlist
      </button>
    </div>
  );
}
