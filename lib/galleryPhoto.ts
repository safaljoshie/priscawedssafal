import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_EDGE = 1600;
const WEBP_QUALITY = 80;

export const MAX_GALLERY_PHOTO_BYTES = 5 * 1024 * 1024;
export const GALLERY_PHOTO_BLOB_PREFIX = "images/gallery/";

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
    quality: 0.9,
  });
  return Buffer.from(jpeg);
}

async function compressWithSharp(input: Buffer): Promise<{
  buffer: Buffer;
  width: number;
  height: number;
}> {
  const sharp = (await import("sharp")).default;
  const plainInput = toPlainBuffer(input);

  const pipeline = sharp(plainInput, { unlimited: true })
    .rotate()
    .resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY });

  let buffer: Buffer;
  if (typeof pipeline.toUint8Array === "function") {
    const result = await pipeline.toUint8Array();
    const bytes = "data" in result ? result.data : result;
    buffer = toPlainBuffer(bytes);
  } else {
    buffer = toPlainBuffer(await pipeline.toBuffer());
  }

  const meta = await sharp(buffer).metadata();
  return {
    buffer,
    width: meta.width ?? MAX_EDGE,
    height: meta.height ?? MAX_EDGE,
  };
}

export async function compressGalleryPhoto(input: Buffer): Promise<{
  buffer: Buffer;
  width: number;
  height: number;
}> {
  const plainInput = toPlainBuffer(input);

  try {
    return await compressWithSharp(plainInput);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (!isHeifError(message) && !isHeifBuffer(plainInput)) {
      throw error;
    }

    try {
      const jpeg = await convertHeicToJpeg(plainInput);
      return compressWithSharp(jpeg);
    } catch (fallbackError) {
      const fallbackMessage =
        fallbackError instanceof Error ? fallbackError.message : "";
      throw new Error(
        `Could not process this iPhone photo. Save it as JPG and try again. (${fallbackMessage})`
      );
    }
  }
}

export function galleryPhotoBlobKey(filename: string): string {
  return `${GALLERY_PHOTO_BLOB_PREFIX}${filename}`;
}

export function galleryPhotoPublicPath(filename: string): string {
  if (useBlobStorage()) {
    return `/api/gallery/photos/${filename}`;
  }
  return `/images/gallery/${filename}`;
}

export async function storeGalleryPhoto(buffer: Buffer): Promise<string> {
  const filename = `${randomUUID()}.webp`;
  const blobKey = galleryPhotoBlobKey(filename);
  const plainBuffer = toPlainBuffer(buffer);

  if (useBlobStorage()) {
    await put(blobKey, plainBuffer, {
      access: "private",
      contentType: "image/webp",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return galleryPhotoPublicPath(filename);
  }

  const dir = path.join(process.cwd(), "public/images/gallery");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), plainBuffer);
  return galleryPhotoPublicPath(filename);
}
