import { wedding } from "@/lib/wedding";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";
import { StayPreview } from "./StayPreview";

const phoneFrameClass =
  "overflow-hidden rounded-[1.75rem] border-[3px] shadow-md";

const phoneHeightClass = "h-[440px] md:h-[485px]";

const infoBoxClass = `${phoneFrameClass} ${phoneHeightClass} flex flex-col justify-center border-green/25 bg-green/10 px-5 py-8 md:px-6`;

const columnClass =
  "flex w-full max-w-[280px] flex-col items-center text-center";

export function Travel() {
  const { travel } = wedding;
  const { gettingHere, explore } = travel;
  const { airport, busStops } = gettingHere;

  return (
    <Section id="travel" className="bg-ivory">
      <SectionHeading label="Travel" title="Getting there & staying" />

      <div className="mt-14 grid justify-items-center gap-10 md:mt-20 md:grid-cols-3 md:gap-8 lg:gap-12">
        <div className={columnClass}>
          <h3 className="font-serif text-lg text-green md:text-xl">
            {gettingHere.title}
          </h3>
          <div className="mt-4 w-full md:mt-6">
            <div className={infoBoxClass}>
              <div>
                <p className="font-serif text-sm text-gold md:text-base">
                  {airport.label}
                </p>
                <p className="mt-2 flex items-baseline justify-between gap-2 text-sm text-green md:text-base">
                  <span>{airport.name}</span>
                  <span className="shrink-0 text-[#1a1a1a]/55">
                    {airport.distance}
                  </span>
                </p>
              </div>

              <div className="mt-8 border-t border-green/15 pt-8">
                <p className="font-serif text-sm text-gold md:text-base">
                  {busStops.label}
                </p>
                <ul className="mt-3 space-y-3">
                  {busStops.stops.map(({ name, distance }) => (
                    <li
                      key={name}
                      className="flex items-baseline justify-between gap-2 text-sm text-green md:text-base"
                    >
                      <span>{name}</span>
                      <span className="shrink-0 text-[#1a1a1a]/55">
                        {distance}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className={columnClass}>
          <h3 className="font-serif text-lg text-green md:text-xl">
            Where to stay
          </h3>
          <StayPreview
            url={travel.stay.url}
            name={travel.stay.name}
            note={travel.stay.note}
          />
        </div>

        <div className={columnClass}>
          <h3 className="font-serif text-lg text-green md:text-xl">
            {explore.title}
          </h3>
          <div className="mt-4 w-full md:mt-6">
            <div
              className={`${infoBoxClass} items-center text-center`}
            >
              <p className="text-sm leading-relaxed text-green md:text-base">
                There are so many places to explore while you are free but the
                bride and groom are not. So visit{" "}
                <a
                  href={explore.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-gold underline-offset-2 transition-colors hover:text-green hover:underline"
                >
                  SaurahaNepal.com
                </a>{" "}
                and discover Sauraha and it&apos;s wildness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
