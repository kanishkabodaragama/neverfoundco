import Link from "next/link";

export function EmptyCart() {
  return (
    <section className="grid gap-6 bg-bone px-5 py-16 text-center text-ink md:px-8 lg:px-10 xl:px-12">
      <div className="w-full bg-ink p-8 text-bone">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-acid">Case empty</p>
        <h2 className="mt-4 font-display text-5xl uppercase leading-none md:text-7xl">
          Your cart is empty
        </h2>
        <p className="mt-4 text-lg font-semibold text-bone/70">Looks like you&apos;re still looking.</p>
        <Link
          className="mt-7 inline-flex bg-acid px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.28em] text-ink transition-colors hover:bg-bone"
          href="/shop"
        >
          Explore the drop
        </Link>
      </div>
    </section>
  );
}
