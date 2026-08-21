import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-auth";
import { addGalleryReel } from "@/lib/storage";
import type { GalleryEventId, GalleryReel } from "@/lib/types";

const EVENT_IDS: GalleryEventId[] = [
  "mehendi",
  "wedding-day",
  "ganesh-sagun",
  "reception",
];

export async function POST(request: Request) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const body = (await request.json()) as Partial<GalleryReel> & {
      titleEn?: string;
      titleNe?: string;
    };

    const event = body.event;
    if (!event || !EVENT_IDS.includes(event)) {
      return NextResponse.json({ error: "Invalid event category" }, { status: 400 });
    }

    const titleEn = (body.titleEn ?? body.title?.en ?? "").trim();
    if (!titleEn) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const reel = await addGalleryReel({
      event,
      title: {
        en: titleEn,
        ne: (body.titleNe ?? body.title?.ne ?? titleEn).trim(),
      },
      duration: (body.duration ?? "").trim() || "0:00",
      videoUrl: body.videoUrl?.trim() || undefined,
      thumb: body.thumb?.trim() || undefined,
      color: body.color,
    });

    return NextResponse.json({ reel });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to add reel";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
