import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { Footer } from "@/components/site/Footer";
import { NvrFndGallery } from "@/components/site/NvrFndGallery";
import { ProductDetailClient } from "@/components/site/ProductDetailClient";
import { StoreArtSurface } from "@/components/site/StoreArtSurface";
import {
  getProductDetailBySlug,
  type MockProductDetail,
} from "@/components/site/product-detail-data";
import { SiteHeader } from "@/components/site/Header";
import { getProductRecommendationsEnabled } from "@/lib/db/site-settings";
import { listStorefrontYouMayAlsoLikeItems } from "@/lib/db/you-may-also-like";

const productPageLayoutControls = {
  topSpacingPx: 12,
};

// You May Also Like title controls:
// xPx/yPx move the title. fontSizeVw changes its responsive font size.
const youMayAlsoLikeTitleControl = {
  xPx: -40,
  yPx: 6,
  fontSizeVw: 14.50,
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

  const [recommendationItems, recommendationsEnabled] = await Promise.all([
    listStorefrontYouMayAlsoLikeItems(),
    getProductRecommendationsEnabled(),
  ]);

  return (
    <NeverFoundProductPage
      product={product}
      recommendationItems={recommendationItems}
      recommendationsEnabled={recommendationsEnabled}
    />
  );
}

function NeverFoundProductPage({
  product,
  recommendationItems,
  recommendationsEnabled,
}: {
  product: MockProductDetail;
  recommendationItems: Awaited<ReturnType<typeof listStorefrontYouMayAlsoLikeItems>>;
  recommendationsEnabled: boolean;
}) {
  const relatedGalleryImages = recommendationItems.map((item) => ({
    alt: item.products?.name ?? "You May Also Like product",
    href: item.products?.slug ? `/products/${item.products.slug}` : "/shop",
    src: item.image_url,
  }));

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

        {recommendationsEnabled && relatedGalleryImages.length ? (
          <NvrFndGallery
            images={relatedGalleryImages}
            lightbox={false}
            slideAspectRatio="1.18 / 1"
            title="YOU MAY ALSO LIKE"
            titleFontSizeVw={youMayAlsoLikeTitleControl.fontSizeVw}
            titleXpx={youMayAlsoLikeTitleControl.xPx}
            titleYpx={youMayAlsoLikeTitleControl.yPx}
            visibleSlides={4}
          />
        ) : null}
      </StoreArtSurface>
      <Footer />
    </div>
  );
}
