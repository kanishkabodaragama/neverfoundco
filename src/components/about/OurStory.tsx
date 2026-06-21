import Image from "next/image";
import { storyPolaroids } from "@/components/about/about-data";

export function OurStory() {
  return (
    <section className="grid gap-9 bg-[#ead8bd] px-5 py-10 md:grid-cols-[0.72fr_1.28fr] md:px-8 lg:px-10 xl:px-12">
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <h2 className="text-4xl font-black uppercase tracking-[-0.05em]">
            Our Story
          </h2>
          <span className="font-hand text-4xl text-[#d9532f]">~~~</span>
        </div>
        <div className="max-w-md space-y-5 text-base font-bold leading-snug">
          <p>
            It started with long summer days, empty pools, old VHS tapes, and
            nights that never ended.
          </p>
          <p>
            We were kids with big dreams, no plans, skateboards, mixtapes, and a
            camera that was always out of film.
          </p>
          <p>
            Never Found was born from that feeling. The feeling of being young,
            free, and a little lost.
          </p>
          <p>
            We don&apos;t chase trends.
            <br />
            We chase moments.
          </p>
        </div>
        <p className="font-hand max-w-md text-2xl leading-tight text-[#d9532f]">
          This is our story.
          <br />
          Thanks for being part of it.
        </p>
      </div>
      <div className="relative grid gap-4 sm:grid-cols-3">
        {storyPolaroids.map((item, index) => (
          <figure
            className={`bg-[#ead8bd] p-3 pb-8 shadow-[0_8px_20px_rgba(23,37,31,0.22)] ${
              index === 0
                ? "rotate-[-2deg] sm:translate-y-4"
                : index === 1
                  ? "rotate-[3deg]"
                  : "rotate-[-1deg] sm:translate-y-8"
            }`}
            key={item.caption}
          >
            <div className="relative aspect-[4/4.6] overflow-hidden bg-[#123f32]">
              <Image alt={item.alt} className="object-cover" fill src={item.src} />
            </div>
            <figcaption className="font-hand mt-3 whitespace-pre-line text-center text-lg uppercase leading-tight">
              {item.caption}
            </figcaption>
          </figure>
        ))}
        <p className="font-hand absolute bottom-[-2rem] left-1/2 hidden -translate-x-1/2 bg-[#17251f] px-6 py-2 text-xl uppercase text-[#ead8bd] sm:block">
          Summer isn&apos;t over
        </p>
        <p className="absolute right-2 top-[-2rem] hidden text-6xl md:block">☺</p>
      </div>
    </section>
  );
}

