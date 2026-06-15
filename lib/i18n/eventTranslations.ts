import type { Locale } from "./messages";
import type { WeddingEvent } from "@/lib/types";
import { formatNepaliTime } from "./nepaliDate";

type EventTranslation = {
  name: string;
  venue: string;
  schedule: { event: string; location: string }[];
};

const eventTranslations: Record<string, EventTranslation> = {
  mehendi: {
    name: "मेहन्दी",
    venue: "नारायणघर, चितवन",
    schedule: [
      { event: "अतिथि आगमन", location: "बगैंचा टेरेस" },
      { event: "मेहन्दी समारोह सुरु", location: "आँगन" },
      { event: "संगीत, नाच र खाजा", location: "आँगन" },
      { event: "बेलुकाको खाना", location: "बगैंचाको पेभिलियन" },
    ],
  },
  "wedding-day": {
    name: "विवाह दिवस",
    venue: "जोशी भिल्ला सौराहा",
    schedule: [
      { event: "अतिथि आगमन", location: "मुख्य प्रवेशद्वार" },
      { event: "विवाह समारोह", location: "दाखको बगैंचा" },
      { event: "आशीर्वाद र पारिवारिक तस्बिर", location: "बगैंचा टेरेस" },
      { event: "विवाह भोज", location: "ठूलो पेभिलियन" },
    ],
  },
  "ganesh-sagun": {
    name: "गणेश चौथी र सगुन",
    venue: "जोशी भिल्ला सौराहा",
    schedule: [
      { event: "अतिथि आगमन", location: "मुख्य हल" },
      { event: "गणेश पूजा", location: "मुख्य हल" },
      { event: "सगुन समारोह", location: "मुख्य हल" },
      { event: "दिउँसोको खाना र खाजा", location: "ठूलो पेभिलियन" },
    ],
  },
  reception: {
    name: "रिसेप्शन",
    venue: "सौराहा थारु भिलेज रिसोर्ट",
    schedule: [
      { event: "अतिथि आगमन र ककटेल", location: "आँगन बार" },
      { event: "रिसेप्शन र खाना", location: "ठूलो पेभिलियन" },
      { event: "पहिलो नाच र भुजा", location: "ठूलो पेभिलियन" },
      { event: "नाच र उत्सव", location: "ठूलो पेभिलियन" },
      { event: "बिदाई", location: "" },
    ],
  },
};

export function getLocalizedEventName(event: WeddingEvent, locale: Locale): string {
  if (locale === "en") return event.name;
  return (
    event.nameNe?.trim() ||
    eventTranslations[event.id]?.name ||
    event.name
  );
}

/** +4 Tailwind steps vs default English event labels */
export function eventTabTextClass(locale: Locale): string {
  return locale === "ne"
    ? "font-serif text-xl font-bold tracking-normal md:text-2xl"
    : "text-xs uppercase tracking-[0.12em] md:text-sm md:tracking-[0.15em]";
}

export function eventTabPaddingClass(locale: Locale): string {
  return locale === "ne"
    ? "px-5 py-3 md:px-6 md:py-4"
    : "px-4 py-2.5 md:px-5 md:py-3";
}

export function eventPanelTitleClass(locale: Locale): string {
  return locale === "ne"
    ? "font-serif text-5xl font-bold text-green md:text-6xl"
    : "font-serif text-xl font-bold text-green md:text-2xl";
}

export function eventCardTitleClass(locale: Locale): string {
  return locale === "ne"
    ? "font-serif text-4xl font-bold md:text-5xl"
    : "font-serif text-lg font-bold md:text-xl";
}

export function eventPickerButtonClass(locale: Locale): string {
  return locale === "ne"
    ? "font-serif text-xl font-bold tracking-normal md:text-2xl"
    : "text-xs uppercase tracking-[0.08em] md:text-sm";
}

export function eventPickerPaddingClass(locale: Locale): string {
  return locale === "ne"
    ? "px-4 py-3 md:px-5 md:py-4"
    : "px-3 py-2.5 md:px-4 md:py-3";
}

export function getLocalizedEvent(
  event: WeddingEvent,
  locale: Locale
): WeddingEvent {
  if (locale === "en") return event;

  const translation = eventTranslations[event.id];

  return {
    ...event,
    name:
      event.nameNe?.trim() ||
      translation?.name ||
      event.name,
    venue:
      event.venueNe?.trim() ||
      translation?.venue ||
      event.venue,
    schedule: event.schedule.map((item, index) => {
      const row = translation?.schedule[index];
      return {
        time: formatNepaliTime(item.time),
        event:
          item.eventNe?.trim() ||
          row?.event ||
          item.event,
        location:
          item.locationNe?.trim() ||
          row?.location ||
          item.location,
      };
    }),
  };
}
