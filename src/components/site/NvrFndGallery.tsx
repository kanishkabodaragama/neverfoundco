"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const galleryImages = [
  {
    alt: "Never Found gallery image 1",
    src: "/images/products/home-drop/never-found-tiger-lounge-tee.jpg",
  },
  {
    alt: "Never Found gallery image 2",
    src: "/images/products/home-drop/never-found-summer-burn-tee.jpg",
  },
  {
    alt: "Never Found gallery image 3",
    src: "/images/products/home-drop/never-found-pink-smoke-tee.jpg",
  },
  {
    alt: "Never Found gallery image 4",
    src: "/images/products/home-drop/never-found-logo-tee.jpg",
  },
];

// Gallery title font controls:
// Uses the same Anton-based font as the mobile slide menu.
// fontSizeVw controls mobile scaling, maxFontSizePx caps desktop size.
// letterGapPx adjusts letter spacing in pixels.
// xPx moves the title horizontally: 0 = original, negative = left, positive = right.
const galleryTitleControl = {
  fontFamily: "var(--font-display), Anton, Impact, sans-serif",
  minFontSizePx: 25,
  fontSizeVw: 20.5,
  maxFontSizePx: 128,
  letterGapPx: 0,
  xPx: -20,
};

export function NvrFndGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;

    document.body.style.overflow = "hidden";
    modalRef.current?.scrollTo({
      left: modalRef.current.clientWidth * activeIndex,
      behavior: "auto",
    });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex]);

  function syncModalIndex() {
    const node = modalRef.current;
    if (!node) return;

    const index = Math.round(node.scrollLeft / node.clientWidth);
    setActiveIndex(Math.min(galleryImages.length - 1, Math.max(0, index)));
  }

  return (
    <section className="overflow-hidden bg-transparent py-10 text-ink md:py-14">
      <h2
        className="whitespace-nowrap px-5 uppercase leading-[0.82] md:px-8"
        style={{
          fontFamily: galleryTitleControl.fontFamily,
          fontSize: `clamp(${galleryTitleControl.minFontSizePx}px, ${galleryTitleControl.fontSizeVw}vw, ${galleryTitleControl.maxFontSizePx}px)`,
          fontStyle: "italic",
          letterSpacing: `${galleryTitleControl.letterGapPx}px`,
          transform: `translateX(${galleryTitleControl.xPx}px)`,
        }}
      >
        NVR FND GALLERY
      </h2>
      <div
        className="no-scrollbar mt-3 flex snap-x snap-mandatory overflow-x-auto scroll-smooth bg-ink"
        ref={stripRef}
      >
        {galleryImages.map((image, index) => (
          <button
            aria-label={`Open gallery image ${index + 1}`}
            className="relative h-48 min-w-[72vw] snap-center overflow-hidden bg-ink md:h-72 md:min-w-[34vw]"
            key={image.src}
            onClick={() => setActiveIndex(index)}
            type="button"
          >
            <Image
              alt={image.alt}
              className="object-cover"
              fill
              sizes="(min-width: 768px) 34vw, 72vw"
              src={image.src}
              unoptimized
            />
          </button>
        ))}
      </div>

      {activeIndex !== null ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-[90] bg-ink"
          role="dialog"
        >
          <button
            aria-label="Close gallery"
            className="absolute right-4 top-4 z-20 grid h-12 w-12 place-items-center text-acid"
            onClick={() => setActiveIndex(null)}
            type="button"
          >
            <span className="absolute h-9 w-0.5 rotate-45 bg-acid" />
            <span className="absolute h-9 w-0.5 -rotate-45 bg-acid" />
          </button>
          <div
            className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
            onScroll={syncModalIndex}
            ref={modalRef}
          >
            {galleryImages.map((image) => (
              <div className="relative h-full min-w-full snap-center" key={image.src}>
                <Image
                  alt={image.alt}
                  className="object-contain p-4"
                  fill
                  sizes="100vw"
                  src={image.src}
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
