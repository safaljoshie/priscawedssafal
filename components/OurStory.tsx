import { wedding } from "@/lib/wedding";
import { SectionHeading } from "./SectionHeading";

export function OurStory() {
  return (
    <section id="story" className="bg-white px-6 py-20">
      <SectionHeading label="Our Story" title="How we fell in love" />

      <div className="relative mt-14">
        <div
          className="absolute left-[1.125rem] top-2 bottom-2 w-px bg-gold/25"
          aria-hidden
        />

        <ol className="space-y-10">
          {wedding.story.map(({ year, title, text }) => (
            <li key={year} className="relative pl-10">
              <span
                className="absolute left-0 top-1 flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-ivory font-serif text-xs text-gold"
                aria-hidden
              >
                {year.slice(2)}
              </span>
              <h3 className="font-serif text-xl text-green">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#1a1a1a]/70">
                {text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
