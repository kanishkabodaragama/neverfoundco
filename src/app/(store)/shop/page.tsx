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

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ShopPage() {
  const dbProducts = await listActiveProducts();
  const products = dbProducts.length ? dbProducts.map(mapDbProductToShopProduct) : shopProducts;

  return (
    <div className="min-h-screen w-full bg-acid text-ink">
      <SiteHeader active="shop" />
      <main>
        <section className="w-full bg-acid px-5 py-12 text-ink md:px-8 md:py-16 xl:px-12">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.28em]">
            <span>Evidence room / drops</span>
            <span>{products.length.toString().padStart(2, "0")} logged</span>
          </div>
          <h1 className="mt-7 font-display text-[18vw] uppercase leading-[0.82] md:text-8xl lg:text-9xl">
            Current
            <br />
            Drop
          </h1>
          <p className="mt-6 max-w-md text-sm font-semibold leading-snug md:text-base">
            Limited streetwear files. Small batches, no restocks, clean product
            evidence for pieces that disappear.
          </p>
        </section>
        <section className="w-full bg-acid px-5 py-12 text-ink md:px-8 md:py-16 xl:px-12">
          <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 md:gap-x-9 md:gap-y-14 lg:grid-cols-4 xl:gap-x-12">
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
