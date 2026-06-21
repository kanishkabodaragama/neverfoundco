import Image from "next/image";
import { countdownItems } from "@/components/site/landing-data";

export function CountdownSection() {
  return (
    <section
      className="relative grid overflow-hidden bg-[#c94f2e] text-[#ead8bd] md:grid-cols-[0.72fr_1fr]"
      id="next-drop"
    >
      <div className="landing-noise pointer-events-none absolute inset-0 z-20" />
      <div className="relative min-h-[220px] overflow-hidden">
        <Image
          alt="Retro van and palm trees announcing the next clothing drop"
          className="object-cover opacity-70 mix-blend-multiply"
          fill
          sizes="(min-width: 768px) 40vw, 100vw"
          src="/images/landing/countdown-van.svg"
        />
        <p className="absolute bottom-5 left-6 rotate-[-8deg] text-4xl">☞</p>
      </div>
      <div className="relative z-10 px-6 py-9 md:px-10">
        <div className="absolute right-8 top-7 hidden text-7xl md:block">☼</div>
        <h2 className="font-black uppercase leading-none tracking-[-0.06em] text-[#17251f] text-[clamp(2.3rem,4.8vw,4.7rem)]">
          Next Drop Loading...
        </h2>
        <div className="mt-6 grid max-w-2xl grid-cols-4 gap-3 text-center">
          {countdownItems.map((item) => (
            <div key={item.label}>
              <p className="text-3xl font-black leading-none md:text-5xl">
                {item.value}
              </p>
              <p className="mt-2 text-xs font-black uppercase md:text-sm">
                {item.label}
              </p>
            </div>
          ))}
        </div>
        <a
          className="mt-8 inline-flex border-2 border-[#ead8bd] px-8 py-3.5 text-sm font-black uppercase transition hover:bg-[#ead8bd] hover:text-[#c94f2e]"
          href="/contact"
        >
          Stay Locked In
        </a>
      </div>
    </section>
  );
}
