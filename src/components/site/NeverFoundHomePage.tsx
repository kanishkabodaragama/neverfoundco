import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { StorePrice } from "@/components/site/StorePrice";
import { shopProducts, type ShopProduct } from "@/components/site/shop-data";

export function NeverFoundHomePage({
  products = shopProducts,
}: {
  products?: ShopProduct[];
}) {
  const featuredProducts = products.filter((product) => !product.soldOut).slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-ink text-ink">
      <Header />
      <main className="flex-1 bg-acid">
        <section className="bg-acid px-5 pb-12 pt-6 text-ink md:px-8 md:pb-20 md:pt-24">
          {/* <div className="mb-10 flex items-end justify-between md:mb-14">
            <h2 className="font-display text-4xl uppercase leading-none md:text-6xl">
              Current
              <br />
              drop
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-ink/50">
              {featuredProducts.length.toString().padStart(2, "0")} / {featuredProducts.length.toString().padStart(2, "0")} logged
            </span>
          </div> */}

          <div className="mx-2 grid grid-cols-2 gap-x-3 gap-y-9 sm:mx-4 sm:gap-x-6 sm:gap-y-12 md:mx-0 md:gap-x-16 md:gap-y-24 lg:gap-x-24 lg:gap-y-28">
            {featuredProducts.map((product) => (
              <EvidenceProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function EvidenceProductCard({
  product,
}: {
  product: ShopProduct;
}) {
  return (
    <Link className="group block" href={`/products/${product.slug ?? product.id}`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-transparent">
        <Image
          alt={product.alt}
          className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.03] sm:p-6 md:p-7"
          fill
          sizes="(min-width: 768px) 45vw, 50vw"
          src={product.image}
          unoptimized
        />
        {product.soldOut ? (
          <span className="absolute right-1 top-1 z-10 bg-rust px-2 py-1 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-bone sm:right-2 sm:top-2 sm:text-[10px]">
            Sold out
          </span>
        ) : null}
      </div>

      <div className="mt-0.5 flex flex-col items-center gap-1 text-center md:mt-1 md:flex-row md:items-start md:justify-between md:text-left">
        <div>
          <h3 className="font-display text-base uppercase leading-tight sm:text-xl">{product.name}</h3>
        </div>
        <div className="shrink-0 text-center md:pl-4 md:text-right">
          <div className="font-mono text-xs font-bold sm:text-sm">
            <StorePrice amountUsd={product.price} />
          </div>
        </div>
      </div>
    </Link>
  );
}
