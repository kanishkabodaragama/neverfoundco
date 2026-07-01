import Image from "next/image";
import Link from "next/link";
import { CurrencySelector } from "@/components/site/CurrencySelector";

const footerLinks = [
  { label: "Search", href: "/shop" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "/returns" },
  { label: "Shipping Policy", href: "/returns" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact Us", href: "/contact" },
  { label: "About Us", href: "/about" },
];

export function Footer() {
  return (
    <footer className="border-0 bg-acid text-ink shadow-none outline-none">
      <div className="px-5 pb-10 pt-8 md:px-8 md:pb-12 md:pt-10">
        <Link
          aria-label="Never Found home"
          className="relative mx-auto block h-24 w-48 md:h-20 md:w-40"
          href="/"
        >
          <Image
            alt="Never Found"
            className="object-contain object-center"
            fill
            sizes="(min-width: 768px) 160px, 192px"
            src="/images/brand/logo-nvr-fnd.png"
          />
        </Link>

        <div className="mt-10 flex flex-col items-start gap-7 font-mono text-xs font-bold uppercase tracking-[0.08em] md:mt-12 md:flex-row md:items-end md:justify-between">
          <div className="grid gap-5">
            <Link
              aria-label="Instagram"
              className="inline-flex h-9 w-9 items-center justify-center border border-ink text-base font-black transition-colors hover:bg-ink hover:text-acid"
              href="https://www.instagram.com/"
              rel="noreferrer"
              target="_blank"
            >
              IG
            </Link>
            <CurrencySelector />
          </div>

          <div className="grid gap-5 md:justify-items-end">
            <p>&copy; {new Date().getFullYear()}, Never Found.</p>
            <nav
              aria-label="Footer navigation"
              className="flex max-w-xl flex-wrap gap-x-5 gap-y-2 text-[11px] leading-relaxed md:justify-end md:text-xs"
            >
              {footerLinks.map((item) => (
                <Link
                  className="transition-colors hover:text-rust"
                  href={item.href}
                  key={item.label}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
