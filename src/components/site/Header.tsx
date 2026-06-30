"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CartLink } from "@/components/site/CartLink";
import { CurrencySelector } from "@/components/site/CurrencySelector";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Drops", href: "/shop" },
  { label: "Manifesto", href: "/about" },
  { label: "Contact", href: "/contact" },
];

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
    <header className="sticky top-0 z-40 border-b border-ink/15 bg-acid/95 text-ink backdrop-blur">
      <div className="relative flex min-h-28 items-center justify-between px-5 py-0 md:min-h-28 md:px-8 md:py-3">
        <button
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative z-10 flex h-24 w-10 flex-col justify-center gap-2 md:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <span
            className={`h-0.5 w-full origin-left bg-ink transition-transform ${
              open ? "translate-x-px rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-full bg-ink transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-full origin-left bg-ink transition-transform ${
              open ? "-rotate-45" : ""
            }`}
          />
        </button>

        <Link
          aria-label="Never Found home"
          className="absolute left-1/2 top-1/2 block h-24 w-48 -translate-x-1/2 -translate-y-1/2 md:static md:h-20 md:w-40 md:translate-x-0 md:translate-y-0"
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
          {navItems.slice(1).map((item) => (
            <Link
              className={`transition-colors hover:text-rust ${
                item.href.includes(active) ? "text-rust" : ""
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

        <div className="relative z-10 md:hidden">
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
            className="relative h-8 w-8"
            onClick={() => setOpen(false)}
            type="button"
          >
            <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rotate-45 bg-ink" />
            <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 -rotate-45 bg-ink" />
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
