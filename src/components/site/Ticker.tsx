const TICKER_ITEMS = [
  "STATUS: NEVER FOUND",
  "LAST SEEN: EVERYWHERE",
  "UNIT #047",
  "RESTOCK: NEGATIVE",
  "CASE STATUS: OPEN",
  "TRACE: LOST",
];

export function Ticker() {
  const line = `${TICKER_ITEMS.join("   ◆   ")}   ◆   `;

  return (
    <div className="ticker border-y border-ink/10 bg-acid text-ink">
      <div className="ticker__track py-2 font-mono text-[11px] font-bold uppercase tracking-[0.28em] md:text-xs">
        <span className="pr-4">
          {line}
          {line}
        </span>
        <span className="pr-4" aria-hidden="true">
          {line}
          {line}
        </span>
      </div>
    </div>
  );
}
