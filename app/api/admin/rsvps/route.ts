import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-auth";
import { getRsvps } from "@/lib/storage";

export async function GET() {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const rsvps = await getRsvps();
    return NextResponse.json({ rsvps });
  } catch {
    return NextResponse.json({ error: "Failed to load RSVPs" }, { status: 500 });
  }
}
