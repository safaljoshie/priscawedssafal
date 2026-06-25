import { revalidatePath } from "next/cache";
import type {
  FamilyCategory,
  FamilyData,
  FamilyMember,
  FamilySide,
  RsvpSubmission,
  WeddingData,
  WeddingEvent,
  WeddingUpdate,
} from "./types";
import { readJson, readJsonArray, writeJson } from "./persistence";
import { sortWeddingData } from "./sortEvents";

const WEDDING_BLOB_KEY = "data/wedding.json";
const RSVPS_BLOB_KEY = "data/rsvps.json";
const FAMILY_BLOB_KEY = "data/family.json";
const WEDDING_FILE = "wedding.json";
const RSVPS_FILE = "rsvps.json";
const FAMILY_FILE = "family.json";

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

export async function getFamilyData(): Promise<FamilyData> {
  return readJson<FamilyData>(FAMILY_BLOB_KEY, FAMILY_FILE);
}

export async function saveFamilyData(data: FamilyData): Promise<void> {
  await writeJson(FAMILY_BLOB_KEY, FAMILY_FILE, data);
  revalidatePath("/family");
}

type FamilyMemberLocation = {
  side: FamilySide;
  category: FamilyCategory;
  index: number;
};

function findFamilyMember(
  data: FamilyData,
  id: string
): FamilyMemberLocation | null {
  for (const side of ["prisca", "safal"] as const) {
    for (const category of [
      "parents",
      "siblings",
      "grandparents",
      "extended",
    ] as const) {
      const index = data[side][category].findIndex((member) => member.id === id);
      if (index !== -1) {
        return { side, category, index };
      }
    }
  }
  return null;
}

function normalizeMember(
  member: Omit<FamilyMember, "id"> & { id?: string }
): FamilyMember {
  return {
    id: member.id?.trim() || crypto.randomUUID(),
    name: member.name?.trim() ?? "",
    nameNe: member.nameNe?.trim() || undefined,
    relation: member.relation?.trim() ?? "",
    relationNe: member.relationNe?.trim() || undefined,
    photo: member.photo?.trim() || undefined,
    bio: member.bio?.trim() ?? "",
    bioNe: member.bioNe?.trim() || undefined,
  };
}

export async function addFamilyMember(
  side: FamilySide,
  category: FamilyCategory,
  member: Omit<FamilyMember, "id"> & { id?: string }
): Promise<FamilyMember> {
  const data = await getFamilyData();
  const created = normalizeMember(member);
  data[side][category].push(created);
  await saveFamilyData(data);
  return created;
}

export async function updateFamilyMember(
  id: string,
  updates: Partial<FamilyMember>
): Promise<FamilyMember> {
  const data = await getFamilyData();
  const location = findFamilyMember(data, id);
  if (!location) throw new Error("Family member not found");

  const current = data[location.side][location.category][location.index];
  const updated: FamilyMember = {
    ...current,
    ...updates,
    id,
    name: updates.name !== undefined ? updates.name.trim() : current.name,
    nameNe:
      updates.nameNe !== undefined
        ? updates.nameNe.trim() || undefined
        : current.nameNe,
    relation:
      updates.relation !== undefined ? updates.relation.trim() : current.relation,
    relationNe:
      updates.relationNe !== undefined
        ? updates.relationNe.trim() || undefined
        : current.relationNe,
    photo:
      updates.photo !== undefined ? updates.photo.trim() || undefined : current.photo,
    bio: updates.bio !== undefined ? updates.bio.trim() : current.bio,
    bioNe:
      updates.bioNe !== undefined ? updates.bioNe.trim() || undefined : current.bioNe,
  };

  data[location.side][location.category][location.index] = updated;
  await saveFamilyData(data);
  return updated;
}

export async function deleteFamilyMember(id: string): Promise<void> {
  const data = await getFamilyData();
  const location = findFamilyMember(data, id);
  if (!location) throw new Error("Family member not found");

  data[location.side][location.category].splice(location.index, 1);
  await saveFamilyData(data);
}
