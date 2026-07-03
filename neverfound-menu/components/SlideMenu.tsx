"use client";

import Image from "next/image";
import { useEffect } from "react";

// ---------------------------------------------------------------------------
// NEVERFOUND — mobile slide menu
//
// This is built as 4 stacked layers, matching the reference screenshot:
//
//   1. BASE       — flat near-black background
//   2. LOGO SHAPES — the wordmark logo, blown up huge and cropped off the
//                    top/bottom edges, rotated slightly. This is what
//                    creates the jagged red "teeth" pattern behind the menu.
//   3. TEXTURE     — the holographic foil photo, color-shifted toward red
//                    and blended over the logo shapes, which is what gives
//                    the mottled / torn-paper grain instead of flat red.
//   4. CONTENT     — the MENU / close header and the nav links. Always
//                    fully opaque so it stays readable.
//
// Everything visual (colors, rotation, sizes, copy) is declared as a
// constant near the top of each section below, so it's easy to locate
// and hand-edit or point a code agent at.
// ---------------------------------------------------------------------------

export type MenuItem = {
  label: string;
  href: string;
  // Which brand color this label uses. Add more keys in tailwind.config.ts
  // (theme.extend.colors.brand) if you want additional options.
  color: "lime" | "white";
};

export type SlideMenuProps = {
  open: boolean;
  onClose: () => void;
  items: MenuItem[];
  /** Optional label rendered top-left. Hidden while the menu is open in the reference design. */
  menuLabel?: string;
};

export default function SlideMenu({
  open,
  onClose,
  items,
  menuLabel = "MENU",
}: SlideMenuProps) {
  // Lock body scroll while the menu is open (typical mobile-menu behavior).
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      aria-hidden={!open}
      className={[
        "fixed inset-0 z-50 overflow-hidden",
        "transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]",
        open ? "translate-x-0" : "translate-x-full pointer-events-none",
      ].join(" ")}
    >
      {/* ---------------------------------------------------------------- */}
      {/* LAYER 1 — base background                                        */}
      {/* ---------------------------------------------------------------- */}
      <div className="absolute inset-0 bg-brand-black" />

      {/* ---------------------------------------------------------------- */}
      {/* LAYER 2 — logo shapes                                             */}
      {/* Two oversized copies of the wordmark, bled off the top and       */}
      {/* bottom edges, rotated slightly opposite ways. Tweak the          */}
      {/* rotate/scale/translate values below to reshape the pattern.      */}
      {/* ---------------------------------------------------------------- */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-0 h-[420px] w-[1800px] -translate-x-1/2 -translate-y-[58%] rotate-[-6deg] opacity-95"
          style={{ filter: "saturate(1.3)" }}
        >
          <Image src="/logo.png" alt="" fill className="object-contain" priority />
        </div>
        <div
          className="absolute bottom-0 left-1/2 h-[420px] w-[1800px] translate-x-[-46%] translate-y-[58%] rotate-[5deg] opacity-95"
          style={{ filter: "saturate(1.3)" }}
        >
          <Image src="/logo.png" alt="" fill className="object-contain" />
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* LAYER 3 — holographic texture, tinted red and blended over the   */}
      {/* logo shapes to add the mottled / torn-paper grain.               */}
      {/* Adjust `filter` and `opacity` here to shift the tint or          */}
      {/* intensity; swap mixBlendMode ("color-burn", "multiply",          */}
      {/* "overlay") for a different grunge effect.                        */}
      {/* ---------------------------------------------------------------- */}
      <div
        className="absolute inset-0"
        style={{
          mixBlendMode: "color-burn",
          opacity: 0.85,
          filter: "sepia(1) saturate(4) hue-rotate(-38deg) brightness(0.9)",
        }}
      >
        <Image
          src="/texture.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>
      {/* Extra dark scrim so the texture doesn't wash out the text layer */}
      <div className="absolute inset-0 bg-black/35" />

      {/* ---------------------------------------------------------------- */}
      {/* LAYER 4 — content (header + nav)                                  */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative z-10 flex h-full flex-col px-6 pt-8">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <span className="font-display text-lg tracking-wide text-brand-white">
            {menuLabel}
          </span>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="text-2xl leading-none text-brand-white"
          >
            ×
          </button>
        </div>

        {/* Nav links */}
        <nav className="mt-6 flex flex-1 flex-col justify-center gap-1">
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={[
                "font-display uppercase leading-[0.92] tracking-tight",
                "text-[15vw] sm:text-[64px]",
                "-skew-x-3",
                item.color === "lime" ? "text-brand-lime" : "text-brand-white",
              ].join(" ")}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
