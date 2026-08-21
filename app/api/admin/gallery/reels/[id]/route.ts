import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-auth";
import { deleteGalleryReel } from "@/lib/storage";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const { id } = await context.params;
    await deleteGalleryReel(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete reel";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
