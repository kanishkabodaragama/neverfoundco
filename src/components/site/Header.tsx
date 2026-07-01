"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CartLink } from "@/components/site/CartLink";
import { CurrencySelector } from "@/components/site/CurrencySelector";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function isActiveNavItem(
  href: string,
  active: "home" | "shop" | "about" | "contact",
) {
  if (href === "/") {
    return active === "home";
  }

  return href.includes(active);
}

export function Header() {
  return <SiteHeader active="home" />;
}

export function SiteHeader({
  active = "home",
}: {
  active?: "home" | "shop" | "about" | "contact";
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-0 bg-acid text-ink shadow-none outline-none after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-acid after:content-['']">
      <div className="relative grid min-h-28 grid-cols-[3rem_1fr_3rem] items-center px-3 py-0 md:flex md:min-h-28 md:justify-between md:px-8 md:py-3">
        <button
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative z-10 col-start-1 flex h-12 w-9 items-center justify-center justify-self-start p-1 text-ink transition-opacity hover:opacity-75 md:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? (
            <CloseGlyph />
          ) : (
            <Image
              alt=""
              aria-hidden="true"
              className="object-contain"
              height={34}
              priority
              src="/images/icons/mobile-menu.png"
              width={34}
            />
          )}
        </button>

        <Link
          aria-label="Never Found home"
          className="relative col-start-2 block h-24 w-48 justify-self-center md:relative md:left-auto md:top-auto md:h-20 md:w-40 md:translate-x-0 md:translate-y-0"
          href="/"
        >
          <Image
            alt="Never Found"
            className="object-contain object-center md:object-left"
            fill
            priority
            sizes="(min-width: 768px) 160px, 192px"
            src="/images/brand/logo-nvr-fnd.png"
          />
        </Link>

        <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-[0.28em] text-ink/75 md:flex">
          {navItems.map((item) => (
            <Link
              className={`transition-colors hover:text-rust ${
                isActiveNavItem(item.href, active) ? "text-rust" : ""
              }`}
              href={item.href}
              key={item.label}
            >
              {item.label}
            </Link>
          ))}
          <Link
            className="bg-ink px-4 py-2 font-bold text-acid transition-colors hover:bg-rust hover:text-ink"
            href="/shop"
          >
            Shop now
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <CurrencySelector />
          <Link className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-ink/70 hover:text-rust" href="/account/login">
            Login
          </Link>
          <CartLink />
        </div>

        <div className="relative z-10 col-start-3 flex h-12 w-9 items-center justify-center justify-self-end md:hidden">
          <CartLink />
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-ink/55 transition-opacity duration-300 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      <nav
        className={`fixed left-0 top-0 z-50 flex h-dvh w-[82vw] max-w-sm flex-col bg-acid font-mono text-sm uppercase tracking-[0.28em] shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile navigation"
      >
        <div className="flex min-h-28 items-center justify-between border-b border-ink/15 px-5">
          <span className="text-xs font-bold text-ink/55">Menu</span>
          <button
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center text-ink"
            onClick={() => setOpen(false)}
            type="button"
          >
            <CloseGlyph />
          </button>
        </div>

        <div className="flex flex-col">
          {navItems.map((item) => (
            <Link
              className="border-b border-ink/10 px-5 py-5 text-ink/75 active:bg-ink active:text-acid"
              href={item.href}
              key={item.label}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-auto grid gap-4 border-t border-ink/15 px-5 py-5">
          <CurrencySelector />
          <Link
            className="bg-ink px-5 py-4 text-center font-bold text-acid"
            href="/account/login"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}

function CloseGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="h-8 w-8"
      fill="none"
      viewBox="0 0 44 44"
    >
      <path
        d="M12 12L32 32M32 12L12 32"
        className="stroke-current"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M22 5.5L26 9.5L22 13.5L18 9.5L22 5.5ZM22 38.5L18 34.5L22 30.5L26 34.5L22 38.5Z"
        className="stroke-current opacity-70"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}
