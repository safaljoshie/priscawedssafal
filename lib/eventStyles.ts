export const eventActiveStyles: Record<string, string> = {
  mehendi: "border-green-dark/70 bg-mehendi-bg text-green-dark",
  "wedding-day": "border-wedding/70 bg-wedding-bg text-wedding",
  "ganesh-sagun": "border-ganesh/70 bg-ganesh-bg text-ganesh",
  reception: "border-reception/70 bg-reception-bg text-reception",
};

export const eventInactiveStyleDetails =
  "border-gold/30 bg-white text-green/70 hover:border-gold hover:text-green";

export const eventInactiveStyleRsvp =
  "border-ivory/20 bg-white/5 text-ivory/70 hover:border-ivory/40";

const defaultActiveStyle = "border-green/70 bg-mehendi-bg text-green";

export function getEventActiveStyle(eventId: string): string {
  return eventActiveStyles[eventId] ?? defaultActiveStyle;
}
