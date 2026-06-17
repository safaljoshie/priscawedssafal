import type { Locale } from "./messages";
import { formatEventDate } from "./nepaliDate";

type FaqItem = {
  q: string;
  a: string;
  image?: string;
};

const faqNepali: { q: string; a: string }[] = [
  {
    q: "के म साथमा कसैलाई ल्याउन सक्छु?",
    a: "तपाईंको निमन्त्रणामा साथी समावेश छ कि छैन भनेर उल्लेख हुनेछ। कृपया निमन्त्रणामा लेखिएको अनुसार मात्र अतिथि संख्या उल्लेख गर्नुहोस्।",
  },
  {
    q: "के बच्चाहरूलाई स्वागत छ?",
    a: "हामी तपाईंका साना सन्तानहरूलाई माया गर्छौं, तर कृपया उनीहरूको हेरचाह र सुरक्षा सुनिश्चित गर्नुहोस्। आशा छ, यसले अभिभावकहरूलाई एक निस्तेज र तनावमुक्त साँझ दिन्छ।",
  },
  {
    q: "के समारोह बाहिर हुनेछ?",
    a: "हो। समारोह र ककटेल समय बाहिर हुनेछ। साँझको हावाका लागि हल्का लेयर ल्याउनुहोस्।",
  },
  {
    q: "के उपहार रजिष्ट्री छ?",
    a: "तपाईंको उपस्थिति नै सबैभन्दा ठूलो उपहार हो। यदि थप सम्मान गर्न चाहनुहुन्छ भने, हनीमून कोषको QR तल छ।\n\nNRNA को लागि Pay ID - 0450887207",
  },
  {
    q: "उपस्थिति जवाफ दिने अन्तिम मिति कहिले हो?",
    a: "कृपया {deadline} सम्म जवाफ दिनुहोस् ताकि हामी बसाइ र खानाको व्यवस्था अन्तिम रूप दिन सकौं।",
  },
  {
    q: "सगुन कार्यक्रमको महत्वपूर्ण जानकारी",
    a: "कृपया, बाकसमा बेर्ने उपहार (कपडा वा कपडाका टुक्राहरू सहित) नल्याउनुहोला।\n\nसगुनका लागि अण्डा र दही अनुरोध गर्दा उपलब्ध गराइनेछ।\n\nहामीलाई तपाईंको उपस्थिति मात्र चाहिन्छ।",
  },
];

export function getLocalizedFaqItem(
  item: FaqItem,
  index: number,
  locale: Locale,
  rsvpDeadline?: string
): FaqItem {
  if (locale === "en") return item;

  const translation = faqNepali[index];
  if (!translation) return item;

  let answer = translation.a;
  if (index === 4 && rsvpDeadline) {
    const deadline = formatEventDate(locale, rsvpDeadline);
    answer = answer.replace("{deadline}", deadline);
  }

  return {
    q: translation.q,
    a: answer,
    image: item.image,
  };
}
