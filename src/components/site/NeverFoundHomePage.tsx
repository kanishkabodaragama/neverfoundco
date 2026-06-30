import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { StorePrice } from "@/components/site/StorePrice";
import { shopProducts, type ShopProduct } from "@/components/site/shop-data";

const featuredProducts = shopProducts.slice(0, 4);

export function NeverFoundHomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-ink text-bone">
      <Header />
      <main>
        <section className="bg-acid px-5 py-16 text-ink md:px-8 md:py-24">
          <div className="mb-10 flex items-end justify-between md:mb-14">
            <h2 className="font-display text-4xl uppercase leading-none md:text-6xl">
              Current
              <br />
              drop
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-ink/50">
              {featuredProducts.length.toString().padStart(2, "0")} / {featuredProducts.length.toString().padStart(2, "0")} logged
            </span>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:gap-x-10 md:gap-y-16">
            {featuredProducts.map((product, index) => (
              <EvidenceProductCard index={index} key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              className="inline-block bg-ink px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.28em] text-acid transition-colors hover:bg-rust hover:text-ink"
              href="/shop"
            >
              View full case file
            </Link>
          </div>
        </section>

        <section className="bg-ink px-5 py-16 md:px-8 md:py-28">
          <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.28em] text-acid">
            Evidence log / 01
          </div>

          <p className="text-stroke font-display text-[12vw] uppercase leading-[0.95] md:max-w-4xl md:text-6xl lg:text-7xl">
            We do not restock. We do not archive. Wear it before it disappears.
          </p>

          <div className="mt-10 grid max-w-3xl grid-cols-2 gap-6 border-t border-acid/15 pt-8 md:grid-cols-4 md:gap-10">
            {[
              ["50", "units per drop"],
              ["0", "restocks, ever"],
              ["1", "drop a month"],
              ["∞", "ways to wear it"],
            ].map(([num, label]) => (
              <div key={label}>
                <div className="font-display text-3xl leading-none text-acid md:text-4xl">
                  {num}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-wide text-bone/60 md:text-xs">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-ink px-5 py-16 md:px-8 md:py-24">
          <div className="border border-acid/30 p-6 md:p-12">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-acid">
              Status: next drop pending
            </div>
            <h2 className="max-w-2xl font-display text-4xl uppercase leading-[0.9] md:text-6xl">
              Get found first. Get notified before it is gone.
            </h2>

            <form className="mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
              <label htmlFor="home-email" className="sr-only">
                Email address
              </label>
              <input
                className="flex-1 border border-bone/30 bg-transparent px-4 py-4 font-mono text-sm text-bone outline-none placeholder:text-bone/40 focus:border-acid"
                id="home-email"
                placeholder="your@email.com"
                type="email"
              />
              <button
                className="whitespace-nowrap bg-acid px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.28em] text-ink transition-colors hover:bg-bone"
                type="button"
              >
                Notify me
              </button>
            </form>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-wide text-bone/40">
              No spam. Just drop alerts. Unsubscribe anytime.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function EvidenceProductCard({
  index,
  product,
}: {
  index: number;
  product: ShopProduct;
}) {
  const exhibit = ["A", "B", "C", "D"][index] ?? String(index + 1);
  const rotate = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"][index % 4];

  return (
    <Link className="group block" href={`/products/${product.slug ?? product.id}`}>
      <div
        className={`relative aspect-[4/5] overflow-hidden bg-ink transition-transform duration-300 group-hover:rotate-0 ${rotate}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="select-none font-display text-7xl uppercase text-acid/15">
            NF
          </span>
        </div>
        <Image
          alt={product.alt}
          className="object-contain p-8"
          fill
          sizes="(min-width: 768px) 45vw, 90vw"
          src={product.image}
          unoptimized
        />
        <div className="absolute left-3 top-3 bg-acid px-2 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-ink">
          Exhibit {exhibit}
        </div>
        {product.soldOut ? (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/70">
            <span className="border border-bone/40 px-3 py-1 font-mono text-xs uppercase tracking-[0.28em] text-bone">
              Never found again
            </span>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <h3 className="font-display text-xl uppercase leading-tight">{product.name}</h3>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-ink/50">
            {product.stockLabel}
          </p>
        </div>
        <div className="shrink-0 pl-4 text-right">
          <div className="font-mono text-sm font-bold">
            <StorePrice amountUsd={product.price} />
          </div>
          <div className={`mt-1 font-mono text-[10px] uppercase tracking-wide ${
            product.soldOut ? "text-rust" : "text-ink/50"
          }`}>
            {product.soldOut ? "Sold out" : "Open"}
          </div>
        </div>
      </div>
    </Link>
  );
}
