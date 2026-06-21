import type { Metadata } from "next";
import { BrandMessage } from "@/components/contact/BrandMessage";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { FaqSection } from "@/components/contact/FaqSection";
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
      <main className="[&>section+section]:mt-6">
        <ContactHero />
        <section
          className="grid gap-10 bg-[#ead8bd] px-5 py-10 md:grid-cols-[1fr_1.1fr] md:px-8 lg:px-10 xl:px-12"
          id="contact"
        >
          <ContactForm />
          <ContactInfo />
        </section>
        <FaqSection />
        <BrandMessage />
      </main>
      <Footer />
    </div>
  );
}
