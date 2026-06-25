"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useCart } from "@/components/store/cart-provider";
import { StorePrice } from "@/components/site/StorePrice";
import type { MockProductDetail } from "@/components/site/product-detail-data";

const colorClasses: Record<string, string> = {
  Black: "bg-[#070B12]",
  Cream: "bg-[#ead8bd]",
  Sage: "bg-[#80916f]",
  Grey: "bg-[#8C8D8F]",
  Navy: "bg-[#1f3148]",
};

export function ProductDetailClient({ product }: { product: MockProductDetail }) {
  const cart = useCart();
  const [selectedGender, setSelectedGender] = useState(product.genders[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [added, setAdded] = useState(false);

  const selectedVariant = useMemo(
    () =>
      product.variants.find(
        (variant) =>
          variant.gender === selectedGender &&
          variant.color === selectedColor &&
          variant.size === selectedSize,
      ) ?? null,
    [product.variants, selectedColor, selectedGender, selectedSize],
  );
  const displayImage = selectedVariant?.image ?? selectedImage;
  const isAvailable = Boolean(selectedVariant && selectedVariant.stock > 0 && !product.soldOut);

  function addSelectedVariant() {
    if (!selectedVariant || !isAvailable) return;

    cart.addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      slug: product.slug,
      unitPrice: product.price,
      image: displayImage,
      gender: selectedGender,
      size: selectedSize,
      color: selectedColor,
    });
    setAdded(true);
  }

  return (
    <div className="mt-8 grid w-full gap-8 lg:grid-cols-[55fr_45fr] xl:gap-12">
      <div className="grid gap-5 md:grid-cols-[96px_1fr]">
        <div className="order-2 flex gap-4 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
          {product.gallery.map((image, index) => (
            <button
              aria-label={`View product image ${index + 1}`}
              className={`relative h-24 w-24 shrink-0 bg-[#FFF9EF] ${
                image === displayImage ? "border-2 border-[#F05267]" : "border border-[#10131A]/15"
              }`}
              key={`${image}-${index}`}
              onClick={() => setSelectedImage(image)}
              type="button"
            >
              <Image
                alt={`${product.name} thumbnail ${index + 1}`}
                className="object-contain p-2"
                fill
                sizes="96px"
                src={image}
              />
            </button>
          ))}
        </div>

        <div className="relative order-1 min-h-[430px] bg-[#FFF9EF] md:order-2 lg:min-h-[610px]">
          <Image
            alt={product.alt}
            className="object-contain p-6 md:p-10"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            src={displayImage}
          />
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <span className="w-fit bg-[#B8A8E8] px-3 py-1 text-xs font-black uppercase">
          {product.stockLabel}
        </span>
        <h1 className="font-pixel mt-6 max-w-xl text-3xl font-black uppercase leading-tight md:text-4xl">
          {product.name}
        </h1>
        <p className="font-pixel mt-5 text-2xl uppercase text-[#F05267]">
          <StorePrice amountUsd={product.price} />
        </p>
        <p className="mt-6 max-w-md text-sm font-bold leading-relaxed">
          {product.shortDescription}
          <br />
          Lost since 1999.
        </p>

        <div className="my-7 h-px w-full bg-[#B8A8E8]" />

        <div className="space-y-6">
          <OptionGroup label={`Gender: ${selectedGender}`}>
            {product.genders.map((gender) => (
              <OptionButton
                key={gender}
                onClick={() => setSelectedGender(gender)}
                selected={gender === selectedGender}
              >
                {gender}
              </OptionButton>
            ))}
          </OptionGroup>

          <OptionGroup label={`Color: ${selectedColor}`}>
            {product.colors.map((color) => (
              <button
                aria-label={`Select ${color}`}
                className={`h-10 w-10 border ${
                  selectedColor === color
                    ? "border-2 border-[#F05267]"
                    : "border-[#10131A]/20"
                } ${colorClasses[color]}`}
                key={color}
                onClick={() => setSelectedColor(color)}
                type="button"
              />
            ))}
          </OptionGroup>

          <OptionGroup label={`Size: ${selectedSize}`}>
            {product.sizes.map((size) => (
              <OptionButton
                key={size}
                onClick={() => setSelectedSize(size)}
                selected={size === selectedSize}
              >
                {size}
              </OptionButton>
            ))}
          </OptionGroup>

          {!selectedVariant ? (
            <p className="text-sm font-black uppercase text-[#F05267]">
              This combination is not available.
            </p>
          ) : null}

          <button
            className="pixel-edge flex w-full items-center justify-center gap-3 bg-[#F05267] px-6 py-4 text-sm font-black uppercase text-[#FFF9EF] transition hover:translate-x-0.5 disabled:cursor-not-allowed disabled:opacity-50"
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

function OptionGroup({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div>
      <p className="font-pixel text-xs uppercase">{label}</p>
      <div className="mt-4 flex flex-wrap gap-3">{children}</div>
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
      className={`min-w-16 border px-5 py-3 text-xs font-black uppercase transition hover:border-[#F05267] hover:text-[#F05267] ${
        selected ? "border-[#F05267] text-[#F05267]" : "border-[#10131A]"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
