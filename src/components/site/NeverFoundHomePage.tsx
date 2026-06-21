import Image from "next/image";
import Link from "next/link";

const products = [
  {
    title: "PIXEL LOGO HOODIE",
    price: "$89.00",
    image: "/images/landing/tee-black.svg",
    slug: "lost-paradise-tee",
  },
  {
    title: "GLITCH TEE",
    price: "$45.00",
    image: "/images/landing/tee-cream.svg",
    slug: "heat-wave-tee",
  },
  {
    title: "8-BIT CAP",
    price: "$35.00",
    image: "/images/landing/tee-yellow.svg",
    slug: "dream-state-tee",
  },
  {
    title: "PIXEL TOTE BAG",
    price: "$39.00",
    image: "/images/landing/tee-sold.svg",
    slug: "daydream-tee",
  },
];

export function NeverFoundHomePage() {
  return (
    <div className="min-h-screen bg-[#070B12] text-[#F7F1E6]">
      <Header />
      <main>
        <section className="relative min-h-[760px] overflow-hidden bg-[#F7F1E6] text-[#10131A]">
          <Image
            alt="Pixel character standing on a cliff looking at a city skyline"
            className="object-cover object-[62%_center]"
            fill
            priority
            sizes="100vw"
            src="/images/arcade/hero-city.png"
          />
          <div className="relative z-10 grid min-h-[760px] w-full gap-10 px-6 py-12 md:px-10 lg:grid-cols-[0.82fr_1.18fr] lg:px-16">
            <div className="relative z-10 flex flex-col justify-center">
              <p className="font-pixel text-sm text-[#F05267] md:text-base">
                1UP &hearts; &hearts; &hearts;
              </p>
              <h1 className="font-pixel mt-10 text-[clamp(4.2rem,10vw,9.5rem)] font-black uppercase leading-[0.86]">
                Never
                <br />
                Found
              </h1>
              <p className="font-pixel mt-8 max-w-sm text-lg uppercase leading-relaxed">
                Lost since 1999
                <br />
                Found by nobody
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-8">
                <Link
                  className="pixel-edge bg-[#F05267] px-7 py-4 text-sm font-black uppercase text-[#FFF9EF] transition hover:translate-x-0.5"
                  href="/shop"
                >
                  ▶ Start game
                </Link>
                <Link
                  className="text-sm font-black uppercase text-[#10131A] transition hover:translate-x-0.5"
                  href="/about"
                >
                  › View archive
                </Link>
              </div>
            </div>
            <div className="relative min-h-[420px] self-end lg:min-h-[620px]">
              <PixelStar className="left-[12%] top-[14%]" />
              <PixelStar className="right-[10%] top-[28%]" />
              <PixelStar className="left-[28%] top-[42%]" />
            </div>
          </div>
          <div className="h-8 bg-[#070B12]" />
        </section>

        <section className="bg-[#070B12] px-6 py-10 md:px-10 lg:px-16">
          <div className="w-full">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-pixel text-sm uppercase text-[#FFF9EF]">
                <span className="pixel-blink mr-3 text-[#F05267]">▣</span>
                Level 01
              </h2>
              <Link className="font-pixel text-sm uppercase hover:text-[#F05267]" href="/shop">
                View all ›
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.title} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#B8A8E8] px-6 py-12 text-[#10131A] md:px-10 lg:px-16">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-black uppercase">{"// About"}</p>
              <h2 className="font-pixel mt-8 max-w-2xl text-2xl font-black uppercase leading-tight md:text-3xl">
                We document
                <br />
                the unnoticed_
              </h2>
              <p className="mt-7 max-w-md text-base leading-relaxed">
                The streets. The noise. The culture that never made it to the
                map. This is Never Found.
              </p>
              <Link className="mt-8 inline-block text-sm font-black uppercase" href="/about">
                Read more →
              </Link>
            </div>
            <div className="relative min-h-[320px]">
              <Image
                alt="Pixel planet illustration"
                className="object-contain"
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                src="/images/arcade/pixel-planet.png"
              />
              <p className="font-pixel absolute bottom-0 right-0 border border-[#10131A] px-6 py-3 text-xs uppercase">
                Location: unknown
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="bg-[#070B12] text-[#FFF9EF]">
      <div className="flex min-h-[86px] w-full items-center justify-between gap-4 px-6 md:px-10 lg:px-16">
        <Link className="font-pixel text-2xl font-black leading-none" href="/">
          never
          <br />
          found
        </Link>
        <nav className="font-pixel hidden items-center gap-10 text-sm uppercase md:flex">
          {["Play", "Shop", "About", "Lookbook"].map((item, index) => (
            <Link
              className={`relative py-2 transition hover:text-[#F05267] ${
                index === 0 ? "text-[#F05267] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-[#F05267]" : ""
              }`}
              href={item === "Play" ? "/" : item === "Lookbook" ? "/about" : `/${item.toLowerCase()}`}
              key={item}
            >
              {item}
            </Link>
          ))}
        </nav>
        <Link className="font-pixel flex items-center gap-3 text-sm uppercase" href="/cart">
          Cart (0)
          <span className="pixel-blink text-[#F05267]">▣</span>
        </Link>
      </div>
    </header>
  );
}

function ProductCard({
  product,
}: {
  product: { title: string; price: string; image: string; slug: string };
}) {
  return (
    <Link
      className="group block bg-[#FFF9EF] p-5 text-[#10131A] transition hover:-translate-y-1"
      href={`/products/${product.slug}`}
    >
      <div className="relative aspect-square">
        <span className="absolute left-0 top-0 z-10 bg-[#B8A8E8] px-3 py-1 text-xs font-black uppercase">
          New
        </span>
        <Image
          alt={product.title}
          className="object-contain p-8"
          fill
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 44vw, 90vw"
          src={product.image}
        />
      </div>
      <h3 className="font-pixel mt-5 text-sm uppercase">{product.title}</h3>
      <p className="mt-3 font-black">{product.price}</p>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-[#F05267]">♥♥♥</span>
        <span>→</span>
      </div>
    </Link>
  );
}

function PixelStar({ className }: { className: string }) {
  return (
    <span
      className={`pixel-blink absolute z-10 text-3xl text-[#B8A8E8] ${className}`}
      aria-hidden="true"
    >
      +
    </span>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#B8A8E8] px-6 py-10 text-[#10131A] md:px-10 lg:px-16">
      <Image
        alt="Pixel planet footer background"
        className="object-cover object-center opacity-45"
        fill
        sizes="100vw"
        src="/images/arcade/pixel-planet.png"
      />
      <div className="absolute inset-0 bg-[#B8A8E8]/70" />
      <div className="relative z-10 flex w-full flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="font-pixel text-xs uppercase leading-relaxed">
          ▣ © Never Found 1999
          <br />
          All rights reserved
        </p>
        <div className="font-pixel flex flex-wrap gap-8 text-xs uppercase">
          {["Instagram", "Tiktok", "Youtube", "Contact"].map((item) => (
            <Link href={item === "Contact" ? "/contact" : "/about"} key={item}>
              {item}
            </Link>
          ))}
        </div>
        <span className="pixel-blink text-2xl text-[#F05267]">▣</span>
      </div>
    </footer>
  );
}
