import Image from "next/image";

export function AboutHero() {
  return (
    <section className="grid gap-6 bg-[#123f32] px-5 py-10 text-[#ead8bd] md:min-h-[610px] md:grid-cols-[0.95fr_1.05fr] md:px-8 lg:px-10 xl:px-12">
      <div className="relative flex min-h-[480px] flex-col justify-center overflow-hidden py-8 md:min-h-[610px]">
        <h1 className="font-black uppercase leading-[0.82] tracking-[-0.07em] text-[clamp(4rem,8vw,8.7rem)]">
          About
          <br />
          Never Found
        </h1>
        <p className="font-hand mt-6 max-w-lg text-2xl uppercase leading-tight tracking-wide text-[#d9532f] md:text-3xl">
          Good people. Good times.
          <br />
          No normal.
        </p>
        <div className="mt-7 max-w-md space-y-5 text-base font-bold leading-snug md:text-lg">
          <p>
            Never Found is more than a brand. It&apos;s a mindset, a memory,
            and a middle finger to normal.
          </p>
          <p>
            We make limited pieces for the misfits, the dreamers, and the ones
            who&apos;d rather be outside.
          </p>
        </div>
        <div className="absolute right-8 top-8 hidden text-6xl text-[#efc067] md:block">
          ✶
        </div>
        <div className="absolute right-10 top-[42%] hidden rounded-full bg-[#d9532f] px-4 py-4 text-4xl md:block">
          ☠
        </div>
        <div className="absolute bottom-16 right-5 rotate-[4deg] space-y-2 text-[#17251f] md:right-14">
          <p className="bg-[#d8bf8f] px-5 py-2 font-hand text-lg uppercase md:text-xl">
            Built on vibes
          </p>
          <p className="bg-[#d8bf8f] px-5 py-2 font-hand text-lg uppercase md:text-xl">
            Driven by passion
          </p>
        </div>
        <div className="absolute bottom-2 left-0 h-3 w-[78%] bg-[repeating-linear-gradient(90deg,#ead8bd_0_12px,#123f32_12px_24px)]" />
      </div>
      <div className="relative min-h-[480px] overflow-hidden bg-[#2f8088] md:min-h-[610px]">
        <div className="landing-noise pointer-events-none absolute inset-0 z-20" />
        <Image
          alt="Person in Never Found shirt carrying a skateboard near palm trees"
          className="object-cover"
          fill
          priority
          src="/images/landing/lookbook-3.svg"
        />
        <div className="absolute right-6 top-0 z-30 h-20 w-32 rotate-12 bg-[#d8bf8f]/70" />
        <div className="absolute bottom-24 right-12 z-30 rounded-full border-[3px] border-[#ead8bd] px-4 py-4 text-5xl">
          🌐
        </div>
        <div className="absolute bottom-10 right-8 z-30 text-3xl font-black uppercase leading-none text-[#d9532f]">
          World
          <br />
          Wide
        </div>
      </div>
    </section>
  );
}
