export default function Hero() {
  return (
    <section id="top" className="relative bg-acid text-ink overflow-hidden">
      <div className="px-5 pt-10 pb-8 md:px-8 md:pt-16 md:pb-12">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest2 mb-6 md:mb-10">
          <span>Case file / SS26</span>
          <span>04 items · open</span>
        </div>

        <h1 className="font-display uppercase leading-[0.82] -ml-1">
          <span className="block text-[20vw] md:text-[9rem] lg:text-[11rem]">
            NEVER
          </span>
          <span className="block text-[20vw] md:text-[9rem] lg:text-[11rem] ml-[12vw] md:ml-32">
            FOUND
          </span>
        </h1>

        <div className="mt-8 md:mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <p className="font-body text-sm md:text-base max-w-xs leading-snug">
            Streetwear made to disappear. Every drop runs once, in small
            count, then it&apos;s gone &mdash; untraceable, unrestocked,
            never found again.
          </p>

          <div className="flex gap-3 shrink-0">
            <a
              href="#evidence"
              className="bg-ink text-acid font-mono text-xs font-bold uppercase tracking-widest2 px-6 py-4 hover:bg-bone hover:text-ink transition-colors text-center"
            >
              View drop
            </a>
            <a
              href="#statement"
              className="border border-ink font-mono text-xs font-bold uppercase tracking-widest2 px-6 py-4 hover:bg-ink hover:text-acid transition-colors text-center"
            >
              The story
            </a>
          </div>
        </div>
      </div>

      {/* bottom hairline rule, like a perforated tear */}
      <div
        className="h-3 w-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--ink) 0 6px, transparent 6px 14px)",
        }}
      />
    </section>
  );
}
