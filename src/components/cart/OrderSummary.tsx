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
      <div className="border border-ink p-5 text-ink">
        <h2 className="font-display text-3xl uppercase leading-none">Order Summary</h2>
        <div className="mt-7 space-y-4 font-sans text-sm font-bold uppercase">
          <div className="flex justify-between gap-4">
            <span>Subtotal</span>
            <span><StorePrice amountLkr={subtotal} /></span>
          </div>
          {discount > 0 ? (
            <div className="flex justify-between gap-4 text-acid">
              <span>Discount {couponCode ? `(${couponCode})` : ""}</span>
              <span>-<StorePrice amountLkr={discount} /></span>
            </div>
          ) : null}
          <div className="flex justify-between gap-4">
            <span>Shipping</span>
            <span><StorePrice amountLkr={shipping} /></span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <span className="text-xl font-black">Total</span>
            <span className="text-xl font-black text-rust">
              <StorePrice amountLkr={total} />
            </span>
          </div>
        </div>
        <Link
          className="mt-7 flex justify-center bg-ink px-6 py-4 font-sans text-xs font-bold uppercase tracking-normal text-acid transition-colors hover:bg-rust hover:text-ink"
          href="/checkout"
        >
          Proceed To Checkout
        </Link>
      </div>
      <div className="space-y-4 border border-ink bg-transparent p-5 text-ink">
        {[
          ["01", "Worldwide Shipping", "We ship everywhere. Wear it anywhere."],
          ["02", "No Restocks", "If it's sold out, it's never coming back."],
          ["03", "Made To Stand Out", "Original designs. Premium quality."],
        ].map(([icon, title, text]) => (
          <div className="grid grid-cols-[50px_1fr] gap-4" key={title}>
            <span className="font-display text-4xl leading-none text-rust">{icon}</span>
            <div>
              <h3 className="font-sans text-[11px] font-bold uppercase tracking-normal">{title}</h3>
              <p className="mt-1 text-sm font-semibold leading-snug text-ink/65">{text}</p>
            </div>
          </div>
        ))}
      </div>
      <figure className="relative min-h-[120px] overflow-hidden border border-ink">
        <p className="absolute bottom-3 left-5 bg-ink px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-normal text-acid">
          Case open
        </p>
      </figure>
    </aside>
  );
}
