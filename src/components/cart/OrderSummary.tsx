import Link from "next/link";
import Image from "next/image";
import { StorePrice } from "@/components/site/StorePrice";

export function OrderSummary({
  subtotal,
  shipping,
}: {
  subtotal: number;
  shipping: number;
}) {
  const total = subtotal + shipping;

  return (
    <aside className="space-y-4">
      <div className="bg-[#070B12] p-5 text-[#FFF9EF]">
        <h2 className="font-pixel text-base font-black uppercase">Order Summary</h2>
        <div className="mt-7 space-y-4 text-sm font-bold">
          <div className="flex justify-between gap-4">
            <span>Subtotal</span>
            <span><StorePrice amountUsd={subtotal} /></span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Shipping</span>
            <span><StorePrice amountUsd={shipping} /></span>
          </div>
          <div className="h-px bg-[#F7F1E6]/15" />
          <div className="flex items-end justify-between gap-4">
            <span className="text-xl font-black">Total</span>
            <span className="text-xl font-black text-[#F05267]">
              <StorePrice amountUsd={total} />
            </span>
          </div>
        </div>
        <Link
          className="pixel-edge mt-7 flex justify-center bg-[#F05267] px-6 py-4 text-sm font-black uppercase transition hover:translate-x-0.5"
          href="/checkout"
        >
          Proceed To Checkout -&gt;
        </Link>
      </div>
      <div className="space-y-4 border border-[#10131A]/10 bg-[#FFF9EF] p-5 text-[#10131A]">
        {[
          ["🌐", "Worldwide Shipping", "We ship everywhere. Wear it anywhere."],
          ["☺", "No Restocks", "If it's sold out, it's never coming back."],
          ["✶", "Made To Stand Out", "Original designs. Premium quality."],
        ].map(([icon, title, text]) => (
          <div className="grid grid-cols-[50px_1fr] gap-4" key={title}>
            <span className="text-4xl">{icon}</span>
            <div>
              <h3 className="text-sm font-black uppercase">{title}</h3>
              <p className="text-sm font-bold leading-snug">{text}</p>
            </div>
          </div>
        ))}
      </div>
      <figure className="relative min-h-[160px] overflow-hidden bg-[#070B12]">
        <Image
          alt="Vintage van culture strip"
          className="object-cover"
          fill
          src="/images/landing/countdown-van.svg"
        />
        <p className="absolute bottom-3 left-5 bg-[#070B12] px-4 py-2 text-sm font-black uppercase text-[#FFF9EF]">
          Enjoy the ride
        </p>
        <p className="absolute bottom-3 right-4 text-5xl">☠</p>
      </figure>
    </aside>
  );
}
