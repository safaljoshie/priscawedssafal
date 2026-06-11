export const wedding = {
  couple: {
    bride: "Prisca",
    groom: "Safal",
  },
  date: new Date("2026-09-12T16:00:00"),
  dateDisplay: "Saturday, September 12, 2026",
  location: {
    city: "Napa Valley, California",
    venue: "Vineyard Estate at St. Helena",
    address: "1200 Main Street, St. Helena, CA 94574",
    mapsUrl: "https://maps.google.com/?q=St+Helena+CA",
  },
  schedule: [
    { time: "3:30 PM", event: "Guest arrival & seating", location: "Garden terrace" },
    { time: "4:00 PM", event: "Ceremony", location: "Vineyard lawn" },
    { time: "5:00 PM", event: "Cocktail hour", location: "Courtyard bar" },
    { time: "6:30 PM", event: "Reception & dinner", location: "Grand pavilion" },
    { time: "9:00 PM", event: "Dancing & celebration", location: "Grand pavilion" },
    { time: "11:00 PM", event: "Farewell", location: "" },
  ],
  travel: {
    airports: [
      { name: "San Francisco (SFO)", distance: "~70 miles" },
      { name: "Oakland (OAK)", distance: "~65 miles" },
      { name: "Sacramento (SMF)", distance: "~55 miles" },
    ],
    hotels: [
      {
        name: "Harvest Inn",
        note: "Room block available — mention Prisca & Safal wedding",
        url: "#",
      },
      {
        name: "Meadowood Napa Valley",
        note: "Luxury option, 10 min from venue",
        url: "#",
      },
      {
        name: "Wine Country Inn",
        note: "Charming B&B in downtown St. Helena",
        url: "#",
      },
    ],
    parking: "Complimentary valet parking at the venue. Rideshare drop-off at the main entrance.",
  },
  dressCode: {
    title: "Garden formal",
    description:
      "We invite you to dress in elegant attire suited for an outdoor celebration. Think flowing fabrics, soft colours, and comfortable shoes for the lawn.",
    suggestions: [
      "Ladies: midi or floor-length dresses, dressy separates",
      "Gentlemen: suits or sport coats; ties optional",
      "Colours: ivory, sage, blush, gold — please avoid white",
    ],
  },
  faq: [
    {
      q: "Can I bring a plus-one?",
      a: "Your invitation will indicate whether a plus-one is included. Please RSVP with the exact number of guests listed on your invite.",
    },
    {
      q: "Are children welcome?",
      a: "We love your little ones, but we've planned an adults-only celebration. We hope this gives parents a well-deserved evening off.",
    },
    {
      q: "Will the ceremony be outdoors?",
      a: "Yes. The ceremony and cocktail hour are outdoors. We recommend a light layer for the evening breeze.",
    },
    {
      q: "Is there a gift registry?",
      a: "Your presence is the greatest gift. If you wish to honour us further, a honeymoon fund link is available upon RSVP confirmation.",
    },
    {
      q: "When is the RSVP deadline?",
      a: "Please respond by July 15, 2026 so we can finalize seating and catering.",
    },
  ],
  rsvpDeadline: "July 15, 2026",
  hashtag: "#PriscaAndSafal",
} as const;

export const navLinks = [
  { href: "#details", label: "Details" },
  { href: "#schedule", label: "Schedule" },
  { href: "#travel", label: "Travel" },
  { href: "#rsvp", label: "RSVP" },
] as const;
