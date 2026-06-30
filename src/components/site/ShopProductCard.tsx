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
        className="relative block aspect-[4/5] overflow-hidden bg-ink transition-transform duration-300 group-hover:-rotate-1"
        href={`/products/${product.slug ?? product.id}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="select-none font-display text-7xl uppercase text-acid/15">
            NF
          </span>
        </div>
        <Image
          alt={product.alt}
          className="object-contain p-8"
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
      <div className="flex flex-col items-center justify-between gap-2 text-center text-ink sm:flex-row sm:items-start sm:gap-3 sm:text-left md:-mt-2 lg:-mt-3">
        <div>
          <h3 className="font-display text-xl uppercase leading-tight">
            <Link className="hover:text-[#d9532f]" href={`/products/${product.slug ?? product.id}`}>
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 font-mono text-sm font-bold"><StorePrice amountUsd={product.price} /></p>
        </div>
        <button
          className="border border-ink px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition hover:bg-ink hover:text-acid disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-ink sm:mt-0"
          disabled={product.soldOut || !defaultVariant}
          onClick={addToCart}
          type="button"
        >
          {product.soldOut || !defaultVariant ? "Gone" : isAdded ? "Added" : "Add"}
        </button>
      </div>
    </article>
  );
}
