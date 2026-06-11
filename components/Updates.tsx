import type { WeddingData } from "@/lib/types";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

function formatPublishedDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function Updates({ wedding }: { wedding: WeddingData }) {
  const { updates } = wedding;
  const hasUpdates = updates.length > 0;

  return (
    <Section id="updates" className="bg-white">
      <SectionHeading label="Updates" title="Notice board" />

      <div className="mx-auto mt-10 max-w-2xl md:mt-14">
        <div className="relative rounded-sm border-2 border-dashed border-gold/35 bg-ivory/60 p-6 shadow-sm md:p-8">
          <div
            className="pointer-events-none absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full border border-gold/40 bg-gold/20 shadow-sm"
            aria-hidden
          />

          {!hasUpdates ? (
            <div className="py-4 text-center">
              <p className="font-serif text-lg text-green/80 md:text-xl">
                No updates yet
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#1a1a1a]/55 md:text-base">
                We&apos;ll post news and reminders here as plans come together.
                Check back soon.
              </p>
            </div>
          ) : (
            <div className="space-y-5 divide-y divide-gold/15">
              {updates.map((update) => (
                <article key={update.id} className="pt-5 first:pt-0">
                  <time
                    dateTime={update.publishedAt}
                    className="text-xs uppercase tracking-[0.2em] text-gold md:text-sm"
                  >
                    {formatPublishedDate(update.publishedAt)}
                  </time>
                  <h3 className="mt-2 font-serif text-xl text-green md:text-2xl">
                    {update.title}
                  </h3>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#1a1a1a]/70 md:text-base">
                    {update.body}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
