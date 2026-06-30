const PRODUCTS = [
  {
    tag: "EXHIBIT A",
    name: "Ghost Hoodie",
    color: "Washed Black",
    price: "$118",
    status: "3 left",
    rotate: "-rotate-2",
  },
  {
    tag: "EXHIBIT B",
    name: "Static Tee",
    color: "Acid Yellow",
    price: "$58",
    status: "Sold out",
    rotate: "rotate-1",
  },
  {
    tag: "EXHIBIT C",
    name: "Vanish Cargo",
    color: "Concrete Grey",
    price: "$142",
    status: "7 left",
    rotate: "-rotate-1",
  },
  {
    tag: "EXHIBIT D",
    name: "Blackout Cap",
    color: "Jet",
    price: "$44",
    status: "12 left",
    rotate: "rotate-2",
  },
];

export default function EvidenceGrid() {
  return (
    <section id="evidence" className="bg-bone text-ink px-5 py-16 md:px-8 md:py-24">
      <div className="flex items-end justify-between mb-10 md:mb-14">
        <h2 className="font-display uppercase text-4xl md:text-6xl leading-none">
          Current
          <br />
          drop
        </h2>
        <span className="font-mono text-[11px] uppercase tracking-widest2 text-ink/50">
          04 / 04 logged
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-12 md:gap-x-10 md:gap-y-16">
        {PRODUCTS.map((p) => (
          <div key={p.name} className="group">
            <div
              className={`relative aspect-[4/5] bg-ink ${p.rotate} group-hover:rotate-0 transition-transform duration-300 overflow-hidden`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-acid/15 text-7xl uppercase select-none">
                  NF
                </span>
              </div>
              <div className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-widest2 bg-acid text-ink px-2 py-1">
                {p.tag}
              </div>
              {p.status === "Sold out" && (
                <div className="absolute inset-0 bg-ink/70 flex items-center justify-center">
                  <span className="font-mono text-xs uppercase tracking-widest2 text-bone border border-bone/40 px-3 py-1">
                    Never found again
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl uppercase leading-tight">
                  {p.name}
                </h3>
                <p className="font-mono text-[11px] uppercase tracking-wide text-ink/50 mt-1">
                  {p.color}
                </p>
              </div>
              <div className="text-right shrink-0 pl-4">
                <div className="font-mono text-sm font-bold">{p.price}</div>
                <div
                  className={`font-mono text-[10px] uppercase tracking-wide mt-1 ${
                    p.status === "Sold out" ? "text-rust" : "text-ink/50"
                  }`}
                >
                  {p.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <a
          href="#status"
          className="inline-block bg-ink text-acid font-mono text-xs font-bold uppercase tracking-widest2 px-8 py-4 hover:bg-rust hover:text-ink transition-colors"
        >
          View full case file
        </a>
      </div>
    </section>
  );
}
