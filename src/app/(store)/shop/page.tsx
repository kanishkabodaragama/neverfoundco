import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { shopProducts } from "@/components/site/shop-data";
import { formatLkr } from "@/components/cart/cart-data";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop limited Never Found streetwear drops with no restocks and scarce stock.",
};

export default function ShopPage() {
  return (
    <div className="min-h-screen w-full bg-[#F7F1E6] text-[#10131A]">
      <Header />
      <main>
        <section className="w-full bg-[#F7F1E6] px-5 py-8 md:px-8 xl:px-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-pixel text-xs uppercase text-[#F05267]">Level 01</p>
              <h1 className="font-pixel mt-3 text-2xl uppercase md:text-3xl">
                Shop drops
              </h1>
            </div>
            <p className="max-w-md text-sm font-bold leading-relaxed">
              Limited streetwear files. Small batches, no restocks, clean product cards.
            </p>
          </div>
        </section>
        <section className="w-full bg-[#070B12] px-5 py-8 text-[#FFF9EF] md:px-8 xl:px-12">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {shopProducts.map((product) => (
              <Link
                className="group bg-[#FFF9EF] p-4 text-[#10131A] transition hover:-translate-y-1"
                href={`/products/${product.id}`}
                key={product.id}
              >
                <div className="relative aspect-square">
                  <span className="absolute left-0 top-0 z-10 bg-[#B8A8E8] px-3 py-1 text-xs font-black uppercase">
                    {product.stockLabel}
                  </span>
                  <Image
                    alt={product.alt}
                    className="object-contain p-7"
                    fill
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw"
                    src={product.image}
                  />
                </div>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <h2 className="font-pixel text-xs uppercase">{product.name}</h2>
                    <p className="mt-2 text-sm font-black">{formatLkr(product.price)}</p>
                  </div>
                  <span className="text-lg">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
