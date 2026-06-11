export const eventActiveStyles: Record<string, string> = {
  mehendi: "border-green-dark bg-green-dark text-ivory",
  "wedding-day": "border-wedding bg-wedding text-ivory",
  "ganesh-sagun": "border-ganesh bg-ganesh text-ivory",
  reception: "border-reception bg-reception text-ivory",
};

export const eventInactiveStyleDetails =
  "border-gold/30 bg-white text-green/70 hover:border-gold hover:text-green";

export const eventInactiveStyleRsvp =
  "border-ivory/20 bg-white/5 text-ivory/70 hover:border-ivory/40";

const defaultActiveStyle = "border-green bg-green text-ivory";

export function getEventActiveStyle(eventId: string): string {
  return eventActiveStyles[eventId] ?? defaultActiveStyle;
}
