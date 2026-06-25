import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-auth";
import { getFamilyData } from "@/lib/storage";

export async function GET() {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const family = await getFamilyData();
    return NextResponse.json({ family });
  } catch {
    return NextResponse.json({ error: "Failed to load family data" }, { status: 500 });
  }
}
