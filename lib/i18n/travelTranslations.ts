import type { WeddingData } from "@/lib/types";
import type { Locale } from "./messages";

export type LocalizedTravel = WeddingData["travel"] & {
  whereToStay: string;
  openSite: string;
  exploreTextBefore: string;
  exploreTextAfter: string;
};

const neTravel: Omit<
  LocalizedTravel,
  "stay"
> & {
  stay: { name: string; note: string };
} = {
  gettingHere: {
    title: "यहाँ कसरी आउने",
    airport: {
      label: "नजिकको विमानस्थल",
      name: "भरतपुर विमानस्थल (BHR)",
      distance: "२५ कि.मी.",
    },
    busStops: {
      label: "नजिकका बस बिसौनी",
      stops: [
        { name: "सौराहा चोक", distance: "३ कि.मी." },
        { name: "चित्रसारी चोक", distance: "६०० मि." },
        { name: "सौराहा स्ट्यान्ड", distance: "१.५ कि.मी." },
      ],
    },
  },
  explore: {
    title: "अन्वेषण",
    text: "",
    url: "https://saurahanepal.com",
  },
  whereToStay: "कहाँ बस्ने",
  openSite: "खोल्नुहोस्",
  exploreTextBefore:
    "तपाईंलाई फुर्सद हुँदा हेर्न र जान धेरै ठाउँहरू छन्, तर दुलही र दुलहालाई त्यस्तो फुर्सद छैन। त्यसैले",
  exploreTextAfter:
    "मा जानुहोस् र सौराहाको जङ्गली सुन्दरता पत्ता लगाउनुहोस्।",
  stay: {
    name: "रिजेन्ट रिसोर्ट, जुगेडी",
    note: "सौराहा, चितवनमा होटल र लजहरू खोज्नुहोस्",
  },
};

export function getLocalizedTravel(
  travel: WeddingData["travel"],
  locale: Locale
): LocalizedTravel {
  if (locale === "en") {
    return {
      ...travel,
      whereToStay: "Where to stay",
      openSite: "Open",
      exploreTextBefore:
        "There are so many places to explore while you are free but the bride and groom are not. So visit",
      exploreTextAfter: "and discover Sauraha and it's wildness.",
    };
  }

  return {
    ...travel,
    gettingHere: neTravel.gettingHere,
    explore: {
      ...travel.explore,
      title: neTravel.explore.title,
    },
    stay: {
      ...travel.stay,
      name: neTravel.stay.name,
      note: neTravel.stay.note,
    },
    whereToStay: neTravel.whereToStay,
    openSite: neTravel.openSite,
    exploreTextBefore: neTravel.exploreTextBefore,
    exploreTextAfter: neTravel.exploreTextAfter,
  };
}
