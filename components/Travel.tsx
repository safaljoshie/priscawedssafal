import { wedding } from "@/lib/wedding";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

export function Travel() {
  const { travel } = wedding;

  return (
    <Section id="travel" className="bg-ivory">
      <SectionHeading label="Travel" title="Getting there & staying" />

      <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
        <div>
          <h3 className="font-serif text-lg text-green md:text-xl">
            Nearest airports
          </h3>
          <ul className="mt-4 space-y-3 md:mt-6">
            {travel.airports.map(({ name, distance }) => (
              <li
                key={name}
                className="flex items-baseline justify-between border-b border-gold/15 pb-3 text-sm md:text-base"
              >
                <span>{name}</span>
                <span className="text-[#1a1a1a]/50">{distance}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-1">
          <h3 className="font-serif text-lg text-green md:text-xl">
            Where to stay
          </h3>
          <ul className="mt-4 space-y-4 md:mt-6">
            {travel.hotels.map(({ name, note, url }) => (
              <li
                key={name}
                className="rounded-sm border border-gold/20 bg-white p-4 md:p-5"
              >
                <a
                  href={url}
                  className="font-medium text-green transition-colors hover:text-gold md:text-lg"
                >
                  {name}
                </a>
                <p className="mt-1 text-xs leading-relaxed text-[#1a1a1a]/60 md:text-sm">
                  {note}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-sm border border-gold/20 bg-white p-4 md:p-6 md:col-span-2 lg:col-span-1">
          <h3 className="font-serif text-lg text-green md:text-xl">Parking</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#1a1a1a]/70 md:mt-4 md:text-base">
            {travel.parking}
          </p>
        </div>
      </div>
    </Section>
  );
}
