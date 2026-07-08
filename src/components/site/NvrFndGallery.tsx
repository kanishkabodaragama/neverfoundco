"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

type NvrFndGalleryImage = {
  alt: string;
  href?: string;
  src: string;
};

const galleryImages: NvrFndGalleryImage[] = [
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
// xPx/yPx move the title. textAlign controls left, center, or right alignment.
const galleryTitleControl = {
  fontFamily: "var(--font-display), Anton, Impact, sans-serif",
  minFontSizePx: 10,
  fontSizeVw: 15.7,
  maxFontSizePx: 128,
  letterGapPx: 0,
  xPx: -25,
  yPx: 6,
  textAlign: "left" as "left" | "center" | "right",
};

// Gallery section controls:
// yPx moves the whole gallery section: 0 = current position, negative = up, positive = down.
// This uses margin so the footer stays directly attached to the gallery.
// visibleSlides controls how many tiles show in the carousel.
const gallerySectionControl = {
  yPx: 0,
  visibleSlides: 4,
  mobileHeightPx: 217,
  desktopHeightPx: 217,
};

export function NvrFndGallery({
  images = galleryImages,
  lightbox = true,
  slideAspectRatio,
  slideHeightPx,
  title = "NVR FND GALLERY",
  visibleSlides = gallerySectionControl.visibleSlides,
}: {
  images?: NvrFndGalleryImage[];
  lightbox?: boolean;
  slideAspectRatio?: string;
  slideHeightPx?: number;
  title?: string;
  visibleSlides?: number;
}) {
  const displayImages = (images.length ? images : galleryImages).slice(0, 4);
  const loopedImages = useMemo(
    () => [...displayImages, ...displayImages, ...displayImages],
    [displayImages],
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const isRepositioningStrip = useRef(false);
  const isRepositioningModal = useRef(false);

  const syncStripToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "auto") => {
      const node = stripRef.current;
      const slide = node?.querySelector<HTMLElement>("[data-gallery-slide]");
      if (!node || !slide) return;

      node.scrollTo({
        left: slide.offsetWidth * (displayImages.length + index),
        behavior,
      });
    },
    [displayImages.length],
  );

  const keepStripInMiddleSet = useCallback(() => {
    const node = stripRef.current;
    const slide = node?.querySelector<HTMLElement>("[data-gallery-slide]");
    if (!node || !slide || displayImages.length < 2 || isRepositioningStrip.current) {
      return;
    }

    const setWidth = slide.offsetWidth * displayImages.length;
    if (setWidth <= 0) return;

    let nextScrollLeft = node.scrollLeft;
    if (node.scrollLeft < slide.offsetWidth) {
      nextScrollLeft = node.scrollLeft + setWidth;
    } else if (node.scrollLeft >= setWidth * 2) {
      nextScrollLeft = node.scrollLeft - setWidth;
    } else {
      return;
    }

    isRepositioningStrip.current = true;
    node.scrollTo({ left: nextScrollLeft, behavior: "auto" });
    requestAnimationFrame(() => {
      isRepositioningStrip.current = false;
    });
  }, [displayImages.length]);

  const keepModalInMiddleSet = useCallback(() => {
    const node = modalRef.current;
    if (!node || displayImages.length < 2 || isRepositioningModal.current) {
      return;
    }

    const setWidth = node.clientWidth * displayImages.length;
    if (setWidth <= 0) return;

    let nextScrollLeft = node.scrollLeft;
    if (node.scrollLeft < node.clientWidth) {
      nextScrollLeft = node.scrollLeft + setWidth;
    } else if (node.scrollLeft >= setWidth * 2) {
      nextScrollLeft = node.scrollLeft - setWidth;
    } else {
      return;
    }

    isRepositioningModal.current = true;
    node.scrollTo({ left: nextScrollLeft, behavior: "auto" });
    requestAnimationFrame(() => {
      isRepositioningModal.current = false;
    });
  }, [displayImages.length]);

  useLayoutEffect(() => {
    syncStripToIndex(0);
  }, [syncStripToIndex]);

  useEffect(() => {
    window.addEventListener("resize", keepStripInMiddleSet);
    return () => window.removeEventListener("resize", keepStripInMiddleSet);
  }, [keepStripInMiddleSet]);

  useEffect(() => {
    if (!lightbox || activeIndex === null) return;

    document.body.classList.add("nvr-gallery-lightbox-open");
    document.body.style.overflow = "hidden";
    modalRef.current?.scrollTo({
      left: modalRef.current.clientWidth * (displayImages.length + activeIndex),
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
  }, [activeIndex, displayImages.length, lightbox]);

  useEffect(() => {
    if (!lightbox || activeIndex === null) return;

    syncStripToIndex(activeIndex, "smooth");
  }, [activeIndex, lightbox, syncStripToIndex]);

  function syncModalIndex() {
    const node = modalRef.current;
    if (!node) return;

    keepModalInMiddleSet();
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
          textAlign: galleryTitleControl.textAlign,
          transform: `translate(${galleryTitleControl.xPx}px, ${galleryTitleControl.yPx}px)`,
        }}
      >
        {title}
      </h2>
      <div
        className="no-scrollbar flex w-full touch-pan-x snap-x snap-mandatory overflow-x-auto bg-ink"
        onScroll={keepStripInMiddleSet}
        ref={stripRef}
      >
        {loopedImages.map((image, index) => {
          const imageIndex = index % displayImages.length;
          const slideStyle: CSSProperties = {
            flex: `0 0 calc(100% / ${visibleSlides})`,
          };

          if (slideAspectRatio) {
            slideStyle.aspectRatio = slideAspectRatio;
          } else {
            slideStyle.height = slideHeightPx
              ? `${slideHeightPx}px`
              : `clamp(${gallerySectionControl.mobileHeightPx}px, 26vw, ${gallerySectionControl.desktopHeightPx}px)`;
          }

          const imageNode = (
            <Image
              alt={image.alt}
              className="object-cover"
              fill
              sizes={`calc(100vw / ${visibleSlides})`}
              src={image.src}
              unoptimized
            />
          );

          if (image.href) {
            return (
              <Link
                aria-label={`View product ${imageIndex + 1}`}
                className="relative snap-start overflow-hidden bg-ink"
                data-gallery-slide
                href={image.href}
                key={`${image.src}-${index}`}
                style={slideStyle}
              >
                {imageNode}
              </Link>
            );
          }

          return (
            <button
              aria-label={`Open gallery image ${imageIndex + 1}`}
              className="relative snap-start overflow-hidden bg-ink"
              data-gallery-slide
              key={`${image.src}-${index}`}
              onClick={() => {
                if (lightbox) setActiveIndex(imageIndex);
              }}
              style={slideStyle}
              type="button"
            >
              {imageNode}
            </button>
          );
        })}
      </div>

      {lightbox && activeIndex !== null ? (
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
            className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto"
            onScroll={syncModalIndex}
            ref={modalRef}
          >
            {loopedImages.map((image, index) => (
              <div
                className="relative h-full min-w-full snap-center"
                key={`${image.src}-modal-${index}`}
              >
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
