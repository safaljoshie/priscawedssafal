export const wedding = {
  couple: {
    bride: "Prisca",
    groom: "Safal",
  },
  date: new Date("2027-01-19T10:00:00"),
  dateDisplay: "January 17 – 22, 2027",
  location: {
    city: "Chitwan, Nepal",
    venue: "Joshi Villa Sauraha",
    venueImage: "/images/joshi-villa-sauraha.png",
    address: "Ratnanagar 8, Chitwan, Nepal",
    mapsUrl: "https://maps.app.goo.gl/DZ8jGnDhY3xJvKZS8",
  },
  events: [
    {
      id: "mehendi",
      name: "Mehendi",
      date: "Sunday, January 17, 2027",
      venue: "Joshi Villa Sauraha",
      schedule: [
        { time: "3:00 PM", event: "Guest arrival", location: "Garden terrace" },
        { time: "3:30 PM", event: "Mehendi ceremony begins", location: "Courtyard" },
        { time: "5:00 PM", event: "Music, dancing & refreshments", location: "Courtyard" },
        { time: "7:30 PM", event: "Dinner", location: "Garden pavilion" },
      ],
    },
    {
      id: "wedding-day",
      name: "Wedding Day",
      date: "Tuesday, January 19, 2027",
      venue: "Joshi Villa Sauraha",
      schedule: [
        { time: "9:00 AM", event: "Guest arrival", location: "Main entrance" },
        { time: "10:00 AM", event: "Wedding ceremony", location: "Vineyard lawn" },
        { time: "12:00 PM", event: "Blessings & family photos", location: "Garden terrace" },
        { time: "1:00 PM", event: "Wedding lunch", location: "Grand pavilion" },
      ],
    },
    {
      id: "ganesh-sagun",
      name: "Ganesh Chauthi & Sagun",
      date: "Wednesday, January 20, 2027",
      venue: "Joshi Villa Sauraha",
      schedule: [
        { time: "9:00 AM", event: "Guest arrival", location: "Main hall" },
        { time: "9:30 AM", event: "Ganesh Puja", location: "Main hall" },
        { time: "11:00 AM", event: "Sagun ceremony", location: "Main hall" },
        { time: "12:30 PM", event: "Lunch & refreshments", location: "Grand pavilion" },
      ],
    },
    {
      id: "reception",
      name: "Reception",
      date: "Friday, January 22, 2027",
      venue: "Joshi Villa Sauraha",
      schedule: [
        { time: "5:00 PM", event: "Guest arrival & cocktails", location: "Courtyard bar" },
        { time: "6:30 PM", event: "Reception & dinner", location: "Grand pavilion" },
        { time: "8:30 PM", event: "First dance & toasts", location: "Grand pavilion" },
        { time: "9:00 PM", event: "Dancing & celebration", location: "Grand pavilion" },
        { time: "11:00 PM", event: "Farewell", location: "" },
      ],
    },
  ],
  travel: {
    airports: [
      { name: "Bharatpur (BHR)", distance: "~25 km" },
      { name: "Kathmandu Tribhuvan (KTM)", distance: "~150 km" },
      { name: "Pokhara (PKR)", distance: "~130 km" },
    ],
    hotels: [
      {
        name: "saurahanepal.com",
        note: "Find hotels and lodges in Sauraha, Chitwan",
        url: "https://saurahanepal.com",
      },
    ],
    parking: "Street and nearby parking available around the venue. Taxis and rideshare are common in Ratnanagar.",
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
      a: "Please respond by December 15, 2026 so we can finalize seating and catering.",
    },
  ],
  rsvpDeadline: "December 15, 2026",
  hashtag: "#PriscaAndSafal",
} as const;

export const navLinks = [
  { href: "#details", label: "Details" },
  { href: "#travel", label: "Travel" },
  { href: "#rsvp", label: "RSVP" },
] as const;
