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
  ["S", "58", "68", "57"],
  ["M", "60", "70", "58"],
  ["L", "62", "72", "59"],
  ["XL", "64", "74", "60"],
  ["XXL", "66", "76", "61"],
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
    .filter((item) => (item.slug ?? item.id) !== product.slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen w-full bg-bone text-ink">
      <SiteHeader active="shop" />
      <main>
        <section className="bg-bone px-5 py-10 md:px-8 xl:px-12">
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

        <section className="grid w-full gap-8 border-t border-ink bg-bone px-5 py-12 md:px-8 lg:grid-cols-[1fr_0.8fr_1fr] xl:px-12">
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

          <div className="flex flex-col items-center justify-center bg-ink py-8 text-acid">
            <span className="font-display text-8xl leading-none">NF</span>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em]">NF-1999</p>
          </div>

          <div id="size-chart">
            <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-rust">
              Size Chart
            </h2>
            <table className="mt-6 w-full border-collapse text-center font-mono text-xs font-bold uppercase">
              <thead>
                <tr>
                  {["Size", "Chest", "Length", "Sleeve"].map((heading) => (
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
            <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-wide">* Measurements in cm</p>
          </div>
        </section>

        <section className="bg-ink px-5 py-16 text-bone md:px-8 xl:px-12">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-4xl uppercase leading-none">
              You may also like
            </h2>
            <Link className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-acid hover:text-rust" href="/shop">
              View all
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
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
            className="bg-ink px-9 py-4 font-mono text-xs font-bold uppercase tracking-[0.28em] text-acid transition-colors hover:bg-bone hover:text-ink"
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
      className="group block text-bone"
      href={`/products/${product.slug ?? product.id}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-ink transition-transform duration-300 group-hover:-rotate-1">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="select-none font-display text-7xl uppercase text-acid/15">
            NF
          </span>
        </div>
        <span className="absolute left-3 top-3 z-10 bg-acid px-2 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-ink">
          Exhibit
        </span>
        <Image
          alt={product.alt}
          className="object-contain p-8"
          fill
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 44vw, 90vw"
          src={product.image}
          unoptimized
        />
      </div>
      <h3 className="mt-5 font-display text-xl uppercase leading-tight">{product.name}</h3>
      <p className="mt-2 font-mono text-sm font-bold text-acid"><StorePrice amountUsd={product.price} /></p>
      <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.28em] text-bone/50">
        <span>View file</span>
      </div>
    </Link>
  );
}
