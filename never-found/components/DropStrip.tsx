export default function DropStrip() {
  return (
    <section id="status" className="bg-ink px-5 py-16 md:px-8 md:py-24">
      <div className="border border-acid/30 p-6 md:p-12">
        <div className="font-mono text-[11px] uppercase tracking-widest2 text-acid mb-4">
          Status: next drop pending
        </div>
        <h2 className="font-display uppercase text-4xl md:text-6xl leading-[0.9] max-w-2xl">
          Get found first. Get notified before it&apos;s gone.
        </h2>

        <form
          className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="your@email.com"
            className="flex-1 bg-transparent border border-bone/30 px-4 py-4 font-mono text-sm placeholder:text-bone/40 text-bone focus:border-acid outline-none"
          />
          <button
            type="submit"
            className="bg-acid text-ink font-mono text-xs font-bold uppercase tracking-widest2 px-6 py-4 hover:bg-bone transition-colors whitespace-nowrap"
          >
            Notify me
          </button>
        </form>
        <p className="font-mono text-[10px] uppercase tracking-wide text-bone/40 mt-3">
          No spam. Just drop alerts. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
