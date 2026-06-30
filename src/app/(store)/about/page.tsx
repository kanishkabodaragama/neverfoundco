import type { Metadata } from "next";
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
    <div className="min-h-screen w-full bg-ink text-bone">
      <Header />
      <main>
        <section className="w-full bg-acid px-5 py-12 text-ink md:px-8 md:py-20 xl:px-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.28em]">
            Evidence log / manifesto
          </div>
          <h1 className="mt-7 max-w-5xl font-display text-[16vw] uppercase leading-[0.86] md:text-8xl lg:text-9xl">
            Streetwear made to disappear.
          </h1>
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-xl text-sm font-semibold leading-snug md:text-base">
              The streets. The noise. The culture that never made it to the
              map. Never Found is a compact drop system for pieces that feel
              collected, not mass produced.
            </p>
            <Link
              className="w-fit bg-ink px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.28em] text-acid transition-colors hover:bg-bone hover:text-ink"
              href="/shop"
            >
              Shop current file
            </Link>
          </div>
        </section>
        <section className="bg-ink px-5 py-16 md:px-8 md:py-28 xl:px-12">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-acid">
              Evidence log / 01
            </p>
            <p className="text-stroke mt-6 max-w-5xl font-display text-[12vw] uppercase leading-[0.95] md:text-6xl lg:text-7xl">
              We do not restock. We do not archive. Wear it before it disappears.
            </p>
          </div>
        </section>
        <section className="grid w-full gap-5 bg-bone px-5 py-16 text-ink md:grid-cols-3 md:px-8 xl:px-12">
          {[
            ["01", "Small drops", "Limited quantities and clear product stories."],
            ["02", "Case files", "Every item is logged like evidence before it disappears."],
            ["03", "No overfill", "Clean pages, hard edges, and room for the product."],
          ].map(([number, title, text]) => (
            <article className="border border-ink p-5" key={number}>
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-rust">{number}</p>
              <h2 className="mt-4 font-display text-2xl uppercase leading-none">{title}</h2>
              <p className="mt-4 text-sm font-semibold leading-relaxed text-ink/70">{text}</p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
