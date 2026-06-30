import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

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
    <div className="min-h-screen bg-bone text-ink">
      <Header />
      <main className="w-full px-5 py-8 md:px-8 xl:px-12">
        <p className="font-pixel text-xs uppercase text-rust">Return file</p>
        <h1 className="font-pixel mt-3 text-2xl uppercase md:text-3xl">
          Return Policy
        </h1>
        <p className="mt-5 max-w-2xl text-sm font-bold leading-relaxed">
          We want every order to land properly. Review the return rules below
          and contact us with your order number before sending anything back.
        </p>
        <div className="mt-8 grid gap-5">
          {sections.map((section) => (
            <section className="border border-ink/15 bg-white/40 p-5" key={section.title}>
              <h2 className="font-pixel text-sm uppercase">{section.title}</h2>
              <p className="mt-3 text-sm font-bold leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-xs font-bold uppercase tracking-wide text-rust">
          Last updated: June 25, 2026
        </p>
      </main>
      <Footer />
    </div>
  );
}
