import type { ProductWithImages } from "@/lib/db/products";

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
    id: "black-heavyweight-tee",
    name: "Black Heavyweight Tee",
    price: 100,
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
    price: 100,
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
    price: 100,
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
    price: 100,
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
    price: 100,
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
  const colors = getJsonList<ProductColor>(product.colors, ["Black"]);
  const colorImageMap = Object.fromEntries(
    colors.map((color, index) => [color, images[index]?.image_url ?? mainImage]),
  );
  const sizes = getJsonList<string>(product.sizes, ["S", "M", "L"]);
  const genders = getJsonList<ProductGender>(product.genders, ["Unisex"]);
  const variants = product.product_variants?.length
    ? product.product_variants.map((variant) => ({
        id: variant.id,
        gender: variant.gender,
        size: variant.size,
        color: variant.color,
        stock: variant.stock_quantity,
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

  const soldOut = product.stock_quantity <= 0 && !product.preorder_enabled;
  const stockLabel = soldOut
    ? "SOLD OUT"
    : product.preorder_enabled
      ? "PRE ORDER"
      : product.show_stock_count
        ? `${product.stock_quantity} LEFT`
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
