import { NeverFoundHomePage } from "@/components/site/NeverFoundHomePage";
import { mapDbProductToShopProduct, shopProducts } from "@/components/site/shop-data";
import { listActiveProducts } from "@/lib/db/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const dbProducts = await listActiveProducts();
  const products = dbProducts.length ? dbProducts.map(mapDbProductToShopProduct) : shopProducts;

  return <NeverFoundHomePage products={products} />;
}
