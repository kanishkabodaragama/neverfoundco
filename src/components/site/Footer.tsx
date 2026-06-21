import Link from "next/link";
export function Footer() {
  return (
    <footer className="bg-[#070B12] px-5 py-8 text-[#FFF9EF] md:px-8 lg:px-10 xl:px-12">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="font-pixel text-xs uppercase leading-relaxed">
          ▣ © Never Found 1999
          <br />
          All rights reserved
        </p>
        <div className="font-pixel flex flex-wrap gap-7 text-xs uppercase">
          <Link href="/about">Instagram</Link>
          <Link href="/about">Tiktok</Link>
          <Link href="/about">Youtube</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <span className="pixel-blink text-2xl text-[#B8A8E8]">▣</span>
      </div>
    </footer>
  );
}
