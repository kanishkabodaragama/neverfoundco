import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { NvrFndGallery } from "@/components/site/NvrFndGallery";
import { StoreArtSurface } from "@/components/site/StoreArtSurface";
import { StorePrice } from "@/components/site/StorePrice";
import { listStorefrontGalleryImages } from "@/lib/db/storefront-gallery";
import { shopProducts, type ShopProduct } from "@/components/site/shop-data";

// Home product section top padding control:
// topPaddingPx adds space inside the product section without pushing the background overlay down.
const homeProductSectionControl = {
  topPaddingPx: 60,
};

// Home product card info controls:
// xPx/yPx move the title and price together.
const homeProductCardInfoControl = {
  xPx: 0,
  yPx: -35,
};

// Home product card price controls:
// xPx/yPx move only the price, fontSizePx changes only its font size.
const homeProductCardPriceControl = {
  xPx: 0,
  yPx: -5,
  fontSizePx: 14,
};

// Home gallery controls:
// galleryAspectRatio sets the gallery image W:H ratio while keeping the current width.
const homeGalleryControl = {
  galleryAspectRatio: "1 / 1.27",
  visibleSlides: 3.3,
};

export async function NeverFoundHomePage({
  productLimit = 4,
  products = shopProducts,
  showSoldOut = false,
}: {
  productLimit?: number;
  products?: ShopProduct[];
  showSoldOut?: boolean;
}) {
  const availableProducts = showSoldOut
    ? products
    : products.filter((product) => !product.soldOut);
  const featuredProducts =
    productLimit > 0 ? availableProducts.slice(0, productLimit) : availableProducts;
  const galleryImages = (await listStorefrontGalleryImages()).map((image, index) => ({
    alt: image.alt_text ?? `Never Found gallery image ${index + 1}`,
    src: image.image_url,
  }));

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-ink text-ink">
      <Header />
      <StoreArtSurface homeGraffiTexture>
        <section
          className="bg-acid px-5 pb-12 pt-[calc(1.5rem+var(--home-product-top-padding))] text-ink md:px-8 md:pb-20 md:pt-[calc(4rem+var(--home-product-top-padding))]"
          style={
            {
              "--home-product-top-padding": `${homeProductSectionControl.topPaddingPx}px`,
            } as CSSProperties
          }
        >
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
        <NvrFndGallery
          images={galleryImages}
          slideAspectRatio={homeGalleryControl.galleryAspectRatio}
          visibleSlides={homeGalleryControl.visibleSlides}
        />
      </StoreArtSurface>
      <Footer graffiTexture />
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
          quality={100}
          sizes="(min-width: 768px) 45vw, 50vw"
          src={product.image}
        />
        {product.soldOut ? (
          <span className="absolute right-1 top-1 z-10 bg-rust px-2 py-1 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-bone sm:right-2 sm:top-2 sm:text-[10px]">
            Sold out
          </span>
        ) : null}
      </div>

      <div
        className="mt-0.5 flex flex-col items-center gap-1 text-center md:mt-1 lg:items-center lg:text-center"
        style={{
          transform: `translate(${homeProductCardInfoControl.xPx}px, ${homeProductCardInfoControl.yPx}px)`,
        }}
      >
        <div>
          <h3 className="font-display text-base italic uppercase leading-tight sm:text-xl">{product.name}</h3>
        </div>
        <div
          className="shrink-0 text-center"
          style={{
            transform: `translate(${homeProductCardPriceControl.xPx}px, ${homeProductCardPriceControl.yPx}px)`,
          }}
        >
          <div
            className="font-display uppercase leading-tight"
            style={{ fontSize: `${homeProductCardPriceControl.fontSizePx}px` }}
          >
            <StorePrice amountLkr={product.price} />
          </div>
        </div>
      </div>
    </Link>
  );
}
