import type { Locale } from "./messages";

type AttireTranslation = {
  ladies: string;
  gents: string;
};

const attireByEventId: Record<string, AttireTranslation> = {
  mehendi: {
    ladies: "आफूलाई मन पर्ने रङमा सारी, कुर्ता वा लहेंगा।",
    gents: "आफूलाई मन पर्ने रङमा कुर्ता।",
  },
  "wedding-day": {
    ladies: "आफूलाई मन पर्ने रङमा सारी, कुर्ता वा लहेंगा।",
    gents: "आफूलाई मन पर्ने रङमा दौरा सुरुवाल वा औपचारिक सुट।",
  },
  "ganesh-sagun": {
    ladies: "आफूलाई मन पर्ने रङमा सारी वा कुर्ता।",
    gents: "आफूलाई मन पर्ने औपचारिक पहिरन।",
  },
  reception: {
    ladies: "आफूलाई मन पर्ने रङमा सारी, कुर्ता वा लहेंगा।",
    gents: "आफूलाई मन पर्ने औपचारिक पहिरन।",
  },
};

export function getLocalizedAttire(
  eventId: string,
  attire: AttireTranslation,
  locale: Locale
): AttireTranslation {
  if (locale === "en") return attire;
  return attireByEventId[eventId] ?? attire;
}
