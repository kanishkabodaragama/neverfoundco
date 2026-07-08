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
  opacity: 0.3,
};

// Overlay above the red logo and below page content.
// yPx moves the overlay start: 0 starts at the top, positive moves it down.
// transparency: 0 is fully visible, 1 is fully transparent.
const redLogoOverlayControl = {
  yPx: 0,
  src: "/images/textures/menu-overlay.png",
  transparency: 0.02,
};

// Single product side graffiti controls:
// xVw/yPx move each image, widthVw changes its base size,
// scale changes final size, rotateDeg changes angle, opacity is 0 to 1.
const productSideGraffiTextureControls = {
  mobileSrc: "/images/textures/product-graffi-mobile.png",
  desktopSrc: "/images/textures/product-graffi-desktop.png",
  mobile: {
    left: {
      xVw: -34,
      yPx: 34,
      widthVw: 132,
      scale: 1,
      rotateDeg: 0,
      opacity: 0.22,
    },
    right: {
      xVw: 34,
      yPx: 34,
      widthVw: 132,
      scale: 1,
      rotateDeg: 0,
      opacity: 0.22,
    },
  },
  desktop: {
    left: {
      xVw: -48,
      yPx: -90,
      widthVw: 92,
      scale: 1,
      rotateDeg: 0,
      opacity: 0.18,
    },
    right: {
      xVw: 56,
      yPx: -90,
      widthVw: 92,
      scale: 1,
      rotateDeg: 0,
      opacity: 0.18,
    },
  },
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
            <ProductSideGraffiTexture
              className="md:hidden"
              controls={productSideGraffiTextureControls.mobile.left}
              src={productSideGraffiTextureControls.mobileSrc}
            />
            <ProductSideGraffiTexture
              className="md:hidden"
              controls={productSideGraffiTextureControls.mobile.right}
              src={productSideGraffiTextureControls.mobileSrc}
            />
            <ProductSideGraffiTexture
              className="hidden md:block"
              controls={productSideGraffiTextureControls.desktop.left}
              src={productSideGraffiTextureControls.desktopSrc}
            />
            <ProductSideGraffiTexture
              className="hidden md:block"
              controls={productSideGraffiTextureControls.desktop.right}
              src={productSideGraffiTextureControls.desktopSrc}
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
        <div className="relative z-10">{children}</div>
      </div>
    </main>
  );
}

function ProductSideGraffiTexture({
  className,
  controls,
  src,
}: {
  className: string;
  controls: {
    opacity: number;
    rotateDeg: number;
    scale: number;
    widthVw: number;
    xVw: number;
    yPx: number;
  };
  src: string;
}) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className={`pointer-events-none absolute z-[2] h-auto max-w-none object-contain object-center mix-blend-multiply ${className}`}
      height={1400}
      priority={false}
      sizes={`${controls.widthVw}vw`}
      src={src}
      style={{
        left: `${controls.xVw}vw`,
        opacity: controls.opacity,
        top: `${controls.yPx}px`,
        transform: `rotate(${controls.rotateDeg}deg) scale(${controls.scale})`,
        transformOrigin: "center center",
        width: `${controls.widthVw}vw`,
      }}
      width={1400}
    />
  );
}
