import Image from "next/image";
import type { ReactNode } from "react";
import { siteTextureSettings } from "@/components/site/site-texture-settings";

// Main page texture controls:
// xPercent/yPercent move the texture focal point, scale changes size,
// rotateDeg changes angle, opacity changes transparency from 0 to 1.
const mainTextureControl = {
  xPercent: 50,
  yPercent: 50,
  scale: 1,
  rotateDeg: 0,
  opacity: siteTextureSettings.yellowTextureOpacity,
};

// Mobile red background logo controls for every storefront page:
// xPercent: 50 is centered, lower moves left, higher moves right.
// yPx: distance from the top of this page section in pixels.
// widthVw/scale: size controls, rotateDeg: rotation angle, opacity: 0 to 1.
// This is the red logo above the texture layers, not the black header logo.
const mobileRedLogoControl = {
  xPercent: 44,
  yPx: -40,
  widthVw: 92,
  scale: 2.0,
  rotateDeg: 0,
  opacity: 0.3,
};

// Overlay above the red logo and below page content.
// yPx moves the overlay start: 0 starts at the top, positive moves it down.
// transparency: 0 is fully visible, 1 is fully transparent.
const redLogoOverlayControl = {
  yPx: 0,
  src: "/images/textures/menu-overlay.png",
  transparency: 1,
};

// Top page texture controls:
// This layer sits above all texture/art layers and behind the content.
// scale changes the cover size, opacity changes transparency from 0 to 1.
const topTextureControl = {
  src: "/images/textures/main-background-top-texture.jpg",
  scale: 1,
  opacity: 0.15,
};

// Single product graffiti texture controls:
// xVw/yPx move it, widthVw changes the base size, scale changes final size,
// rotateDeg changes angle, opacity changes transparency from 0 to 1.
const productGraffiTextureControl = {
  src: "/images/textures/product-graffi-desktop.png",
  xVw: 8,
  yPx: -100,
  widthVw: 100,
  scale: 1.8,
  rotateDeg: 0,
  opacity: 1,
};

export function StoreArtSurface({
  children,
  homeGraffiTexture = false,
  productTexture = false,
}: {
  children: ReactNode;
  homeGraffiTexture?: boolean;
  productTexture?: boolean;
}) {
  return (
    <main className="relative overflow-hidden bg-acid">
      <div className="store-art-surface relative z-10 text-ink">
        <Image
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 object-cover mix-blend-multiply"
          fill
          preload
          quality={100}
          sizes="100vw"
          src="/images/textures/main-background.jpg"
          style={{
            objectPosition: `${mainTextureControl.xPercent}% ${mainTextureControl.yPercent}%`,
            opacity: mainTextureControl.opacity,
            transform: `rotate(${mainTextureControl.rotateDeg}deg) scale(${mainTextureControl.scale})`,
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-acid"
          style={{ opacity: siteTextureSettings.yellowLayerOpacity }}
        />
        <Image
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute z-[9] h-auto max-w-none object-contain md:hidden"
          height={2000}
          priority={false}
          src="/images/brand/neverfound-red-original.png"
          style={{
            left: `${mobileRedLogoControl.xPercent}%`,
            opacity: mobileRedLogoControl.opacity,
            top: `${mobileRedLogoControl.yPx}px`,
            transform: `translateX(-50%) rotate(${mobileRedLogoControl.rotateDeg}deg) scale(${mobileRedLogoControl.scale})`,
            width: `${mobileRedLogoControl.widthVw}vw`,
          }}
          unoptimized
          width={3375}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5]"
          style={{ top: `${redLogoOverlayControl.yPx}px` }}
        >
          <Image
            alt=""
            aria-hidden="true"
            className="object-cover mix-blend-multiply"
            fill
            priority={false}
            sizes="100vw"
            src={redLogoOverlayControl.src}
            style={{ opacity: 1 - redLogoOverlayControl.transparency }}
          />
        </div>
        {homeGraffiTexture ? (
          <Image
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[2] object-cover object-top mix-blend-multiply"
            fill
            priority={false}
            sizes="100vw"
            src="/images/textures/graffi-mobile.png"
            style={{ opacity: siteTextureSettings.homeGraffiTextureOpacity }}
          />
        ) : null}
        {productTexture ? (
          <>
            <Image
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute z-[2] h-auto max-w-none border-0 bg-transparent object-contain object-center shadow-none outline-none"
              height={500}
              priority={false}
              sizes={`${productGraffiTextureControl.widthVw}vw`}
              src={productGraffiTextureControl.src}
              style={{
                backgroundColor: "transparent",
                border: 0,
                boxShadow: "none",
                left: `${productGraffiTextureControl.xVw}vw`,
                top: `${productGraffiTextureControl.yPx}px`,
                opacity: productGraffiTextureControl.opacity,
                outline: "none",
                transform: `rotate(${productGraffiTextureControl.rotateDeg}deg) scale(${productGraffiTextureControl.scale})`,
                transformOrigin: "top center",
                width: `${productGraffiTextureControl.widthVw}vw`,
              }}
              unoptimized
              width={400}
            />
            <Image
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[3] object-cover object-center opacity-[0.22] mix-blend-multiply md:hidden"
              fill
              priority={false}
              sizes="100vw"
              src="/images/textures/graffi-mobile.png"
            />
            <Image
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[3] hidden object-cover object-center opacity-[0.22] mix-blend-multiply md:block"
              fill
              priority={false}
              sizes="100vw"
              src="/images/textures/graffi-desktop.png"
            />
          </>
        ) : null}
        <Image
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[8] object-cover object-center"
          fill
          priority={false}
          sizes="100vw"
          src={topTextureControl.src}
          style={{
            opacity: topTextureControl.opacity,
            transform: `scale(${topTextureControl.scale})`,
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </main>
  );
}
