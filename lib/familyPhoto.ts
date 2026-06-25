import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_EDGE = 512;
const WEBP_QUALITY = 82;

export const MAX_FAMILY_PHOTO_BYTES = 4 * 1024 * 1024;
export const FAMILY_PHOTO_BLOB_PREFIX = "images/family/";

function useBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function toPlainBuffer(data: Buffer | Uint8Array): Buffer {
  return Buffer.from(data);
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
  const sharp = (await import("sharp")).default;
  const plainInput = toPlainBuffer(input);

  const pipeline = sharp(plainInput)
    .rotate()
    .resize(MAX_EDGE, MAX_EDGE, { fit: "cover", position: "centre" })
    .webp({ quality: WEBP_QUALITY });

  if (typeof pipeline.toUint8Array === "function") {
    const result = await pipeline.toUint8Array();
    const bytes = "data" in result ? result.data : result;
    return toPlainBuffer(bytes);
  }

  return toPlainBuffer(await pipeline.toBuffer());
}

export async function storeFamilyPhoto(buffer: Buffer): Promise<string> {
  const filename = `${randomUUID()}.webp`;
  const blobKey = familyPhotoBlobKey(filename);
  const plainBuffer = toPlainBuffer(buffer);

  if (useBlobStorage()) {
    await put(blobKey, plainBuffer, {
      access: "private",
      contentType: "image/webp",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return familyPhotoPublicPath(filename);
  }

  const dir = path.join(process.cwd(), "public/images/family");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), plainBuffer);
  return familyPhotoPublicPath(filename);
}
