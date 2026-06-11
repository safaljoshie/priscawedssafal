import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { RsvpSubmission, WeddingData, WeddingEvent } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const WEDDING_PATH = path.join(DATA_DIR, "wedding.json");
const RSVPS_PATH = path.join(DATA_DIR, "rsvps.json");

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

export async function getWeddingData(): Promise<WeddingData> {
  await ensureDataDir();
  const raw = await readFile(WEDDING_PATH, "utf-8");
  return JSON.parse(raw) as WeddingData;
}

export async function saveWeddingData(data: WeddingData): Promise<void> {
  await ensureDataDir();
  await writeFile(WEDDING_PATH, JSON.stringify(data, null, 2), "utf-8");
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

export async function getRsvps(): Promise<RsvpSubmission[]> {
  await ensureDataDir();
  try {
    const raw = await readFile(RSVPS_PATH, "utf-8");
    return JSON.parse(raw) as RsvpSubmission[];
  } catch {
    return [];
  }
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
  await ensureDataDir();
  await writeFile(RSVPS_PATH, JSON.stringify(rsvps, null, 2), "utf-8");
  return entry;
}

export function slugifyEventId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
