const values = [
  {
    icon: "🔥",
    title: "Limited Drops",
    text: "3-4 pieces per drop. Once they're gone, they're gone.",
  },
  {
    icon: "🌎",
    title: "Worldwide Shipping",
    text: "We ship everywhere.",
  },
  {
    icon: "🙂",
    title: "No Restocks",
    text: "If it's sold out, it's never coming back.",
  },
  {
    icon: "✦",
    title: "Made To Stand Out",
    text: "Original designs. Built different.",
  },
];

export function BrandValuesBanner() {
  return (
    <section className="landing-noise relative grid gap-5 bg-[#123f32] px-5 py-9 text-[#ead8bd] md:grid-cols-2 md:px-8 lg:grid-cols-4 lg:px-10 xl:px-12">
      {values.map((value) => (
        <article className="space-y-3" key={value.title}>
          <p className="text-4xl">{value.icon}</p>
          <h2 className="text-xl font-black uppercase leading-none">
            {value.title}
          </h2>
          <p className="max-w-xs text-sm font-bold leading-snug">{value.text}</p>
        </article>
      ))}
    </section>
  );
}

