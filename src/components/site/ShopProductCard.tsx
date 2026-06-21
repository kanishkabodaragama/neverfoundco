"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ShopProduct } from "@/components/site/shop-data";

export function ShopProductCard({ product }: { product: ShopProduct }) {
  const [isAdded, setIsAdded] = useState(false);

  return (
    <article
      className={`group relative space-y-3 ${product.soldOut ? "opacity-60 grayscale" : ""}`}
    >
      <Link
        aria-label={`View ${product.name}`}
        className="relative block aspect-[4/4.35] overflow-hidden border-2 border-[#17251f] bg-[#ead8bd] transition group-hover:-translate-y-1 group-hover:rotate-[-0.8deg]"
        href={`/products/${product.id}`}
      >
        <Image
          alt={product.alt}
          className="object-contain p-4"
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 31vw, 90vw"
          src={product.image}
        />
        <span
          className={`absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#17251f] text-center text-[0.58rem] font-black uppercase leading-none ${
            product.soldOut
              ? "rotate-12 bg-[#d9532f] text-[#17251f]"
              : "bg-[#123f32] text-[#ead8bd]"
          }`}
        >
          {product.stockLabel}
        </span>
      </Link>
      <div className="flex items-start justify-between gap-3 text-[0.82rem] font-black uppercase leading-tight">
        <div>
          <h3>
            <Link className="hover:text-[#d9532f]" href={`/products/${product.id}`}>
              {product.name}
            </Link>
          </h3>
          <p>LKR {product.price.toLocaleString("en-LK")}</p>
        </div>
        <button
          className="border-2 border-[#17251f] px-3 py-2 text-[0.7rem] transition hover:bg-[#17251f] hover:text-[#ead8bd] disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#17251f]"
          disabled={product.soldOut}
          onClick={() => setIsAdded(true)}
          type="button"
        >
          {product.soldOut ? "Gone" : isAdded ? "Added" : "Add"}
        </button>
      </div>
    </article>
  );
}
