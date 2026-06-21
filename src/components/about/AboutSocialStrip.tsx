import Link from "next/link";

export function AboutSocialStrip() {
  return (
    <section className="landing-noise bg-[#17251f] px-5 py-7 text-[#ead8bd] md:px-8 lg:px-10 xl:px-12">
      <div className="grid gap-6 md:grid-cols-[1fr_1fr_1fr] md:items-center">
        <p className="text-lg font-black uppercase">Follow Us</p>
        <div className="flex flex-wrap gap-8 text-xl">
          <a aria-label="Instagram" href="/contact">
            ◎
          </a>
          <a aria-label="TikTok" href="/contact">
            ♪
          </a>
          <a aria-label="YouTube" href="/contact">
            ▶
          </a>
          <Link aria-label="Website" href="/">
            ◉
          </Link>
        </div>
        <p className="font-hand text-4xl lowercase text-[#ead8bd] md:text-right">
          stay lost →
        </p>
      </div>
    </section>
  );
}
