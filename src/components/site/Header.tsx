"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/store/cart-provider";
import { CartLink } from "@/components/site/CartLink";
import { CurrencySelector } from "@/components/site/CurrencySelector";
import { StorePrice } from "@/components/site/StorePrice";

type MobileMenuTextAlignment = "left" | "center" | "right" | "justify";
type MobileMenuRowVerticalAlignment = "top" | "center" | "bottom";

type MobileNavItem = {
  label: string;
  href: string;
  fontSizePx: number;
  xPx?: number;
  textAlignment?: MobileMenuTextAlignment;
  rowVerticalAlignment?: MobileMenuRowVerticalAlignment;
  wordClass: string;
  colorClass: string;
};

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const mobileNavItems: MobileNavItem[] = [
  {
    label: "Home",
    href: "/",
    fontSizePx: 215,
    xPx: -20,
    textAlignment: "center",
    rowVerticalAlignment: "center",
    wordClass: "scale-x-[1.02]",
    colorClass: "text-acid",
  },
  {
    label: "Contact Us",
    href: "/contact",
    fontSizePx: 112,
    xPx: -15,
    textAlignment: "center",
    rowVerticalAlignment: "center",
    wordClass: "scale-x-[0.98]",
    colorClass: "text-bone",
  },
  {
    label: "About Us",
    href: "/about",
    fontSizePx: 132,
    xPx: -12,
    textAlignment: "center",
    rowVerticalAlignment: "center",
    wordClass: "scale-x-[1.02]",
    colorClass: "text-acid",
  },
  {
    label: "Login",
    href: "/account/login",
    fontSizePx: 220,
    xPx: -20,
    textAlignment: "center",
    rowVerticalAlignment: "center",
    wordClass: "scale-x-[1]",
    colorClass: "text-bone",
  },
];

type MobileMenuLogoControl = {
  scale: number;
  xPercent: number;
  yPx: number;
  rotateDeg: number;
  opacity: number;
};

const mobileMenuDesignControl = {
  widthPx: 390,
  heightPx: 844,
  xPercent: 50,
  yPercent: 50,
  scale: 1,
};

const mobileMenuItemsControl: {
  xPx: number;
  yPx: number;
  textAlignment: MobileMenuTextAlignment;
  rowHeightScale: number;
  rowVerticalAlignment: MobileMenuRowVerticalAlignment;
  itemGapPx: number;
} = {
  xPx: 0,
  yPx: 0,
  textAlignment: "center",
  rowHeightScale: 1,
  rowVerticalAlignment: "center",
  itemGapPx: 4,
};

const mobileMenuTopBarControl = {
  xPx: 0,
  yPx: -20,
  menuFontSizePx: 15,
  closeIconScale: 1,
  closeIconSizePx: 20,
};

// Main black header logo controls for mobile only:
// widthPx/heightPx set its frame, scale changes its overall size,
// topPaddingPx adds space above it, and xPx/yPx move it.
const mobileHeaderLogoControl = {
  widthPx: 192,
  heightPx: 80,
  topPaddingPx: 0,
  scale: 0.8,
  xPx: 0,
  yPx: 0,
};

const mobileMenuLogoBaseWidthPx = 605;
const mobileMenuItemsFontFamily =
  "var(--font-display), Anton, Impact, sans-serif";

// Manual mobile menu controls:
// design: widthPx/heightPx are the fixed mobile design canvas, scale changes all menu art at once.
// logos: scale = size, xPercent/xPx = left/right, yPx = up/down, rotateDeg = angle.
// menuItems: shared xPx/yPx above moves every item as one group inside the fixed canvas.
// itemGapPx changes the gap between all menu items at once.
// topBar: xPx/yPx moves the Menu label and close button together.
// topBar menuFontSizePx changes "Menu"; closeIconSizePx/closeIconScale changes close icon size.
// Per-item fontSizePx values above manually change each menu item's font size.
// Per-item xPx: 0 = center, negative = left, positive = right.
// textAlignment words: "left", "center", "right", "justify".
// rowVerticalAlignment words: "top", "center", "bottom".
// rowHeightScale changes each menu item's row height relative to its font size.
// mobileMenuItemsFontFamily sets the menu item font. Current value uses Anton.
// Per-item xPx/textAlignment/rowVerticalAlignment values override or add to the shared defaults.
const mobileMenuLogoControls: Record<"top" | "bottom", MobileMenuLogoControl> = {
  top: {
    scale: 1,
    xPercent: 50,
    yPx: -110,
    rotateDeg: 10,
    opacity: 0.5,
  },
  bottom: {
    scale: 1,
    xPercent: 40,
    yPx: -30,
    rotateDeg: 8,
    opacity: 0.5,
  },
};

function isActiveNavItem(
  href: string,
  active: "home" | "shop" | "about" | "contact",
) {
  if (href === "/") {
    return active === "home";
  }

  return href.includes(active);
}

function getMenuItemJustifyContent(alignment: MobileMenuTextAlignment) {
  if (alignment === "left") return "flex-start";
  if (alignment === "right") return "flex-end";
  return "center";
}

function getMenuItemAlignItems(alignment: MobileMenuRowVerticalAlignment) {
  if (alignment === "top") return "flex-start";
  if (alignment === "bottom") return "flex-end";
  return "center";
}

function MobileMenuRedLogo({ position }: { position: "top" | "bottom" }) {
  const controls = mobileMenuLogoControls[position];

  return (
    <Image
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute z-[3] h-auto max-w-none object-contain"
      height={800}
      priority={false}
      src="/images/brand/neverfound-red-menu-source.png"
      style={{
        [position]: `${controls.yPx}px`,
        left: `${controls.xPercent}%`,
        opacity: controls.opacity,
        transform: `translateX(-50%) rotate(${controls.rotateDeg}deg) scale(${controls.scale})`,
        width: `${mobileMenuLogoBaseWidthPx}px`,
      }}
      width={1600}
    />
  );
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
  const [mobileMenuViewport, setMobileMenuViewport] = useState({
    height: mobileMenuDesignControl.heightPx,
    width: mobileMenuDesignControl.widthPx,
  });
  const cart = useCart();
  const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.items.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );
  const mobileMenuScale =
    Math.min(
      mobileMenuViewport.width / mobileMenuDesignControl.widthPx,
      mobileMenuViewport.height / mobileMenuDesignControl.heightPx,
    ) * mobileMenuDesignControl.scale;

  useEffect(() => {
    function syncMobileMenuViewport() {
      setMobileMenuViewport({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }

    syncMobileMenuViewport();
    window.addEventListener("resize", syncMobileMenuViewport);
    window.addEventListener("orientationchange", syncMobileMenuViewport);

    return () => {
      window.removeEventListener("resize", syncMobileMenuViewport);
      window.removeEventListener("orientationchange", syncMobileMenuViewport);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const { body, documentElement } = document;
    const originalBodyOverflow = body.style.overflow;
    const originalHtmlOverscrollBehavior = documentElement.style.overscrollBehavior;

    body.style.overflow = "hidden";
    documentElement.style.overscrollBehavior = "none";

    return () => {
      body.style.overflow = originalBodyOverflow;
      documentElement.style.overscrollBehavior = originalHtmlOverscrollBehavior;
    };
  }, [open]);

  return (
    <>
    <header className="site-header absolute inset-x-0 top-0 z-20 border-0 bg-transparent text-ink shadow-none outline-none">
      <div className="relative grid min-h-24 grid-cols-[3rem_1fr_3rem] items-center px-3 py-2 md:flex md:min-h-24 md:justify-between md:px-8 md:py-2">
        <button
          aria-expanded={open}
          aria-label="Open menu"
          className="relative z-10 col-start-1 flex h-10 w-9 items-center justify-center justify-self-start p-1 text-ink transition-opacity hover:opacity-75 md:hidden"
          onClick={() => {
            setOpen((value) => !value);
          }}
          type="button"
        >
          <Image
            alt=""
            aria-hidden="true"
            className="object-contain"
            height={34}
            priority
            src="/images/icons/mobile-menu.png"
            width={34}
          />
        </button>

        <Link
          aria-label="Never Found home"
          className="relative col-start-2 block justify-self-center md:h-20 md:w-40"
          href="/"
        >
          <span
            className="block md:hidden"
            style={{
              paddingTop: `${mobileHeaderLogoControl.topPaddingPx}px`,
              transform: `translate(${mobileHeaderLogoControl.xPx}px, ${mobileHeaderLogoControl.yPx}px) scale(${mobileHeaderLogoControl.scale})`,
              width: `${mobileHeaderLogoControl.widthPx}px`,
            }}
          >
            <span
              className="relative block w-full"
              style={{ height: `${mobileHeaderLogoControl.heightPx}px` }}
            >
              <Image
                alt="Never Found"
                className="object-contain object-center"
                fill
                priority
                sizes={`${mobileHeaderLogoControl.widthPx}px`}
                src="/images/brand/logo-nvr-fnd.png"
              />
            </span>
          </span>
          <span className="relative hidden h-20 w-40 md:block">
            <Image
              alt="Never Found"
              className="object-contain object-left"
              fill
              priority
              sizes="160px"
              src="/images/brand/logo-nvr-fnd.png"
            />
          </span>
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
          <CartLink
            onClick={() => {
              setCartOpen(true);
            }}
          />
        </div>

        <div className="relative z-10 col-start-3 flex h-10 w-9 items-center justify-center justify-self-end md:hidden">
          <CartLink
            onClick={() => {
              setCartOpen(true);
            }}
          />
        </div>
      </div>
    </header>

      <div
        className={`fixed inset-0 z-[9998] bg-ink/55 transition-opacity duration-300 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      <nav
        className={`fixed inset-0 z-[9999] h-dvh overflow-hidden overscroll-none bg-ink font-mono text-sm uppercase tracking-[0.16em] text-bone shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] md:hidden ${
          open ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"
        }`}
        aria-label="Mobile navigation"
      >
        <Image
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 object-cover opacity-[0.17] mix-blend-screen"
          fill
          priority={false}
          sizes="100vw"
          src="/images/textures/main-background.jpg"
        />
        <div className="absolute inset-0 z-[1] bg-black/35" />

        <div
          className="absolute z-10 overflow-visible"
          style={{
            height: `${mobileMenuDesignControl.heightPx}px`,
            left: `${mobileMenuDesignControl.xPercent}%`,
            top: `${mobileMenuDesignControl.yPercent}%`,
            transform: `translate(-50%, -50%) scale(${mobileMenuScale})`,
            transformOrigin: "center center",
            width: `${mobileMenuDesignControl.widthPx}px`,
          }}
        >
          <MobileMenuRedLogo position="top" />
          <MobileMenuRedLogo position="bottom" />

          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
            style={{
              gap: `${mobileMenuItemsControl.itemGapPx}px`,
              textAlign: mobileMenuItemsControl.textAlignment,
              transform: `translate(${mobileMenuItemsControl.xPx}px, ${mobileMenuItemsControl.yPx}px)`,
            }}
          >
            {mobileNavItems.map((item) => {
              const textAlignment =
                item.textAlignment ?? mobileMenuItemsControl.textAlignment;
              const rowVerticalAlignment =
                item.rowVerticalAlignment ??
                mobileMenuItemsControl.rowVerticalAlignment;

              return (
                <Link
                  className={`flex w-full whitespace-nowrap uppercase leading-[0.86] tracking-normal transition-colors hover:text-rust active:text-rust ${item.colorClass}`}
                  href={item.href}
                  key={item.label}
                  onClick={() => setOpen(false)}
                  style={{
                    alignItems: getMenuItemAlignItems(rowVerticalAlignment),
                    fontFamily: mobileMenuItemsFontFamily,
                    fontSize: `${item.fontSizePx}px`,
                    fontStyle: "italic",
                    justifyContent: getMenuItemJustifyContent(textAlignment),
                    minHeight: `${item.fontSizePx * mobileMenuItemsControl.rowHeightScale}px`,
                    transform: `translateX(${item.xPx ?? 0}px)`,
                  }}
                >
                  <span
                    className={`inline-block origin-center ${item.wordClass}`}
                    style={{
                      textAlignLast:
                        textAlignment === "justify" ? "justify" : "auto",
                      width: textAlignment === "justify" ? "100%" : "auto",
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="relative z-20 flex h-full flex-col px-6 pt-8">
          <div
            className="relative z-20 flex items-center justify-between"
            style={{
              transform: `translate(${mobileMenuTopBarControl.xPx}px, ${mobileMenuTopBarControl.yPx}px)`,
            }}
          >
            <span
              className="font-display uppercase leading-none tracking-normal text-bone"
              style={{ fontSize: `${mobileMenuTopBarControl.menuFontSizePx}px` }}
            >
              Menu
            </span>
            <button
              aria-label="Close menu"
              className="relative flex items-center justify-center text-bone transition-opacity hover:opacity-70"
              onClick={() => setOpen(false)}
              style={{
                height: `${mobileMenuTopBarControl.closeIconSizePx}px`,
                transform: `scale(${mobileMenuTopBarControl.closeIconScale})`,
                width: `${mobileMenuTopBarControl.closeIconSizePx}px`,
              }}
              type="button"
            >
              <span
                aria-hidden="true"
                className="absolute h-px rotate-45 bg-current"
                style={{ width: `${mobileMenuTopBarControl.closeIconSizePx}px` }}
              />
              <span
                aria-hidden="true"
                className="absolute h-px -rotate-45 bg-current"
                style={{ width: `${mobileMenuTopBarControl.closeIconSizePx}px` }}
              />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+20px)] z-20 flex justify-center px-6">
            <CurrencySelector tone="dark" />
          </div>
        </div>
      </nav>

      <div
        aria-hidden="true"
        className={`fixed inset-0 z-[9998] bg-ink/55 transition-opacity duration-300 ${
          cartOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setCartOpen(false)}
      />

      <aside
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-[9999] flex h-dvh w-[88vw] max-w-md flex-col bg-acid text-ink shadow-2xl transition-transform duration-300 ease-out ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex min-h-20 items-center justify-between px-5">
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
            className="relative flex items-center justify-center text-ink transition-opacity hover:opacity-65"
            onClick={() => setCartOpen(false)}
            style={{
              height: `${mobileMenuTopBarControl.closeIconSizePx}px`,
              transform: `scale(${mobileMenuTopBarControl.closeIconScale})`,
              width: `${mobileMenuTopBarControl.closeIconSizePx}px`,
            }}
            type="button"
          >
            <span
              aria-hidden="true"
              className="absolute h-px rotate-45 bg-current"
              style={{ width: `${mobileMenuTopBarControl.closeIconSizePx}px` }}
            />
            <span
              aria-hidden="true"
              className="absolute h-px -rotate-45 bg-current"
              style={{ width: `${mobileMenuTopBarControl.closeIconSizePx}px` }}
            />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {cart.items.length > 0 ? (
            <div className="grid gap-3">
              {cart.items.map((item) => {
                const itemKey = item.variantId ?? item.productId;

                return (
                  <article
                    className="grid grid-cols-[72px_1fr] items-start gap-3 pb-3"
                    key={itemKey}
                  >
                    <div className="relative aspect-[4/5] bg-transparent">
                      <Image
                        alt={item.name}
                        className="object-contain"
                        fill
                        sizes="72px"
                        src={item.image ?? "/images/products/home-drop/never-found-logo-tee.png"}
                        unoptimized
                      />
                    </div>
                    <div className="flex min-w-0 flex-col gap-2">
                      <div>
                        <h3 className="line-clamp-2 font-display text-base italic uppercase leading-none">
                          {item.name}
                        </h3>
                        <div className="mt-1 space-y-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-ink/60">
                          {item.gender ? <p>{item.gender}</p> : null}
                          {item.color ? <p>Color: {item.color}</p> : null}
                          {item.size ? <p>Size: {item.size}</p> : null}
                        </div>
                        <p className="mt-1 font-mono text-[11px] font-bold">
                          <StorePrice amountUsd={item.unitPrice} />
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center rounded-full border border-ink font-mono text-[10px] font-bold">
                          <button
                            className="px-2.5 py-1 transition hover:bg-ink hover:text-acid"
                            onClick={() => cart.updateQuantity(itemKey, item.quantity - 1)}
                            type="button"
                          >
                            -
                          </button>
                          <span className="min-w-7 border-x border-ink px-2 py-1 text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="px-2.5 py-1 transition hover:bg-ink hover:text-acid"
                            onClick={() => cart.updateQuantity(itemKey, item.quantity + 1)}
                            type="button"
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-rust"
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

        <div className="px-5 py-5">
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
    </>
  );
}
