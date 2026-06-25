export type ScheduleItem = {
  time: string;
  event: string;
  location: string;
  eventNe?: string;
  locationNe?: string;
};

export type WeddingEvent = {
  id: string;
  name: string;
  nameNe?: string;
  date: string;
  venue: string;
  venueNe?: string;
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
      ladiesNe?: string;
      gentsNe?: string;
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

export type FamilyCategory =
  | "parents"
  | "siblings"
  | "grandparents"
  | "extended";

export type FamilySide = "prisca" | "safal";

export type FamilyMember = {
  id: string;
  name: string;
  nameNe?: string;
  relation: string;
  relationNe?: string;
  photo?: string;
  bio: string;
  bioNe?: string;
};

export type FamilySideData = Record<FamilyCategory, FamilyMember[]>;

export type FamilyVisibility = {
  prisca: boolean;
  safal: boolean;
};

export type FamilyData = {
  visibility?: FamilyVisibility;
  prisca: FamilySideData;
  safal: FamilySideData;
};
