import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-auth";
import { getGalleryData } from "@/lib/storage";

export async function GET() {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const gallery = await getGalleryData();
    return NextResponse.json({ gallery });
  } catch {
    return NextResponse.json(
      { error: "Failed to load gallery data" },
      { status: 500 }
    );
  }
}
