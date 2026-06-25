import Link from "next/link";
import Image from "next/image";
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#B8A8E8] px-5 py-10 text-[#10131A] md:px-8 lg:px-10 xl:px-12">
      <Image
        alt="Pixel planet footer background"
        className="object-cover object-center opacity-45"
        fill
        sizes="100vw"
        src="/images/arcade/pixel-planet.png"
      />
      <div className="absolute inset-0 bg-[#B8A8E8]/70" />
      <div className="relative z-10 mx-auto flex w-full flex-col gap-6 md:flex-row md:items-center md:justify-between">
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
          <Link href="/returns">Returns</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <Link
          className="font-pixel text-xs uppercase leading-relaxed transition hover:text-[#F05267]"
          href="https://neurait.com"
          rel="noreferrer"
          target="_blank"
        >
          Developed and maintained by Neura IT
        </Link>
      </div>
    </footer>
  );
}
