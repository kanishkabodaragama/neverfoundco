import Image from "next/image";

export function ContactHero() {
  return (
    <section className="grid gap-6 bg-[#123f32] px-5 py-10 text-[#ead8bd] md:min-h-[610px] md:grid-cols-[0.9fr_1.1fr] md:px-8 lg:px-10 xl:px-12">
      <div className="relative flex min-h-[480px] flex-col justify-center overflow-hidden py-8 md:min-h-[610px]">
        <h1 className="font-black uppercase leading-[0.78] tracking-[-0.07em] text-[clamp(4rem,8.5vw,9rem)]">
          Contact
        </h1>
        <p className="font-hand mt-6 text-3xl uppercase tracking-wide text-[#d9532f]">
          We&apos;re real ones.
        </p>
        <p className="mt-6 max-w-lg text-xl font-bold leading-snug md:text-2xl">
          Got a question, an idea,
          <br />
          or just wanna say what&apos;s up?
          <br />
          We&apos;d love to hear from you.
        </p>
        <div className="absolute right-8 top-8 hidden text-6xl text-[#efc067] md:block">
          ✶
        </div>
        <div className="absolute right-12 top-[44%] hidden rounded-full bg-[#d9532f] px-4 py-4 text-4xl md:block">
          ☠
        </div>
        <div className="absolute bottom-16 right-6 rotate-[-4deg] space-y-2 text-[#17251f] md:right-16">
          <p className="bg-[#d8bf8f] px-5 py-2 font-hand text-xl uppercase">
            Keep it
          </p>
          <p className="bg-[#d8bf8f] px-5 py-2 font-hand text-xl uppercase">
            Real
          </p>
        </div>
        <p className="absolute bottom-10 right-10 hidden text-5xl md:block">☺</p>
        <div className="absolute bottom-2 left-0 h-3 w-[78%] bg-[repeating-linear-gradient(90deg,#ead8bd_0_12px,#123f32_12px_24px)]" />
      </div>
      <div className="relative min-h-[480px] overflow-hidden bg-[#2f8088] md:min-h-[610px]">
        <div className="landing-noise pointer-events-none absolute inset-0 z-20" />
        <Image
          alt="Skateboarder flying over a California skatepark in Never Found clothing"
          className="object-cover"
          fill
          priority
          src="/images/landing/hero-skate.svg"
        />
        <div className="absolute right-6 top-0 z-30 h-20 w-32 rotate-12 bg-[#d8bf8f]/70" />
        <div className="absolute bottom-20 right-10 z-30 rounded-full border-[3px] border-[#17251f] bg-[#ead8bd] px-4 py-4 text-4xl">
          🌐
        </div>
        <div className="absolute bottom-8 right-7 z-30 bg-[#d9532f] px-4 py-3 text-3xl font-black uppercase leading-none text-[#ead8bd]">
          World
          <br />
          Wide
        </div>
      </div>
    </section>
  );
}
