import Link from "next/link";
import { Ticker } from "@/components/site/Ticker";

export function Footer() {
  return (
    <footer className="bg-ink text-bone">
      <Ticker />
      <div className="px-5 py-12 md:px-8 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Link aria-label="Never Found home" className="mb-4 flex items-center gap-2" href="/">
              <span className="font-display text-2xl leading-none tracking-tight text-acid">
                NEVER
              </span>
              <span className="border border-acid px-1.5 py-0.5 font-display text-2xl leading-none tracking-tight">
                FOUND
              </span>
            </Link>
            <p className="max-w-xs font-mono text-[11px] uppercase tracking-wide text-bone/40">
              Independent streetwear. Small runs. No restocks. Based nowhere
              in particular.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 font-mono text-xs uppercase tracking-[0.28em]">
            <div className="flex flex-col gap-3 text-bone/60">
              <span className="mb-1 text-acid/70">Shop</span>
              <Link className="transition-colors hover:text-acid" href="/shop">
                Current drop
              </Link>
              <Link className="transition-colors hover:text-acid" href="/cart">
                Cart
              </Link>
              <Link className="transition-colors hover:text-acid" href="/account/login">
                Orders
              </Link>
            </div>
            <div className="flex flex-col gap-3 text-bone/60">
              <span className="mb-1 text-acid/70">Files</span>
              <Link className="transition-colors hover:text-acid" href="/about">
                About Us
              </Link>
              <Link className="transition-colors hover:text-acid" href="/contact">
                Contact
              </Link>
              <Link className="transition-colors hover:text-acid" href="/privacy">
                Privacy
              </Link>
              <Link className="transition-colors hover:text-acid" href="/returns">
                Returns
              </Link>
              <Link className="transition-colors hover:text-acid" href="/terms">
                Terms
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-4 border-t border-acid/10 pt-6 font-mono text-[10px] uppercase tracking-wide text-bone/30 md:flex-row md:items-center">
          <span>&copy; {new Date().getFullYear()} Never Found. All units accounted for.</span>
          <Link className="transition-colors hover:text-acid" href="https://neurait.com" rel="noreferrer" target="_blank">
            Developed and maintained by Neura IT
          </Link>
        </div>
      </div>
    </footer>
  );
}
