import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Never Found for drop questions, order help, ideas, or brand notes.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen w-full bg-[#F7F1E6] text-[#10131A]">
      <Header />
      <main>
        <section className="w-full bg-[#F7F1E6] px-5 py-8 md:px-8 xl:px-12">
          <p className="font-pixel text-xs uppercase text-[#F05267]">Support file</p>
          <h1 className="font-pixel mt-3 text-2xl uppercase md:text-3xl">
            Contact
          </h1>
          <p className="mt-4 max-w-2xl text-sm font-bold leading-relaxed">
            Need help with an order, sizing, shipping, returns, or an upcoming
            drop? Send the details through and the Never Found team will reply
            with the next step.
          </p>
          <div className="mt-6 grid gap-3 text-sm font-bold md:grid-cols-3">
            <div className="border border-[#10131A]/15 p-4">
              <p className="font-pixel text-xs uppercase text-[#F05267]">Orders</p>
              <p className="mt-2">Include your order number so we can find it quickly.</p>
            </div>
            <div className="border border-[#10131A]/15 p-4">
              <p className="font-pixel text-xs uppercase text-[#F05267]">Drops</p>
              <p className="mt-2">Ask about restocks, pre-orders, sizes, and product care.</p>
            </div>
            <div className="border border-[#10131A]/15 p-4">
              <p className="font-pixel text-xs uppercase text-[#F05267]">Partners</p>
              <p className="mt-2">For collaborations, styling pulls, and brand notes.</p>
            </div>
          </div>
        </section>
        <section
          className="grid w-full gap-8 bg-[#070B12] px-5 py-8 text-[#FFF9EF] md:grid-cols-[1fr_1.1fr] md:px-8 xl:px-12"
          id="contact"
        >
          <ContactForm />
          <ContactInfo />
        </section>
      </main>
      <Footer />
    </div>
  );
}
