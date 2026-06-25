import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

const MAX_EDGE = 512;
const WEBP_QUALITY = 82;

export const MAX_FAMILY_PHOTO_BYTES = 4 * 1024 * 1024;
export const FAMILY_PHOTO_BLOB_PREFIX = "images/family/";

function useBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function familyPhotoBlobKey(filename: string): string {
  return `${FAMILY_PHOTO_BLOB_PREFIX}${filename}`;
}

export function familyPhotoPublicPath(filename: string): string {
  if (useBlobStorage()) {
    return `/api/family/photos/${filename}`;
  }
  return `/images/family/${filename}`;
}

export async function compressFamilyPhoto(input: Buffer): Promise<Buffer> {
  return sharp(input)
    .rotate()
    .resize(MAX_EDGE, MAX_EDGE, { fit: "cover", position: "centre" })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
}

export async function storeFamilyPhoto(buffer: Buffer): Promise<string> {
  const filename = `${randomUUID()}.webp`;
  const blobKey = familyPhotoBlobKey(filename);

  if (useBlobStorage()) {
    await put(blobKey, buffer, {
      access: "private",
      contentType: "image/webp",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return familyPhotoPublicPath(filename);
  }

  const dir = path.join(process.cwd(), "public/images/family");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return familyPhotoPublicPath(filename);
}
