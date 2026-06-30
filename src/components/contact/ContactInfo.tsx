const contactItems = [
  { icon: "✉", label: "Email", value: "hello@neverfoundco.com" },
  { icon: "☎", label: "Phone", value: "+94 70 123 4567" },
  { icon: "◎", label: "Instagram", value: "@neverfoundco" },
  {
    icon: "⌖",
    label: "Address",
    value: "No. 27, Loop Street, Colombo 01, Sri Lanka.",
  },
];

export function ContactInfo() {
  return (
    <div className="relative">
      <h2 className="font-display text-3xl uppercase leading-none">
        Other Ways To Reach Us
      </h2>
      <div className="mt-6 grid gap-5">
        <div className="grid gap-5">
          {contactItems.map((item) => (
            <div className="grid grid-cols-[44px_1fr] gap-4" key={item.label}>
              <span className="flex h-10 w-10 items-center justify-center border border-ink/30 font-mono text-lg text-rust">
                {item.icon}
              </span>
              <div>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-rust">{item.label}</p>
                <p className="mt-1 text-sm font-semibold leading-snug text-ink/70">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
