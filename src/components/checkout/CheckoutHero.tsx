import Image from "next/image";

export function CheckoutHero() {
  return (
    <section className="grid gap-6 bg-[#123f32] px-5 py-10 text-[#ead8bd] md:min-h-[610px] md:grid-cols-[0.9fr_1.1fr] md:px-8 lg:px-10 xl:px-12">
      <div className="relative flex min-h-[480px] flex-col justify-center overflow-hidden py-8 md:min-h-[610px]">
        <p className="text-sm font-black uppercase tracking-wide text-[#efb775]">
          Secure checkout / Drop 001
        </p>
        <h1 className="mt-4 font-black uppercase leading-[0.78] tracking-[-0.07em] text-[clamp(3.8rem,7.8vw,8.4rem)]">
          Checkout
        </h1>
        <p className="font-hand mt-6 max-w-lg text-2xl uppercase leading-tight tracking-wide text-[#d9532f] md:text-3xl">
          Final stop.
          <br />
          No restocks.
          <br />
          Make it yours.
        </p>
        <p className="mt-8 w-fit rotate-[-2deg] bg-[#d8bf8f] px-6 py-4 text-center font-hand text-2xl uppercase leading-tight text-[#17251f]">
          PayHere
          <br />
          ready soon.
        </p>
        <div className="absolute right-8 top-8 hidden text-6xl text-[#efc067] md:block">
          ✶
        </div>
        <div className="absolute bottom-2 left-0 h-3 w-[78%] bg-[repeating-linear-gradient(90deg,#ead8bd_0_12px,#123f32_12px_24px)]" />
      </div>
      <div className="relative min-h-[480px] overflow-hidden md:min-h-[610px]">
        <div className="landing-noise pointer-events-none absolute inset-0 z-20" />
        <figure className="paper-frame absolute left-[6%] top-8 h-[74%] w-[48%] rotate-[-3deg] overflow-hidden bg-[#2f8088]">
          <Image
            alt="Skateboarder wearing Never Found clothing before checkout"
            className="object-cover"
            fill
            priority
            src="/images/landing/hero-skate.svg"
          />
        </figure>
        <figure className="paper-frame absolute bottom-8 right-[4%] h-[70%] w-[45%] rotate-[3deg] overflow-hidden bg-[#ead8bd]">
          <Image
            alt="Never Found graphic t-shirt checkout poster"
            className="object-contain p-6"
            fill
            src="/images/landing/tee-yellow.svg"
          />
        </figure>
        <div className="absolute bottom-12 right-10 z-30 bg-[#d9532f] px-5 py-4 text-3xl font-black uppercase leading-none">
          Visa
          <br />
          Master
        </div>
        <div className="absolute left-[46%] top-12 z-30 rounded-full bg-[#ead8bd] px-4 py-4 text-4xl text-[#17251f]">
          ☺
        </div>
      </div>
    </section>
  );
}
