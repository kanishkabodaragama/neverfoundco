import Image from "next/image";

export function BrandMessage() {
  return (
    <section className="grid gap-6 bg-[#ead8bd] px-5 py-10 md:grid-cols-[0.8fr_1.2fr] md:px-8 lg:px-10 xl:px-12">
      <article className="landing-noise relative min-h-[330px] overflow-hidden bg-[#123f32] p-8 text-[#ead8bd]">
        <p className="font-hand text-3xl lowercase tracking-wide text-[#d9532f]">
          no restocks.
        </p>
        <div className="mt-8 flex items-center gap-6">
          <p className="text-7xl">🌐</p>
          <h2 className="font-black uppercase leading-[0.9] tracking-[-0.04em] text-[clamp(2.5rem,5vw,5rem)]">
            Once
            <br />
            it&apos;s gone,
            <br />
            it&apos;s gone.
          </h2>
        </div>
        <p className="font-hand absolute bottom-8 left-8 rotate-[-3deg] bg-[#d8bf8f] px-5 py-2 text-xl uppercase text-[#17251f]">
          That&apos;s the code.
        </p>
      </article>
      <article className="relative min-h-[330px] overflow-hidden bg-[#2f8088]">
        <Image
          alt="Never Found lifestyle image with city skyline and graphic tee"
          className="object-cover"
          fill
          src="/images/landing/lookbook-3.svg"
        />
        <div className="absolute right-8 top-0 h-20 w-28 rotate-12 bg-[#c94f2e]" />
        <div className="absolute bottom-5 right-8 rotate-[-8deg] bg-[#d9532f] px-5 py-4 text-sm font-black uppercase leading-tight text-[#17251f]">
          Support Real
          <br />
          Support Small
          <br />
          Support Culture
        </div>
      </article>
    </section>
  );
}

