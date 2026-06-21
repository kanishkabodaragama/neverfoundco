import Link from "next/link";

export function EmptyCart() {
  return (
    <section className="grid gap-6 bg-[#F7F1E6] px-5 py-12 text-center md:px-8 lg:px-10 xl:px-12">
      <div className="w-full bg-[#070B12] p-8 text-[#FFF9EF]">
        <p className="text-3xl">☹</p>
        <h2 className="font-pixel mt-4 text-2xl font-black uppercase">
          Your cart is empty
        </h2>
        <p className="mt-4 text-lg font-bold">Looks like you&apos;re still looking.</p>
        <Link
          className="pixel-edge mt-7 inline-flex bg-[#F05267] px-8 py-4 text-sm font-black uppercase text-[#FFF9EF]"
          href="/shop"
        >
          Explore the drop -&gt;
        </Link>
      </div>
    </section>
  );
}
