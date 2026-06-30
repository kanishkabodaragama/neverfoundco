"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/store/cart-provider";
import { StorePrice } from "@/components/site/StorePrice";
import type { ShopProduct } from "@/components/site/shop-data";

export function ShopProductCard({ product }: { product: ShopProduct }) {
  const cart = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const defaultVariant = product.variants.find((variant) => variant.stock > 0);

  function addToCart() {
    if (product.soldOut || !defaultVariant) return;

    cart.addItem({
      productId: product.id,
      variantId: defaultVariant.id,
      name: product.name,
      slug: product.slug ?? product.id,
      unitPrice: product.price,
      image: defaultVariant.image ?? product.image,
      gender: defaultVariant.gender,
      size: defaultVariant.size,
      color: defaultVariant.color,
    });
    setIsAdded(true);
  }

  return (
    <article
      className={`group relative mx-2 space-y-2 sm:mx-0 md:space-y-0 ${product.soldOut ? "opacity-75" : ""}`}
    >
      <Link
        aria-label={`View ${product.name}`}
        className="relative block aspect-[4/5] overflow-visible bg-transparent transition-transform duration-300 group-hover:-rotate-1"
        href={`/products/${product.slug ?? product.id}`}
      >
        <Image
          alt={product.alt}
          className="scale-[1.06] object-contain p-3 transition-transform duration-300 group-hover:scale-[1.1] md:scale-[0.94] md:p-4 md:group-hover:scale-[0.98]"
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 31vw, 90vw"
          src={product.image}
          unoptimized
        />
        <span
          className={`absolute top-3 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.28em] ${
            product.soldOut
              ? "right-3 bg-rust font-black text-bone"
              : "left-3 bg-acid text-ink"
          }`}
        >
          {product.soldOut ? "Sold out" : product.stockLabel}
        </span>
      </Link>
      <div className="flex flex-col items-center justify-between gap-2 text-center text-ink sm:flex-row sm:items-start sm:gap-3 sm:text-left md:-mt-4 lg:-mt-6">
        <div>
          <h3 className="font-display text-xl uppercase leading-tight">
            <Link className="hover:text-[#d9532f]" href={`/products/${product.slug ?? product.id}`}>
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 font-mono text-sm font-bold"><StorePrice amountUsd={product.price} /></p>
        </div>
        {!product.soldOut && defaultVariant ? (
          <button
            className="border border-ink px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition hover:bg-ink hover:text-acid sm:mt-0"
            onClick={addToCart}
            type="button"
          >
            {isAdded ? "Added" : "Add"}
          </button>
        ) : null}
      </div>
    </article>
  );
}
