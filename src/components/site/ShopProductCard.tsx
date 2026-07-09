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
    <article className="group relative mx-2 space-y-2 sm:mx-0 md:space-y-0">
      <Link
        aria-label={`View ${product.name}`}
        className="relative block aspect-[4/5] overflow-hidden bg-transparent transition-transform duration-300 group-hover:-rotate-1"
        href={`/products/${product.slug ?? product.id}`}
      >
        <Image
          alt={product.alt}
          className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.03] sm:p-6 md:p-7"
          fill
          quality={100}
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 31vw, 90vw"
          src={product.image}
        />
        <span
          className={`absolute top-3 px-2 py-1 font-sans text-[10px] uppercase tracking-normal ${
            product.soldOut
              ? "right-3 bg-rust font-black text-bone"
              : "left-3 bg-acid text-ink"
          }`}
        >
          {product.soldOut ? "Sold out" : product.stockLabel}
        </span>
      </Link>
      <div className="mt-0.5 flex flex-col items-center justify-between gap-2 text-center text-ink sm:flex-row sm:items-start sm:gap-3 sm:text-left md:mt-1">
        <div>
          <h3 className="font-display text-xl uppercase leading-tight">
            <Link className="hover:text-[#d9532f]" href={`/products/${product.slug ?? product.id}`}>
              {product.name}
            </Link>
          </h3>
          <p className="font-display text-xl uppercase leading-tight"><StorePrice amountUsd={product.price} /></p>
        </div>
        {!product.soldOut && defaultVariant ? (
          <button
            className="border border-ink px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-normal transition hover:bg-ink hover:text-acid sm:mt-0"
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
