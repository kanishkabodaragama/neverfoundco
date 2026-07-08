import Image from "next/image";
import type { ReactNode } from "react";
import { siteTextureSettings } from "@/components/site/site-texture-settings";

// Red background logo controls:
// xPercent: 50 is centered, lower moves left, higher moves right.
// yPx: distance from the top of this page section in pixels.
// widthVw/scale: size controls, rotateDeg: rotation angle, opacity: 0 to 1.
const backgroundLogoControl = {
  xPercent: 50,
  yPx: -100,
  widthVw: 92,
  scale: 1.5,
  rotateDeg: 5,
  opacity: 1,
};

// Overlay above the red logo and below page content.
// yPx moves the overlay start: 0 starts at the top, positive moves it down.
// transparency: 0 is fully visible, 1 is fully transparent.
const redLogoOverlayControl = {
  yPx: 0,
  src: "/images/textures/menu-overlay.png",
  transparency: 0.02,
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
          priority={false}
          sizes="100vw"
          src="/images/textures/main-background.jpg"
          style={{ opacity: siteTextureSettings.yellowTextureOpacity }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-acid"
          style={{ opacity: siteTextureSettings.yellowLayerOpacity }}
        />
        <Image
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute z-[4] h-auto max-w-none object-contain"
          height={220}
          priority={false}
          src="/images/brand/neverfound-red.png"
          style={{
            left: `${backgroundLogoControl.xPercent}%`,
            opacity: backgroundLogoControl.opacity,
            top: `${backgroundLogoControl.yPx}px`,
            transform: `translateX(-50%) rotate(${backgroundLogoControl.rotateDeg}deg) scale(${backgroundLogoControl.scale})`,
            width: `${backgroundLogoControl.widthVw}vw`,
          }}
          width={500}
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
        <div className="relative z-10">{children}</div>
      </div>
    </main>
  );
}
