"use client";

import { useCart } from "@/components/store/cart-provider";

export function AddToCartButton({
  productId,
  name,
  slug,
  unitPrice,
}: {
  productId: string;
  name: string;
  slug: string;
  unitPrice: number;
}) {
  const cart = useCart();

  return (
    <button
      type="button"
      onClick={() => cart.addItem({ productId, name, slug, unitPrice })}
      className="border border-foreground px-4 py-2 text-sm font-medium"
    >
      Add to cart
    </button>
  );
}

