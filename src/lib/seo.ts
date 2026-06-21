import type { Metadata } from "next";

export function productMetadata(product: {
  name: string;
  short_description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  slug: string;
  product_images?: { image_url: string }[];
}): Metadata {
  const title = product.meta_title || product.name;
  const description =
    product.meta_description ||
    product.short_description ||
    "Shop product details and checkout securely.";
  const images = product.product_images?.map((image) => image.image_url) ?? [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images,
    },
    alternates: {
      canonical: `/products/${product.slug}`,
    },
  };
}

