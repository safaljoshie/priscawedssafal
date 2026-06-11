import { wedding } from "@/lib/wedding";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

export function Schedule() {
  return (
    <Section id="schedule" className="bg-white">
      <SectionHeading label="Schedule" title="Day-of timeline" />

      <ol className="mx-auto mt-14 max-w-2xl space-y-0 md:mt-20">
        {wedding.schedule.map(({ time, event, location }, i) => (
          <li
            key={time}
            className={`flex gap-5 py-5 md:gap-8 md:py-6 ${
              i < wedding.schedule.length - 1 ? "border-b border-gold/15" : ""
            }`}
          >
            <time className="w-16 shrink-0 font-serif text-sm text-gold md:w-24 md:text-base">
              {time}
            </time>
            <div>
              <p className="font-medium text-green md:text-lg">{event}</p>
              {location && (
                <p className="mt-0.5 text-xs text-[#1a1a1a]/50 md:text-sm">
                  {location}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
