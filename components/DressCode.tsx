import type { WeddingData } from "@/lib/types";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

export function DressCode({ wedding }: { wedding: WeddingData }) {
  const { dressCode } = wedding;

  return (
    <Section id="dress-code" className="bg-white">
      <SectionHeading label="Attire" title={dressCode.title} />

      <div className="mx-auto mt-8 max-w-3xl md:mt-12">
        <p className="text-center text-sm leading-relaxed text-[#1a1a1a]/70 md:text-base md:leading-loose">
          {dressCode.description}
        </p>

        <ul className="mt-8 grid gap-4 md:mt-12 md:grid-cols-3 md:gap-6">
          {dressCode.suggestions.map((item) => (
            <li
              key={item}
              className="rounded-sm border border-gold/15 bg-ivory/50 p-5 text-sm text-[#1a1a1a]/70 md:text-base"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
