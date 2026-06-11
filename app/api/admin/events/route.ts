import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-auth";
import { addEvent, getEvents, slugifyEventId } from "@/lib/storage";
import type { WeddingEvent } from "@/lib/types";

export async function GET() {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const events = await getEvents();
    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ error: "Failed to load events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const body = (await request.json()) as Partial<WeddingEvent>;
    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    let id = body.id?.trim() || slugifyEventId(body.name);
    const existing = await getEvents();
    let suffix = 1;
    const baseId = id;
    while (existing.some((e) => e.id === id)) {
      id = `${baseId}-${suffix++}`;
    }

    const event: WeddingEvent = {
      id,
      name: body.name.trim(),
      date: body.date?.trim() || "",
      venue: body.venue?.trim() || "",
      mapsUrl: body.mapsUrl?.trim() || "",
      schedule: body.schedule || [],
    };

    const created = await addEvent(event);
    return NextResponse.json({ event: created }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create event";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
