"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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
  minFontSizePx: 10,
  fontSizeVw: 15,
  maxFontSizePx: 128,
  letterGapPx: 0,
  xPx: -20,
};

// Gallery section controls:
// yPx moves the whole gallery section: 0 = current position, negative = up, positive = down.
// This uses margin so the footer stays directly attached to the gallery.
// visibleSlides controls how many tiles show in the carousel. 3.3 = 3 full images plus 30% of the next.
const gallerySectionControl = {
  yPx: 0,
  visibleSlides: 3.3,
  mobileHeightPx: 190,
  desktopHeightPx: 288,
};

export function NvrFndGallery({
  images = galleryImages,
}: {
  images?: NvrFndGalleryImage[];
}) {
  const displayImages = images.length ? images : galleryImages;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const stripTouchStartX = useRef<number | null>(null);
  const modalTouchStartX = useRef<number | null>(null);
  const isLoopingStrip = useRef(false);

  const syncStripToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "auto") => {
      const node = stripRef.current;
      const slide = node?.querySelector<HTMLElement>("[data-gallery-slide]");
      if (!node || !slide) return;

      node.scrollTo({
        left: slide.offsetWidth * index,
        behavior,
      });
    },
    [],
  );

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

  useEffect(() => {
    if (activeIndex === null) return;

    syncStripToIndex(activeIndex, "smooth");
  }, [activeIndex, syncStripToIndex]);

  function syncModalIndex() {
    const node = modalRef.current;
    if (!node) return;

    const index = Math.round(node.scrollLeft / node.clientWidth);
    setActiveIndex(Math.min(displayImages.length - 1, Math.max(0, index)));
  }

  function getCurrentStripIndex() {
    const node = stripRef.current;
    const slide = node?.querySelector<HTMLElement>("[data-gallery-slide]");
    if (!node || !slide) return 0;

    return Math.round(node.scrollLeft / slide.offsetWidth);
  }

  function rememberTouchStart(ref: MutableRefObject<number | null>, x: number) {
    ref.current = x;
  }

  function loopStripOnEdgeSwipe(endX: number) {
    const startX = stripTouchStartX.current;
    stripTouchStartX.current = null;
    if (startX === null || displayImages.length < 2) return;

    const deltaX = endX - startX;
    if (Math.abs(deltaX) < 40) return;

    const index = getCurrentStripIndex();
    if (deltaX < 0 && index >= displayImages.length - 1) {
      syncStripToIndex(0, "smooth");
    } else if (deltaX > 0 && index <= 0) {
      syncStripToIndex(displayImages.length - 1, "smooth");
    }
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

  function loopStripAtScrollEnd() {
    const node = stripRef.current;
    if (!node || isLoopingStrip.current || displayImages.length < 2) return;

    const maxScrollLeft = node.scrollWidth - node.clientWidth;
    if (maxScrollLeft <= 0) return;

    if (node.scrollLeft >= maxScrollLeft - 1) {
      isLoopingStrip.current = true;
      requestAnimationFrame(() => {
        node.scrollTo({ left: 0, behavior: "smooth" });
        window.setTimeout(() => {
          isLoopingStrip.current = false;
        }, 300);
      });
    }
  }

  return (
    <section
      className="overflow-hidden bg-transparent text-ink"
      style={{ marginTop: `${gallerySectionControl.yPx}px` }}
    >
      <h2
        className="whitespace-nowrap px-5 uppercase leading-none md:px-8"
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
        className="no-scrollbar flex touch-pan-x snap-x snap-mandatory overflow-x-auto scroll-smooth bg-ink"
        onScroll={loopStripAtScrollEnd}
        onTouchEnd={(event) => loopStripOnEdgeSwipe(event.changedTouches[0]?.clientX ?? 0)}
        onTouchStart={(event) =>
          rememberTouchStart(stripTouchStartX, event.touches[0]?.clientX ?? 0)
        }
        ref={stripRef}
      >
        {displayImages.map((image, index) => (
          <button
            aria-label={`Open gallery image ${index + 1}`}
            className="relative snap-start overflow-hidden bg-ink"
            data-gallery-slide
            key={image.src}
            onClick={() => setActiveIndex(index)}
            style={{
              flex: `0 0 calc(100% / ${gallerySectionControl.visibleSlides})`,
              height: `clamp(${gallerySectionControl.mobileHeightPx}px, 26vw, ${gallerySectionControl.desktopHeightPx}px)`,
            }}
            type="button"
          >
            <Image
              alt={image.alt}
              className="object-cover"
              fill
              sizes={`calc(100vw / ${gallerySectionControl.visibleSlides})`}
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
        </div>
      ) : null}
    </section>
  );
}
