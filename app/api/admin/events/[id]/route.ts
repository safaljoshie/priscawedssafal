import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-auth";
import { deleteEvent, updateEvent } from "@/lib/storage";
import type { WeddingEvent } from "@/lib/types";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const body = (await request.json()) as Partial<WeddingEvent>;
    const updates: Partial<WeddingEvent> = {};
    if (body.name !== undefined) updates.name = body.name.trim();
    if (body.nameNe !== undefined) {
      updates.nameNe = body.nameNe.trim() || undefined;
    }
    if (body.date !== undefined) updates.date = body.date.trim();
    if (body.venue !== undefined) updates.venue = body.venue.trim();
    if (body.venueNe !== undefined) {
      updates.venueNe = body.venueNe.trim() || undefined;
    }
    if (body.mapsUrl !== undefined) updates.mapsUrl = body.mapsUrl.trim();
    if (body.schedule !== undefined) {
      updates.schedule = body.schedule.map((row) => ({
        ...row,
        eventNe: row.eventNe?.trim() || undefined,
        locationNe: row.locationNe?.trim() || undefined,
      }));
    }

    const updated = await updateEvent(id, updates);
    return NextResponse.json({ event: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update event";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const { id } = await context.params;
    await deleteEvent(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete event";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
