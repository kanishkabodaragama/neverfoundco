"use client";

import Image from "next/image";
import { useState } from "react";
import { heroSlides } from "@/components/site/landing-data";

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = heroSlides[activeIndex];

  return (
    <div className="relative min-h-[500px] overflow-hidden bg-[#2f8088] lg:min-h-[calc(100svh-84px)]">
      <Image
        alt={activeSlide.alt}
        className="h-full w-full object-cover transition duration-300"
        fill
        priority
        sizes="(min-width: 1024px) 55vw, 100vw"
        src={activeSlide.image}
      />
      <div className="absolute inset-0 bg-[#123f32]/10" />
      <div className="absolute left-[-2px] top-0 hidden h-full w-7 bg-[linear-gradient(90deg,#123f32_0,#123f32_45%,transparent_45%)] lg:block" />
      <div className="sticker-star absolute left-4 top-8 z-10 flex h-28 w-28 rotate-[-10deg] items-center justify-center bg-[#ead8bd] p-5 text-center text-sm font-black uppercase leading-none text-[#17251f] md:left-[-1rem] md:top-12 md:h-36 md:w-36 md:text-lg">
        {activeSlide.badge}
      </div>
      <p className="absolute left-6 top-40 z-10 border-2 border-[#ead8bd] bg-[#123f32]/80 px-4 py-2 text-xs font-black uppercase tracking-wide text-[#ead8bd] md:left-10 md:top-48">
        {activeSlide.eyebrow}
      </p>
      <div className="absolute right-7 top-8 z-10 rotate-12 rounded-full border-[3px] border-[#17251f] bg-[#d9532f] px-3 py-4 text-3xl">
        ☠
      </div>
      <div className="absolute bottom-0 right-8 z-10 flex border-2 border-[#d8bf8f] bg-[#d8bf8f]/85 text-base font-black">
        {heroSlides.map((slide, index) => (
          <button
            aria-label={`Show ${slide.eyebrow} slide`}
            className={`px-5 py-3 transition ${
              activeIndex === index ? "bg-[#c94f2e] text-[#ead8bd]" : ""
            }`}
            key={slide.eyebrow}
            onClick={() => setActiveIndex(index)}
            type="button"
          >
            {String(index + 1).padStart(2, "0")}
          </button>
        ))}
      </div>
    </div>
  );
}
