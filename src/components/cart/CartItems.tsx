"use client";

import { useMemo, useState } from "react";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { PromoCode } from "@/components/cart/PromoCode";
import {
  mockCartItems,
  shippingFee,
  type CartProduct,
} from "@/components/cart/cart-data";

export function CartItems() {
  const [items, setItems] = useState<CartProduct[]>(mockCartItems);
  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  function updateQuantity(id: string, quantity: number) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    );
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <section className="mx-auto grid max-w-[1440px] gap-6 bg-[#F7F1E6] px-5 py-10 md:px-8 lg:grid-cols-[1fr_360px] lg:px-10 xl:px-12">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-pixel text-3xl font-black uppercase">
            Your Items ({items.length})
          </h1>
          <button
            className="text-sm font-black uppercase text-[#F05267] transition hover:text-[#10131A]"
            onClick={() => setItems([])}
            type="button"
          >
            Clear Cart
          </button>
        </div>
        <div className="space-y-4">
          {items.map((item) => (
            <CartItemCard
              item={item}
              key={item.id}
              onQuantityChange={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>
        <PromoCode />
      </div>
      <OrderSummary shipping={shippingFee} subtotal={subtotal} />
    </section>
  );
}
