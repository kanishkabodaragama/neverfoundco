"use client";

import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useCart } from "@/components/store/cart-provider";
import { StorePrice } from "@/components/site/StorePrice";
import type { MockProductDetail } from "@/components/site/product-detail-data";
import { getVariantCombinationKey, uniqueVariantValues } from "@/lib/product-variants";

export function ProductDetailClient({ product }: { product: MockProductDetail }) {
  const cart = useCart();
  const [requestedGender, setSelectedGender] = useState(product.genders[0]);
  const [requestedColor, setSelectedColor] = useState(product.colors[0]);
  const [requestedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [galleryStart, setGalleryStart] = useState(0);
  const [added, setAdded] = useState(false);
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
  const displayImage = selectedVariant?.image ?? selectedImage;
  const displayPrice = selectedVariant?.price ?? product.price;
  const isAvailable = Boolean(
    selectedVariant &&
      (product.preorderEnabled || !product.stockTrackingEnabled || selectedVariant.stock > 0),
  );
  const maxGalleryStart = Math.max(0, product.gallery.length - 4);
  const displayImageIndex = product.gallery.indexOf(displayImage);
  const effectiveGalleryStart =
    displayImageIndex >= 0 &&
    (displayImageIndex < galleryStart || displayImageIndex >= galleryStart + 4)
      ? Math.min(Math.max(0, displayImageIndex), maxGalleryStart)
      : galleryStart;
  const visibleGallery = product.gallery.slice(effectiveGalleryStart, effectiveGalleryStart + 4);

  function moveGallery(direction: -1 | 1) {
    setGalleryStart(
      Math.min(maxGalleryStart, Math.max(0, effectiveGalleryStart + direction)),
    );
  }

  function selectGender(gender: MockProductDetail["genders"][number]) {
    setSelectedGender(gender);
    setAdded(false);
  }

  function selectColor(color: MockProductDetail["colors"][number]) {
    setSelectedColor(color);
    setAdded(false);
  }

  function selectSize(size: MockProductDetail["sizes"][number]) {
    setSelectedSize(size);
    setAdded(false);
  }

  function addSelectedVariant() {
    if (!selectedVariant || !isAvailable) return;

    cart.addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      slug: product.slug,
      unitPrice: displayPrice,
      image: displayImage,
      gender: selectedGender,
      size: selectedSize,
      color: selectedColor,
    });
    setAdded(true);
  }

  return (
    <div className="mt-8 grid w-full gap-6 lg:grid-cols-[55fr_45fr] lg:gap-4 xl:gap-5">
      <div className="grid gap-5 md:grid-cols-[96px_1fr]">
        <div className="order-2 grid gap-3 md:order-1">
          <button
            aria-label="Previous product images"
            className="hidden h-9 w-24 place-items-center border border-ink/20 bg-transparent disabled:cursor-not-allowed disabled:opacity-35 md:grid"
            disabled={effectiveGalleryStart === 0}
            onClick={() => moveGallery(-1)}
            type="button"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
          <div className="flex gap-4 overflow-x-auto md:grid md:max-h-[432px] md:overflow-hidden">
          {visibleGallery.map((image, index) => (
            <button
              aria-label={`View product image ${effectiveGalleryStart + index + 1}`}
              className={`relative h-24 w-24 shrink-0 bg-transparent ${
                image === displayImage ? "border-2 border-rust" : "border border-ink/15"
              }`}
              key={`${image}-${effectiveGalleryStart + index}`}
              onClick={() => setSelectedImage(image)}
              type="button"
            >
              <Image
                alt={`${product.name} thumbnail ${index + 1}`}
                className="object-contain p-2"
                fill
                sizes="96px"
                src={image}
                unoptimized
              />
            </button>
          ))}
          </div>
          <button
            aria-label="Next product images"
            className="hidden h-9 w-24 place-items-center border border-ink/20 bg-transparent disabled:cursor-not-allowed disabled:opacity-35 md:grid"
            disabled={effectiveGalleryStart >= maxGalleryStart}
            onClick={() => moveGallery(1)}
            type="button"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        <div className="relative order-1 min-h-[430px] bg-transparent md:order-2 lg:min-h-[610px]">
          <Image
            alt={product.alt}
            className="scale-[1.03] object-contain p-3 md:scale-[0.98] md:p-4"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            src={displayImage}
            unoptimized
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center lg:items-start lg:text-left">
        <span className="w-fit bg-acid px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-ink">
          {product.stockLabel}
        </span>
        <h1 className="mt-6 max-w-xl font-display text-5xl uppercase leading-none md:text-7xl">
          {product.name}
        </h1>
        <p className="mt-5 font-mono text-2xl font-bold uppercase text-rust">
          <StorePrice amountUsd={displayPrice} />
        </p>
        <p className="mt-6 max-w-md whitespace-pre-line text-sm font-semibold leading-relaxed text-ink/70">
          {product.shortDescription}
        </p>

        <div className="my-7 h-px w-full bg-acid" />

        <div className="w-full space-y-6">
          <OptionGroup label={`Gender: ${selectedGender}`}>
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

          <OptionGroup label={`Color: ${selectedColor}`}>
            {availableColors.map((color) => (
              <button
                aria-label={`Select ${color}`}
                className={`h-10 w-10 border ${
                  selectedColor === color
                    ? "border-2 border-rust"
                    : "border-ink/20"
                }`}
                style={{ backgroundColor: getColorValue(color, product.colorSwatches) }}
                key={color}
                onClick={() => selectColor(color)}
                type="button"
              />
            ))}
          </OptionGroup>

          <OptionGroup label={`Size: ${selectedSize}`}>
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

          <button
            className="flex w-full items-center justify-center gap-3 bg-ink px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.28em] text-acid transition-colors hover:bg-rust hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
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
                  : "Add Selected Variant"}
          </button>
        </div>
      </div>
    </div>
  );
}

function getColorValue(color: string, swatches: Record<string, string>) {
  return swatches[color] ?? color;
}

function OptionGroup({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="text-center lg:text-left">
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em]">{label}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3 lg:justify-start">{children}</div>
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
      className={`min-w-16 border px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] transition hover:border-rust hover:text-rust ${
        selected ? "border-rust text-rust" : "border-ink"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
