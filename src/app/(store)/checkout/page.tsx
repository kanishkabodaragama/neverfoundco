import type { Metadata } from "next";
import { CheckoutExperience } from "@/components/checkout/CheckoutExperience";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { StoreArtSurface } from "@/components/site/StoreArtSurface";
import { listCheckoutCountries } from "@/lib/db/shipping";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your Never Found order with secure PayHere checkout.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CheckoutPage() {
  const countries = await listCheckoutCountries();

  return (
    <div className="min-h-screen w-full bg-acid text-ink">
      <Header />
      <StoreArtSurface>
        <CheckoutExperience countries={countries} />
      </StoreArtSurface>
      <Footer />
    </div>
  );
}
