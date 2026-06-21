import Image from "next/image";

export function ShopHero() {
  return (
    <section className="grid gap-6 bg-[#123f32] px-5 py-10 text-[#ead8bd] md:min-h-[610px] md:grid-cols-[0.85fr_1.15fr] md:px-8 lg:px-10 xl:px-12">
      <div className="relative flex min-h-[480px] flex-col justify-center overflow-hidden py-8 md:min-h-[610px]">
        <div className="absolute right-6 top-5 hidden text-5xl text-[#efc067] md:block">
          ✶
        </div>
        <p className="text-sm font-black uppercase tracking-wide text-[#efb775]">
          Drop room / catalog 001
        </p>
        <h1 className="mt-4 font-black uppercase leading-[0.78] tracking-[-0.07em] text-[clamp(4rem,8.5vw,9rem)]">
          Shop
        </h1>
        <p className="mt-6 max-w-md text-xl font-black leading-tight md:text-2xl">
          Limited pieces.
          <br />
          No restocks.
          <br />
          Grab what you love before it&apos;s gone.
        </p>
        <div className="absolute bottom-2 left-0 h-3 w-[75%] bg-[repeating-linear-gradient(90deg,#ead8bd_0_12px,#123f32_12px_24px)]" />
      </div>
      <div className="relative min-h-[480px] overflow-hidden md:min-h-[610px]">
        <div className="landing-noise pointer-events-none absolute inset-0 z-20" />
        <figure className="paper-frame absolute left-0 top-8 h-[58%] w-[54%] rotate-[-3deg] overflow-hidden border-2 border-[#17251f] bg-[#2f8088]">
          <Image
            alt="Skate lifestyle collage image for shop catalog"
            className="object-cover"
            fill
            src="/images/landing/hero-skate.svg"
          />
        </figure>
        <figure className="paper-frame absolute bottom-8 right-0 h-[58%] w-[52%] rotate-[3deg] overflow-hidden border-2 border-[#17251f] bg-[#ead8bd]">
          <Image
            alt="Graphic t-shirt product collage image"
            className="object-contain p-5"
            fill
            src="/images/landing/tee-black.svg"
          />
        </figure>
        <figure className="paper-frame absolute right-[27%] top-0 h-[40%] w-[38%] rotate-[7deg] overflow-hidden border-2 border-[#17251f] bg-[#c94f2e]">
          <Image
            alt="Retro poster block in shop hero collage"
            className="object-cover mix-blend-multiply"
            fill
            src="/images/landing/lookbook-2.svg"
          />
        </figure>
        <div className="sticker-star absolute right-5 top-10 z-30 flex h-28 w-28 rotate-12 items-center justify-center bg-[#ead8bd] p-5 text-center text-sm font-black uppercase leading-none text-[#17251f]">
          No
          <br />
          Restocks
        </div>
        <div className="absolute bottom-7 left-5 z-30 rounded-full border-[3px] border-[#17251f] bg-[#d9532f] px-4 py-4 text-3xl">
          🌎
        </div>
      </div>
    </section>
  );
}
