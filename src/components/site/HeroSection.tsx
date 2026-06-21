import { HeroSlider } from "@/components/site/HeroSlider";

export function HeroSection() {
  return (
    <section className="relative grid overflow-hidden bg-[#123f32] lg:min-h-[calc(100svh-84px)] lg:grid-cols-[0.94fr_1.06fr]">
      <div className="landing-noise pointer-events-none absolute inset-0 z-20" />
      <div className="relative z-10 flex min-h-[calc(100svh-76px)] flex-col justify-center overflow-hidden px-6 py-10 text-[#ead8bd] md:px-12 lg:min-h-[calc(100svh-84px)] lg:px-16 xl:px-20">
        <div className="absolute bottom-0 left-0 h-3 w-[58%] bg-[repeating-linear-gradient(90deg,#ead8bd_0_12px,#123f32_12px_24px)]" />
        <p className="text-sm font-black uppercase leading-tight tracking-wide text-[#efb775] md:text-base">
          D.E.D Summer
          <br />
          Drop 001
        </p>
        <h1 className="mt-5 max-w-[620px] font-black uppercase leading-[0.84] tracking-[-0.055em] text-[clamp(3.6rem,7.6vw,8.8rem)]">
          Limited
          <br />
          Drops.
          <br />
          <span className="text-[#d9532f]">Never Normal.</span>
        </h1>
        <p className="mt-5 max-w-md text-xl font-black leading-tight md:text-2xl">
          3-4 pieces. Once they&apos;re gone, they&apos;re gone.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-6">
          <a
            className="border-2 border-[#d9532f] px-7 py-3.5 text-sm font-black uppercase tracking-wide text-[#efc067] transition hover:bg-[#d9532f] hover:text-[#123f32]"
            href="/shop"
          >
            Shop Drop 001 -&gt;
          </a>
        </div>
        <div className="absolute right-8 top-8 hidden h-16 w-16 rotate-12 items-center justify-center text-4xl text-[#efc067] md:flex">
          ✶
        </div>
        <div className="absolute bottom-20 right-10 hidden text-4xl md:block">☺</div>
      </div>
      <HeroSlider />
    </section>
  );
}
