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
          <p className="mt-4 max-w-xl text-sm font-bold leading-relaxed">
            Questions about drops, orders, sizing, or collaborations. Keep it
            short and we will get back to you.
          </p>
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
