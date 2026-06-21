import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
      <main>
        <section className="grid w-full gap-8 bg-[#B8A8E8] px-5 py-10 text-[#10131A] md:grid-cols-[0.85fr_1.15fr] md:px-8 xl:px-12">
          <div>
            <p className="font-pixel text-xs uppercase">{"// About"}</p>
            <h1 className="font-pixel mt-4 max-w-2xl text-2xl uppercase leading-tight md:text-3xl">
              We document the unnoticed_
            </h1>
            <p className="mt-5 max-w-xl text-sm font-bold leading-relaxed md:text-base">
              The streets. The noise. The culture that never made it to the map.
              Never Found is a compact drop system for pieces that feel collected,
              not mass produced.
            </p>
            <Link
              className="mt-6 inline-block text-sm font-black uppercase text-[#F05267]"
              href="/shop"
            >
              Shop current level →
            </Link>
          </div>
          <div className="relative min-h-[300px]">
            <Image
              alt="Pixel planet illustration"
              className="object-contain"
              fill
              sizes="(min-width: 768px) 48vw, 100vw"
              src="/images/arcade/pixel-planet.png"
            />
          </div>
        </section>
        <section className="grid w-full gap-4 bg-[#070B12] px-5 py-8 text-[#FFF9EF] md:grid-cols-3 md:px-8 xl:px-12">
          {[
            ["01", "Small drops", "Limited quantities and clear product stories."],
            ["02", "Street files", "Retro arcade rhythm with premium streetwear restraint."],
            ["03", "No overfill", "Clean pages, focused details, and room for product imagery."],
          ].map(([number, title, text]) => (
            <article className="border border-[#FFF9EF]/10 p-5" key={number}>
              <p className="font-pixel text-xs text-[#F05267]">{number}</p>
              <h2 className="font-pixel mt-4 text-sm uppercase">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#FFF9EF]/70">{text}</p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
