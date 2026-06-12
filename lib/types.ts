export type ScheduleItem = {
  time: string;
  event: string;
  location: string;
};

export type WeddingEvent = {
  id: string;
  name: string;
  date: string;
  venue: string;
  mapsUrl?: string;
  schedule: ScheduleItem[];
};

export type WeddingUpdate = {
  id: string;
  title: string;
  body: string;
  titleNe?: string;
  bodyNe?: string;
  publishedAt: string;
};

export type WeddingData = {
  couple: { bride: string; groom: string };
  countdownDate: string;
  dateDisplay: string;
  dateRange?: { start: string; end: string };
  location: {
    city: string;
    venue: string;
    venueImage: string;
    address: string;
    mapsUrl: string;
  };
  events: WeddingEvent[];
  travel: {
    gettingHere: {
      title: string;
      airport: { label: string; name: string; distance: string };
      busStops: {
        label: string;
        stops: { name: string; distance: string }[];
      };
    };
    stay: { name: string; url: string; note: string };
    explore: { title: string; text: string; url: string };
  };
  dressCode: {
    title: string;
    description: string;
    events: {
      eventId: string;
      ladies: string;
      gents: string;
    }[];
  };
  faq: { q: string; a: string; image?: string }[];
  updates: WeddingUpdate[];
  rsvpDeadline: string;
  hashtag: string;
};

export type RsvpSubmission = {
  id: string;
  submittedAt: string;
  name: string;
  email: string;
  phone: string;
  attending: "yes" | "no";
  eventsAttending: string[];
  guests: string;
  dietary: string;
  message: string;
};
