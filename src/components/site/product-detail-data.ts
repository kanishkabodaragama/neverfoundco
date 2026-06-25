import {
  shopProducts,
  type ProductColor,
  type ProductGender,
  type ProductVariant,
} from "@/components/site/shop-data";
import { getActiveProductBySlug } from "@/lib/db/products";

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
  sizes: string[];
  genders: ProductGender[];
  variants: ProductVariant[];
  category: string;
  shortDescription: string;
  description: string;
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

function mapDbProductToDetail(product: Awaited<ReturnType<typeof getActiveProductBySlug>>) {
  if (!product) return null;

  const images = [...(product.product_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const variants = product.product_variants ?? [];
  const colors = getJsonList<ProductColor>(product.colors, ["Black"]);
  const sizes = getJsonList<string>(product.sizes, ["S", "M", "L"]);
  const genders = getJsonList<ProductGender>(product.genders, ["Unisex"]);
  const mainImage =
    product.main_image_url || images[0]?.image_url || "/images/products/black-heavyweight-tee.png";
  const soldOut = product.stock_quantity <= 0 && !product.preorder_enabled;
  const stockLabel = soldOut
    ? "SOLD OUT"
    : product.preorder_enabled
      ? "PRE ORDER"
      : product.show_stock_count
        ? `${product.stock_quantity} LEFT`
        : "IN STOCK";

  return {
    slug: product.slug,
    id: product.id,
    name: product.name,
    price: Number(product.sale_price ?? product.price),
    stockLabel,
    image: mainImage,
    gallery: [mainImage, ...images.map((image) => image.image_url)].filter(
      (value, index, list) => list.indexOf(value) === index,
    ),
    alt: product.name,
    color: colors[0],
    colors,
    sizes,
    genders,
    variants: variants.length
      ? variants.map((variant) => ({
          id: variant.id,
          gender: variant.gender,
          size: variant.size,
          color: variant.color as ProductColor,
          stock: variant.stock_quantity,
          image: variant.image_url ?? undefined,
        }))
      : genders.flatMap((gender) =>
          sizes.flatMap((size) =>
            colors.map((color) => ({
              id: `${product.id}-${gender}-${size}-${color}`,
              gender,
              size,
              color,
              stock: product.stock_quantity,
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
    soldOut,
  } satisfies MockProductDetail;
}

function getJsonList<T extends string>(value: unknown, fallback: T[]) {
  return Array.isArray(value) && value.length ? (value.map(String) as T[]) : fallback;
}
