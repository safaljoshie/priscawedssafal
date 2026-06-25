import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_EDGE = 512;
const WEBP_QUALITY = 82;

export const MAX_FAMILY_PHOTO_BYTES = 10 * 1024 * 1024;
export const FAMILY_PHOTO_BLOB_PREFIX = "images/family/";

function useBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function toPlainBuffer(data: Buffer | Uint8Array): Buffer {
  return Buffer.from(data);
}

function isHeifBuffer(input: Buffer): boolean {
  if (input.length < 12) return false;
  const brand = input.subarray(8, 12).toString("ascii");
  return (
    brand.startsWith("heic") ||
    brand.startsWith("heif") ||
    brand.startsWith("mif1") ||
    brand.startsWith("msf1")
  );
}

function isHeifError(message: string): boolean {
  return /heif|heic|iref box/i.test(message);
}

async function convertHeicToJpeg(input: Buffer): Promise<Buffer> {
  const convert = (await import("heic-convert")).default;
  const jpeg = await convert({
    buffer: input,
    format: "JPEG",
    quality: 0.92,
  });
  return Buffer.from(jpeg);
}

async function compressWithSharp(input: Buffer): Promise<Buffer> {
  const sharp = (await import("sharp")).default;
  const plainInput = toPlainBuffer(input);

  const pipeline = sharp(plainInput, { unlimited: true })
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

export async function compressFamilyPhoto(input: Buffer): Promise<Buffer> {
  const plainInput = toPlainBuffer(input);

  try {
    return await compressWithSharp(plainInput);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (!isHeifError(message) && !isHeifBuffer(plainInput)) {
      throw error;
    }

    const jpeg = await convertHeicToJpeg(plainInput);
    return compressWithSharp(jpeg);
  }
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
