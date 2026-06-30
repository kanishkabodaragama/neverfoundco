import Image from "next/image";
import Link from "next/link";
import { StorePrice } from "@/components/site/StorePrice";
import type { DropProduct } from "@/components/site/landing-data";

export function ProductCard({ product }: { product: DropProduct }) {
  return (
    <article className={`group relative mx-2 space-y-2.5 text-center sm:mx-0 sm:text-left md:space-y-0 ${product.soldOut ? "opacity-75" : ""}`}>
      <Link
        aria-label={`View ${product.name}`}
        className="relative block aspect-square overflow-hidden border-2 border-[#17251f] bg-[#ead8bd] transition group-hover:-translate-y-1 group-hover:rotate-[-1deg]"
        href={`/products/${product.slug}`}
      >
        <Image
          alt={product.alt}
          className="object-contain p-4"
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 44vw, 90vw"
          src={product.image}
        />
        <span
          className={`absolute right-3 top-3 px-2 py-1 font-mono text-[10px] font-black uppercase tracking-[0.18em] ${
            product.soldOut
              ? "bg-rust text-bone"
              : "bg-[#123f32] text-[#ead8bd]"
          }`}
        >
          {product.soldOut ? "Sold out" : product.stockLabel}
        </span>
      </Link>
      <div className="text-[0.8rem] font-black uppercase leading-tight md:-mt-2 lg:-mt-3">
        <h3>
          <Link className="hover:text-[#d9532f]" href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>
        <p><StorePrice amountUsd={product.price} /></p>
      </div>
    </article>
  );
}
