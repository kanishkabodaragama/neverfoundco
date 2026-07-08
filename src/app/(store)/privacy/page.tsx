import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { StoreArtSurface } from "@/components/site/StoreArtSurface";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Never Found collects, uses, and protects customer information.",
};

const sections = [
  {
    title: "Information we collect",
    body: "We collect the information needed to process orders and support customers, including your name, email address, phone number, delivery address, order details, payment status, and messages sent through the contact form.",
  },
  {
    title: "How we use information",
    body: "We use customer information to confirm orders, arrange delivery, provide order updates, respond to support requests, improve the storefront, and prevent fraud or misuse of the website.",
  },
  {
    title: "Payments",
    body: "Payment information is handled by the selected payment gateway. Never Found does not store full card numbers or sensitive payment credentials on this website.",
  },
  {
    title: "Cookies and analytics",
    body: "The website may use essential cookies for cart, login, checkout, and admin functions. We may also use basic analytics to understand page performance and improve shopping flows.",
  },
  {
    title: "Sharing information",
    body: "We only share information with service providers needed to operate the store, such as payment processors, delivery partners, hosting providers, and technical support teams.",
  },
  {
    title: "Your choices",
    body: "You can contact us to request access, correction, or deletion of your customer information where legally and operationally possible.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-acid text-ink">
      <Header />
      <StoreArtSurface>
      <div className="w-full px-5 py-8 md:px-8 xl:px-12">
        <p className="font-sans text-[11px] font-bold uppercase tracking-normal text-rust">Policy file</p>
        <h1 className="mt-4 font-display text-5xl uppercase leading-none md:text-7xl">
          Privacy Policy
        </h1>
        <p className="mt-5 max-w-2xl text-sm font-semibold leading-relaxed text-ink/70">
          This policy explains how Never Found handles customer information
          when you browse, create an order, contact us, or log in to view your
          order history.
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
