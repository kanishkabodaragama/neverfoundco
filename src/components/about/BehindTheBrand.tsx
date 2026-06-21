import Image from "next/image";
import { processCards } from "@/components/about/about-data";

export function BehindTheBrand() {
  return (
    <section className="grid gap-7 bg-[#ead8bd] px-5 py-10 md:px-8 lg:grid-cols-[1.35fr_0.85fr] lg:px-10 xl:px-12">
      <div>
        <div className="mb-5 flex items-center gap-6">
          <h2 className="text-4xl font-black uppercase tracking-[-0.05em]">
            Behind The Brand
          </h2>
          <span className="font-hand text-4xl text-[#17251f]">~~~</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {processCards.map((card) => (
            <article className="space-y-3" key={card.title}>
              <div className="paper-frame relative aspect-[4/3.2] overflow-hidden bg-[#123f32]">
                <Image alt={card.alt} className="object-cover" fill src={card.src} />
              </div>
              <h3 className="text-sm font-black uppercase">{card.title}</h3>
            </article>
          ))}
        </div>
      </div>
      <article className="landing-noise relative min-h-[300px] overflow-hidden bg-[#123f32] p-8 text-[#ead8bd]">
        <h2 className="max-w-sm text-4xl font-black uppercase leading-[0.98] tracking-[-0.04em] md:text-5xl">
          We&apos;re small.
          <br />
          We care.
          <br />
          We do this
          <br />
          for real.
        </h2>
        <p className="absolute right-10 top-8 text-7xl">🌐</p>
        <p className="font-hand absolute bottom-8 right-8 rotate-[6deg] bg-[#d8bf8f] px-5 py-3 text-xl uppercase leading-tight text-[#17251f]">
          Support real
          <br />
          Support small
          <br />
          Support culture
        </p>
        <p className="absolute bottom-8 left-8 text-4xl">☠</p>
      </article>
    </section>
  );
}

