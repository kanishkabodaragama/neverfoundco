import { cartCultureItems } from "@/components/cart/cart-data";

export function CartCultureStrip() {
  return (
    <section className="landing-noise grid gap-7 bg-[#123f32] px-5 py-9 text-[#ead8bd] md:grid-cols-2 md:px-8 lg:grid-cols-4 lg:px-10 xl:px-12">
      {cartCultureItems.map((item) => (
        <article className="grid grid-cols-[64px_1fr] gap-4" key={item.title}>
          <p className="text-5xl">{item.icon}</p>
          <div>
            <h2 className="text-lg font-black uppercase">{item.title}</h2>
            <p className="mt-2 text-sm font-bold leading-snug">{item.text}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

