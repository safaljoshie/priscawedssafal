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
    const updated = await updateEvent(id, {
      name: body.name?.trim(),
      date: body.date?.trim(),
      venue: body.venue?.trim(),
      mapsUrl: body.mapsUrl?.trim(),
      schedule: body.schedule,
    });
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
