import type { Locale } from "./messages";

type AttireTranslation = {
  ladies: string;
  gents: string;
  ladiesNe?: string;
  gentsNe?: string;
};

const attireByEventId: Record<string, AttireTranslation> = {
  mehendi: {
    ladies:
      "हकुपतासी (उपलब्ध भए) वा कालो वा रातो रङको सारी, कुर्ता वा लहेंगा।",
    gents: "रातो वा कालो औपचारिक पहिरन वा कुर्ता।",
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
  if (locale === "en") {
    return { ladies: attire.ladies, gents: attire.gents };
  }

  const fallback = attireByEventId[eventId];
  return {
    ladies: attire.ladiesNe?.trim() || fallback?.ladies || attire.ladies,
    gents: attire.gentsNe?.trim() || fallback?.gents || attire.gents,
  };
}
