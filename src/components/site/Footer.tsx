import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "/returns" },
  { label: "Shipping Policy", href: "/returns" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact Us", href: "/contact" },
  { label: "About Us", href: "/about" },
];

export function Footer() {
  return (
    <footer className="border-0 bg-ink text-bone shadow-none outline-none">
      <div className="px-5 pb-4 pt-4 md:px-8 md:pb-6 md:pt-6">
        <Link
          aria-label="Never Found home"
          className="relative mx-auto block h-[72px] w-36 md:h-[60px] md:w-[120px]"
          href="/"
        >
          <Image
            alt="Never Found"
            className="object-contain object-center"
            fill
            sizes="(min-width: 768px) 120px, 144px"
            src="/images/brand/footer-logo-white.png"
          />
        </Link>

        <div className="mt-3 grid gap-3 font-mono text-[9px] font-bold uppercase tracking-[0.06em] md:mt-5 md:grid-cols-[auto_1fr] md:items-end md:gap-8 md:text-[10px]">
          <Link
            aria-label="Instagram"
            className="inline-flex h-7 w-7 items-center justify-center text-bone transition-opacity hover:opacity-70"
            href="https://www.instagram.com/"
            rel="noreferrer"
            target="_blank"
          >
            <Image
              alt=""
              aria-hidden="true"
              className="h-4 w-4 object-contain invert"
              height={16}
              src="/images/icons/instagram.png"
              width={16}
            />
          </Link>

          <div className="grid gap-3 md:justify-items-end">
            <p>&copy; {new Date().getFullYear()}, Never Found.</p>
            <nav
              aria-label="Footer navigation"
              className="grid grid-cols-3 gap-x-3 gap-y-2 leading-relaxed md:flex md:max-w-xl md:flex-wrap md:justify-end md:gap-x-5"
            >
              {footerLinks.map((item) => (
                <Link
                  className="transition-colors hover:text-acid"
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
