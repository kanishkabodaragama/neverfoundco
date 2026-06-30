"use client";

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
    <header className="sticky top-0 z-40 border-b border-acid/20 bg-ink/95 text-bone backdrop-blur">
      <div className="flex items-center justify-between px-5 py-4 md:px-8">
        <Link aria-label="Never Found home" className="flex items-center gap-2" href="/">
          <span className="font-display text-xl leading-none tracking-tight text-acid">
            NEVER
          </span>
          <span className="border border-acid px-1.5 py-0.5 font-display text-xl leading-none tracking-tight">
            FOUND
          </span>
        </Link>

        <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-[0.28em] text-bone/80 md:flex">
          {navItems.slice(1).map((item) => (
            <Link
              className={`transition-colors hover:text-acid ${
                item.href.includes(active) ? "text-acid" : ""
              }`}
              href={item.href}
              key={item.label}
            >
              {item.label}
            </Link>
          ))}
          <Link
            className="bg-acid px-4 py-2 font-bold text-ink transition-colors hover:bg-bone"
            href="/shop"
          >
            Shop now
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <CurrencySelector />
          <Link className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-bone/70 hover:text-acid" href="/account/login">
            Login
          </Link>
          <CartLink />
        </div>

        <button
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative flex h-6 w-8 flex-col justify-between md:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <span
            className={`h-0.5 w-full origin-left bg-acid transition-transform ${
              open ? "translate-x-px rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-full bg-acid transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-full origin-left bg-acid transition-transform ${
              open ? "-rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {open ? (
        <nav className="flex flex-col border-t border-acid/20 font-mono text-sm uppercase tracking-[0.28em] md:hidden">
          {navItems.map((item) => (
            <Link
              className="border-b border-acid/10 px-5 py-4 text-bone/80 active:bg-acid/5 active:text-acid"
              href={item.href}
              key={item.label}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-acid/10 px-5 py-4">
            <CurrencySelector />
            <CartLink />
          </div>
          <Link
            className="bg-acid px-5 py-4 text-center font-bold text-ink"
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
