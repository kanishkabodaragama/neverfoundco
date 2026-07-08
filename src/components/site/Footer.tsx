import Image from "next/image";
import Link from "next/link";

const leftFooterLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "/returns" },
];

const centerFooterLinks = [
  { label: "Refund Policy", href: "/returns" },
  { label: "Contact Us", href: "/contact" },
];

const rightFooterLinks = [
  { label: "Shipping Policy", href: "/returns" },
  { label: "About Us", href: "/about" },
];

// Footer controls:
// footerPaddingTopPx adjusts space above the logo across the whole footer.
// logoPaddingTopPx/logoPaddingBottomPx adjust space inside the logo area.
// logoMarginBottomPx adjusts the gap after the logo area.
const footerLayoutControls = {
  footerPaddingTopPx: 0,
  logoPaddingTopPx: 0,
  logoPaddingBottomPx: -10,
  logoMarginBottomPx: -20,
};

export function Footer({}: { graffiTexture?: boolean }) {
  return (
    <footer className="relative overflow-hidden border-0 bg-black text-acid shadow-none outline-none">
      <div
        className="relative z-10 px-5 pb-5 md:px-8 md:pb-7"
        style={{
          paddingTop: `${footerLayoutControls.footerPaddingTopPx}px`,
        }}
      >
        <div
          style={{
            marginBottom: `${footerLayoutControls.logoMarginBottomPx}px`,
            paddingBottom: `${footerLayoutControls.logoPaddingBottomPx}px`,
            paddingTop: `${footerLayoutControls.logoPaddingTopPx}px`,
          }}
        >
          <Link
            aria-label="Never Found home"
            className="relative mx-auto block h-[76px] w-44 md:h-[78px] md:w-56"
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
        </div>

        <div className="grid grid-cols-3 items-end gap-4 font-display text-[9px] font-black italic uppercase leading-relaxed tracking-normal md:text-[11px]">
          <div className="grid justify-items-start gap-2">
            <Link
              aria-label="Instagram"
              className="inline-flex h-7 w-7 items-center justify-center transition-opacity hover:opacity-70"
              href="https://www.instagram.com/"
              rel="noreferrer"
              target="_blank"
            >
              <Image
                alt=""
                aria-hidden="true"
                className="h-5 w-5 object-contain [filter:brightness(0)_saturate(100%)_invert(88%)_sepia(99%)_saturate(1760%)_hue-rotate(14deg)_brightness(108%)_contrast(111%)]"
                height={20}
                src="/images/icons/instagram.png"
                width={20}
              />
            </Link>
            <p>&copy; {new Date().getFullYear()}, Never Found.</p>
            <FooterLinkList links={leftFooterLinks} />
          </div>

          <FooterLinkList className="justify-self-center text-center" links={centerFooterLinks} />
          <FooterLinkList className="justify-self-end text-right" links={rightFooterLinks} />
        </div>
      </div>
    </footer>
  );
}

function FooterLinkList({
  className = "",
  links,
}: {
  className?: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <nav aria-label="Footer navigation" className={`grid gap-1.5 ${className}`}>
      {links.map((item) => (
        <Link className="transition-colors hover:text-bone" href={item.href} key={item.label}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
