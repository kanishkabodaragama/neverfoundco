import type { Metadata } from "next";
import { CheckoutExperience } from "@/components/checkout/CheckoutExperience";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { listShippingCountries } from "@/lib/db/shipping";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your Never Found order with PayHere payment option placeholder.",
};

export default async function CheckoutPage() {
  const countries = await listShippingCountries();

  return (
    <div className="min-h-screen w-full bg-[#F7F1E6] text-[#10131A]">
      <Header />
      <main>
        <CheckoutExperience countries={countries} />
      </main>
      <Footer />
    </div>
  );
}
