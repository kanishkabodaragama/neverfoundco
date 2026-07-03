import Image from "next/image";
import type { ReactNode } from "react";
import { siteTextureSettings } from "@/components/site/site-texture-settings";

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
      <div className="pointer-events-none absolute inset-x-0 top-20 z-[2] h-32 overflow-hidden md:top-[10.75rem] md:h-44">
        <Image
          alt=""
          aria-hidden="true"
          className="absolute left-1/2 top-[-48%] h-auto w-[92vw] max-w-5xl -translate-x-1/2 object-contain opacity-70 md:top-[-54%] md:w-[68vw]"
          height={220}
          priority={false}
          src="/images/brand/neverfound-red.png"
          width={500}
        />
      </div>
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
