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
    <div className="min-h-screen w-full bg-[#F7F1E6] text-[#10131A]">
      <SiteHeader active="shop" />
      <main>
        <section className="bg-[#F7F1E6] px-5 py-8 md:px-8 xl:px-12">
          <nav
            aria-label="Breadcrumb"
            className="font-pixel flex flex-wrap items-center gap-3 text-[11px] uppercase"
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

        <section className="grid w-full gap-8 border-t border-[#B8A8E8] bg-[#F7F1E6] px-5 py-9 md:px-8 lg:grid-cols-[1fr_0.8fr_1fr] xl:px-12">
          <div>
            <h2 className="font-pixel text-xs uppercase text-[#8F7BD5]">
              {"// Product Details"}
            </h2>
            <ul className="mt-6 space-y-3 text-sm font-bold">
              {detailBullets.map((detail) => (
                <li className="flex gap-4" key={detail}>
                  <span className="text-[#8F7BD5]">✣</span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center justify-center py-8 text-[#8F7BD5]">
            <span className="text-8xl leading-none">✥</span>
            <p className="font-pixel mt-5 text-xs uppercase">NF-1999</p>
          </div>

          <div id="size-chart">
            <h2 className="font-pixel text-xs uppercase text-[#8F7BD5]">
              {"// Size Chart"}
            </h2>
            <table className="mt-6 w-full border-collapse text-center text-sm font-bold">
              <thead>
                <tr>
                  {["Size", "Chest", "Length", "Sleeve"].map((heading) => (
                    <th className="border border-[#10131A] px-3 py-3 uppercase" key={heading}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizeRows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell) => (
                      <td className="border border-[#10131A] px-3 py-3" key={cell}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-xs font-black uppercase">* Measurements in cm</p>
          </div>
        </section>

        <section className="bg-[#070B12] px-5 py-10 text-[#FFF9EF] md:px-8 xl:px-12">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-pixel text-sm uppercase">
              <span className="pixel-blink mr-3 text-[#B8A8E8]">▣</span>
              You may also like
            </h2>
            <Link className="font-pixel text-xs uppercase hover:text-[#F05267]" href="/shop">
              View all ›
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((item) => (
              <RelatedProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>

        <section className="grid w-full items-center gap-6 bg-[#B8A8E8] px-5 py-8 text-[#10131A] md:grid-cols-[1fr_1.2fr_auto] md:px-8 xl:px-12">
          <div className="flex items-center gap-5">
            <span className="text-4xl">✉</span>
            <div>
              <h2 className="font-pixel text-sm uppercase">Stay in the loop.</h2>
              <p className="mt-2 text-sm font-bold">
                New drops. Secret locations. No spam.
              </p>
            </div>
          </div>
          <input
            aria-label="Email address"
            className="w-full border border-[#FFF9EF] bg-transparent px-5 py-4 text-sm font-black uppercase outline-none placeholder:text-[#10131A]"
            placeholder="Your email"
            type="email"
          />
          <button
            className="pixel-edge bg-[#F05267] px-9 py-4 text-sm font-black uppercase text-[#FFF9EF] transition hover:translate-x-0.5"
            type="button"
          >
            Join ›
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
      className="group block bg-[#FFF9EF] p-5 text-[#10131A] transition hover:-translate-y-1"
      href={`/products/${product.slug ?? product.id}`}
    >
      <div className="relative aspect-square">
        <span className="absolute left-0 top-0 z-10 bg-[#B8A8E8] px-3 py-1 text-xs font-black uppercase">
          New
        </span>
        <Image
          alt={product.alt}
          className="object-contain p-8"
          fill
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 44vw, 90vw"
          src={product.image}
        />
      </div>
      <h3 className="font-pixel mt-5 text-sm uppercase">{product.name}</h3>
      <p className="mt-3 font-black"><StorePrice amountUsd={product.price} /></p>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-[#F05267]">♥♥♥</span>
        <span>→</span>
      </div>
    </Link>
  );
}
