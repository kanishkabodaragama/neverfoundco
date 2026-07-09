"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { CSSProperties, UIEvent } from "react";
import { StorePrice } from "@/components/site/StorePrice";
import type { ShopProduct } from "@/components/site/shop-data";

type RecommendationTextAlignment = "left" | "center" | "right" | "justify";

// "You may also like" title controls:
// fontSizePx changes the title size.
// textAlignment words: "left", "center", "right", "justify".
// xPx moves the title horizontally: 0 = original, negative = left, positive = right.
const youMayAlsoLikeTitleControl: {
  fontSizePx: number;
  textAlignment: RecommendationTextAlignment;
  xPx: number;
} = {
  fontSizePx: 56,
  textAlignment: "left",
  xPx: 0,
};

// Recommendation card layout controls:
// columnGapPx changes the horizontal gap between every product card.
const recommendationCardLayoutControl = {
  columnGapPx: 20,
};

export function ProductRecommendations({
  products,
}: {
  products: ShopProduct[];
}) {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const isLoopingSlider = useRef(false);
  if (!products.length) return null;

  const usesSlider = products.length > 2;

  function getCurrentSliderIndex() {
    const node = sliderRef.current;
    const slide = node?.querySelector<HTMLElement>("[data-recommendation-slide]");
    if (!node || !slide) return 0;

    return Math.round(
      node.scrollLeft /
        (slide.offsetWidth + recommendationCardLayoutControl.columnGapPx),
    );
  }

  function scrollSliderTo(index: number, behavior: ScrollBehavior = "smooth") {
    const node = sliderRef.current;
    const slide = node?.querySelector<HTMLElement>("[data-recommendation-slide]");
    if (!node || !slide) return;

    const wrappedIndex = ((index % products.length) + products.length) % products.length;
    node.scrollTo({
      left:
        (slide.offsetWidth + recommendationCardLayoutControl.columnGapPx) *
        wrappedIndex,
      behavior,
    });
  }

  function loopSliderAtScrollEnd(event: UIEvent<HTMLDivElement>) {
    if (!usesSlider || isLoopingSlider.current || products.length < 2) return;

    const node = event.currentTarget;
    const maxScrollLeft = node.scrollWidth - node.clientWidth;
    if (maxScrollLeft <= 0) return;

    if (node.scrollLeft >= maxScrollLeft - 1) {
      isLoopingSlider.current = true;
      requestAnimationFrame(() => {
        scrollSliderTo(0);
        window.setTimeout(() => {
          isLoopingSlider.current = false;
        }, 300);
      });
    }
  }

  function loopSliderOnEdgeSwipe(endX: number) {
    const startX = touchStartX.current;
    touchStartX.current = null;
    if (!usesSlider || startX === null || products.length < 2) return;

    const deltaX = endX - startX;
    if (Math.abs(deltaX) < 40) return;

    const index = getCurrentSliderIndex();
    if (deltaX < 0 && index >= products.length - 1) {
      scrollSliderTo(0);
    } else if (deltaX > 0 && index <= 0) {
      scrollSliderTo(products.length - 1);
    }
  }

  function navigateRecommendationSlider(direction: -1 | 1) {
    const currentIndex = getCurrentSliderIndex();
    const lastDesktopStartIndex = Math.max(0, products.length - 4);

    if (direction === 1 && currentIndex >= lastDesktopStartIndex) {
      scrollSliderTo(0);
      return;
    }

    if (direction === -1 && currentIndex <= 0) {
      scrollSliderTo(lastDesktopStartIndex);
      return;
    }

    scrollSliderTo(currentIndex + direction);
  }

  return (
    <section className="bg-acid px-5 py-10 text-ink md:px-8 md:py-14 xl:px-12">
      <div className="flex items-center justify-between gap-4">
        <h2
          className="font-display uppercase leading-none"
          style={{
            fontSize: `${youMayAlsoLikeTitleControl.fontSizePx}px`,
            textAlign: youMayAlsoLikeTitleControl.textAlignment,
            transform: `translateX(${youMayAlsoLikeTitleControl.xPx}px)`,
            width: "100%",
          }}
        >
          You may also like
        </h2>
        <Link
          className="shrink-0 font-mono text-xs font-bold uppercase tracking-[0.28em] text-rust hover:text-ink"
          href="/shop"
        >
          View all
        </Link>
      </div>

      <div className="relative">
        <div
          className={
            usesSlider
              ? "no-scrollbar mt-8 flex touch-pan-x snap-x snap-mandatory overflow-x-auto scroll-smooth"
              : "mt-8 grid gap-y-10"
          }
          onScroll={loopSliderAtScrollEnd}
          onTouchEnd={(event) => loopSliderOnEdgeSwipe(event.changedTouches[0]?.clientX ?? 0)}
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          ref={sliderRef}
          style={
            {
              "--recommendation-column-gap": `${recommendationCardLayoutControl.columnGapPx}px`,
              columnGap: `${recommendationCardLayoutControl.columnGapPx}px`,
              ...(usesSlider
                ? {}
                : {
                    gridTemplateColumns: `repeat(${products.length}, minmax(0, 1fr))`,
                  }),
            } as CSSProperties
          }
        >
          {products.map((product) => (
            <RelatedProductCard
              key={product.id}
              product={product}
              usesSlider={usesSlider}
            />
          ))}
        </div>
        {products.length > 4 ? (
          <>
            <button
              aria-label="Previous recommended product"
              className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ink/80 text-bone transition hover:bg-ink lg:grid"
              onClick={() => navigateRecommendationSlider(-1)}
              type="button"
            >
              <ChevronLeft aria-hidden="true" className="h-6 w-6" />
            </button>
            <button
              aria-label="Next recommended product"
              className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ink/80 text-bone transition hover:bg-ink lg:grid"
              onClick={() => navigateRecommendationSlider(1)}
              type="button"
            >
              <ChevronRight aria-hidden="true" className="h-6 w-6" />
            </button>
          </>
        ) : null}
      </div>
    </section>
  );
}

function RelatedProductCard({
  product,
  usesSlider,
}: {
  product: ShopProduct;
  usesSlider: boolean;
}) {
  const previewImages = [
    product.image,
    ...product.gallery,
    ...product.variants.map((variant) => variant.image),
  ].filter((image, index, list): image is string => Boolean(image) && list.indexOf(image) === index);

  return (
    <Link
      className={`group block snap-start text-center text-ink md:text-left ${
        usesSlider ? "recommendation-slider-card shrink-0" : ""
      }`}
      data-recommendation-slide
      href={`/products/${product.slug ?? product.id}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-transparent">
        <Image
          alt={product.alt}
          className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.03] sm:p-6 md:p-7"
          fill
          sizes={usesSlider ? "50vw" : "(min-width: 768px) 45vw, 100vw"}
          src={product.image}
          unoptimized
        />
      </div>
      {previewImages.length > 1 ? (
        <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
          {previewImages.slice(0, 5).map((image, index) => (
            <span
              className="relative h-12 w-12 shrink-0 bg-transparent"
              key={`${product.id}-${image}-${index}`}
            >
              <Image
                alt=""
                aria-hidden="true"
                className="object-contain"
                fill
                sizes="48px"
                src={image}
                unoptimized
              />
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-1 flex flex-col items-center gap-1 text-center md:flex-row md:items-start md:justify-between md:text-left">
        <div>
          <h3 className="font-display text-xl uppercase leading-none">{product.name}</h3>
          <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink/55">
            {product.colors.length} color{product.colors.length === 1 ? "" : "s"} /{" "}
            {product.sizes.length} size{product.sizes.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="shrink-0 font-display text-xl uppercase leading-none md:pl-3 md:text-right">
          <StorePrice amountUsd={product.price} />
        </div>
      </div>
    </Link>
  );
}
