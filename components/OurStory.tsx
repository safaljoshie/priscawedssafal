import { wedding } from "@/lib/wedding";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

export function OurStory() {
  return (
    <Section id="story" className="bg-white">
      <SectionHeading label="Our Story" title="How we fell in love" />

      <div className="relative mt-14 md:mt-20">
        <div
          className="absolute left-[1.125rem] top-2 bottom-2 w-px bg-gold/25 md:left-1/2 md:-translate-x-px"
          aria-hidden
        />

        <ol className="space-y-10 md:space-y-16">
          {wedding.story.map(({ year, title, text }, i) => (
            <li
              key={year}
              className="relative pl-10 md:grid md:grid-cols-2 md:gap-12 md:pl-0"
            >
              <span
                className="absolute left-0 top-1 flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-ivory font-serif text-xs text-gold md:left-1/2 md:-translate-x-1/2 md:h-11 md:w-11 md:text-sm"
                aria-hidden
              >
                {year.slice(2)}
              </span>

              {i % 2 === 1 ? (
                <div className="hidden md:block" aria-hidden />
              ) : null}

              <div
                className={`md:pt-1 ${
                  i % 2 === 0
                    ? "md:col-start-1 md:pr-16 md:text-right"
                    : "md:col-start-2 md:pl-16"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-gold md:text-sm">
                  {year}
                </p>
                <h3 className="mt-1 font-serif text-xl text-green md:text-2xl">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#1a1a1a]/70 md:text-base">
                  {text}
                </p>
              </div>

              {i % 2 === 0 ? (
                <div className="hidden md:block" aria-hidden />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
