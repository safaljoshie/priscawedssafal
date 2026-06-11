import { wedding } from "@/lib/wedding";
import { SectionHeading } from "./SectionHeading";

export function DressCode() {
  const { dressCode } = wedding;

  return (
    <section id="dress-code" className="bg-white px-6 py-20">
      <SectionHeading label="Attire" title={dressCode.title} />

      <p className="mx-auto mt-8 max-w-sm text-center text-sm leading-relaxed text-[#1a1a1a]/70">
        {dressCode.description}
      </p>

      <ul className="mx-auto mt-8 max-w-sm space-y-3">
        {dressCode.suggestions.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm text-[#1a1a1a]/70"
          >
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
