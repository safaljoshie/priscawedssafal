"use client";

import type { WeddingData } from "@/lib/types";
import { getEventActiveStyle } from "@/lib/eventStyles";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getLocalizedAttire } from "@/lib/i18n/dressCodeTranslations";
import {
  eventCardTitleClass,
  getLocalizedEventName,
} from "@/lib/i18n/eventTranslations";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

export function DressCode({ wedding }: { wedding: WeddingData }) {
  const { locale, t } = useLanguage();
  const isNepali = locale === "ne";
  const { dressCode } = wedding;
  const attireByEventId = Object.fromEntries(
    dressCode.events.map((item) => [item.eventId, item])
  );

  return (
    <Section id="dress-code" className="bg-white">
      <SectionHeading label={t.dressCode.label} title={t.dressCode.title} />

      <div className="mx-auto mt-8 max-w-4xl md:mt-12">
        <p className="text-center text-sm leading-relaxed text-[#1a1a1a]/70 md:text-base md:leading-loose">
          {t.dressCode.description}
        </p>

        <ul className="mt-8 grid gap-4 md:mt-12 md:grid-cols-2 md:gap-6">
          {wedding.events.map((event) => {
            const attire = attireByEventId[event.id];
            if (!attire) return null;

            const localizedAttire = getLocalizedAttire(event.id, attire, locale);

            return (
              <li
                key={event.id}
                className={`rounded-sm border p-5 md:p-6 ${getEventActiveStyle(event.id)}`}
              >
                <h3 className={eventCardTitleClass(locale)}>
                  {getLocalizedEventName(event, locale)}
                </h3>
                <p
                  className={`mt-3 leading-relaxed opacity-90 ${
                    isNepali
                      ? "font-serif text-xs md:text-sm"
                      : "text-sm md:text-base"
                  }`}
                >
                  <span
                    className={`font-bold tracking-[0.08em] opacity-90 ${
                      isNepali ? "font-serif text-xs md:text-sm" : "uppercase"
                    }`}
                  >
                    {t.dressCode.ladies}
                  </span>
                  <br />
                  {localizedAttire.ladies}
                </p>
                <p
                  className={`mt-3 leading-relaxed opacity-90 ${
                    isNepali
                      ? "font-serif text-xs md:text-sm"
                      : "text-sm md:text-base"
                  }`}
                >
                  <span
                    className={`font-bold tracking-[0.08em] opacity-90 ${
                      isNepali ? "font-serif text-xs md:text-sm" : "uppercase"
                    }`}
                  >
                    {t.dressCode.gents}
                  </span>
                  <br />
                  {localizedAttire.gents}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
