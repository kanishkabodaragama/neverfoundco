"use client";

import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
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
  const [imageMotion, setImageMotion] = useState<"next" | "previous">("next");
  const [galleryStart, setGalleryStart] = useState(0);
  const [added, setAdded] = useState(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
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
  const displayImage = selectedImage;
  const displayPrice = selectedVariant?.price ?? product.price;
  const isAvailable = Boolean(
    selectedVariant &&
      (product.preorderEnabled || !product.stockTrackingEnabled || selectedVariant.stock > 0),
  );
  const maxGalleryStart = Math.max(0, galleryImages.length - 4);
  const displayImageIndex = galleryImages.indexOf(displayImage);
  const activeGalleryIndex = Math.max(0, displayImageIndex);
  const effectiveGalleryStart =
    displayImageIndex >= 0 &&
    (displayImageIndex < galleryStart || displayImageIndex >= galleryStart + 4)
      ? Math.min(Math.max(0, displayImageIndex), maxGalleryStart)
      : galleryStart;
  const visibleGallery = galleryImages.slice(effectiveGalleryStart, effectiveGalleryStart + 4);

  function moveGallery(direction: -1 | 1) {
    setGalleryStart(
      Math.min(maxGalleryStart, Math.max(0, effectiveGalleryStart + direction)),
    );
  }

  function showGalleryImage(index: number, direction: "next" | "previous") {
    const image = galleryImages[index];
    if (!image) return;

    setImageMotion(direction);
    setSelectedImage(image);
    setGalleryStart(Math.min(maxGalleryStart, Math.max(0, index)));
  }

  function selectGalleryImage(image: string, index: number) {
    setImageMotion(index >= activeGalleryIndex ? "next" : "previous");
    setSelectedImage(image);
  }

  function slideGallery(direction: -1 | 1) {
    if (galleryImages.length < 2) return;

    const nextIndex =
      (activeGalleryIndex + direction + galleryImages.length) % galleryImages.length;
    showGalleryImage(nextIndex, direction > 0 ? "next" : "previous");
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    dragStart.current = { x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragStart.current) return;

    const deltaX = event.clientX - dragStart.current.x;
    const deltaY = event.clientY - dragStart.current.y;
    dragStart.current = null;

    if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    slideGallery(deltaX < 0 ? 1 : -1);
  }

  function selectGender(gender: MockProductDetail["genders"][number]) {
    setSelectedGender(gender);
    setSelectedImage(product.image);
    setImageMotion("next");
    setAdded(false);
  }

  function selectColor(color: MockProductDetail["colors"][number]) {
    setSelectedColor(color);
    setSelectedImage(product.image);
    setImageMotion("next");
    setAdded(false);
  }

  function selectSize(size: MockProductDetail["sizes"][number]) {
    setSelectedSize(size);
    setSelectedImage(product.image);
    setImageMotion("next");
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
      image: selectedVariant.image || product.image,
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
            className="hidden h-9 w-24 place-items-center bg-transparent text-ink transition-opacity hover:opacity-65 disabled:cursor-not-allowed disabled:opacity-25 md:grid"
            disabled={effectiveGalleryStart === 0}
            onClick={() => moveGallery(-1)}
            type="button"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
          <div className="no-scrollbar flex gap-4 overflow-x-auto md:grid md:max-h-[432px] md:overflow-hidden">
          {visibleGallery.map((image, index) => (
            <button
              aria-label={`View product image ${effectiveGalleryStart + index + 1}`}
              className={`relative h-24 w-24 shrink-0 bg-transparent ${
                image === displayImage ? "border-2 border-rust" : "border border-transparent"
              }`}
              key={`${image}-${effectiveGalleryStart + index}`}
              onClick={() => selectGalleryImage(image, effectiveGalleryStart + index)}
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
            className="hidden h-9 w-24 place-items-center bg-transparent text-ink transition-opacity hover:opacity-65 disabled:cursor-not-allowed disabled:opacity-25 md:grid"
            disabled={effectiveGalleryStart >= maxGalleryStart}
            onClick={() => moveGallery(1)}
            type="button"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        <div
          className="relative order-1 min-h-[430px] touch-pan-y overflow-hidden bg-transparent md:order-2 lg:min-h-[610px]"
          onPointerCancel={() => {
            dragStart.current = null;
          }}
          onPointerDown={handlePointerDown}
          onPointerLeave={() => {
            dragStart.current = null;
          }}
          onPointerUp={handlePointerUp}
        >
          {galleryImages.length > 1 ? (
            <>
              <button
                aria-label="Previous product image"
                className="absolute left-1 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center bg-transparent font-mono text-4xl font-bold leading-none text-ink transition-opacity hover:opacity-60 md:left-3"
                onClick={() => slideGallery(-1)}
                type="button"
              >
                ‹
              </button>
              <button
                aria-label="Next product image"
                className="absolute right-1 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center bg-transparent font-mono text-4xl font-bold leading-none text-ink transition-opacity hover:opacity-60 md:right-3"
                onClick={() => slideGallery(1)}
                type="button"
              >
                ›
              </button>
            </>
          ) : null}
          <div
            className={`product-gallery-frame absolute inset-0 ${
              imageMotion === "previous" ? "product-gallery-image--previous" : ""
            }`}
            key={displayImage}
          >
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
      </div>

      <div className="flex flex-col items-center justify-start text-center lg:items-start lg:text-left">
        <span className="w-fit bg-transparent px-0 py-0 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-ink/65">
          {product.stockLabel}
        </span>
        <h1 className="mt-3 max-w-xl font-display text-4xl italic uppercase leading-none md:text-6xl">
          {product.name}
        </h1>
        <p className="mt-3 font-mono text-xl font-bold uppercase text-ink md:text-2xl">
          <StorePrice amountUsd={displayPrice} />
        </p>
        <p className="mt-3 max-w-md whitespace-pre-line text-sm font-semibold italic leading-relaxed text-ink/70">
          {product.shortDescription}
        </p>

        <div className="my-4 h-px w-full bg-ink/15" />

        <div className="w-full space-y-5">
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
              <a
                className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] underline decoration-ink/60 underline-offset-4 transition-colors hover:text-rust"
                href="#size-chart"
              >
                Size Guide
              </a>
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

          <button
            className="mt-2 flex w-full items-center justify-center gap-3 rounded-full bg-ink px-6 py-4 font-mono text-xs font-bold italic uppercase tracking-[0.22em] text-bone transition-colors hover:bg-rust hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
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

          <section className="pt-3 text-left">
            <div className="flex items-center justify-between border-b border-ink/65 pb-3">
              <h2 className="font-display text-2xl italic uppercase leading-none">
                Description
              </h2>
              <span aria-hidden="true" className="font-mono text-xl leading-none">
                ^
              </span>
            </div>
            {product.description ? (
              <p className="mt-4 whitespace-pre-line text-sm font-medium italic leading-relaxed text-ink/75">
                {product.description}
              </p>
            ) : (
              <p className="mt-4 text-sm font-medium italic leading-relaxed text-ink/75">
                {product.shortDescription}
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
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
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em]">{label}</p>
        {action}
      </div>
      <div className="mt-2 flex flex-wrap justify-start gap-2">{children}</div>
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
      className={`min-w-16 rounded-full border px-6 py-3 font-sans text-sm font-semibold transition ${
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
  colorValue,
  onClick,
  selected,
}: {
  children: ReactNode;
  colorValue: string;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <button
      className="min-w-16 rounded-full border px-6 py-3 font-sans text-sm font-semibold transition hover:opacity-80"
      onClick={onClick}
      style={{
        backgroundColor: selected ? colorValue : "transparent",
        borderColor: colorValue,
        color: selected ? "#f5f3ec" : colorValue,
      }}
      type="button"
    >
      {children}
    </button>
  );
}
