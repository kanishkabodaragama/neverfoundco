import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

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
    <div className="min-h-screen bg-[#F7F1E6] text-[#10131A]">
      <Header />
      <main className="w-full px-5 py-8 md:px-8 xl:px-12">
        <p className="font-pixel text-xs uppercase text-[#F05267]">Policy file</p>
        <h1 className="font-pixel mt-3 text-2xl uppercase md:text-3xl">
          Privacy Policy
        </h1>
        <p className="mt-5 max-w-2xl text-sm font-bold leading-relaxed">
          This policy explains how Never Found handles customer information
          when you browse, create an order, contact us, or log in to view your
          order history.
        </p>
        <div className="mt-8 grid gap-5">
          {sections.map((section) => (
            <section className="border border-[#10131A]/15 bg-white/40 p-5" key={section.title}>
              <h2 className="font-pixel text-sm uppercase">{section.title}</h2>
              <p className="mt-3 text-sm font-bold leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-xs font-bold uppercase tracking-wide text-[#F05267]">
          Last updated: June 25, 2026
        </p>
      </main>
      <Footer />
    </div>
  );
}
