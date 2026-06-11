export const navLinks = [
  { href: "#details", label: "Details" },
  { href: "#travel", label: "Travel" },
  { href: "#rsvp", label: "RSVP" },
] as const;

export type { WeddingData, WeddingEvent, RsvpSubmission, ScheduleItem } from "./types";
