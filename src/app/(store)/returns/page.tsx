import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

export const metadata: Metadata = {
  title: "Return Policy",
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[#F7F1E6] text-[#10131A]">
      <Header />
      <main className="w-full px-5 py-8 md:px-8 xl:px-12">
        <p className="font-pixel text-xs uppercase text-[#F05267]">Return file</p>
        <h1 className="font-pixel mt-3 text-2xl uppercase md:text-3xl">
          Return Policy
        </h1>
        <p className="mt-5 max-w-2xl text-sm font-bold leading-relaxed">
          Placeholder return policy copy. Replace with final return terms before launch.
        </p>
      </main>
      <Footer />
    </div>
  );
}
