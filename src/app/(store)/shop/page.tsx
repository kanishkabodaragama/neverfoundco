import type { Metadata } from "next";
import { NeverFoundHomePage } from "@/components/site/NeverFoundHomePage";
import { mapDbProductToShopProduct, shopProducts } from "@/components/site/shop-data";
import { listActiveProducts } from "@/lib/db/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop limited Never Found streetwear drops with no restocks and scarce stock.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ShopPage() {
  const dbProducts = await listActiveProducts();
  const products = dbProducts.length ? dbProducts.map(mapDbProductToShopProduct) : shopProducts;

  return <NeverFoundHomePage productLimit={0} products={products} showSoldOut />;
}
