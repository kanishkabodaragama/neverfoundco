"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { MutableRefObject } from "react";

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

type NvrFndGalleryImage = {
  alt: string;
  src: string;
};

// Gallery title font controls:
// Uses the same Anton-based font as the mobile slide menu.
// fontSizeVw controls mobile scaling, maxFontSizePx caps desktop size.
// letterGapPx adjusts letter spacing in pixels.
// xPx moves the title horizontally: 0 = original, negative = left, positive = right.
const galleryTitleControl = {
  fontFamily: "var(--font-display), Anton, Impact, sans-serif",
  minFontSizePx: 52,
  fontSizeVw: 16,
  maxFontSizePx: 228,
  letterGapPx: 0,
  xPx: 0,
};

// Gallery section controls:
// yPx moves the whole gallery section: 0 = current position, negative = up, positive = down.
// This uses margin so the footer stays directly attached to the gallery.
const gallerySectionControl = {
  yPx: 0,
};

export function NvrFndGallery({
  images = galleryImages,
}: {
  images?: NvrFndGalleryImage[];
}) {
  const displayImages = images.length ? images : galleryImages;
  const stripImages =
    displayImages.length > 1 ? [...displayImages, ...displayImages] : displayImages;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const modalTouchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;

    document.body.classList.add("nvr-gallery-lightbox-open");
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
      document.body.classList.remove("nvr-gallery-lightbox-open");
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex]);

  function syncModalIndex() {
    const node = modalRef.current;
    if (!node) return;

    const index = Math.round(node.scrollLeft / node.clientWidth);
    setActiveIndex(Math.min(displayImages.length - 1, Math.max(0, index)));
  }

  function rememberTouchStart(ref: MutableRefObject<number | null>, x: number) {
    ref.current = x;
  }

  function loopModalOnEdgeSwipe(endX: number) {
    const startX = modalTouchStartX.current;
    modalTouchStartX.current = null;
    if (startX === null || activeIndex === null || displayImages.length < 2) return;

    const deltaX = endX - startX;
    if (Math.abs(deltaX) < 40) return;

    if (deltaX < 0 && activeIndex >= displayImages.length - 1) {
      setActiveIndex(0);
    } else if (deltaX > 0 && activeIndex <= 0) {
      setActiveIndex(displayImages.length - 1);
    }
  }

  function moveModal(direction: -1 | 1) {
    if (activeIndex === null) return;
    setActiveIndex(
      ((activeIndex + direction) % displayImages.length + displayImages.length) %
        displayImages.length,
    );
  }

  return (
    <section
      className="overflow-hidden bg-ink text-ink"
      style={{ marginTop: `${gallerySectionControl.yPx}px` }}
    >
      <div className="overflow-hidden bg-acid px-0 pt-2">
        <h2
          className="inline-block whitespace-nowrap uppercase leading-[0.76]"
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
      </div>
      <div
        aria-label="Never Found gallery strip"
        className="no-scrollbar flex touch-pan-x snap-x snap-mandatory overflow-x-auto scroll-smooth bg-ink"
      >
        {stripImages.map((image, index) => {
          const originalIndex = index % displayImages.length;

          return (
            <button
              aria-label={`Open gallery image ${originalIndex + 1}`}
              className="group relative h-[172px] w-[42vw] shrink-0 snap-start overflow-hidden bg-ink outline-offset-4 transition-opacity duration-200 active:opacity-80 sm:h-[220px] sm:w-[30vw] md:h-[236px] md:w-[24vw] lg:h-[260px] lg:w-[22vw] xl:w-[20vw]"
              data-gallery-slide
              key={`${image.src}-${index}`}
              onClick={() => setActiveIndex(originalIndex)}
              type="button"
            >
              <Image
                alt={image.alt}
                className="object-cover transition-transform duration-300 group-hover:scale-[1.025] motion-reduce:transition-none"
                fill
                sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 22vw, (min-width: 768px) 24vw, (min-width: 640px) 30vw, 42vw"
                src={image.src}
                unoptimized
              />
            </button>
          );
        })}
      </div>

      {activeIndex !== null ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-[90] bg-ink"
          role="dialog"
        >
          <button
            aria-label="Close gallery"
            className="absolute right-4 top-[calc(env(safe-area-inset-top)+1rem)] z-20 grid h-12 w-12 place-items-center text-acid transition-opacity hover:opacity-75"
            onClick={() => setActiveIndex(null)}
            type="button"
          >
            <X className="h-8 w-8" strokeWidth={2.2} />
          </button>
          <button
            aria-label="Previous gallery image"
            className="absolute left-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center bg-acid text-ink transition-colors hover:bg-rust md:grid"
            onClick={() => moveModal(-1)}
            type="button"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2.2} />
          </button>
          <button
            aria-label="Next gallery image"
            className="absolute right-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center bg-acid text-ink transition-colors hover:bg-rust md:grid"
            onClick={() => moveModal(1)}
            type="button"
          >
            <ChevronRight className="h-6 w-6" strokeWidth={2.2} />
          </button>
          <div
            className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
            onScroll={syncModalIndex}
            onTouchEnd={(event) => loopModalOnEdgeSwipe(event.changedTouches[0]?.clientX ?? 0)}
            onTouchStart={(event) =>
              rememberTouchStart(modalTouchStartX, event.touches[0]?.clientX ?? 0)
            }
            ref={modalRef}
          >
            {displayImages.map((image) => (
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
          <div className="pointer-events-none absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-20 flex justify-center">
            <span className="bg-acid px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-ink">
              {(activeIndex + 1).toString().padStart(2, "0")} /{" "}
              {displayImages.length.toString().padStart(2, "0")}
            </span>
          </div>
        </div>
      ) : null}
    </section>
  );
}
