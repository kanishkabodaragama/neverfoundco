import { ProductCard } from "@/components/site/ProductCard";
import { dropProducts } from "@/components/site/landing-data";

export function CurrentDrop() {
  return (
    <section
      className="grid gap-8 bg-[#ead8bd] px-5 py-9 md:grid-cols-[220px_1fr] md:px-8 lg:px-10 xl:px-12"
      id="shop"
    >
      <div className="space-y-7">
        <div className="space-y-7">
          <h2 className="font-black uppercase leading-none tracking-[-0.05em] text-[clamp(2.1rem,4vw,3.4rem)]">
            Current Drop
          </h2>
          <div className="space-y-4">
            <p className="text-2xl font-black uppercase text-[#d9532f]">
              Drop 001
            </p>
            <p className="max-w-[14rem] text-sm font-bold leading-snug">
              Shot in the sun. Built for nowhere. Made to stand out.
            </p>
          </div>
        </div>
        <p className="text-3xl">☺</p>
        <a
          className="text-sm font-black uppercase hover:text-[#d9532f]"
          href="/shop"
        >
          View all products -&gt;
        </a>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" id="drop-products">
        {dropProducts.map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </section>
  );
}
