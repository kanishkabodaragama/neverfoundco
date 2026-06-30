export default function Statement() {
  return (
    <section id="statement" className="bg-ink px-5 py-16 md:px-8 md:py-28">
      <div className="font-mono text-[11px] uppercase tracking-widest2 text-acid mb-6">
        Evidence log / 01
      </div>

      <p className="font-display uppercase text-stroke text-[12vw] leading-[0.95] md:text-6xl lg:text-7xl md:max-w-4xl">
        We don&apos;t restock. We don&apos;t archive. Wear it before it
        disappears.
      </p>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 border-t border-acid/15 pt-8 max-w-3xl">
        {[
          ["50", "units per drop"],
          ["0", "restocks, ever"],
          ["1", "drop a month"],
          ["∞", "ways to wear it"],
        ].map(([num, label]) => (
          <div key={label}>
            <div className="font-display text-3xl md:text-4xl text-acid leading-none">
              {num}
            </div>
            <div className="font-mono text-[10px] md:text-xs uppercase tracking-wide text-bone/60 mt-2">
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
