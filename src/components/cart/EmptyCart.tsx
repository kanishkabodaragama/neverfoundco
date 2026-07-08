import Link from "next/link";

export function EmptyCart() {
  return (
    <section className="grid gap-6 bg-acid px-5 py-12 text-center text-ink md:px-8 md:py-16 lg:px-10 xl:px-12">
      <div className="w-full border border-ink p-8 text-ink">
        <p className="font-sans text-[11px] uppercase tracking-normal text-rust">Case empty</p>
        <h2 className="mt-4 font-display text-5xl uppercase leading-none md:text-7xl">
          Your cart is empty
        </h2>
        <p className="mt-4 text-lg font-semibold text-ink/70">Looks like you&apos;re still looking.</p>
        <Link
          className="mt-7 inline-flex bg-ink px-8 py-4 font-sans text-xs font-bold uppercase tracking-normal text-acid transition-colors hover:bg-rust hover:text-ink"
          href="/shop"
        >
          Explore the drop
        </Link>
      </div>
    </section>
  );
}
