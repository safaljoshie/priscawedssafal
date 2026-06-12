import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-auth";
import { addUpdate, getUpdates } from "@/lib/storage";
import type { WeddingUpdate } from "@/lib/types";

export async function GET() {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const updates = await getUpdates();
    return NextResponse.json({ updates });
  } catch {
    return NextResponse.json({ error: "Failed to load updates" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const body = (await request.json()) as Partial<WeddingUpdate>;
    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!body.body?.trim()) {
      return NextResponse.json({ error: "Body is required" }, { status: 400 });
    }

    const update: WeddingUpdate = {
      id: crypto.randomUUID(),
      title: body.title.trim(),
      body: body.body.trim(),
      titleNe: body.titleNe?.trim() || undefined,
      bodyNe: body.bodyNe?.trim() || undefined,
      publishedAt: body.publishedAt?.trim() || new Date().toISOString(),
    };

    const created = await addUpdate(update);
    return NextResponse.json({ update: created }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create update";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
