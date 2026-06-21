import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

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
          Placeholder privacy copy. Replace with final policy before launch.
        </p>
      </main>
      <Footer />
    </div>
  );
}
