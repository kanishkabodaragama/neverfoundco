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
    <article className="grid gap-0 border border-ink bg-transparent transition hover:-rotate-1 md:grid-cols-[150px_1fr_110px_140px_48px]">
      <div className="relative min-h-[150px] bg-transparent">
        <Image
          alt={item.alt}
          className="object-contain p-3"
          fill
          src={item.image}
        />
      </div>
      <div className="space-y-4 p-5">
        <h3 className="font-display text-2xl uppercase leading-none">{item.name}</h3>
        <div className="font-sans text-xs uppercase tracking-normal text-ink/60">
          <p>{item.color}</p>
          <p>Size: {item.size}</p>
        </div>
        <span className="inline-flex border border-ink px-3 py-2 font-sans text-[10px] font-bold uppercase tracking-normal text-ink">
          {item.stockLabel}
        </span>
      </div>
      <div className="flex items-start p-5 font-sans text-sm font-bold uppercase md:justify-center">
        <StorePrice amountLkr={item.price} />
      </div>
      <div className="flex items-start p-5">
        <div className="flex border border-ink font-sans text-sm font-bold">
          <button
            className="px-4 py-2 transition hover:bg-ink hover:text-acid"
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            type="button"
          >
            -
          </button>
          <span className="border-x border-ink px-4 py-2">
            {item.quantity}
          </span>
          <button
            className="px-4 py-2 transition hover:bg-ink hover:text-acid"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            type="button"
          >
            +
          </button>
        </div>
      </div>
      <button
        aria-label={`Remove ${item.name}`}
        className="p-5 text-2xl transition hover:bg-rust hover:text-ink"
        onClick={() => onRemove(item.id)}
        type="button"
      >
        ×
      </button>
    </article>
  );
}
