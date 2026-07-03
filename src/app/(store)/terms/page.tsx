import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { StoreArtSurface } from "@/components/site/StoreArtSurface";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Never Found website, checkout, preorder, and account terms.",
};

const sections = [
  {
    title: "Using the website",
    body: "By using the Never Found website, you agree to use it only for lawful shopping, account, and support purposes. We may update products, prices, availability, and website content at any time.",
  },
  {
    title: "Orders",
    body: "An order is confirmed only after checkout is completed and the payment status is accepted or the selected payment method is approved. We may cancel orders affected by stock errors, payment issues, suspected fraud, or incorrect customer information.",
  },
  {
    title: "Product information",
    body: "We try to show product images, colours, sizes, and descriptions accurately. Small differences may occur due to screen settings, photography, production batches, or fabric behaviour.",
  },
  {
    title: "Pre-orders",
    body: "Pre-order products are sold before dispatch is ready. Start dates, end dates, fulfilment windows, and quantity limits are controlled by the admin panel and may change if production or delivery timelines shift.",
  },
  {
    title: "Customer accounts",
    body: "When an order is placed, a customer account may be available using the order email and latest order number. Customers are responsible for keeping order details private.",
  },
  {
    title: "Promotions",
    body: "Coupon codes, discounts, and campaigns may have usage limits, product restrictions, expiry dates, and eligibility rules. We may pause or remove promotions when needed.",
  },
  {
    title: "Liability",
    body: "Never Found is not responsible for indirect losses caused by website downtime, delivery delays outside our control, payment provider interruptions, or incorrect information submitted by customers.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-acid text-ink">
      <Header />
      <StoreArtSurface>
      <div className="w-full px-5 py-8 md:px-8 xl:px-12">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-rust">Terms file</p>
        <h1 className="mt-4 font-display text-5xl uppercase leading-none md:text-7xl">
          Terms and Conditions
        </h1>
        <p className="mt-5 max-w-2xl text-sm font-semibold leading-relaxed text-ink/70">
          These terms apply when you browse the website, place an order, use a
          coupon, join a pre-order, or log in to view order history.
        </p>
        <div className="mt-8 grid gap-5">
          {sections.map((section) => (
            <section className="border border-ink bg-transparent p-5" key={section.title}>
              <h2 className="font-display text-2xl uppercase leading-none">{section.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-ink/70">{section.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-8 max-w-2xl font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-rust">
          Last updated: June 25, 2026
        </p>
      </div>
      </StoreArtSurface>
      <Footer />
    </div>
  );
}
