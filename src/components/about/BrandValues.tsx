import { brandValues } from "@/components/about/about-data";

export function BrandValues() {
  return (
    <section className="landing-noise bg-[#c94f2e] px-5 py-9 text-[#ead8bd] md:px-8 lg:px-10 xl:px-12">
      <h2 className="mb-7 text-center text-3xl font-black uppercase tracking-[-0.04em] md:text-4xl">
        What We Stand For
      </h2>
      <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">
        {brandValues.map((value) => (
          <article className="grid grid-cols-[64px_1fr] gap-4" key={value.title}>
            <p className="text-5xl">{value.icon}</p>
            <div>
              <h3 className="text-lg font-black uppercase">{value.title}</h3>
              <p className="mt-2 max-w-xs text-sm font-bold leading-snug">
                {value.text}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

