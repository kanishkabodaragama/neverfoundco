import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { BehindTheBrand } from "@/components/about/BehindTheBrand";
import { BrandValues } from "@/components/about/BrandValues";
import { Manifesto } from "@/components/about/Manifesto";
import { OurStory } from "@/components/about/OurStory";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Never Found story: limited drops, skate culture, DIY energy, and good people.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-[#F7F1E6] text-[#10131A]">
      <Header />
      <main className="[&>section+section]:mt-6">
        <AboutHero />
        <OurStory />
        <BrandValues />
        <BehindTheBrand />
        <Manifesto />
      </main>
      <Footer />
    </div>
  );
}
