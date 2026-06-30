const ITEMS = [
  "STATUS: NEVER FOUND",
  "LAST SEEN: EVERYWHERE",
  "UNIT #047",
  "RESTOCK: NEGATIVE",
  "CASE STATUS: OPEN",
  "TRACE: LOST",
];

export default function Ticker() {
  const line = ITEMS.join("   ◆   ") + "   ◆   ";
  return (
    <div className="bg-acid text-ink ticker border-y border-ink/10">
      <div className="ticker__track font-mono text-[11px] md:text-xs font-bold uppercase tracking-widest2 py-2">
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
