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
      className={`group relative space-y-4 ${product.soldOut ? "opacity-70 grayscale" : ""}`}
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
          className={`absolute left-3 top-3 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.28em] ${
            product.soldOut
              ? "bg-rust text-ink"
              : "bg-acid text-ink"
          }`}
        >
          {product.stockLabel}
        </span>
      </Link>
      <div className="flex items-start justify-between gap-3 text-ink">
        <div>
          <h3 className="font-display text-xl uppercase leading-tight">
            <Link className="hover:text-[#d9532f]" href={`/products/${product.slug ?? product.id}`}>
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 font-mono text-sm font-bold"><StorePrice amountUsd={product.price} /></p>
        </div>
        <button
          className="border border-ink px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] transition hover:bg-ink hover:text-acid disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-ink"
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
