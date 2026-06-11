import { wedding } from "@/lib/wedding";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

export function DressCode() {
  const { dressCode } = wedding;

  return (
    <Section id="dress-code" className="bg-white">
      <SectionHeading label="Attire" title={dressCode.title} />

      <p className="mx-auto mt-8 max-w-sm text-center text-sm leading-relaxed text-[#1a1a1a]/70">
        {dressCode.description}
      </p>

      <ul className="mx-auto mt-8 max-w-sm space-y-3">
        {dressCode.suggestions.map((item) => (
          <li
            key={item}
            className="rounded-sm border border-gold/15 bg-ivory/50 p-4 text-sm text-[#1a1a1a]/70"
          >
            {item}
          </li>
        ))}
      </ul>
    </Section>
  );
}
