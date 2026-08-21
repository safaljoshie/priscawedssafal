import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-auth";
import { updateGalleryVisibility } from "@/lib/storage";

export async function PUT(request: Request) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const body = (await request.json()) as { enabled?: boolean };
    if (typeof body.enabled !== "boolean") {
      return NextResponse.json(
        { error: "enabled must be a boolean" },
        { status: 400 }
      );
    }

    const enabled = await updateGalleryVisibility(body.enabled);
    return NextResponse.json({ enabled });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update gallery visibility";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
