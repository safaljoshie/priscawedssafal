"use client";

import type { WeddingData } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { formatBsDate } from "@/lib/i18n/nepaliDate";
import { getLocalizedUpdate } from "@/lib/i18n/updateTranslations";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

function formatPublishedDate(iso: string, locale: "en" | "ne") {
  if (locale === "ne") {
    return formatBsDate(iso, "MMMM DD, YYYY");
  }
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function Updates({ wedding }: { wedding: WeddingData }) {
  const { updates } = wedding;
  const { locale, t } = useLanguage();
  const isNepali = locale === "ne";
  const hasUpdates = updates.length > 0;

  return (
    <Section id="updates" className="bg-white">
      <SectionHeading label={t.updates.label} title={t.updates.title} />

      <div className="mx-auto mt-10 max-w-2xl md:mt-14">
        <div className="relative rounded-sm border-2 border-dashed border-gold/35 bg-ivory/60 p-6 shadow-sm md:p-8">
          <div
            className="pointer-events-none absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full border border-gold/40 bg-gold/20 shadow-sm"
            aria-hidden
          />

          {!hasUpdates ? (
            <div className="py-4 text-center">
              <p className="font-serif text-lg font-bold text-green/80 md:text-xl">
                {t.updates.emptyTitle}
              </p>
              <p
                className={`mt-3 text-sm leading-relaxed text-[#1a1a1a]/55 md:text-base ${
                  isNepali ? "font-serif" : ""
                }`}
              >
                {t.updates.emptyBody}
              </p>
            </div>
          ) : (
            <div className="space-y-5 divide-y divide-gold/15">
              {updates.map((update) => {
                const { title, body } = getLocalizedUpdate(update, locale);

                return (
                <article key={update.id} className="pt-5 first:pt-0">
                  <time
                    dateTime={update.publishedAt}
                    className={`text-xs tracking-[0.2em] text-gold md:text-sm ${
                      isNepali ? "font-serif" : "uppercase"
                    }`}
                  >
                    {formatPublishedDate(update.publishedAt, locale)}
                  </time>
                  <h3 className="mt-2 font-serif text-xl font-bold text-green md:text-2xl">
                    {title}
                  </h3>
                  <p
                    className={`mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[#1a1a1a]/70 md:text-base ${
                      isNepali ? "font-serif" : ""
                    }`}
                  >
                    {body}
                  </p>
                </article>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <a
            href={t.updates.facebookEventUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`mx-auto inline-flex min-h-[44px] max-w-sm items-center justify-center rounded-sm border border-gold/35 px-5 py-3 text-sm leading-snug text-green transition-colors hover:border-gold hover:text-wedding md:max-w-md md:px-6 md:text-sm ${
              isNepali ? "font-serif" : "uppercase tracking-[0.15em]"
            }`}
          >
            {t.updates.facebookEvent}
          </a>
        </div>
      </div>
    </Section>
  );
}
