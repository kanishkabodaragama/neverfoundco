"use client";

import Image from "next/image";
import { ChevronDown, Ruler } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode, UIEvent } from "react";
import { useCart } from "@/components/store/cart-provider";
import { StorePrice } from "@/components/site/StorePrice";
import type { MockProductDetail } from "@/components/site/product-detail-data";
import { isUuid } from "@/lib/ids";
import { getVariantCombinationKey, uniqueVariantValues } from "@/lib/product-variants";

export function ProductDetailClient({ product }: { product: MockProductDetail }) {
  const cart = useCart();
  const [requestedGender, setSelectedGender] = useState(product.genders[0]);
  const [requestedColor, setSelectedColor] = useState(product.colors[0]);
  const [requestedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const mobileThumbnailStrip = useRef<HTMLDivElement | null>(null);
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
  const displayImageIndex = galleryImages.indexOf(displayImage);
  const activeGalleryIndex = Math.max(0, displayImageIndex);
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
      inline: "center",
    });
  }, [activeGalleryIndex]);

  function scrollCarouselTo(index: number, behavior: ScrollBehavior = "smooth") {
    const image = galleryImages[index];
    if (!image) return;

    setSelectedImage(image);
    carouselRef.current?.scrollTo({
      left: carouselRef.current.clientWidth * index,
      behavior,
    });
  }

  function selectGalleryImage(image: string, index: number) {
    setSelectedImage(image);
    scrollCarouselTo(index);
  }

  function syncCarouselSelection(event: UIEvent<HTMLDivElement>) {
    const target = event.currentTarget;
    const index = Math.round(target.scrollLeft / target.clientWidth);
    const image = galleryImages[index];

    if (image && image !== selectedImage) setSelectedImage(image);
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
      scrollCarouselTo(nextIndex);
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
    <div className="mt-8 grid w-full gap-6 lg:grid-cols-[55fr_45fr] lg:gap-4 xl:gap-5">
      <div className="grid gap-5">
        <div
          className="no-scrollbar flex min-h-[430px] touch-pan-x snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain overscroll-y-none scroll-smooth bg-transparent md:min-h-[610px]"
          onScroll={syncCarouselSelection}
          ref={carouselRef}
        >
          {galleryImages.map((image, index) => (
            <div
              className="relative min-h-[430px] min-w-full touch-pan-x snap-center overflow-hidden md:min-h-[610px]"
              key={`${image}-${index}`}
            >
              <Image
                alt={product.alt}
                className="scale-[1.03] object-contain p-3 md:scale-[0.98] md:p-4"
                draggable={false}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                src={image}
                unoptimized
              />
            </div>
          ))}
        </div>

        <div
          className="no-scrollbar flex scroll-px-16 justify-start gap-4 overflow-x-auto scroll-smooth px-0 md:justify-center"
          ref={mobileThumbnailStrip}
        >
          {galleryImages.map((image, index) => (
            <GalleryThumb
              image={image}
              index={index}
              isSelected={image === displayImage}
              key={`${image}-${index}`}
              onClick={() => selectGalleryImage(image, index)}
              productName={product.name}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col items-start justify-start text-left">
        <h1 className="max-w-xl font-display text-5xl italic uppercase leading-none md:text-6xl">
          {product.name}
        </h1>
        <p className="mt-3 font-mono text-xl font-bold uppercase text-ink md:text-2xl">
          <StorePrice amountUsd={displayPrice} />
        </p>
        {shortDescription ? (
          <p className="mt-3 max-w-md whitespace-pre-line text-sm font-semibold italic leading-relaxed text-ink/70">
            {shortDescription}
          </p>
        ) : null}

        <div className="mt-8 w-full space-y-8">
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
                className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-normal underline decoration-ink/60 underline-offset-4 transition-colors hover:text-rust"
                href="#size-chart"
              >
                <Ruler className="h-4 w-4" />
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
            className="mt-1 flex h-12 w-full items-center justify-center gap-3 rounded-full bg-ink px-6 py-2 font-sans text-xs font-black italic uppercase tracking-[0.08em] text-bone transition-colors hover:bg-rust hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
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
    </div>
  );
}

function GalleryThumb({
  image,
  index,
  isSelected,
  onClick,
  productName,
}: {
  image: string;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  productName: string;
}) {
  return (
    <button
      aria-label={`View product image ${index + 1}`}
      className={`relative h-24 w-24 shrink-0 bg-transparent ${
        isSelected ? "border-2 border-rust" : "border border-transparent"
      }`}
      data-gallery-index={index}
      onClick={onClick}
      type="button"
    >
      <Image
        alt={`${productName} thumbnail ${index + 1}`}
        className="object-contain p-2"
        fill
        sizes="96px"
        src={image}
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
      className="min-w-20 rounded-full border-2 px-5 py-2 font-sans text-sm font-medium transition hover:opacity-80"
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
