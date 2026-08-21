import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-auth";
import {
  MAX_GALLERY_PHOTO_BYTES,
  compressGalleryPhoto,
  storeGalleryPhoto,
} from "@/lib/galleryPhoto";
import { isImageUploadFile } from "@/lib/familyPhotoUrl";
import { addGalleryPhoto } from "@/lib/storage";
import type { GalleryEventId } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

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
    const formData = await request.formData();
    const file = formData.get("file");
    const event = String(formData.get("event") ?? "");
    const altEn = String(formData.get("altEn") ?? "").trim();
    const altNe = String(formData.get("altNe") ?? "").trim();
    const saveAsPhoto = formData.get("saveAsPhoto") !== "false";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (saveAsPhoto && !EVENT_IDS.includes(event as GalleryEventId)) {
      return NextResponse.json({ error: "Invalid event category" }, { status: 400 });
    }

    if (!isImageUploadFile(file)) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    if (file.size > MAX_GALLERY_PHOTO_BYTES) {
      return NextResponse.json(
        { error: "Image must be under 5MB. Try a smaller photo." },
        { status: 400 }
      );
    }

    const input = Buffer.from(new Uint8Array(await file.arrayBuffer()));
    const compressed = await compressGalleryPhoto(input);
    const url = await storeGalleryPhoto(compressed.buffer, {
      contentType: compressed.contentType,
      extension: compressed.extension,
    });

    if (!saveAsPhoto) {
      return NextResponse.json({
        url,
        sizeKb: Math.round(compressed.buffer.length / 1024),
      });
    }

    const photo = await addGalleryPhoto({
      event: event as GalleryEventId,
      src: url,
      thumb: url,
      portrait: compressed.height > compressed.width,
      alt: {
        en: altEn || `${event} photo`,
        ne: altNe || altEn || `${event} photo`,
      },
    });

    return NextResponse.json({
      photo,
      url,
      sizeKb: Math.round(compressed.buffer.length / 1024),
    });
  } catch (error) {
    const raw =
      error instanceof Error ? error.message : "Failed to upload image";
    const message = /heif|heic/i.test(raw)
      ? "This iPhone photo could not be processed. Try JPG/PNG, or Most Compatible camera setting."
      : raw;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
