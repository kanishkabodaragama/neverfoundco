"use client";

import Image from "next/image";
import { ChevronDown, Ruler, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode, TouchEvent } from "react";
import { useCart } from "@/components/store/cart-provider";
import { StorePrice } from "@/components/site/StorePrice";
import type { MockProductDetail } from "@/components/site/product-detail-data";
import { isUuid } from "@/lib/ids";
import { getVariantCombinationKey, uniqueVariantValues } from "@/lib/product-variants";

const productGalleryLayoutControls = {
  mainImageSectionOffsetYpx: 14,
  mainImageTopPaddingPx: 100,
  mainImageDesktopTopPaddingPx: 16,
  mainImageXpx: 0,
  mainImageYpx: 0,
  mainImageScale: 1.03,
  thumbnailVisibleCount: 6,
  thumbnailGapPx: 20,
  thumbnailOffsetXpx: 0,
  thumbnailOffsetYpx: -20,
  thumbnailCardPaddingPx: 0,
  // Enlarges the thumbnail card and image together so the image is not cropped.
  thumbnailImageScale: 1.5,
};

// Product title and price controls:
// xPx/yPx move each text element. Font sizes and gaps are in pixels.
const productTextControls = {
  itemGapPx: 20,
  title: {
    xPx: 0,
    yPx: -10,
    mobileFontSizePx: 35,
    desktopFontSizePx: 60,
    lineHeight: 1,
    letterGapPx: 0,
  },
  price: {
    xPx: 0,
    yPx: -10,
    fontFamily: "var(--font-display), Anton, Impact, sans-serif",
    fontWeight: 600,
    mobileFontSizePx: 17.5,
    desktopFontSizePx: 30,
    lineHeight: 1,
    letterGapPx: 0,
  },
};

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

export function ProductDetailClient({ product }: { product: MockProductDetail }) {
  const cart = useCart();
  const [requestedGender, setSelectedGender] = useState(product.genders[0]);
  const [requestedColor, setSelectedColor] = useState(product.colors[0]);
  const [requestedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [carouselPosition, setCarouselPosition] = useState(1);
  const [isCarouselResetting, setIsCarouselResetting] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const mobileThumbnailStrip = useRef<HTMLDivElement | null>(null);
  const carouselTouchStart = useRef<{ x: number; y: number } | null>(null);
  const isCarouselAnimating = useRef(false);
  const availableGenders = useMemo(
    () => uniqueVariantValues(product.variants.map((variant) => variant.gender)),
    [product.variants],
  );
  const selectedGender = availableGenders.includes(requestedGender)
    ? requestedGender
    : availableGenders[0] ?? requestedGender;
  const availableColors = useMemo(
    () =>
      uniqueVariantValues(
        product.variants
          .filter((variant) => variant.gender === selectedGender)
          .map((variant) => variant.color),
      ),
    [product.variants, selectedGender],
  );
  const selectedColor = availableColors.includes(requestedColor)
    ? requestedColor
    : availableColors[0] ?? requestedColor;
  const availableSizes = useMemo(
    () =>
      uniqueVariantValues(
        product.variants
          .filter(
            (variant) =>
              variant.gender === selectedGender && variant.color === selectedColor,
          )
          .map((variant) => variant.size),
      ),
    [product.variants, selectedColor, selectedGender],
  );
  const selectedSize = availableSizes.includes(requestedSize)
    ? requestedSize
    : availableSizes[0] ?? requestedSize;

  const selectedVariant = useMemo(
    () =>
      product.variants.find(
        (variant) =>
          getVariantCombinationKey(variant) ===
          getVariantCombinationKey({
            gender: selectedGender,
            color: selectedColor,
            size: selectedSize,
          }),
      ) ?? null,
    [product.variants, selectedColor, selectedGender, selectedSize],
  );
  const galleryImages = useMemo(
    () =>
      [
        product.image,
        ...product.gallery,
        ...product.variants.map((variant) => variant.image),
      ].filter((image, index, list): image is string => Boolean(image) && list.indexOf(image) === index),
    [product.gallery, product.image, product.variants],
  );
  const displayImage = galleryImages.includes(selectedImage)
    ? selectedImage
    : galleryImages[0] ?? selectedImage;
  const displayPrice = selectedVariant?.price ?? product.price;
  const isAvailable = Boolean(
    selectedVariant &&
      (product.preorderEnabled || !product.stockTrackingEnabled || selectedVariant.stock > 0),
  );
  const displayImageIndex = galleryImages.indexOf(displayImage);
  const activeGalleryIndex = Math.max(0, displayImageIndex);
  const carouselSlides = useMemo(
    () =>
      galleryImages.length > 1
        ? [galleryImages[galleryImages.length - 1], ...galleryImages, galleryImages[0]]
        : galleryImages,
    [galleryImages],
  );
  const displayedCarouselPosition = galleryImages.length > 1 ? carouselPosition : 0;
  const shortDescription = product.shortDescription?.trim();
  const description = product.description?.trim();
  const maxQuantity =
    product.preorderEnabled || !product.stockTrackingEnabled
      ? 20
      : Math.max(1, selectedVariant?.stock ?? 1);
  const selectedQuantity = Math.min(quantity, maxQuantity);

  useEffect(() => {
    const thumbnail = mobileThumbnailStrip.current?.querySelector(
      `[data-gallery-index="${activeGalleryIndex}"]`,
    );

    thumbnail?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [activeGalleryIndex]);

  useEffect(() => {
    if (!isSizeChartOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSizeChartOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isSizeChartOpen]);

  function showGalleryIndex(index: number) {
    if (!galleryImages.length) return;

    const wrappedIndex = ((index % galleryImages.length) + galleryImages.length) % galleryImages.length;
    const image = galleryImages[wrappedIndex];
    if (!image) return;

    setSelectedImage(image);
    isCarouselAnimating.current = false;
    setIsCarouselResetting(false);
    setCarouselPosition(galleryImages.length > 1 ? wrappedIndex + 1 : 0);
  }

  function rotateGallery(direction: 1 | -1) {
    if (galleryImages.length < 2 || isCarouselAnimating.current) return;

    const nextIndex = (activeGalleryIndex + direction + galleryImages.length) % galleryImages.length;
    isCarouselAnimating.current = true;
    setSelectedImage(galleryImages[nextIndex]);
    setIsCarouselResetting(false);
    setCarouselPosition((currentPosition) => currentPosition + direction);
  }

  function selectGalleryImage(image: string, index: number) {
    setSelectedImage(image);
    showGalleryIndex(index);
  }

  function settleLoopedCarousel() {
    if (galleryImages.length < 2) return;

    if (carouselPosition === 0) {
      setIsCarouselResetting(true);
      setCarouselPosition(galleryImages.length);
    } else if (carouselPosition === galleryImages.length + 1) {
      setIsCarouselResetting(true);
      setCarouselPosition(1);
    }

    isCarouselAnimating.current = false;
  }

  function handleCarouselTouchStart(event: TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0];
    if (!touch) return;

    carouselTouchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  }

  function handleCarouselTouchMove(event: TouchEvent<HTMLDivElement>) {
    const start = carouselTouchStart.current;
    const touch = event.touches[0];
    if (!start || !touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault();
    }
  }

  function handleCarouselTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = carouselTouchStart.current;
    const touch = event.changedTouches[0];
    carouselTouchStart.current = null;
    if (!start || !touch || galleryImages.length < 2) return;

    const deltaX = touch.clientX - start.x;
    if (Math.abs(deltaX) < 40) return;

    rotateGallery(deltaX < 0 ? 1 : -1);
  }

  function clampQuantity(value: number) {
    return Math.min(maxQuantity, Math.max(1, value));
  }

  function selectVariantImage(
    nextSelection: Partial<{
      color: string;
      gender: string;
      size: string;
    }>,
  ) {
    const nextGender = nextSelection.gender ?? selectedGender;
    const nextColor = nextSelection.color ?? selectedColor;
    const nextSize = nextSelection.size ?? selectedSize;
    const nextVariant = product.variants.find(
      (variant) =>
        getVariantCombinationKey(variant) ===
        getVariantCombinationKey({
          gender: nextGender,
          color: nextColor,
          size: nextSize,
        }),
    );

    const nextImage = nextVariant?.image || product.image;
    const nextIndex = galleryImages.indexOf(nextImage);

    if (nextIndex >= 0) {
      showGalleryIndex(nextIndex);
    } else {
      setSelectedImage(nextImage);
    }
  }

  function selectGender(gender: MockProductDetail["genders"][number]) {
    setSelectedGender(gender);
    selectVariantImage({ gender });
    setAdded(false);
  }

  function selectColor(color: MockProductDetail["colors"][number]) {
    setSelectedColor(color);
    selectVariantImage({ color });
    setAdded(false);
  }

  function selectSize(size: MockProductDetail["sizes"][number]) {
    setSelectedSize(size);
    selectVariantImage({ size });
    setAdded(false);
  }

  function addSelectedVariant() {
    if (!selectedVariant || !isAvailable) return;

    cart.addItem({
      productId: product.id,
      variantId: isUuid(selectedVariant.id) ? selectedVariant.id : undefined,
      name: product.name,
      slug: product.slug,
      unitPrice: displayPrice,
      image: selectedVariant.image || product.image,
      gender: selectedGender,
      size: selectedSize,
      color: selectedColor,
      quantity: selectedQuantity,
    });
    setAdded(true);
  }

  return (
    <div className="grid w-full gap-6 lg:grid-cols-[55fr_45fr] lg:gap-4 xl:gap-5">
      <div
        className="grid gap-5"
        style={{ marginTop: `${productGalleryLayoutControls.mainImageSectionOffsetYpx}px` }}
      >
        <div
          className="min-h-[430px] touch-pan-y overflow-hidden bg-transparent md:min-h-[610px]"
          onTouchEnd={handleCarouselTouchEnd}
          onTouchMove={handleCarouselTouchMove}
          onTouchStart={handleCarouselTouchStart}
        >
          <div
            className={`flex ${
              isCarouselResetting ? "" : "transition-transform duration-300 ease-out"
            }`}
            onTransitionEnd={settleLoopedCarousel}
            style={{ transform: `translate3d(-${displayedCarouselPosition * 100}%, 0, 0)` }}
          >
            {carouselSlides.map((image, index) => (
              <div
                className="relative min-h-[430px] min-w-full touch-pan-y overflow-hidden md:min-h-[610px]"
                key={`${image}-${index}`}
              >
                <Image
                  alt={product.alt}
                  className="object-contain px-3 pb-3 pt-[var(--main-product-image-top-padding)] md:px-4 md:pb-4 md:pt-[var(--main-product-image-desktop-top-padding)]"
                  draggable={false}
                  fill
                  priority={index === 1}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  src={image}
                  style={
                    {
                      "--main-product-image-desktop-top-padding": `${productGalleryLayoutControls.mainImageDesktopTopPaddingPx}px`,
                      "--main-product-image-top-padding": `${productGalleryLayoutControls.mainImageTopPaddingPx}px`,
                      transform: `translate(${productGalleryLayoutControls.mainImageXpx}px, ${productGalleryLayoutControls.mainImageYpx}px) scale(${productGalleryLayoutControls.mainImageScale})`,
                    } as CSSProperties
                  }
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>

        <div
          className="no-scrollbar grid touch-pan-x grid-flow-col justify-start overflow-x-auto overscroll-x-contain scroll-smooth px-0"
          ref={mobileThumbnailStrip}
          style={{
            gap: `${productGalleryLayoutControls.thumbnailGapPx}px`,
            gridAutoColumns: `calc(${
              (100 / productGalleryLayoutControls.thumbnailVisibleCount) *
              productGalleryLayoutControls.thumbnailImageScale
            }% - ${
              (((productGalleryLayoutControls.thumbnailVisibleCount - 1) *
                productGalleryLayoutControls.thumbnailGapPx) /
                productGalleryLayoutControls.thumbnailVisibleCount) *
              productGalleryLayoutControls.thumbnailImageScale
            }px)`,
            marginTop: `${productGalleryLayoutControls.thumbnailOffsetYpx}px`,
            transform: `translateX(${productGalleryLayoutControls.thumbnailOffsetXpx}px)`,
          }}
        >
          {galleryImages.map((image, index) => (
            <GalleryThumb
              image={image}
              index={index}
              isSelected={image === displayImage}
              key={`${image}-${index}`}
              onClick={() => selectGalleryImage(image, index)}
              productName={product.name}
              showSelectedBorder={galleryImages.length > 1}
            />
          ))}
        </div>
      </div>

      <div
        className="flex flex-col items-start justify-start text-left"
        style={{ rowGap: `${productTextControls.itemGapPx}px` }}
      >
        <h1
          className="max-w-xl font-display italic uppercase"
          style={{
            fontSize: `clamp(${productTextControls.title.mobileFontSizePx}px, 8vw, ${productTextControls.title.desktopFontSizePx}px)`,
            letterSpacing: `${productTextControls.title.letterGapPx}px`,
            lineHeight: productTextControls.title.lineHeight,
            marginLeft: `${productTextControls.title.xPx}px`,
            marginTop: `${productTextControls.title.yPx}px`,
          }}
        >
          {product.name}
        </h1>
        <p
          className="uppercase text-ink"
          style={{
            fontFamily: productTextControls.price.fontFamily,
            fontSize: `clamp(${productTextControls.price.mobileFontSizePx}px, 4vw, ${productTextControls.price.desktopFontSizePx}px)`,
            fontWeight: productTextControls.price.fontWeight,
            letterSpacing: `${productTextControls.price.letterGapPx}px`,
            lineHeight: productTextControls.price.lineHeight,
            marginLeft: `${productTextControls.price.xPx}px`,
            marginTop: `${productTextControls.price.yPx}px`,
          }}
        >
          <StorePrice amountUsd={displayPrice} />
        </p>
        {shortDescription ? (
          <p className="max-w-md whitespace-pre-line text-sm font-semibold italic leading-relaxed text-ink/70">
            {shortDescription}
          </p>
        ) : null}

        <div
          className="w-full"
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: `${productTextControls.itemGapPx}px`,
          }}
        >
          {availableGenders.length > 1 ? (
            <OptionGroup label="Gender">
              {availableGenders.map((gender) => (
                <OptionButton
                  key={gender}
                  onClick={() => selectGender(gender)}
                  selected={gender === selectedGender}
                >
                  {gender}
                </OptionButton>
              ))}
            </OptionGroup>
          ) : null}

          <OptionGroup label="Color">
            {availableColors.map((color) => (
              <ColorOptionButton
                colorName={color}
                colorValue={product.colorSwatches[color] ?? color}
                key={color}
                onClick={() => selectColor(color)}
                selected={color === selectedColor}
              >
                {color}
              </ColorOptionButton>
            ))}
          </OptionGroup>

          <OptionGroup
            label="Size"
            action={
              <button
                className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-normal underline decoration-ink/60 underline-offset-4 transition-colors hover:text-rust"
                onClick={() => setIsSizeChartOpen(true)}
                type="button"
              >
                <Ruler className="h-4 w-4" />
                Size Guide
              </button>
            }
          >
            {availableSizes.map((size) => (
              <OptionButton
                key={size}
                onClick={() => selectSize(size)}
                selected={size === selectedSize}
              >
                {size}
              </OptionButton>
            ))}
          </OptionGroup>

          {!selectedVariant ? (
            <p className="text-sm font-black uppercase text-rust">
              This combination is not available.
            </p>
          ) : null}

          <OptionGroup label="Quantity">
            <div className="relative w-36">
              <select
                className="h-11 w-full appearance-none rounded-full border-2 border-ink bg-transparent px-5 font-sans text-sm text-ink"
                onChange={(event) => {
                  setQuantity(clampQuantity(Number(event.target.value)));
                  setAdded(false);
                }}
                value={selectedQuantity}
              >
                {Array.from(
                  {
                    length: maxQuantity,
                  },
                  (_, index) => index + 1,
                ).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2" />
            </div>
          </OptionGroup>

          <button
            className="flex h-12 w-full items-center justify-center gap-3 rounded-full bg-ink px-6 py-2 font-sans text-xs font-black italic uppercase tracking-[0.08em] text-bone transition-colors hover:bg-rust hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!isAvailable}
            onClick={addSelectedVariant}
            type="button"
          >
            {!selectedVariant
              ? "Unavailable"
              : !isAvailable
                ? "Sold Out"
                : added
                  ? "Added To Cart"
                  : "Add To Cart"}
          </button>

          {description ? (
            <section className="pt-8 text-left">
              <h2 className="font-sans text-2xl font-black italic uppercase tracking-normal text-ink">
                Description
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm font-medium italic leading-relaxed text-ink/75">
                {description}
              </p>
            </section>
          ) : null}
        </div>
      </div>
      {isSizeChartOpen ? <SizeChartModal onClose={() => setIsSizeChartOpen(false)} /> : null}
    </div>
  );
}

function SizeChartModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/80 px-4 py-6 text-ink"
      role="dialog"
    >
      <button
        aria-label="Close size chart"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        type="button"
      />
      <div className="relative z-10 max-h-full w-full max-w-3xl overflow-auto border-2 border-ink bg-acid p-5 shadow-[8px_8px_0_#111] sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-rust">
            Size Chart
          </h2>
          <button
            aria-label="Close size chart"
            className="grid h-10 w-10 place-items-center border border-ink text-ink transition-colors hover:bg-ink hover:text-acid"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[540px] table-fixed border-collapse text-center font-mono text-[10px] font-bold uppercase sm:text-xs">
            <thead>
              <tr>
                <th className="sticky left-0 z-20 border border-ink bg-acid px-1.5 py-3 text-left uppercase sm:px-3">
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
                  <th className="sticky left-0 z-10 border border-ink bg-acid px-1.5 py-3 text-left uppercase sm:px-3">
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
        <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-wide">
          * Measurements in inches
        </p>
      </div>
    </div>
  );
}

function GalleryThumb({
  image,
  index,
  isSelected,
  onClick,
  productName,
  showSelectedBorder,
}: {
  image: string;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  productName: string;
  showSelectedBorder: boolean;
}) {
  return (
    <button
      aria-label={`View product image ${index + 1}`}
      className={`relative aspect-square w-full min-w-0 bg-transparent ${
        isSelected && showSelectedBorder
          ? "border-2 border-rust"
          : "border border-transparent"
      }`}
      data-gallery-index={index}
      onClick={onClick}
      type="button"
    >
      <Image
        alt={`${productName} thumbnail ${index + 1}`}
        className="object-contain"
        fill
        sizes="96px"
        src={image}
        style={{
          padding: `${productGalleryLayoutControls.thumbnailCardPaddingPx}px`,
        }}
        unoptimized
      />
    </button>
  );
}

function OptionGroup({
  action,
  children,
  label,
}: {
  action?: ReactNode;
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="text-left">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[13px] font-black uppercase tracking-normal">{label}</p>
        {action}
      </div>
      <div className="mt-3 flex flex-wrap justify-start gap-3">{children}</div>
    </div>
  );
}

function OptionButton({
  children,
  onClick,
  selected,
}: {
  children: ReactNode;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <button
      className={`min-w-[4.5rem] rounded-full border-2 px-5 py-2 font-sans text-sm font-medium transition ${
        selected
          ? "border-ink bg-ink text-bone"
          : "border-ink/35 bg-transparent text-ink hover:border-ink"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function ColorOptionButton({
  children,
  colorName,
  colorValue,
  onClick,
  selected,
}: {
  children: ReactNode;
  colorName: string;
  colorValue: string;
  onClick: () => void;
  selected: boolean;
}) {
  const isLightColor = isLightVariantColor(colorValue, colorName);

  return (
    <button
      className="min-w-20 rounded-full border-2 px-5 py-2 font-sans text-sm font-medium transition hover:opacity-80"
      onClick={onClick}
      style={{
        backgroundColor: selected ? colorValue : "transparent",
        borderColor: colorValue,
        color: isLightColor ? "#0a0a0a" : selected ? "#f5f3ec" : colorValue,
      }}
      type="button"
    >
      {children}
    </button>
  );
}

function isLightVariantColor(colorValue: string, colorName: string) {
  const namedColor = `${colorName} ${colorValue}`.toLowerCase();
  if (
    /white|cream|ivory|bone|natural|beige|oat|ecru|pearl|ash|light|grey|gray/.test(
      namedColor,
    )
  ) {
    return true;
  }

  const hex = colorValue.trim().match(/^#?([a-f\d]{3}|[a-f\d]{6})$/i)?.[1];
  if (hex) {
    const fullHex =
      hex.length === 3
        ? hex
            .split("")
            .map((char) => char + char)
            .join("")
        : hex;
    const red = parseInt(fullHex.slice(0, 2), 16);
    const green = parseInt(fullHex.slice(2, 4), 16);
    const blue = parseInt(fullHex.slice(4, 6), 16);

    return getRelativeLuminance(red, green, blue) > 0.62;
  }

  const rgb = colorValue.match(
    /^rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})/i,
  );
  if (rgb) {
    return getRelativeLuminance(Number(rgb[1]), Number(rgb[2]), Number(rgb[3])) > 0.62;
  }

  return false;
}

function getRelativeLuminance(red: number, green: number, blue: number) {
  return (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
}
