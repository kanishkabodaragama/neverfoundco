import Image from "next/image";
import type { ReactNode } from "react";
import { siteTextureSettings } from "@/components/site/site-texture-settings";

export function StoreArtSurface({
  children,
  productTexture = false,
}: {
  children: ReactNode;
  productTexture?: boolean;
}) {
  return (
    <main className="relative -mt-20 overflow-hidden bg-ink pt-20 md:-mt-[5.75rem] md:pt-[5.75rem]">
      <Image
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 object-cover"
        fill
        priority={false}
        sizes="100vw"
        src="/images/textures/main-background.jpg"
        style={{ opacity: siteTextureSettings.darkTextureOpacity }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-32 overflow-hidden md:h-44">
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
        {productTexture ? (
          <>
            <Image
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[2] object-cover object-center opacity-[0.22] mix-blend-multiply md:hidden"
              fill
              priority={false}
              sizes="100vw"
              src="/images/textures/graffi-mobile.png"
            />
            <Image
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[2] hidden object-cover object-center opacity-[0.22] mix-blend-multiply md:block"
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
