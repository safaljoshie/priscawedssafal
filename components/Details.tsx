import { wedding } from "@/lib/wedding";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

export function Details() {
  const { dateDisplay, location, events } = wedding;

  return (
    <Section id="details" className="bg-ivory">
      <SectionHeading label="The Wedding" title="A few days of celebration" />

      <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-[#1a1a1a]/70 md:text-base">
        Our wedding spans several days of traditions and festivities. Join us
        for as many events as your invitation includes.
      </p>

      <article className="mx-auto mt-10 max-w-2xl rounded-sm border border-gold/20 bg-white p-6 text-center shadow-sm md:mt-14 md:p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-gold md:text-sm">
          When & where
        </p>
        <p className="mt-3 font-serif text-2xl text-green md:text-3xl">
          {dateDisplay}
        </p>
        <p className="mt-3 font-serif text-lg text-green/90 md:text-xl">
          {location.venue}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#1a1a1a]/60 md:text-base">
          {location.address} · {location.city}
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

      <div className="mt-14 space-y-8 md:mt-20 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
        {events.map((event, index) => (
          <article
            key={event.id}
            className="overflow-hidden rounded-sm border border-gold/20 bg-white shadow-sm"
          >
            <div className="border-b border-gold/15 bg-ivory/40 px-6 py-5 md:px-8 md:py-6">
              <p className="font-serif text-xs uppercase tracking-[0.3em] text-gold">
                {index + 1}. {event.name}
              </p>
              <p className="mt-2 font-serif text-xl text-green md:text-2xl">
                {event.date}
              </p>
              <p className="mt-1 text-sm text-[#1a1a1a]/55">{event.venue}</p>
            </div>

            <ol className="px-6 py-2 md:px-8">
              {event.schedule.map(({ time, event: item, location: place }, i) => (
                <li
                  key={`${event.id}-${time}`}
                  className={`flex gap-4 py-4 md:gap-6 md:py-5 ${
                    i < event.schedule.length - 1
                      ? "border-b border-gold/10"
                      : ""
                  }`}
                >
                  <time className="w-16 shrink-0 font-serif text-sm text-gold md:w-20 md:text-base">
                    {time}
                  </time>
                  <div>
                    <p className="text-sm font-medium text-green md:text-base">
                      {item}
                    </p>
                    {place && (
                      <p className="mt-0.5 text-xs text-[#1a1a1a]/50 md:text-sm">
                        {place}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </Section>
  );
}
