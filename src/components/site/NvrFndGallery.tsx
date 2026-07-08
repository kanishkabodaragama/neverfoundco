"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { TouchEvent } from "react";

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
// visibleSlides controls how many tiles show in the carousel. 3.3 = 3 full images plus 30% of the next.
const gallerySectionControl = {
  yPx: 0,
  visibleSlides: 3.3,
  mobileHeightPx: 190,
  desktopHeightPx: 288,
};

export function NvrFndGallery({
  images = galleryImages,
  lightbox = true,
  title = "NVR FND GALLERY",
  visibleSlides = gallerySectionControl.visibleSlides,
}: {
  images?: NvrFndGalleryImage[];
  lightbox?: boolean;
  title?: string;
  visibleSlides?: number;
}) {
  const displayImages = images.length ? images : galleryImages;
  const loopedImages = useMemo(
    () => [...displayImages, ...displayImages, ...displayImages],
    [displayImages],
  );
  const stripSlides = useMemo(
    () =>
      displayImages.length > 1
        ? [displayImages[displayImages.length - 1], ...displayImages, displayImages[0]]
        : displayImages,
    [displayImages],
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [stripPosition, setStripPosition] = useState(1);
  const [isStripResetting, setIsStripResetting] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const isRepositioningModal = useRef(false);
  const stripTouchStart = useRef<{ x: number; y: number } | null>(null);
  const stripSwipeTriggered = useRef(false);
  const isStripAnimating = useRef(false);
  const displayedStripPosition = displayImages.length > 1 ? stripPosition : 0;

  function keepModalInMiddleSet() {
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
  }

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

  function syncModalIndex() {
    const node = modalRef.current;
    if (!node) return;

    keepModalInMiddleSet();
  }

  function rotateStrip(direction: 1 | -1) {
    if (displayImages.length < 2 || isStripAnimating.current) return;

    isStripAnimating.current = true;
    setIsStripResetting(false);
    setStripPosition((position) => position + direction);
  }

  function settleLoopedStrip() {
    if (displayImages.length < 2) return;

    if (stripPosition === 0) {
      setIsStripResetting(true);
      setStripPosition(displayImages.length);
    } else if (stripPosition === displayImages.length + 1) {
      setIsStripResetting(true);
      setStripPosition(1);
    }

    isStripAnimating.current = false;
  }

  function handleStripTouchStart(event: TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0];
    if (!touch) return;

    stripSwipeTriggered.current = false;
    stripTouchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  }

  function handleStripTouchMove(event: TouchEvent<HTMLDivElement>) {
    const start = stripTouchStart.current;
    const touch = event.touches[0];
    if (!start || !touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault();
    }
  }

  function handleStripTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = stripTouchStart.current;
    const touch = event.changedTouches[0];
    stripTouchStart.current = null;
    if (!start || !touch || displayImages.length < 2) return;

    const deltaX = touch.clientX - start.x;
    if (Math.abs(deltaX) < 40) return;

    stripSwipeTriggered.current = true;
    rotateStrip(deltaX < 0 ? 1 : -1);
  }

  function shouldCancelClickAfterSwipe() {
    if (!stripSwipeTriggered.current) return false;

    stripSwipeTriggered.current = false;
    return true;
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
        className="touch-pan-y overflow-hidden bg-ink"
        onTouchEnd={handleStripTouchEnd}
        onTouchMove={handleStripTouchMove}
        onTouchStart={handleStripTouchStart}
      >
        <div
          className={`flex ${
            isStripResetting ? "" : "transition-transform duration-300 ease-out"
          }`}
          onTransitionEnd={settleLoopedStrip}
          style={{ transform: `translate3d(calc(-${displayedStripPosition} * (100vw / ${visibleSlides})), 0, 0)` }}
        >
        {stripSlides.map((image, index) => {
          const imageIndex =
            displayImages.length > 1
              ? (index - 1 + displayImages.length) % displayImages.length
              : index;
          const slideStyle = {
            flex: `0 0 calc(100% / ${visibleSlides})`,
            height: `clamp(${gallerySectionControl.mobileHeightPx}px, 26vw, ${gallerySectionControl.desktopHeightPx}px)`,
          };
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
                onClick={(event) => {
                  if (shouldCancelClickAfterSwipe()) event.preventDefault();
                }}
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
              onClick={(event) => {
                if (shouldCancelClickAfterSwipe()) {
                  event.preventDefault();
                  return;
                }
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
