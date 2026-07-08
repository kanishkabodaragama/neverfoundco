const faqs = [
  {
    question: "Where are you based?",
    answer: "Never Found is based in Colombo, Sri Lanka.",
  },
  {
    question: "Do you ship worldwide?",
    answer: "Yes. We ship everywhere the postal routes let us reach.",
  },
  {
    question: "When will my order ship?",
    answer: "Orders usually ship after payment is confirmed and packed.",
  },
  {
    question: "Do you restock sold out items?",
    answer: "No restocks. Once a piece is gone, that is the code.",
  },
  {
    question: "How can I track my order?",
    answer: "Tracking details will be sent to your email after dispatch.",
  },
];

export function FaqSection() {
  return (
    <section className="bg-[#ead8bd] px-5 py-10 md:px-8 lg:px-10 xl:px-12">
      <div className="grid gap-8 lg:grid-cols-[0.82fr_1fr] lg:items-start">
        <div>
          <h2 className="mb-5 text-3xl font-black uppercase tracking-normal">
            FAQ
          </h2>
          <div className="grid gap-2">
            {faqs.map((faq) => (
              <details
                className="group border-2 border-[#17251f]"
                key={faq.question}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-black uppercase transition hover:bg-[#f0dfc4]">
                  {faq.question}
                  <span className="text-2xl group-open:rotate-45">+</span>
                </summary>
                <p className="px-5 pb-5 text-sm font-bold leading-snug">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
        <div className="landing-paper relative min-h-[360px] overflow-hidden border-2 border-[#17251f] bg-[#d8bf8f]">
          <iframe
            aria-label="Google map showing Colombo, Sri Lanka"
            className="absolute inset-0 h-full w-full grayscale sepia"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Colombo%2001%2C%20Sri%20Lanka&output=embed"
            title="Never Found map location"
          />
          <div className="pointer-events-none absolute left-4 top-4 bg-[#123f32] px-4 py-3 text-sm font-black uppercase text-[#ead8bd]">
            Find us / Colombo
          </div>
        </div>
      </div>
    </section>
  );
}
