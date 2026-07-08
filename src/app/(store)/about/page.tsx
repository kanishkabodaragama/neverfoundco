import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { StoreArtSurface } from "@/components/site/StoreArtSurface";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The Never Found story: limited drops, skate culture, DIY energy, and good people.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-acid text-ink">
      <Header />
      <StoreArtSurface>
        <section className="w-full bg-acid px-5 py-12 text-ink md:px-8 md:py-20 xl:px-12">
          <div className="font-sans text-[11px] uppercase tracking-normal">
            About Never Found
          </div>
          <h1 className="mt-7 max-w-5xl font-display text-[16vw] uppercase leading-[0.86] md:text-8xl lg:text-9xl">
            Built for people who move different.
          </h1>
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-xl text-sm font-semibold leading-snug md:text-base">
              Never Found is an independent streetwear label shaped by loud
              graphics, clean drops, and the feeling of finding something before
              everyone else does.
            </p>
            <Link
              className="w-fit bg-ink px-6 py-4 font-sans text-xs font-bold uppercase tracking-normal text-acid transition-colors hover:bg-rust hover:text-ink"
              href="/shop"
            >
              Shop current file
            </Link>
          </div>
        </section>
        <section className="bg-acid px-5 py-12 md:px-8 md:py-20 xl:px-12">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-normal text-rust">
              Our point of view
            </p>
            <p className="mt-6 max-w-5xl font-display text-[12vw] uppercase leading-[0.95] md:text-6xl lg:text-7xl">
              We make pieces with presence: bold enough for the street, limited
              enough to feel personal.
            </p>
          </div>
        </section>
        <section className="grid w-full gap-5 bg-acid px-5 py-12 text-ink md:grid-cols-3 md:px-8 md:py-16 xl:px-12">
          {[
            ["01", "Limited by design", "Small batches keep each drop focused and intentional."],
            ["02", "Graphic first", "Every tee starts with artwork that can carry the whole outfit."],
            ["03", "No restock culture", "When a product disappears, the next chapter starts."],
          ].map(([number, title, text]) => (
            <article className="border border-ink p-5" key={number}>
              <p className="font-sans text-[11px] uppercase tracking-normal text-rust">{number}</p>
              <h2 className="mt-4 font-display text-2xl uppercase leading-none">{title}</h2>
              <p className="mt-4 text-sm font-semibold leading-relaxed text-ink/70">{text}</p>
            </article>
          ))}
        </section>
        <section className="grid w-full gap-8 bg-acid px-5 pb-16 text-ink md:grid-cols-[0.8fr_1.2fr] md:px-8 xl:px-12">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-normal text-rust">
              How we work
            </p>
            <h2 className="mt-4 font-display text-5xl uppercase leading-none md:text-7xl">
              Drop small. Design loud.
            </h2>
          </div>
          <div className="grid gap-4 text-sm font-semibold leading-relaxed text-ink/75 md:text-base">
            <p>
              We keep the product list tight so every release has room to be
              seen properly. The goal is not to fill a catalogue. The goal is to
              make pieces that feel worth checking the site for.
            </p>
            <p>
              Our visual language is direct: yellow fields, hard typography,
              strong product photography, and no unnecessary decoration between
              the customer and the drop.
            </p>
            <p>
              Never Found is for the people who like their clothes with a story,
              a little tension, and a deadline.
            </p>
          </div>
        </section>
      </StoreArtSurface>
      <Footer />
    </div>
  );
}
