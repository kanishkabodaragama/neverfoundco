"use client";

import Image from "next/image";
import Link from "next/link";

export function CartLink() {
  return (
    <Link
      className="group flex h-12 min-h-12 w-9 items-center justify-center px-0 text-ink transition-colors hover:text-rust md:h-auto md:min-h-9 md:w-auto md:px-3"
      href="/cart"
      aria-label="Cart"
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
    </Link>
  );
}
