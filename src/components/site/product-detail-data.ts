import {
  shopProducts,
  type ProductColor,
  type ProductGender,
  type ProductVariant,
} from "@/components/site/shop-data";
import { getActiveProductBySlug } from "@/lib/db/products";
import { listVariantOptions } from "@/lib/db/variant-options";
import {
  normalizeVariantCombination,
  uniqueVariantValues,
} from "@/lib/product-variants";

export type MockProductDetail = {
  id: string;
  slug: string;
  name: string;
  price: number;
  stockLabel: string;
  image: string;
  gallery: string[];
  alt: string;
  color: ProductColor;
  colors: ProductColor[];
  colorSwatches: Record<string, string>;
  sizes: string[];
  genders: ProductGender[];
  variants: ProductVariant[];
  category: string;
  shortDescription: string;
  description: string;
  preorderEnabled?: boolean;
  stockTrackingEnabled?: boolean;
  soldOut?: boolean;
};

const shopProductDetails: MockProductDetail[] = shopProducts.map((product) => ({
  id: product.id,
  slug: product.id,
  name: product.name,
  price: product.price,
  stockLabel: product.stockLabel,
  image: product.image,
  gallery: product.gallery,
  alt: product.alt,
  color: product.color,
  colors: product.colors,
  colorSwatches: Object.fromEntries(product.colors.map((color) => [color, color])),
  sizes: product.sizes,
  genders: product.genders,
  variants: product.variants,
  category: product.category,
  shortDescription: `${product.stockLabel}. No restocks. Built for the current drop.`,
  description:
    "Part of the Never Found limited catalog: premium everyday fabric, clean streetwear styling, and no-restock scarcity.",
  soldOut: product.soldOut,
}));

export const mockProductDetails = shopProductDetails;

export function getMockProductBySlug(slug: string) {
  return mockProductDetails.find((product) => product.slug === slug) ?? null;
}

export async function getProductDetailBySlug(slug: string) {
  const dbProduct = await getActiveProductBySlug(slug);
  if (dbProduct) return mapDbProductToDetail(dbProduct);
  return getMockProductBySlug(slug);
}

async function mapDbProductToDetail(product: Awaited<ReturnType<typeof getActiveProductBySlug>>) {
  if (!product) return null;

  const variantOptions = await listVariantOptions();
  const images = [...(product.product_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const variants = (product.product_variants ?? []).map(normalizeVariantCombination);
  const variantColors = uniqueVariantValues<ProductColor>(
    variants.map((variant) => variant.color as ProductColor),
  );
  const colors = variants.length
    ? variantColors
    : getJsonList<ProductColor>(product.colors, ["Black"]);
  const colorSwatches = Object.fromEntries(
    variantOptions
      .filter((option) => option.option_type === "color")
      .map((option) => [option.name, option.color_value ?? option.name]),
  );
  const sizes = variants.length
    ? uniqueVariantValues(variants.map((variant) => variant.size))
    : getJsonList<string>(product.sizes, ["S", "M", "L"]);
  const genders = variants.length
    ? uniqueVariantValues<ProductGender>(variants.map((variant) => variant.gender))
    : getJsonList<ProductGender>(product.genders, ["Unisex"]);
  const mainImage =
    product.main_image_url || images[0]?.image_url || "/images/products/black-heavyweight-tee.png";
  const colorImageMap = Object.fromEntries(
    colors.map((color, index) => [color, images[index]?.image_url ?? mainImage]),
  );
  const availableStock = variants.length
    ? variants.reduce((total, variant) => total + variant.stock_quantity, 0)
    : product.stock_quantity;
  const soldOut =
    product.stock_tracking_enabled && availableStock <= 0 && !product.preorder_enabled;
  const productPrice = Number(product.sale_price ?? product.price);
  const stockLabel = soldOut
    ? "SOLD OUT"
    : product.preorder_enabled
      ? "PRE ORDER"
      : product.show_stock_count
        ? `${availableStock} LEFT`
        : "IN STOCK";
  const variantImageUrls = variants
    .map((variant) => variant.image_url)
    .filter((imageUrl): imageUrl is string => Boolean(imageUrl));

  return {
    slug: product.slug,
    id: product.id,
    name: product.name,
    price: productPrice,
    stockLabel,
    image: mainImage,
    gallery: [mainImage, ...images.map((image) => image.image_url), ...variantImageUrls].filter(
      (value, index, list) => list.indexOf(value) === index,
    ),
    alt: product.name,
    color: colors[0],
    colors,
    colorSwatches,
    sizes,
    genders,
    variants: variants.length
      ? variants.map((variant) => ({
          id: variant.id,
          gender: variant.gender,
          size: variant.size,
          color: variant.color as ProductColor,
          stock: variant.stock_quantity,
          price:
            variant.sale_price !== null || variant.price !== null
              ? Number(variant.sale_price ?? variant.price)
              : productPrice,
          image: variant.image_url ?? colorImageMap[variant.color] ?? mainImage,
        }))
      : genders.flatMap((gender) =>
          sizes.flatMap((size) =>
            colors.map((color) => ({
              id: `${product.id}-${gender}-${size}-${color}`,
              gender,
              size,
              color,
              stock: product.stock_quantity,
              price: productPrice,
              image: mainImage,
            })),
          ),
        ),
    category: product.category,
    shortDescription:
      product.short_description ?? `${product.stock_quantity} left. Built for the current drop.`,
    description:
      product.description ??
      "Part of the Never Found limited catalog: premium everyday fabric, clean streetwear styling, and no-restock scarcity.",
    preorderEnabled: product.preorder_enabled,
    stockTrackingEnabled: product.stock_tracking_enabled,
    soldOut,
  } satisfies MockProductDetail;
}

function getJsonList<T extends string>(value: unknown, fallback: T[]) {
  return Array.isArray(value) && value.length ? (value.map(String) as T[]) : fallback;
}
