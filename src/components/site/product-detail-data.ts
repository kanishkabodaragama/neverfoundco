import { dropProducts } from "@/components/site/landing-data";
import { shopProducts } from "@/components/site/shop-data";

export type MockProductDetail = {
  slug: string;
  name: string;
  price: number;
  stockLabel: string;
  image: string;
  alt: string;
  color: string;
  sizes: string[];
  category: string;
  shortDescription: string;
  description: string;
  soldOut?: boolean;
};

const dropProductDetails: MockProductDetail[] = dropProducts.map((product) => ({
  slug: product.slug,
  name: product.name,
  price: Number(product.price.replace(/[^0-9]/g, "")),
  stockLabel: product.stockLabel,
  image: product.image,
  alt: product.alt,
  color: product.name.includes("Daydream") ? "Black" : "Cream",
  sizes: ["S", "M", "L", "XL"],
  category: "T-Shirts",
  shortDescription: "Limited Drop 001 piece from the Never Found summer run.",
  description:
    "A collectible streetwear piece built with retro skate poster energy, soft everyday weight, and no-restock scarcity. Made for the ones who would rather be outside.",
  soldOut: product.soldOut,
}));

const shopProductDetails: MockProductDetail[] = shopProducts.map((product) => ({
  slug: product.id,
  name: product.name,
  price: product.price,
  stockLabel: product.stockLabel,
  image: product.image,
  alt: product.alt,
  color: product.color,
  sizes: product.sizes,
  category: product.category,
  shortDescription: `${product.stockLabel}. No restocks. Built for the current drop.`,
  description:
    "Part of the Never Found limited catalog: thick graphic attitude, vintage paper mood, skate culture DNA, and a fit made for long days that turn into late nights.",
  soldOut: product.soldOut,
}));

export const mockProductDetails = [
  ...shopProductDetails,
  ...dropProductDetails.filter(
    (dropProduct) =>
      !shopProductDetails.some((shopProduct) => shopProduct.slug === dropProduct.slug),
  ),
];

export function getMockProductBySlug(slug: string) {
  return mockProductDetails.find((product) => product.slug === slug) ?? null;
}

