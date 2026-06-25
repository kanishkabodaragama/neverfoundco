"use client";

import { useEffect, useMemo, useState } from "react";
import { CartItemCard } from "@/components/cart/CartItemCard";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { PromoCode } from "@/components/cart/PromoCode";
import { shippingFee, type CartProduct } from "@/components/cart/cart-data";
import { useCart } from "@/components/store/cart-provider";

export function CartItems() {
  const cart = useCart();
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
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
  const appliedDiscount = cart.couponCode ? couponDiscount : 0;
  const couponItems = useMemo(
    () =>
      cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    [cart.items],
  );
  const couponItemsKey = useMemo(() => JSON.stringify(couponItems), [couponItems]);

  useEffect(() => {
    if (!cart.couponCode || cart.items.length === 0) {
      return;
    }

    const controller = new AbortController();

    fetch("/api/cart/coupon", {
      body: JSON.stringify({
        couponCode: cart.couponCode,
        items: couponItems,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: controller.signal,
    })
      .then((response) => response.json().then((result) => ({ response, result })))
      .then(({ response, result }) => {
        if (!response.ok || "error" in result) {
          setCouponDiscount(0);
          setCouponMessage(result.error ?? "Coupon could not be applied.");
          return;
        }

        setCouponDiscount(Number(result.discountAmount ?? 0));
        setCouponMessage(`${result.couponCode} applied.`);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setCouponDiscount(0);
        setCouponMessage("Coupon could not be applied.");
      });

    return () => controller.abort();
  }, [cart.couponCode, cart.items.length, couponItems, couponItemsKey]);

  async function applyCoupon(code: string) {
    const couponCode = code.trim().toUpperCase();

    if (!couponCode) {
      setCouponMessage("Enter a coupon code.");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponMessage("");

    try {
      const response = await fetch("/api/cart/coupon", {
        body: JSON.stringify({
          couponCode,
          items: couponItems,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const result = (await response.json()) as
        | {
            couponCode: string;
            discountAmount: number;
          }
        | { error: string };

      if (!response.ok || "error" in result) {
        cart.clearCouponCode();
        setCouponDiscount(0);
        setCouponMessage("error" in result ? result.error : "Coupon could not be applied.");
        return;
      }

      cart.setCouponCode(result.couponCode);
      setCouponDiscount(Number(result.discountAmount ?? 0));
      setCouponMessage(`${result.couponCode} applied.`);
    } catch {
      setCouponDiscount(0);
      setCouponMessage("Coupon could not be applied.");
    } finally {
      setIsApplyingCoupon(false);
    }
  }

  function removeCoupon() {
    cart.clearCouponCode();
    setCouponDiscount(0);
    setCouponMessage("");
  }

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
        <PromoCode
          appliedCode={cart.couponCode}
          disabled={cart.items.length === 0}
          isApplying={isApplyingCoupon}
          message={couponMessage}
          onApply={applyCoupon}
          onRemove={removeCoupon}
        />
      </div>
      <OrderSummary
        couponCode={cart.couponCode}
        discount={appliedDiscount}
        shipping={shippingFee}
        subtotal={subtotal}
      />
    </section>
  );
}
