import type { Metadata } from "next";
import { BrandValuesBanner } from "@/components/site/BrandValuesBanner";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { ShopCatalog } from "@/components/site/ShopCatalog";
import { ShopHero } from "@/components/site/ShopHero";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop limited Never Found streetwear drops with no restocks and scarce stock.",
};

export default function ShopPage() {
  return (
    <div className="min-h-screen w-full bg-[#F7F1E6] text-[#10131A]">
      <Header />
      <main className="[&>section+section]:mt-6">
        <ShopHero />
        <ShopCatalog />
        <BrandValuesBanner />
      </main>
      <Footer />
    </div>
  );
}
