import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/site/Footer";
import { ProductDetailClient } from "@/components/site/ProductDetailClient";
import { StorePrice } from "@/components/site/StorePrice";
import {
  getProductDetailBySlug,
  type MockProductDetail,
} from "@/components/site/product-detail-data";
import { mapDbProductToShopProduct, shopProducts, type ShopProduct } from "@/components/site/shop-data";
import { SiteHeader } from "@/components/site/Header";
import { listActiveProducts } from "@/lib/db/products";

const detailBullets = [
  "100% Cotton Fleece",
  "450GSM Heavyweight",
  "Pixel Embroidery Front & Back",
  "Oversized Fit",
  "Kangaroo Pocket",
  "Ribbed Cuffs & Hem",
  "Made to Last",
];

const sizeRows = [
  ["S", "17", "26.5", "19.5", "8.5"],
  ["M", "20", "27.5", "21", "9"],
  ["L", "21", "28.5", "22", "9.5"],
  ["XL", "22", "29.5", "23", "10"],
  ["2XL", "23", "29.5", "24", "11.5"],
];

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductDetailBySlug(slug);

  if (!product) return {};

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | Never Found Co`,
      description: product.shortDescription,
      images: [{ url: product.image, alt: product.alt }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductDetailBySlug(slug);

  if (!product) notFound();

  const dbProducts = await listActiveProducts();
  const relatedProducts = dbProducts.length ? dbProducts.map(mapDbProductToShopProduct) : shopProducts;

  return <NeverFoundProductPage product={product} relatedProducts={relatedProducts} />;
}

function NeverFoundProductPage({
  product,
  relatedProducts,
}: {
  product: MockProductDetail;
  relatedProducts: ShopProduct[];
}) {
  const related = relatedProducts
    .filter((item) => !item.soldOut && (item.slug ?? item.id) !== product.slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen w-full bg-acid text-ink">
      <SiteHeader active="shop" />
      <main>
        <section className="bg-acid px-5 py-8 md:px-8 md:py-10 xl:px-12">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-ink/55"
          >
            <Link href="/">Home</Link>
            <span>›</span>
            <Link href="/shop">Shop</Link>
            <span>›</span>
            <Link href="/shop">{product.category}</Link>
            <span>›</span>
            <span>{product.name}</span>
          </nav>

          <ProductDetailClient product={product} />
        </section>

        <section className="grid w-full gap-8 border-t border-ink bg-acid px-5 py-12 md:px-8 lg:grid-cols-[1fr_0.8fr_1fr] xl:px-12">
          <div>
            <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-rust">
              Product Details
            </h2>
            {product.description ? (
              <div className="mt-6 whitespace-pre-line text-sm font-semibold leading-relaxed text-ink/70">
                {product.description}
              </div>
            ) : (
              <ul className="mt-6 space-y-3 text-sm font-semibold text-ink/70">
                {detailBullets.map((detail) => (
                  <li className="flex gap-4" key={detail}>
                    <span className="text-rust">◆</span>
                    {detail}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col items-center justify-center border border-ink py-8 text-ink">
            <span className="font-display text-8xl leading-none">NF</span>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-rust">NF-1999</p>
          </div>

          <div id="size-chart">
            <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-rust">
              Size Chart
            </h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-center font-mono text-xs font-bold uppercase">
                <thead>
                  <tr>
                    {[
                      "Size",
                      "Shoulder (inches)",
                      "Height (inches)",
                      "Chest (inches)",
                      "Sleeve (inches)",
                    ].map((heading) => (
                      <th className="border border-ink px-3 py-3 uppercase" key={heading}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizeRows.map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell) => (
                        <td className="border border-ink px-3 py-3" key={cell}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-wide">* Measurements in inches</p>
          </div>
        </section>

        <section className="bg-acid px-5 py-14 text-ink md:px-8 md:py-16 xl:px-12">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-4xl uppercase leading-none">
              You may also like
            </h2>
            <Link className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-rust hover:text-ink" href="/shop">
              View all
            </Link>
          </div>
          <div className="mt-10 grid gap-x-7 gap-y-12 sm:grid-cols-2 md:gap-x-9 md:gap-y-14 xl:grid-cols-4 xl:gap-x-12">
            {related.map((item) => (
              <RelatedProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>

        <section className="grid w-full items-center gap-6 bg-acid px-5 py-10 text-ink md:grid-cols-[1fr_1.2fr_auto] md:px-8 xl:px-12">
          <div className="flex items-center gap-5">
            <span className="text-4xl">✉</span>
            <div>
              <h2 className="font-display text-3xl uppercase leading-none">Stay in the loop.</h2>
              <p className="mt-2 text-sm font-semibold">
                New drops. Secret locations. No spam.
              </p>
            </div>
          </div>
          <input
            aria-label="Email address"
            className="w-full border border-ink bg-transparent px-5 py-4 font-mono text-sm font-bold uppercase outline-none placeholder:text-ink/60"
            placeholder="Your email"
            type="email"
          />
          <button
            className="bg-ink px-9 py-4 font-mono text-xs font-bold uppercase tracking-[0.28em] text-acid transition-colors hover:bg-rust hover:text-ink"
            type="button"
          >
            Join
          </button>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function RelatedProductCard({
  product,
}: {
  product: ShopProduct;
}) {
  return (
    <Link
      className="group mx-2 block text-center text-ink sm:mx-0 sm:text-left"
      href={`/products/${product.slug ?? product.id}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-transparent transition-transform duration-300 group-hover:-rotate-1">
        <span
          className={`absolute top-3 z-10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.28em] ${
            product.soldOut
              ? "right-3 bg-rust font-black text-bone"
              : "left-3 bg-acid text-ink"
          }`}
        >
          {product.soldOut ? "Sold out" : product.stockLabel}
        </span>
        <Image
          alt={product.alt}
          className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.03] sm:p-6 md:p-7"
          fill
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 44vw, 90vw"
          src={product.image}
          unoptimized
        />
      </div>
      <div className="mt-2 md:mt-1">
        <h3 className="font-display text-xl uppercase leading-tight">{product.name}</h3>
        <p className="mt-1 font-mono text-sm font-bold text-ink"><StorePrice amountUsd={product.price} /></p>
      </div>
    </Link>
  );
}
