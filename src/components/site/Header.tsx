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
      <div className="relative flex min-h-28 items-center justify-between px-5 py-3 md:min-h-28 md:px-8">
        <button
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative z-10 flex h-6 w-8 flex-col justify-between md:hidden"
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
          className="absolute left-1/2 top-1/2 block h-20 w-40 -translate-x-1/2 -translate-y-1/2 md:static md:h-20 md:w-40 md:translate-x-0 md:translate-y-0"
          href="/"
        >
          <Image
            alt="Never Found"
            className="object-contain object-center md:object-left"
            fill
            priority
            sizes="(min-width: 768px) 160px, 160px"
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

      {open ? (
        <nav className="flex flex-col border-t border-ink/15 bg-acid font-mono text-sm uppercase tracking-[0.28em] md:hidden">
          {navItems.map((item) => (
            <Link
              className="border-b border-ink/10 px-5 py-4 text-ink/75 active:bg-ink active:text-acid"
              href={item.href}
              key={item.label}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-ink/10 px-5 py-4">
            <CurrencySelector />
            <CartLink />
          </div>
          <Link
            className="bg-ink px-5 py-4 text-center font-bold text-acid"
            href="/account/login"
            onClick={() => setOpen(false)}
          >
            Login
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
