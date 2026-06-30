import Link from "next/link";
import { StorePrice } from "@/components/site/StorePrice";

export function OrderSummary({
  discount = 0,
  couponCode,
  subtotal,
  shipping,
}: {
  discount?: number;
  couponCode?: string;
  subtotal: number;
  shipping: number;
}) {
  const total = Math.max(0, subtotal - discount) + shipping;

  return (
    <aside className="space-y-4">
      <div className="bg-ink p-5 text-bone">
        <h2 className="font-display text-3xl uppercase leading-none">Order Summary</h2>
        <div className="mt-7 space-y-4 font-mono text-sm font-bold uppercase">
          <div className="flex justify-between gap-4">
            <span>Subtotal</span>
            <span><StorePrice amountUsd={subtotal} /></span>
          </div>
          {discount > 0 ? (
            <div className="flex justify-between gap-4 text-acid">
              <span>Discount {couponCode ? `(${couponCode})` : ""}</span>
              <span>-<StorePrice amountUsd={discount} /></span>
            </div>
          ) : null}
          <div className="flex justify-between gap-4">
            <span>Shipping</span>
            <span><StorePrice amountUsd={shipping} /></span>
          </div>
          <div className="h-px bg-acid/15" />
          <div className="flex items-end justify-between gap-4">
            <span className="text-xl font-black">Total</span>
            <span className="text-xl font-black text-acid">
              <StorePrice amountUsd={total} />
            </span>
          </div>
        </div>
        <Link
          className="mt-7 flex justify-center bg-acid px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.28em] text-ink transition-colors hover:bg-bone"
          href="/checkout"
        >
          Proceed To Checkout
        </Link>
      </div>
      <div className="space-y-4 border border-ink bg-bone p-5 text-ink">
        {[
          ["01", "Worldwide Shipping", "We ship everywhere. Wear it anywhere."],
          ["02", "No Restocks", "If it's sold out, it's never coming back."],
          ["03", "Made To Stand Out", "Original designs. Premium quality."],
        ].map(([icon, title, text]) => (
          <div className="grid grid-cols-[50px_1fr] gap-4" key={title}>
            <span className="font-display text-4xl leading-none text-rust">{icon}</span>
            <div>
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.28em]">{title}</h3>
              <p className="mt-1 text-sm font-semibold leading-snug text-ink/65">{text}</p>
            </div>
          </div>
        ))}
      </div>
      <figure className="relative min-h-[160px] overflow-hidden bg-ink">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="select-none font-display text-8xl uppercase text-acid/15">NF</span>
        </div>
        <p className="absolute bottom-3 left-5 bg-acid px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-ink">
          Case open
        </p>
      </figure>
    </aside>
  );
}
