"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/store/cart-provider";
import { CartLink } from "@/components/site/CartLink";
import { CurrencySelector } from "@/components/site/CurrencySelector";
import { StorePrice } from "@/components/site/StorePrice";

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
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useCart();
  const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.items.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );

  return (
    <header className="sticky top-0 z-40 border-0 border-b border-acid bg-acid text-ink shadow-none outline-none after:absolute after:inset-x-0 after:-bottom-2 after:h-2 after:bg-acid after:content-['']">
      <div className="relative grid grid-cols-[3rem_1fr_3rem] items-center px-3 py-1 md:flex md:justify-between md:px-8 md:py-1.5">
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
          <CartLink onClick={() => setCartOpen(true)} />
        </div>

        <div className="relative z-10 col-start-3 flex h-12 w-9 items-center justify-center justify-self-end md:hidden">
          <CartLink onClick={() => setCartOpen(true)} />
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

      <div
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-ink/55 transition-opacity duration-300 ${
          cartOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setCartOpen(false)}
      />

      <aside
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-50 flex h-dvh w-[88vw] max-w-md flex-col bg-acid text-ink shadow-2xl transition-transform duration-300 ease-out ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex min-h-20 items-center justify-between border-b border-ink/15 px-5">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-rust">
              Cart
            </p>
            <h2 className="font-display text-3xl italic uppercase leading-none">
              {cartCount} item{cartCount === 1 ? "" : "s"}
            </h2>
          </div>
          <button
            aria-label="Close cart"
            className="grid h-10 w-10 place-items-center text-ink transition-opacity hover:opacity-65"
            onClick={() => setCartOpen(false)}
            type="button"
          >
            <CloseGlyph />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {cart.items.length > 0 ? (
            <div className="grid gap-4">
              {cart.items.map((item) => {
                const itemKey = item.variantId ?? item.productId;

                return (
                  <article
                    className="grid grid-cols-[104px_1fr] gap-4 border-b border-ink/15 pb-4"
                    key={itemKey}
                  >
                    <div className="relative aspect-[4/5] bg-transparent">
                      <Image
                        alt={item.name}
                        className="object-contain"
                        fill
                        sizes="104px"
                        src={item.image ?? "/images/products/home-drop/never-found-logo-tee.png"}
                        unoptimized
                      />
                    </div>
                    <div className="flex min-w-0 flex-col justify-between gap-3">
                      <div>
                        <h3 className="font-display text-xl italic uppercase leading-none">
                          {item.name}
                        </h3>
                        <div className="mt-2 space-y-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink/60">
                          {item.gender ? <p>{item.gender}</p> : null}
                          {item.color ? <p>Color: {item.color}</p> : null}
                          {item.size ? <p>Size: {item.size}</p> : null}
                        </div>
                        <p className="mt-2 font-mono text-xs font-bold">
                          <StorePrice amountUsd={item.unitPrice} />
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center rounded-full border border-ink font-mono text-xs font-bold">
                          <button
                            className="px-3 py-1.5 transition hover:bg-ink hover:text-acid"
                            onClick={() => cart.updateQuantity(itemKey, item.quantity - 1)}
                            type="button"
                          >
                            -
                          </button>
                          <span className="min-w-8 border-x border-ink px-2 py-1.5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="px-3 py-1.5 transition hover:bg-ink hover:text-acid"
                            onClick={() => cart.updateQuantity(itemKey, item.quantity + 1)}
                            type="button"
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-rust"
                          onClick={() => cart.removeItem(itemKey)}
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="grid min-h-64 place-items-center text-center">
              <div>
                <p className="font-display text-4xl italic uppercase leading-none">
                  Cart empty
                </p>
                <Link
                  className="mt-5 inline-flex rounded-full bg-ink px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-acid"
                  href="/shop"
                  onClick={() => setCartOpen(false)}
                >
                  Shop now
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-ink/15 px-5 py-5">
          <div className="flex items-center justify-between font-mono text-xs font-bold uppercase tracking-[0.2em]">
            <span>Subtotal</span>
            <span>
              <StorePrice amountUsd={subtotal} />
            </span>
          </div>
          <Link
            className="mt-4 flex w-full items-center justify-center rounded-full bg-ink px-6 py-4 font-mono text-xs font-bold italic uppercase tracking-[0.22em] text-acid transition-colors hover:bg-rust hover:text-ink"
            href="/checkout"
            onClick={() => setCartOpen(false)}
          >
            Checkout
          </Link>
        </div>
      </aside>
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
