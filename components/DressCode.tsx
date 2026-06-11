import type { WeddingData } from "@/lib/types";
import { getEventActiveStyle } from "@/lib/eventStyles";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

export function DressCode({ wedding }: { wedding: WeddingData }) {
  const { dressCode } = wedding;
  const attireByEventId = Object.fromEntries(
    dressCode.events.map((item) => [item.eventId, item])
  );

  return (
    <Section id="dress-code" className="bg-white">
      <SectionHeading
        label="Attire"
        title={dressCode.title}
        className="[&_h2]:font-bold"
      />

      <div className="mx-auto mt-8 max-w-4xl md:mt-12">
        <p className="text-center text-sm leading-relaxed text-[#1a1a1a]/70 md:text-base md:leading-loose">
          {dressCode.description}
        </p>

        <ul className="mt-8 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-6">
          {wedding.events.map((event) => {
            const attire = attireByEventId[event.id];
            if (!attire) return null;

            return (
              <li
                key={event.id}
                className={`rounded-sm border p-5 md:p-6 ${getEventActiveStyle(event.id)}`}
              >
                <h3 className="font-serif text-lg font-bold md:text-xl">
                  {event.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed opacity-90 md:text-base">
                  <span className="font-medium uppercase tracking-[0.08em] opacity-75">
                    Ladies
                  </span>
                  <br />
                  {attire.ladies}
                </p>
                <p className="mt-3 text-sm leading-relaxed opacity-90 md:text-base">
                  <span className="font-medium uppercase tracking-[0.08em] opacity-75">
                    Gents
                  </span>
                  <br />
                  {attire.gents}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
