import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-auth";
import { updateFamilyVisibility } from "@/lib/storage";
import type { FamilyVisibility } from "@/lib/types";

export async function PUT(request: Request) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const body = (await request.json()) as Partial<FamilyVisibility>;
    const visibility = await updateFamilyVisibility(body);
    return NextResponse.json({ visibility });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update visibility";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
