import { wedding } from "@/lib/wedding";
import { SectionHeading } from "./SectionHeading";

export function Travel() {
  const { travel } = wedding;

  return (
    <section id="travel" className="bg-ivory px-6 py-20">
      <SectionHeading label="Travel" title="Getting there & staying" />

      <div className="mt-14 space-y-10">
        <div>
          <h3 className="font-serif text-lg text-green">Nearest airports</h3>
          <ul className="mt-4 space-y-3">
            {travel.airports.map(({ name, distance }) => (
              <li
                key={name}
                className="flex items-baseline justify-between border-b border-gold/15 pb-3 text-sm"
              >
                <span>{name}</span>
                <span className="text-[#1a1a1a]/50">{distance}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg text-green">Where to stay</h3>
          <ul className="mt-4 space-y-4">
            {travel.hotels.map(({ name, note, url }) => (
              <li
                key={name}
                className="rounded-sm border border-gold/20 bg-white p-4"
              >
                <a
                  href={url}
                  className="font-medium text-green transition-colors hover:text-gold"
                >
                  {name}
                </a>
                <p className="mt-1 text-xs leading-relaxed text-[#1a1a1a]/60">
                  {note}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-sm border border-gold/20 bg-white p-4">
          <h3 className="font-serif text-lg text-green">Parking</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#1a1a1a]/70">
            {travel.parking}
          </p>
        </div>
      </div>
    </section>
  );
}
