import { wedding } from "@/lib/wedding";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

export function Details() {
  const { dateDisplay, location } = wedding;

  return (
    <Section id="details" className="bg-ivory">
      <SectionHeading label="The Wedding" title="Ceremony & reception" />

      <div className="mt-14 grid gap-6 md:mt-20 md:grid-cols-2 md:gap-8">
        <article className="rounded-sm border border-gold/20 bg-white p-6 text-center shadow-sm md:p-10">
          <p className="text-xs uppercase tracking-[0.25em] text-gold md:text-sm">
            When
          </p>
          <p className="mt-3 font-serif text-2xl text-green md:text-3xl">
            {dateDisplay}
          </p>
          <p className="mt-2 text-sm text-[#1a1a1a]/60 md:text-base">
            Ceremony begins at 4:00 PM
          </p>
        </article>

        <article className="rounded-sm border border-gold/20 bg-white p-6 text-center shadow-sm md:p-10">
          <p className="text-xs uppercase tracking-[0.25em] text-gold md:text-sm">
            Where
          </p>
          <p className="mt-3 font-serif text-2xl text-green md:text-3xl">
            {location.venue}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#1a1a1a]/60 md:text-base">
            {location.address}
          </p>
          <a
            href={location.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-xs uppercase tracking-[0.2em] text-gold underline-offset-4 transition-colors hover:text-green hover:underline md:text-sm"
          >
            View on map
          </a>
        </article>
      </div>
    </Section>
  );
}
