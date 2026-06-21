import Link from "next/link";

export function SocialFooterStrip() {
  return (
    <section className="bg-[#123f32] px-5 pb-8 text-[#ead8bd] md:px-8 lg:px-10 xl:px-12">
      <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
        <div>
          <p className="text-lg font-black uppercase">Follow Us</p>
          <div className="mt-3 flex flex-wrap gap-6 text-xl">
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
        </div>
        <div className="flex items-center justify-end gap-6">
          <p className="text-6xl">☼</p>
          <p className="font-hand rotate-[-6deg] text-4xl lowercase text-[#d9532f]">
            stay
            <br />
            lost →
          </p>
        </div>
      </div>
    </section>
  );
}
