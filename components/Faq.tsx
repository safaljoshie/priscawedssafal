import { wedding } from "@/lib/wedding";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

export function Faq() {
  return (
    <Section id="faq" className="bg-ivory">
      <SectionHeading label="FAQ" title="Good to know" />

      <div className="mt-12 space-y-3">
        {wedding.faq.map(({ q, a }) => (
          <details
            key={q}
            className="group rounded-sm border border-gold/20 bg-white"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-green transition-colors hover:text-gold">
              {q}
              <span
                className="shrink-0 text-gold transition-transform group-open:rotate-45"
                aria-hidden
              >
                +
              </span>
            </summary>
            <p className="border-t border-gold/10 px-5 py-4 text-sm leading-relaxed text-[#1a1a1a]/70">
              {a}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}
