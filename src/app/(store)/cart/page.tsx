import type { Metadata } from "next";
import { CartItems } from "@/components/cart/CartItems";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { StoreArtSurface } from "@/components/site/StoreArtSurface";

export const metadata: Metadata = {
  title: "Cart",
  description:
    "Review your Never Found limited-drop cart before checkout.",
};

export default function CartPage() {
  return (
    <div className="min-h-screen w-full bg-acid text-ink">
      <Header />
      <StoreArtSurface>
        <CartItems />
      </StoreArtSurface>
      <Footer />
    </div>
  );
}
