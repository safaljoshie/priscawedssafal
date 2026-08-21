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

function isJpegBuffer(input: Buffer): boolean {
  return input.length > 3 && input[0] === 0xff && input[1] === 0xd8 && input[2] === 0xff;
}

function isPngBuffer(input: Buffer): boolean {
  return (
    input.length > 8 &&
    input[0] === 0x89 &&
    input[1] === 0x50 &&
    input[2] === 0x4e &&
    input[3] === 0x47
  );
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

function isSharpLoadError(message: string): boolean {
  return /sharp|libvips|ERR_DLOPEN_FAILED|Cannot find module/i.test(message);
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
  contentType: "image/webp";
  extension: "webp";
}> {
  const sharp = (await import("sharp")).default;
  const plainInput = toPlainBuffer(input);

  const pipeline = sharp(plainInput, { unlimited: true })
    .rotate()
    .resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY });

  const buffer = toPlainBuffer(await pipeline.toBuffer());
  const meta = await sharp(buffer).metadata();
  return {
    buffer,
    width: meta.width ?? MAX_EDGE,
    height: meta.height ?? MAX_EDGE,
    contentType: "image/webp",
    extension: "webp",
  };
}

function fallbackImage(
  input: Buffer
): {
  buffer: Buffer;
  width: number;
  height: number;
  contentType: "image/jpeg" | "image/png";
  extension: "jpg" | "png";
} {
  if (isPngBuffer(input)) {
    return {
      buffer: input,
      width: MAX_EDGE,
      height: MAX_EDGE,
      contentType: "image/png",
      extension: "png",
    };
  }

  return {
    buffer: input,
    width: MAX_EDGE,
    height: MAX_EDGE,
    contentType: "image/jpeg",
    extension: "jpg",
  };
}

export async function compressGalleryPhoto(input: Buffer): Promise<{
  buffer: Buffer;
  width: number;
  height: number;
  contentType: "image/webp" | "image/jpeg" | "image/png";
  extension: "webp" | "jpg" | "png";
}> {
  const plainInput = toPlainBuffer(input);

  try {
    return await compressWithSharp(plainInput);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (isSharpLoadError(message) && (isJpegBuffer(plainInput) || isPngBuffer(plainInput))) {
      return fallbackImage(plainInput);
    }

    if (!isHeifError(message) && !isHeifBuffer(plainInput) && !isSharpLoadError(message)) {
      throw error;
    }

    try {
      const jpeg = await convertHeicToJpeg(plainInput);
      try {
        return await compressWithSharp(jpeg);
      } catch (sharpError) {
        const sharpMessage =
          sharpError instanceof Error ? sharpError.message : "";
        if (isSharpLoadError(sharpMessage)) {
          return fallbackImage(jpeg);
        }
        throw sharpError;
      }
    } catch (fallbackError) {
      if (isJpegBuffer(plainInput) || isPngBuffer(plainInput)) {
        return fallbackImage(plainInput);
      }
      const fallbackMessage =
        fallbackError instanceof Error ? fallbackError.message : "";
      throw new Error(
        `Could not process this photo. Try a JPG or PNG. (${fallbackMessage})`
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

export async function storeGalleryPhoto(
  buffer: Buffer,
  options?: { contentType?: string; extension?: string }
): Promise<string> {
  const extension = options?.extension ?? "webp";
  const contentType = options?.contentType ?? "image/webp";
  const filename = `${randomUUID()}.${extension}`;
  const blobKey = galleryPhotoBlobKey(filename);
  const plainBuffer = toPlainBuffer(buffer);

  if (useBlobStorage()) {
    await put(blobKey, plainBuffer, {
      access: "private",
      contentType,
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
