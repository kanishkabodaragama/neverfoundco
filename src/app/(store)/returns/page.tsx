import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { StoreArtSurface } from "@/components/site/StoreArtSurface";

export const metadata: Metadata = {
  title: "Return Policy",
  description: "Never Found return, exchange, and refund guidance.",
};

const sections = [
  {
    title: "Return window",
    body: "Return requests should be submitted within 7 days of delivery. Items must be unused, unworn, unwashed, and returned with original tags and packaging where possible.",
  },
  {
    title: "Non-returnable items",
    body: "Final sale items, customized pieces, damaged-by-use products, and hygiene-sensitive items may not be eligible for return unless the item arrived faulty or incorrect.",
  },
  {
    title: "Faulty or incorrect items",
    body: "If you receive a faulty or incorrect item, contact us with your order number and clear photos. We will review the issue and arrange a replacement, store credit, or refund where applicable.",
  },
  {
    title: "Pre-orders",
    body: "Pre-order timelines are estimates. If a pre-order is delayed materially, we will update the order status and provide the available options.",
  },
  {
    title: "Refunds",
    body: "Approved refunds are processed back through the original payment method where possible. Processing times depend on the payment provider and bank.",
  },
  {
    title: "Return shipping",
    body: "Customers are responsible for return shipping unless the return is due to a Never Found fulfilment error or a confirmed product fault.",
  },
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-acid text-ink">
      <Header />
      <StoreArtSurface>
      <div className="w-full px-5 py-8 md:px-8 xl:px-12">
        <p className="font-sans text-[11px] font-bold uppercase tracking-normal text-rust">Return file</p>
        <h1 className="mt-4 font-display text-5xl uppercase leading-none md:text-7xl">
          Return Policy
        </h1>
        <p className="mt-5 max-w-2xl text-sm font-semibold leading-relaxed text-ink/70">
          We want every order to land properly. Review the return rules below
          and contact us with your order number before sending anything back.
        </p>
        <div className="mt-8 grid gap-5">
          {sections.map((section) => (
            <section className="border border-ink bg-transparent p-5" key={section.title}>
              <h2 className="font-display text-2xl uppercase leading-none">{section.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-ink/70">{section.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-8 max-w-2xl font-sans text-[10px] font-bold uppercase tracking-normal text-rust">
          Last updated: June 25, 2026
        </p>
      </div>
      </StoreArtSurface>
      <Footer />
    </div>
  );
}
