import { wedding } from "@/lib/wedding";
import { SectionHeading } from "./SectionHeading";

export function Schedule() {
  return (
    <section id="schedule" className="bg-white px-6 py-20">
      <SectionHeading label="Schedule" title="Day-of timeline" />

      <ol className="mt-14 space-y-0">
        {wedding.schedule.map(({ time, event, location }, i) => (
          <li
            key={time}
            className={`flex gap-5 py-5 ${
              i < wedding.schedule.length - 1
                ? "border-b border-gold/15"
                : ""
            }`}
          >
            <time className="w-16 shrink-0 font-serif text-sm text-gold">
              {time}
            </time>
            <div>
              <p className="font-medium text-green">{event}</p>
              {location && (
                <p className="mt-0.5 text-xs text-[#1a1a1a]/50">{location}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
