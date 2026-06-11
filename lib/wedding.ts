export const navLinks = [
  { href: "#details", label: "Details" },
  { href: "#updates", label: "Updates" },
  { href: "#travel", label: "Travel" },
  { href: "#rsvp", label: "RSVP" },
] as const;

export type { WeddingData, WeddingEvent, WeddingUpdate, RsvpSubmission, ScheduleItem } from "./types";
