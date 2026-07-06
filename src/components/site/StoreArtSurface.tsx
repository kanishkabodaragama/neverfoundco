import Image from "next/image";
import type { ReactNode } from "react";
import { siteTextureSettings } from "@/components/site/site-texture-settings";

// Fixed red background logo controls:
// xPercent: 50 is centered, lower moves left, higher moves right.
// yPx: distance from the top of the viewport in pixels.
// widthVw/scale: size controls, rotateDeg: rotation angle, opacity: 0 to 1.
const fixedBackgroundLogoControl = {
  xPercent: 50,
  yPx: 64,
  widthVw: 92,
  scale: 1,
  rotateDeg: 0,
  opacity: 0.72,
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
          className="pointer-events-none fixed z-[4] h-auto max-w-none object-contain"
          height={220}
          priority={false}
          src="/images/brand/neverfound-red.png"
          style={{
            left: `${fixedBackgroundLogoControl.xPercent}%`,
            opacity: fixedBackgroundLogoControl.opacity,
            top: `${fixedBackgroundLogoControl.yPx}px`,
            transform: `translateX(-50%) rotate(${fixedBackgroundLogoControl.rotateDeg}deg) scale(${fixedBackgroundLogoControl.scale})`,
            width: `${fixedBackgroundLogoControl.widthVw}vw`,
          }}
          width={500}
        />
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
