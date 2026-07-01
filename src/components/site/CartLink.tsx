"use client";

import Image from "next/image";
import { useCart } from "@/components/store/cart-provider";

export function CartLink({ onClick }: { onClick: () => void }) {
  const cart = useCart();
  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <button
      className="group relative flex h-12 min-h-12 w-9 items-center justify-center px-0 text-ink transition-colors hover:text-rust md:h-auto md:min-h-9 md:w-auto md:px-3"
      onClick={onClick}
      aria-label="Cart"
      type="button"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="block h-[23px] w-[23px] object-contain transition-opacity group-hover:opacity-75 md:h-6 md:w-6"
        height={24}
        priority
        src="/images/icons/mobile-cart.png"
        width={24}
      />
      {itemCount > 0 ? (
        <span
          aria-hidden="true"
          className="cart-pixel-alert absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 bg-rust"
        />
      ) : null}
    </button>
  );
}
