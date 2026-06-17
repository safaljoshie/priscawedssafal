"use client";

import Image from "next/image";
import { useState } from "react";
import type { WeddingData } from "@/lib/types";
import {
  eventInactiveStyleDetails,
  getEventActiveStyle,
} from "@/lib/eventStyles";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import {
  eventPanelTitleClass,
  eventTabPaddingClass,
  eventTabTextClass,
  getLocalizedEvent,
  getLocalizedEventName,
} from "@/lib/i18n/eventTranslations";
import {
  formatEventDate,
  formatWeddingDateDisplay,
} from "@/lib/i18n/nepaliDate";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

export function Details({ wedding }: { wedding: WeddingData }) {
  const { dateDisplay, dateRange, location, events } = wedding;
  const { locale, t } = useLanguage();
  const [selectedId, setSelectedId] = useState<string>(events[0]?.id ?? "");

  const displayDate = formatWeddingDateDisplay(locale, dateDisplay, dateRange);
  const displayVenue = locale === "ne" ? t.location.venue : location.venue;
  const displayAddress = locale === "ne" ? t.location.address : location.address;
  const isNepali = locale === "ne";

  const selected = events.find((e) => e.id === selectedId) ?? events[0];

  if (!selected) return null;

  const localizedSelected = getLocalizedEvent(selected, locale);

  return (
    <Section id="details" className="bg-ivory">
      <SectionHeading label={t.details.label} title={t.details.title} />

      <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-[#1a1a1a]/70 md:text-base">
        {t.details.intro}
      </p>

      <article className="mx-auto mt-10 max-w-2xl rounded-sm border border-gold/20 bg-white p-6 text-center shadow-sm md:mt-14 md:p-8">
        <p
          className={`text-xs tracking-[0.25em] text-gold md:text-sm ${
            isNepali ? "font-serif" : "uppercase"
          }`}
        >
          {t.details.whenWhere}
        </p>
        <p className="mt-3 font-serif text-2xl text-green md:text-3xl">
          {displayDate}
        </p>
        <div className="mx-auto mt-6 max-w-xs">
          <Image
            src={location.venueImage}
            alt={location.venue}
            width={400}
            height={300}
            className="mx-auto h-auto w-full rounded-sm"
          />
        </div>
        <p className="mt-4 font-serif text-lg text-green/90 md:text-xl">
          {displayVenue}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#1a1a1a]/60 md:text-base">
          {displayAddress}
        </p>
        <a
          href={location.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-4 inline-block text-xs tracking-[0.2em] text-gold underline-offset-4 transition-colors hover:text-green hover:underline md:text-sm ${
            isNepali ? "font-serif" : "uppercase"
          }`}
        >
          {t.details.viewMap}
        </a>
      </article>

      <div className="mx-auto mt-14 max-w-4xl md:mt-20">
        <div
          className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:justify-center md:gap-3"
          role="tablist"
          aria-label="Wedding events"
        >
          {events.map((event) => {
            const isActive = event.id === selectedId;
            return (
              <button
                key={event.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedId(event.id)}
                className={`shrink-0 rounded-sm border transition-colors ${eventTabPaddingClass(locale)} ${eventTabTextClass(locale)} ${
                  isActive
                    ? getEventActiveStyle(event.id)
                    : eventInactiveStyleDetails
                }`}
              >
                {getLocalizedEventName(event, locale)}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          className="mt-6 overflow-hidden rounded-sm border border-gold/20 bg-white shadow-sm"
        >
          <div className="border-b border-gold/15 bg-ivory/40 px-5 py-4 md:px-8 md:py-5">
            <h3 className={eventPanelTitleClass(locale)}>
              {localizedSelected.name}
            </h3>
            <p className="mt-1 text-sm text-[#1a1a1a]/60 md:text-base">
              {formatEventDate(locale, selected.date)}
            </p>
            <p className="mt-0.5 text-sm text-[#1a1a1a]/50">
              {localizedSelected.venue}
            </p>
            {selected.mapsUrl && (
              <a
                href={selected.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-2 inline-block text-xs tracking-[0.15em] text-gold underline-offset-4 hover:underline ${
                  isNepali ? "font-serif" : "uppercase"
                }`}
              >
                {t.details.viewMap}
              </a>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] text-left text-sm md:text-base">
              <thead>
                <tr className="border-b border-gold/15 bg-ivory/20">
                  <th
                    className={`px-5 py-3 font-serif text-xs tracking-[0.15em] text-gold md:px-8 md:py-4 md:text-sm ${
                      isNepali ? "" : "uppercase"
                    }`}
                  >
                    {t.details.time}
                  </th>
                  <th
                    className={`px-5 py-3 font-serif text-xs tracking-[0.15em] text-gold md:px-8 md:py-4 md:text-sm ${
                      isNepali ? "" : "uppercase"
                    }`}
                  >
                    {t.details.event}
                  </th>
                  <th
                    className={`px-5 py-3 font-serif text-xs tracking-[0.15em] text-gold md:px-8 md:py-4 md:text-sm ${
                      isNepali ? "" : "uppercase"
                    }`}
                  >
                    {t.details.location}
                  </th>
                </tr>
              </thead>
              <tbody>
                {localizedSelected.schedule.map(({ time, event: item, location: place }) => (
                  <tr
                    key={`${selected.id}-${time}-${item}`}
                    className="border-b border-gold/10 last:border-b-0"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-serif text-gold md:px-8 md:py-5">
                      {time}
                    </td>
                    <td className="px-5 py-4 font-medium text-green md:px-8 md:py-5">
                      {item}
                    </td>
                    <td className="px-5 py-4 text-[#1a1a1a]/55 md:px-8 md:py-5">
                      {place || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Section>
  );
}
