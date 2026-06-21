import Link from "next/link";

const navItems = [
  { label: "Play", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Lookbook", href: "/about" },
];

export function Header() {
  return (
    <header className="bg-[#070B12] text-[#FFF9EF]">
      <div className="mx-auto flex min-h-[96px] max-w-[1440px] items-center justify-between gap-4 px-5 py-3 md:px-8 xl:px-12">
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
          {navItems.map((item, index) => (
            <Link
              className={`relative py-2 transition hover:text-[#F05267] ${
                index === 0
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
        <Link
          className="font-pixel flex items-center gap-3 text-sm uppercase transition hover:text-[#F05267]"
          href="/cart"
        >
          Cart (0)
          <span className="pixel-blink text-[#F05267]">▣</span>
        </Link>
      </div>
    </header>
  );
}
