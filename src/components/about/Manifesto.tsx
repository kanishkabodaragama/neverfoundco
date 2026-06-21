export function Manifesto() {
  return (
    <section className="grid gap-6 bg-[#ead8bd] px-5 py-10 md:grid-cols-[0.9fr_1.1fr] md:px-8 lg:px-10 xl:px-12">
      <article className="landing-noise relative min-h-[320px] overflow-hidden bg-[#123f32] p-8 text-[#ead8bd]">
        <h2 className="text-4xl font-black uppercase leading-[0.96] tracking-[-0.04em] md:text-6xl">
          We&apos;re small.
          <br />
          We care.
          <br />
          We do this
          <br />
          for real.
        </h2>
        <p className="absolute right-8 top-8 text-7xl">🌐</p>
        <p className="absolute bottom-8 left-8 text-4xl">☠</p>
      </article>
      <article className="relative min-h-[320px] overflow-hidden bg-[#c94f2e] p-8 text-[#ead8bd]">
        <p className="font-hand max-w-xl rotate-[-2deg] text-3xl leading-tight md:text-5xl">
          Lost but enjoying the journey. Built for the ones who make their own
          map.
        </p>
        <p className="font-hand absolute bottom-8 right-8 rotate-[6deg] bg-[#d8bf8f] px-5 py-3 text-xl uppercase leading-tight text-[#17251f]">
          Support real
          <br />
          Support small
          <br />
          Support culture
        </p>
      </article>
    </section>
  );
}

