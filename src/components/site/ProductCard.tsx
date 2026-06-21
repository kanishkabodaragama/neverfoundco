import Image from "next/image";
import Link from "next/link";
import type { DropProduct } from "@/components/site/landing-data";

export function ProductCard({ product }: { product: DropProduct }) {
  return (
    <article
      className={`group relative space-y-2.5 ${
        product.soldOut ? "opacity-70 grayscale" : ""
      }`}
    >
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
          className={`absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#17251f] text-center text-[0.58rem] font-black uppercase leading-none ${
            product.soldOut
              ? "rotate-12 bg-[#d9532f] text-[#17251f]"
              : "bg-[#123f32] text-[#ead8bd]"
          }`}
        >
          {product.stockLabel}
        </span>
      </Link>
      <div className="text-[0.8rem] font-black uppercase leading-tight">
        <h3>
          <Link className="hover:text-[#d9532f]" href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>
        <p>{product.price}</p>
      </div>
    </article>
  );
}
