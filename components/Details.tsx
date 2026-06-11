import { wedding } from "@/lib/wedding";
import { SectionHeading } from "./SectionHeading";

export function Details() {
  const { dateDisplay, location } = wedding;

  return (
    <section id="details" className="bg-ivory px-6 py-20">
      <SectionHeading label="The Wedding" title="Ceremony & reception" />

      <div className="mt-14 space-y-6">
        <article className="rounded-sm border border-gold/20 bg-white p-6 text-center shadow-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">When</p>
          <p className="mt-3 font-serif text-2xl text-green">{dateDisplay}</p>
          <p className="mt-2 text-sm text-[#1a1a1a]/60">
            Ceremony begins at 4:00 PM
          </p>
        </article>

        <article className="rounded-sm border border-gold/20 bg-white p-6 text-center shadow-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Where</p>
          <p className="mt-3 font-serif text-2xl text-green">
            {location.venue}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#1a1a1a]/60">
            {location.address}
          </p>
          <a
            href={location.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-xs uppercase tracking-[0.2em] text-gold underline-offset-4 transition-colors hover:text-green hover:underline"
          >
            View on map
          </a>
        </article>
      </div>
    </section>
  );
}
