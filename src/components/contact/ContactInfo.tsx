import Image from "next/image";

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
      <h2 className="text-3xl font-black uppercase tracking-[-0.04em]">
        Other Ways To Reach Us
      </h2>
      <div className="mt-6 grid gap-8 xl:grid-cols-[1fr_300px] xl:items-start">
        <div className="grid gap-5">
          {contactItems.map((item) => (
            <div className="grid grid-cols-[58px_1fr] gap-4" key={item.label}>
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#17251f] text-2xl">
                {item.icon}
              </span>
              <div>
                <p className="font-black uppercase text-[#d9532f]">{item.label}</p>
                <p className="max-w-xs text-sm font-bold leading-snug">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
        <figure className="paper-frame relative mx-auto w-full max-w-[300px] rotate-[4deg] bg-[#ead8bd] p-3 pb-10 shadow-[0_8px_20px_rgba(23,37,31,0.18)] xl:mt-2">
          <div className="relative aspect-square overflow-hidden bg-[#123f32]">
            <Image
              alt="Polaroid style street sign from the Never Found world"
              className="object-cover"
              fill
              src="/images/landing/lookbook-2.svg"
            />
          </div>
          <figcaption className="font-hand mt-3 text-right text-xl uppercase">
            Built different
          </figcaption>
        </figure>
      </div>
      <p className="absolute right-0 top-0 hidden text-6xl md:block">✶</p>
    </div>
  );
}
