import type { ProductWithImages } from "@/lib/db/products";
import {
  normalizeVariantCombination,
  uniqueVariantValues,
} from "@/lib/product-variants";

export type ShopProduct = {
  id: string;
  slug?: string;
  name: string;
  price: number;
  category: string;
  sizes: string[];
  colors: ProductColor[];
  color: ProductColor;
  genders: ProductGender[];
  variants: ProductVariant[];
  stockLabel: string;
  image: string;
  youMayAlsoLikeImage?: string | null;
  gallery: string[];
  alt: string;
  soldOut?: boolean;
};

export type ProductGender = "Male" | "Female" | "Unisex";
export type ProductColor = string;

export type ProductVariant = {
  id: string;
  gender: ProductGender;
  size: string;
  color: ProductColor;
  stock: number;
  price?: number;
  image?: string;
};

function buildVariants({
  productId,
  genders,
  sizes,
  colors,
  imageByColor,
}: {
  productId: string;
  genders: ProductGender[];
  sizes: string[];
  colors: ProductColor[];
  imageByColor: Partial<Record<ProductColor, string>>;
}) {
  return genders.flatMap((gender) =>
    sizes.flatMap((size) =>
      colors.map((color, index) => ({
        id: `${productId}-${gender.toLowerCase()}-${size.toLowerCase()}-${color.toLowerCase()}`,
        gender,
        size,
        color,
        stock: index === 0 ? 6 : 3,
        image: imageByColor[color],
      })),
    ),
  );
}

export const shopProducts: ShopProduct[] = [
  {
    id: "never-found-tiger-lounge-tee",
    slug: "never-found-tiger-lounge-tee",
    name: "Tiger Lounge Tee",
    price: 30000,
    category: "T-Shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White"],
    color: "White",
    genders: ["Unisex"],
    stockLabel: "LIMITED DROP",
    image: "/images/products/home-drop/never-found-tiger-lounge-tee.png",
    gallery: ["/images/products/home-drop/never-found-tiger-lounge-tee.png"],
    alt: "White Never Found graphic t-shirt with a colorful back print",
    variants: buildVariants({
      productId: "never-found-tiger-lounge-tee",
      genders: ["Unisex"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["White"],
      imageByColor: {
        White: "/images/products/home-drop/never-found-tiger-lounge-tee.png",
      },
    }),
  },
  {
    id: "never-found-pink-smoke-tee",
    slug: "never-found-pink-smoke-tee",
    name: "Pink Smoke Tee",
    price: 30000,
    category: "T-Shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White"],
    color: "White",
    genders: ["Unisex"],
    stockLabel: "LIMITED DROP",
    image: "/images/products/home-drop/never-found-pink-smoke-tee.png",
    gallery: ["/images/products/home-drop/never-found-pink-smoke-tee.png"],
    alt: "White Never Found graphic t-shirt with a pink smoke back print",
    variants: buildVariants({
      productId: "never-found-pink-smoke-tee",
      genders: ["Unisex"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["White"],
      imageByColor: {
        White: "/images/products/home-drop/never-found-pink-smoke-tee.png",
      },
    }),
  },
  {
    id: "never-found-summer-burn-tee",
    slug: "never-found-summer-burn-tee",
    name: "Summer Burn Tee",
    price: 30000,
    category: "T-Shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White"],
    color: "White",
    genders: ["Unisex"],
    stockLabel: "LIMITED DROP",
    image: "/images/products/home-drop/never-found-summer-burn-tee.png",
    gallery: ["/images/products/home-drop/never-found-summer-burn-tee.png"],
    alt: "White Never Found graphic t-shirt with a bright summer back print",
    variants: buildVariants({
      productId: "never-found-summer-burn-tee",
      genders: ["Unisex"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["White"],
      imageByColor: {
        White: "/images/products/home-drop/never-found-summer-burn-tee.png",
      },
    }),
  },
  {
    id: "never-found-logo-tee",
    slug: "never-found-logo-tee",
    name: "Logo Tee",
    price: 30000,
    category: "T-Shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White"],
    color: "White",
    genders: ["Unisex"],
    stockLabel: "LIMITED DROP",
    image: "/images/products/home-drop/never-found-logo-tee.png",
    gallery: ["/images/products/home-drop/never-found-logo-tee.png"],
    alt: "White Never Found logo t-shirt",
    variants: buildVariants({
      productId: "never-found-logo-tee",
      genders: ["Unisex"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["White"],
      imageByColor: {
        White: "/images/products/home-drop/never-found-logo-tee.png",
      },
    }),
  },
  {
    id: "black-heavyweight-tee",
    name: "Black Heavyweight Tee",
    price: 30000,
    category: "T-Shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    color: "Black",
    genders: ["Male", "Unisex"],
    stockLabel: "18 LEFT",
    image: "/images/products/black-heavyweight-tee.png",
    gallery: [
      "/images/products/black-heavyweight-tee.png",
      "/images/products/cream-heavyweight-tee.png",
    ],
    alt: "Photorealistic black heavyweight cotton t-shirt",
    variants: buildVariants({
      productId: "black-heavyweight-tee",
      genders: ["Male", "Unisex"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black"],
      imageByColor: { Black: "/images/products/black-heavyweight-tee.png" },
    }),
  },
  {
    id: "cream-heavyweight-tee",
    name: "Cream Heavyweight Tee",
    price: 30000,
    category: "T-Shirts",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Cream"],
    color: "Cream",
    genders: ["Female", "Unisex"],
    stockLabel: "14 LEFT",
    image: "/images/products/cream-heavyweight-tee.png",
    gallery: [
      "/images/products/cream-heavyweight-tee.png",
      "/images/products/black-heavyweight-tee.png",
    ],
    alt: "Photorealistic cream heavyweight cotton t-shirt",
    variants: buildVariants({
      productId: "cream-heavyweight-tee",
      genders: ["Female", "Unisex"],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Cream"],
      imageByColor: { Cream: "/images/products/cream-heavyweight-tee.png" },
    }),
  },
  {
    id: "sage-camp-shirt",
    name: "Sage Camp Shirt",
    price: 30000,
    category: "Shirts",
    sizes: ["S", "M", "XL"],
    colors: ["Sage"],
    color: "Sage",
    genders: ["Male", "Female", "Unisex"],
    stockLabel: "9 LEFT",
    image: "/images/products/sage-camp-shirt.png",
    gallery: ["/images/products/sage-camp-shirt.png"],
    alt: "Photorealistic sage green camp collar shirt",
    variants: buildVariants({
      productId: "sage-camp-shirt",
      genders: ["Male", "Female", "Unisex"],
      sizes: ["S", "M", "XL"],
      colors: ["Sage"],
      imageByColor: { Sage: "/images/products/sage-camp-shirt.png" },
    }),
  },
  {
    id: "grey-heavyweight-hoodie",
    name: "Grey Heavyweight Hoodie",
    price: 30000,
    category: "Hoodies",
    sizes: ["M", "L", "XL"],
    colors: ["Grey"],
    color: "Grey",
    genders: ["Unisex"],
    stockLabel: "7 LEFT",
    image: "/images/products/grey-heavyweight-hoodie.png",
    gallery: ["/images/products/grey-heavyweight-hoodie.png"],
    alt: "Photorealistic heather grey heavyweight hoodie",
    variants: buildVariants({
      productId: "grey-heavyweight-hoodie",
      genders: ["Unisex"],
      sizes: ["M", "L", "XL"],
      colors: ["Grey"],
      imageByColor: { Grey: "/images/products/grey-heavyweight-hoodie.png" },
    }),
  },
  {
    id: "black-cargo-trouser",
    name: "Black Cargo Trouser",
    price: 30000,
    category: "Pants",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    color: "Black",
    genders: ["Male", "Unisex"],
    stockLabel: "11 LEFT",
    image: "/images/products/black-cargo-trouser.png",
    gallery: ["/images/products/black-cargo-trouser.png"],
    alt: "Photorealistic black cotton cargo trouser",
    variants: buildVariants({
      productId: "black-cargo-trouser",
      genders: ["Male", "Unisex"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black"],
      imageByColor: { Black: "/images/products/black-cargo-trouser.png" },
    }),
  },
];

export const categories = [
  "All",
  "T-Shirts",
  "Hoodies",
  "Shirts",
  "Pants",
] as const;

export const sizes = ["XS", "S", "M", "L", "XL"] as const;

export const colors = ["Black", "Cream", "Sage", "Grey", "Navy"] as const;

export const genders = ["Male", "Female", "Unisex"] as const;

export function mapDbProductToShopProduct(product: ProductWithImages): ShopProduct {
  const images = [...(product.product_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const mainImage =
    product.main_image_url || images[0]?.image_url || "/images/products/black-heavyweight-tee.png";
  const savedVariants = (product.product_variants ?? []).map(normalizeVariantCombination);
  const colors = savedVariants.length
    ? uniqueVariantValues(savedVariants.map((variant) => variant.color))
    : getJsonList<ProductColor>(product.colors, ["Black"]);
  const colorImageMap = Object.fromEntries(
    colors.map((color, index) => [color, images[index]?.image_url ?? mainImage]),
  );
  const sizes = savedVariants.length
    ? uniqueVariantValues(savedVariants.map((variant) => variant.size))
    : getJsonList<string>(product.sizes, ["S", "M", "L"]);
  const genders = savedVariants.length
    ? uniqueVariantValues<ProductGender>(savedVariants.map((variant) => variant.gender))
    : getJsonList<ProductGender>(product.genders, ["Unisex"]);
  const variants = savedVariants.length
    ? savedVariants.map((variant) => ({
        id: variant.id,
        gender: variant.gender,
        size: variant.size,
        color: variant.color,
        stock: variant.stock_quantity,
        price:
          variant.sale_price !== null || variant.price !== null
            ? Number(variant.sale_price ?? variant.price)
            : undefined,
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
            image: mainImage,
          })),
        ),
      );

  const availableStock = savedVariants.length
    ? savedVariants.reduce((total, variant) => total + variant.stock_quantity, 0)
    : product.stock_quantity;
  const soldOut = product.stock_tracking_enabled && availableStock <= 0 && !product.preorder_enabled;
  const stockLabel = soldOut
    ? "SOLD OUT"
    : product.preorder_enabled
      ? "PRE ORDER"
      : product.show_stock_count
        ? `${availableStock} LEFT`
        : "IN STOCK";

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: Number(product.sale_price ?? product.price),
    category: product.category,
    sizes,
    colors,
    color: colors[0] ?? "Black",
    genders,
    variants,
    stockLabel,
    image: mainImage,
    youMayAlsoLikeImage: product.you_may_also_like_image_url ?? null,
    gallery: [mainImage, ...images.map((image) => image.image_url)].filter(
      (value, index, list) => list.indexOf(value) === index,
    ),
    alt: product.name,
    soldOut,
  };
}

function getJsonList<T extends string>(value: unknown, fallback: T[]) {
  return Array.isArray(value) && value.length ? (value.map(String) as T[]) : fallback;
}
