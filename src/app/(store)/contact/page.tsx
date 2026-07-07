import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { StoreArtSurface } from "@/components/site/StoreArtSurface";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Never Found for drop questions, order help, ideas, or brand notes.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen w-full bg-acid text-ink">
      <Header />
      <StoreArtSurface>
        <section className="w-full bg-acid px-5 pb-12 pt-[calc(env(safe-area-inset-top)+6.5rem)] text-ink md:px-8 md:py-20 xl:px-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em]">Support file</p>
          <h1 className="mt-7 font-display text-[18vw] uppercase leading-[0.82] md:text-8xl lg:text-9xl">
            Contact
          </h1>
          <p className="mt-6 max-w-2xl text-sm font-semibold leading-snug md:text-base">
            Need help with an order, sizing, shipping, returns, or an upcoming
            drop? Send the details through and the Never Found team will reply
            with the next step.
          </p>
          <div className="mt-8 grid gap-3 text-sm font-semibold md:grid-cols-3">
            <div className="border border-ink p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em]">Orders</p>
              <p className="mt-2">Include your order number so we can find it quickly.</p>
            </div>
            <div className="border border-ink p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em]">Drops</p>
              <p className="mt-2">Ask about restocks, pre-orders, sizes, and product care.</p>
            </div>
            <div className="border border-ink p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em]">Partners</p>
              <p className="mt-2">For collaborations, styling pulls, and brand notes.</p>
            </div>
          </div>
        </section>
        <section
          className="grid w-full gap-10 bg-acid px-5 py-12 text-ink md:grid-cols-[1fr_1.1fr] md:px-8 md:py-16 xl:px-12"
          id="contact"
        >
          <ContactForm />
          <ContactInfo />
        </section>
      </StoreArtSurface>
      <Footer />
    </div>
  );
}
