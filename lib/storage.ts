import { revalidatePath } from "next/cache";
import type { RsvpSubmission, WeddingData, WeddingEvent, WeddingUpdate } from "./types";
import { readJson, readJsonArray, writeJson } from "./persistence";
import { sortWeddingData } from "./sortEvents";

const WEDDING_BLOB_KEY = "data/wedding.json";
const RSVPS_BLOB_KEY = "data/rsvps.json";
const WEDDING_FILE = "wedding.json";
const RSVPS_FILE = "rsvps.json";

export async function getWeddingData(): Promise<WeddingData> {
  const data = await readJson<WeddingData>(WEDDING_BLOB_KEY, WEDDING_FILE);
  return sortWeddingData(data);
}

export async function saveWeddingData(data: WeddingData): Promise<void> {
  await writeJson(WEDDING_BLOB_KEY, WEDDING_FILE, sortWeddingData(data));
  revalidatePath("/");
}

export async function getEvents(): Promise<WeddingEvent[]> {
  const wedding = await getWeddingData();
  return wedding.events;
}

export async function addEvent(event: WeddingEvent): Promise<WeddingEvent> {
  const wedding = await getWeddingData();
  if (wedding.events.some((e) => e.id === event.id)) {
    throw new Error("Event id already exists");
  }
  wedding.events.push(event);
  await saveWeddingData(wedding);
  return event;
}

export async function updateEvent(
  id: string,
  updates: Partial<WeddingEvent>
): Promise<WeddingEvent> {
  const wedding = await getWeddingData();
  const index = wedding.events.findIndex((e) => e.id === id);
  if (index === -1) throw new Error("Event not found");

  const updated = { ...wedding.events[index], ...updates, id };
  wedding.events[index] = updated;
  await saveWeddingData(wedding);
  return updated;
}

export async function deleteEvent(id: string): Promise<void> {
  const wedding = await getWeddingData();
  const next = wedding.events.filter((e) => e.id !== id);
  if (next.length === wedding.events.length) throw new Error("Event not found");
  wedding.events = next;
  await saveWeddingData(wedding);
}

export async function getUpdates(): Promise<WeddingUpdate[]> {
  const wedding = await getWeddingData();
  return wedding.updates;
}

export async function addUpdate(
  update: WeddingUpdate
): Promise<WeddingUpdate> {
  const wedding = await getWeddingData();
  if (wedding.updates.some((u) => u.id === update.id)) {
    throw new Error("Update id already exists");
  }
  wedding.updates.push(update);
  await saveWeddingData(wedding);
  return update;
}

export async function updateUpdate(
  id: string,
  updates: Partial<WeddingUpdate>
): Promise<WeddingUpdate> {
  const wedding = await getWeddingData();
  const index = wedding.updates.findIndex((u) => u.id === id);
  if (index === -1) throw new Error("Update not found");

  const updated = { ...wedding.updates[index], ...updates, id };
  wedding.updates[index] = updated;
  await saveWeddingData(wedding);
  return updated;
}

export async function deleteUpdate(id: string): Promise<void> {
  const wedding = await getWeddingData();
  const next = wedding.updates.filter((u) => u.id !== id);
  if (next.length === wedding.updates.length) {
    throw new Error("Update not found");
  }
  wedding.updates = next;
  await saveWeddingData(wedding);
}

export async function getRsvps(): Promise<RsvpSubmission[]> {
  return readJsonArray<RsvpSubmission>(RSVPS_BLOB_KEY, RSVPS_FILE);
}

export async function addRsvp(
  submission: Omit<RsvpSubmission, "id" | "submittedAt">
): Promise<RsvpSubmission> {
  const rsvps = await getRsvps();
  const entry: RsvpSubmission = {
    ...submission,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
  };
  rsvps.unshift(entry);
  await writeJson(RSVPS_BLOB_KEY, RSVPS_FILE, rsvps);
  return entry;
}

export function slugifyEventId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
