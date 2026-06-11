import type { ScheduleItem, WeddingData, WeddingEvent, WeddingUpdate } from "./types";

/** Minutes from midnight for comparing schedule times like "3:00 PM". */
export function parseTimeValue(time: string): number {
  const trimmed = time.trim();
  if (!trimmed) return Number.MAX_SAFE_INTEGER;

  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return Number.MAX_SAFE_INTEGER;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function parseEventDateValue(date: string): number {
  const trimmed = date.trim();
  if (!trimmed) return Number.MAX_SAFE_INTEGER;

  const parsed = Date.parse(trimmed);
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
}

export function sortSchedule(schedule: ScheduleItem[] = []): ScheduleItem[] {
  return [...schedule].sort(
    (a, b) => parseTimeValue(a.time) - parseTimeValue(b.time)
  );
}

export function sortEvents(events: WeddingEvent[]): WeddingEvent[] {
  return [...events]
    .map((event) => ({
      ...event,
      schedule: sortSchedule(event.schedule),
    }))
    .sort((a, b) => parseEventDateValue(a.date) - parseEventDateValue(b.date));
}

export function sortUpdates(updates: WeddingUpdate[] = []): WeddingUpdate[] {
  return [...updates].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function sortWeddingData(data: WeddingData): WeddingData {
  return {
    ...data,
    events: sortEvents(data.events),
    updates: sortUpdates(data.updates ?? []),
  };
}
