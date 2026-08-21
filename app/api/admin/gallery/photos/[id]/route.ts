import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-auth";
import { deleteGalleryPhoto } from "@/lib/storage";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const { id } = await context.params;
    await deleteGalleryPhoto(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete photo";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
