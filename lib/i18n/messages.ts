export type Locale = "en" | "ne";

export const messages = {
  en: {
    nav: {
      home: "Home",
      details: "Details",
      updates: "Updates",
      travel: "Travel",
      rsvp: "RSVP",
    },
    hero: {
      saveTheDate: "Save the Date",
      discoverMore: "Discover more",
    },
    countdown: {
      days: "Days",
      hours: "Hours",
      minutes: "Min",
      seconds: "Sec",
      arrived: "The day has arrived!",
    },
    details: {
      label: "The Wedding",
      title: "A few days of celebration",
      intro:
        "Our wedding spans several days of traditions and festivities. Join us for as many events as your invitation includes.",
      whenWhere: "When & where",
      viewMap: "View on map",
      schedule: "Schedule",
      time: "Time",
      event: "Event",
      location: "Location",
    },
    updates: {
      label: "Updates",
      title: "Notice board",
      emptyTitle: "No updates yet",
      emptyBody:
        "We'll post news and reminders here as plans come together. Check back soon.",
      facebookEvent: "Visit our FB Event Page & Join our group chat",
      facebookEventUrl: "https://fb.me/2YtsftoyfzbEpzT",
    },
    travel: {
      label: "Travel",
      title: "Getting there & staying",
    },
    dressCode: {
      label: "Attire",
      title: "What to wear",
      description:
        "Dress code for each celebration — choose colours that feel right for you.",
      ladies: "Ladies",
      gents: "Gents",
    },
    faq: {
      label: "FAQ",
      title: "Good to know",
    },
    rsvp: {
      label: "RSVP",
      title: "Celebrate with us",
      deadline: "Please respond by",
    },
    location: {
      city: "Chitwan, Nepal",
      venue: "Joshi Villa Sauraha",
      address: "Ratnanagar 8, Chitwan, Nepal",
    },
  },
  ne: {
    nav: {
      home: "गृह",
      details: "विवरण",
      updates: "सूचनाहरू",
      travel: "यात्रा",
      rsvp: "उपस्थिति",
    },
    hero: {
      saveTheDate: "मिति सुरक्षित गर्नुहोस्",
      discoverMore: "थप जान्नुहोस्",
    },
    countdown: {
      days: "दिन",
      hours: "घण्टा",
      minutes: "मिनेट",
      seconds: "सेकेन्ड",
      arrived: "त्यो दिन आइपुग्यो!",
    },
    details: {
      label: "विवाह",
      title: "केही दिनको उत्सव",
      intro:
        "हाम्रो विवाह धेरै दिनसम्म चल्ने परम्परा र उत्सव हो। तपाईंको निमन्त्रणामा समावेश भएका कार्यक्रमहरूमा हामीसँग सामेल हुनुहोस्।",
      whenWhere: "कहिले र कहाँ",
      viewMap: "नक्सामा हेर्नुहोस्",
      schedule: "तालिका",
      time: "समय",
      event: "कार्यक्रम",
      location: "स्थान",
    },
    updates: {
      label: "सूचनाहरू",
      title: "सूचना पाटी",
      emptyTitle: "अहिलेसम्म कुनै सूचना छैन",
      emptyBody:
        "योजना अगाडि बढेपछि हामी यहाँ समाचार र सम्झाउना राख्नेछौं। चाँडै फेरि हेर्नुहोला।",
      facebookEvent: "हाम्रो FB कार्यक्रम पेज हेर्नुहोस् र समूह च्याटमा सामेल हुनुहोस्",
      facebookEventUrl: "https://fb.me/2YtsftoyfzbEpzT",
    },
    travel: {
      label: "यात्रा",
      title: "यहाँ कसरी आउने र बस्ने",
    },
    dressCode: {
      label: "पहिरन",
      title: "के लगाउने",
      description:
        "प्रत्येक उत्सवका लागि पहिरन — आफूलाई मन पर्ने रङ छान्नुहोस्।",
      ladies: "महिला",
      gents: "पुरुष",
    },
    faq: {
      label: "बारम्बार सोधिने प्रश्न",
      title: "जान्नै पर्ने कुरा",
    },
    rsvp: {
      label: "उपस्थिति",
      title: "हामीसँग उत्सव मनाउनुहोस्",
      deadline: "कृपया यस मिति सम्म जवाफ दिनुहोस्",
    },
    location: {
      city: "चितवन, नेपाल",
      venue: "जोशी भिल्ला सौराहा",
      address: "रत्ननगर ८, चितवन, नेपाल",
    },
  },
} as const;

export type Messages = (typeof messages)[Locale];
