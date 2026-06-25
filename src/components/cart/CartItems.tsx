"use client";

import { useMemo } from "react";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { PromoCode } from "@/components/cart/PromoCode";
import { shippingFee, type CartProduct } from "@/components/cart/cart-data";
import { useCart } from "@/components/store/cart-provider";

export function CartItems() {
  const cart = useCart();
  const items = useMemo<CartProduct[]>(
    () =>
      cart.items.map((item) => ({
        id: item.variantId ?? item.productId,
        name: item.name,
        color: item.color ?? "Default",
        size: item.size ?? "Default",
        stockLabel: item.gender ?? "Selected",
        price: item.unitPrice,
        quantity: item.quantity,
        image: item.image ?? "/images/products/black-heavyweight-tee.png",
        alt: item.name,
      })),
    [cart.items],
  );
  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  function updateQuantity(id: string, quantity: number) {
    cart.updateQuantity(id, quantity);
  }

  function removeItem(id: string) {
    cart.removeItem(id);
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <section className="grid w-full gap-6 bg-[#F7F1E6] px-5 py-8 md:px-8 lg:grid-cols-[1fr_340px] xl:px-12">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-pixel text-2xl font-black uppercase md:text-3xl">
            Your Items ({items.length})
          </h1>
          <button
            className="text-sm font-black uppercase text-[#F05267] transition hover:text-[#10131A]"
            onClick={cart.clearCart}
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
