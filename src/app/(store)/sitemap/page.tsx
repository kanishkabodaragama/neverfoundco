import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { StoreArtSurface } from "@/components/site/StoreArtSurface";
import { listActiveProducts } from "@/lib/db/products";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Browse every public page and current Never Found product.",
};

const pages = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/returns", label: "Return Policy" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms and Conditions" },
];

export default async function SitemapPage() {
  const products = await listActiveProducts();

  return (
    <div className="min-h-screen w-full bg-acid text-ink">
      <Header />
      <StoreArtSurface>
        <section className="min-h-[70vh] w-full px-5 pb-20 pt-36 md:px-8 md:pb-28 md:pt-44 xl:px-12">
          <h1 className="font-display text-6xl uppercase leading-none text-rust md:text-8xl">
            Sitemap
          </h1>

          <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-20">
            <SitemapLinks heading="Pages" links={pages} />
            <SitemapLinks
              heading="Products"
              links={products.map((product) => ({
                href: `/products/${product.slug}`,
                label: product.name,
              }))}
            />
          </div>
        </section>
      </StoreArtSurface>
      <Footer />
    </div>
  );
}

function SitemapLinks({
  heading,
  links,
}: {
  heading: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <nav aria-label={`${heading} sitemap`}>
      <h2 className="font-display text-3xl uppercase leading-none">{heading}</h2>
      <ul className="mt-6 grid gap-3">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              className="font-sans text-base font-semibold underline decoration-1 underline-offset-4 transition-colors hover:text-rust"
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
