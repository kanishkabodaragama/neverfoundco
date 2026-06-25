"use client";

import Image from "next/image";
import type { CartProduct } from "@/components/cart/cart-data";
import { StorePrice } from "@/components/site/StorePrice";

export function CartItemCard({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartProduct;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <article className="grid gap-0 border border-[#10131A]/10 bg-[#FFF9EF] transition hover:-translate-y-1 md:grid-cols-[150px_1fr_110px_140px_40px]">
      <div className="relative min-h-[150px] bg-[#FFF9EF]">
        <Image
          alt={item.alt}
          className="object-contain p-5"
          fill
          src={item.image}
        />
      </div>
      <div className="space-y-4 p-5">
        <h3 className="font-pixel text-sm uppercase">{item.name}</h3>
        <div className="text-sm font-bold leading-snug">
          <p>{item.color}</p>
          <p>Size: {item.size}</p>
        </div>
        <span className="inline-flex bg-[#070B12] px-3 py-2 text-xs font-black uppercase text-[#FFF9EF]">
          {item.stockLabel}
        </span>
      </div>
      <div className="flex items-start p-5 text-sm font-black uppercase md:justify-center">
        <StorePrice amountUsd={item.price} />
      </div>
      <div className="flex items-start p-5">
        <div className="flex border border-[#10131A]/20 text-sm font-black">
          <button
            className="px-4 py-2 transition hover:bg-[#070B12] hover:text-[#FFF9EF]"
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            type="button"
          >
            -
          </button>
          <span className="border-x border-[#10131A]/20 px-4 py-2">
            {item.quantity}
          </span>
          <button
            className="px-4 py-2 transition hover:bg-[#070B12] hover:text-[#FFF9EF]"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            type="button"
          >
            +
          </button>
        </div>
      </div>
      <button
        aria-label={`Remove ${item.name}`}
        className="p-5 text-2xl transition hover:text-[#F05267]"
        onClick={() => onRemove(item.id)}
        type="button"
      >
        ×
      </button>
    </article>
  );
}
