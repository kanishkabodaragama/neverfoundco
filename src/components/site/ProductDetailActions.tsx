"use client";

import Link from "next/link";
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
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        className="pixel-edge bg-[#F05267] px-6 py-4 text-sm font-black uppercase text-[#FFF9EF] transition hover:translate-x-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={soldOut}
        onClick={handleAddToCart}
        type="button"
      >
        {soldOut ? "Sold Out" : added ? "Added To Cart" : "Add To Cart ->"}
      </button>
      <Link
        className="border border-[#10131A]/20 px-6 py-4 text-center text-sm font-black uppercase transition hover:translate-x-0.5 hover:border-[#F05267] hover:text-[#F05267]"
        href="/cart"
      >
        View Cart
      </Link>
    </div>
  );
}
