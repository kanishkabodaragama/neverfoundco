import Link from "next/link";
import { CartLink } from "@/components/site/CartLink";
import { CurrencySelector } from "@/components/site/CurrencySelector";
import { ScrollHeader } from "@/components/site/ScrollHeader";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  return <SiteHeader active="home" />;
}

export function SiteHeader({ active = "home" }: { active?: "home" | "shop" | "about" | "contact" }) {
  return (
    <ScrollHeader>
      <div className="flex min-h-[86px] w-full items-center justify-between gap-4 px-5 py-3 md:px-8 xl:px-12">
        <Link
          aria-label="Never Found home"
          className="font-pixel text-2xl font-black leading-none"
          href="/"
        >
          <span className="block">never</span>
          <span className="block">found</span>
        </Link>
        <nav
          aria-label="Primary navigation"
          className="font-pixel hidden items-center gap-6 text-sm uppercase md:flex xl:gap-10"
        >
          {navItems.map((item) => (
            <Link
              className={`relative py-2 transition hover:text-[#F05267] ${
                item.label.toLowerCase() === active
                  ? "text-[#F05267] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-[#F05267]"
                  : ""
              }`}
              href={item.href}
              key={item.label}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <CurrencySelector />
          <Link className="font-pixel text-sm uppercase transition hover:text-[#F05267]" href="/account/login">
            Login
          </Link>
          <CartLink />
        </div>
      </div>
    </ScrollHeader>
  );
}
