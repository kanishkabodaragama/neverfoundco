import Image from "next/image";
import Link from "next/link";
import { StorePrice } from "@/components/site/StorePrice";
import type { DropProduct } from "@/components/site/landing-data";

export function ProductCard({ product }: { product: DropProduct }) {
  return (
    <article className="group relative mx-2 space-y-2.5 text-center sm:mx-0 sm:text-left md:space-y-0">
      <Link
        aria-label={`View ${product.name}`}
        className="relative block aspect-[4/5] overflow-hidden bg-transparent transition group-hover:-translate-y-1 group-hover:rotate-[-1deg]"
        href={`/products/${product.slug}`}
      >
        <Image
          alt={product.alt}
          className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.03] sm:p-6 md:p-7"
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
      <div className="mt-0.5 text-[0.8rem] font-black uppercase leading-tight md:mt-1">
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
