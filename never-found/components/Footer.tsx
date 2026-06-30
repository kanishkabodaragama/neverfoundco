import Ticker from "@/components/Ticker";

export default function Footer() {
  return (
    <footer className="bg-ink">
      <Ticker />
      <div className="px-5 py-12 md:px-8 md:py-16">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="font-display text-2xl tracking-tight leading-none text-acid">
                NEVER
              </span>
              <span className="font-display text-2xl tracking-tight leading-none border border-acid px-1.5 py-0.5">
                FOUND
              </span>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-bone/40 max-w-xs">
              Independent streetwear. Small runs. No restocks. Based
              nowhere in particular.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 font-mono text-xs uppercase tracking-widest2">
            <div className="flex flex-col gap-3 text-bone/60">
              <span className="text-acid/70 mb-1">Shop</span>
              <a href="#evidence" className="hover:text-acid transition-colors">
                Current drop
              </a>
              <a href="#status" className="hover:text-acid transition-colors">
                Drop alerts
              </a>
            </div>
            <div className="flex flex-col gap-3 text-bone/60">
              <span className="text-acid/70 mb-1">Follow</span>
              <a href="#" className="hover:text-acid transition-colors">
                Instagram
              </a>
              <a href="#" className="hover:text-acid transition-colors">
                TikTok
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-acid/10 flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-wide text-bone/30">
          <span>&copy; {new Date().getFullYear()} Never Found. All units accounted for.</span>
          <span>Case closed.</span>
        </div>
      </div>
    </footer>
  );
}
