import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api-auth";
import {
  MAX_FAMILY_PHOTO_BYTES,
  compressFamilyPhoto,
  storeFamilyPhoto,
} from "@/lib/familyPhoto";
import { isImageUploadFile } from "@/lib/familyPhotoUrl";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!isImageUploadFile(file)) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    if (file.size > MAX_FAMILY_PHOTO_BYTES) {
      return NextResponse.json(
        { error: "Image must be under 10MB. Try a smaller photo." },
        { status: 400 }
      );
    }

    const input = Buffer.from(new Uint8Array(await file.arrayBuffer()));
    const compressed = await compressFamilyPhoto(input);
    const url = await storeFamilyPhoto(compressed);

    return NextResponse.json({
      url,
      sizeKb: Math.round(compressed.length / 1024),
    });
  } catch (error) {
    const raw =
      error instanceof Error ? error.message : "Failed to upload image";
    const message =
      /heif|heic/i.test(raw)
        ? "This iPhone photo could not be processed. Try choosing “Most Compatible” in Settings → Camera, or upload a JPG/PNG."
        : raw;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
