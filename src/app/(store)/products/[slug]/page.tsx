import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { Footer } from "@/components/site/Footer";
import { ProductDetailClient } from "@/components/site/ProductDetailClient";
import { ProductRecommendations } from "@/components/site/ProductRecommendations";
import { StoreArtSurface } from "@/components/site/StoreArtSurface";
import {
  getProductDetailBySlug,
  type MockProductDetail,
} from "@/components/site/product-detail-data";
import { mapDbProductToShopProduct, shopProducts, type ShopProduct } from "@/components/site/shop-data";
import { SiteHeader } from "@/components/site/Header";
import { listActiveProducts } from "@/lib/db/products";
import { getProductRecommendationsEnabled } from "@/lib/db/site-settings";

const sizeRows = [
  ["S", "17", "26.5", "19.5", "8.5"],
  ["M", "20", "27.5", "21", "9"],
  ["L", "21", "28.5", "22", "9.5"],
  ["XL", "22", "29.5", "23", "10"],
  ["2XL", "23", "29.5", "24", "11.5"],
];

const sizeMeasurements = [
  { label: "Shoulder", values: sizeRows.map((row) => row[1]) },
  { label: "Height", values: sizeRows.map((row) => row[2]) },
  { label: "Chest", values: sizeRows.map((row) => row[3]) },
  { label: "Sleeve", values: sizeRows.map((row) => row[4]) },
];

const productPageLayoutControls = {
  topSpacingPx: 12,
};

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
    description: product.shortDescription ?? product.name,
    openGraph: {
      title: `${product.name} | Never Found Co`,
      description: product.shortDescription ?? product.name,
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

  const [dbProducts, recommendationsEnabled] = await Promise.all([
    listActiveProducts(),
    getProductRecommendationsEnabled(),
  ]);
  const relatedProducts = dbProducts.length ? dbProducts.map(mapDbProductToShopProduct) : shopProducts;

  return (
    <NeverFoundProductPage
      product={product}
      recommendationsEnabled={recommendationsEnabled}
      relatedProducts={relatedProducts}
    />
  );
}

function NeverFoundProductPage({
  product,
  recommendationsEnabled,
  relatedProducts,
}: {
  product: MockProductDetail;
  recommendationsEnabled: boolean;
  relatedProducts: ShopProduct[];
}) {
  const related = relatedProducts
    .filter((item) => !item.soldOut && (item.slug ?? item.id) !== product.slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen w-full bg-acid text-ink">
      <SiteHeader active="shop" />
      <StoreArtSurface productTexture>
        <section
          className="bg-acid px-5 pb-8 pt-[var(--product-page-top-spacing)] md:px-8 md:pb-10 xl:px-12"
          style={
            {
              "--product-page-top-spacing": `${productPageLayoutControls.topSpacingPx}px`,
            } as CSSProperties
          }
        >
          <ProductDetailClient product={product} />
        </section>

        {recommendationsEnabled ? <ProductRecommendations products={related} /> : null}

        <section className="w-full bg-acid px-5 py-8 md:px-8 xl:px-12">
          <div id="size-chart" className="mx-auto max-w-3xl scroll-mt-32 md:scroll-mt-36">
            <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-rust">
              Size Chart
            </h2>
            <div className="mt-6">
              <table className="w-full table-fixed border-collapse text-center font-mono text-[10px] font-bold uppercase sm:text-xs">
                <thead>
                  <tr>
                    <th className="border border-ink px-1.5 py-3 text-left uppercase sm:px-3">
                      Measure
                    </th>
                    {sizeRows.map(([size]) => (
                      <th className="border border-ink px-1.5 py-3 uppercase sm:px-3" key={size}>
                        {size}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizeMeasurements.map((measurement) => (
                    <tr key={measurement.label}>
                      <th className="border border-ink px-1.5 py-3 text-left uppercase sm:px-3">
                        {measurement.label}
                      </th>
                      {measurement.values.map((value, index) => (
                        <td
                          className="border border-ink px-1.5 py-3 sm:px-3"
                          key={`${measurement.label}-${sizeRows[index][0]}`}
                        >
                          {value}
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
      </StoreArtSurface>
      <Footer />
    </div>
  );
}
