"use client";

import Link from "next/link";
import { useCart } from "@/components/store/cart-provider";
import { formatCurrency } from "@/lib/utils";

export function CartView() {
  const cart = useCart();
  const subtotal = cart.items.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );

  if (cart.items.length === 0) {
    return (
      <div className="space-y-4">
        <p>Your cart is empty.</p>
        <Link className="underline" href="/">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {cart.items.map((item) => (
        <div
          key={item.productId}
          className="flex flex-wrap items-center justify-between gap-4 border-b py-4"
        >
          <div>
            <Link className="font-medium underline" href={`/products/${item.slug}`}>
              {item.name}
            </Link>
            <p className="text-sm text-foreground/70">
              {formatCurrency(item.unitPrice)}
            </p>
          </div>
          <input
            aria-label={`Quantity for ${item.name}`}
            className="w-20 border px-3 py-2"
            min={1}
            type="number"
            value={item.quantity}
            onChange={(event) =>
              cart.updateQuantity(item.productId, Number(event.target.value))
            }
          />
          <p>{formatCurrency(item.unitPrice * item.quantity)}</p>
          <button
            type="button"
            className="underline"
            onClick={() => cart.removeItem(item.productId)}
          >
            Remove
          </button>
        </div>
      ))}
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Subtotal</p>
        <p className="text-lg font-semibold">{formatCurrency(subtotal)}</p>
      </div>
      <Link
        className="inline-flex border border-foreground px-4 py-2 font-medium"
        href="/checkout"
      >
        Checkout
      </Link>
    </div>
  );
}

