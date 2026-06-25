import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { SiteHeader } from "@/components/site/Header";
import { ShopProductCard } from "@/components/site/ShopProductCard";
import { mapDbProductToShopProduct, shopProducts } from "@/components/site/shop-data";
import { listActiveProducts } from "@/lib/db/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop limited Never Found streetwear drops with no restocks and scarce stock.",
};

export default async function ShopPage() {
  const dbProducts = await listActiveProducts();
  const products = dbProducts.length ? dbProducts.map(mapDbProductToShopProduct) : shopProducts;

  return (
    <div className="min-h-screen w-full bg-[#F7F1E6] text-[#10131A]">
      <SiteHeader active="shop" />
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
            {products.map((product) => (
              <ShopProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
