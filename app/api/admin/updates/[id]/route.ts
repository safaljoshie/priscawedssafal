import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-auth";
import { deleteUpdate, updateUpdate } from "@/lib/storage";
import type { WeddingUpdate } from "@/lib/types";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const body = (await request.json()) as Partial<WeddingUpdate>;
    const updates: Partial<WeddingUpdate> = {};
    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.body !== undefined) updates.body = body.body.trim();
    if (body.publishedAt !== undefined) {
      updates.publishedAt = body.publishedAt.trim();
    }

    const updated = await updateUpdate(id, updates);
    return NextResponse.json({ update: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update update";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const { id } = await context.params;
    await deleteUpdate(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete update";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
