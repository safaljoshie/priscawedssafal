import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_EDGE = 512;
const WEBP_QUALITY = 82;

export const MAX_FAMILY_PHOTO_BYTES = 5 * 1024 * 1024;
export const FAMILY_PHOTO_BLOB_PREFIX = "images/family/";

function useBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function toPlainBuffer(data: Buffer | Uint8Array): Buffer {
  return Buffer.from(data);
}

function isJpegBuffer(input: Buffer): boolean {
  return input.length > 3 && input[0] === 0xff && input[1] === 0xd8 && input[2] === 0xff;
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

  return toPlainBuffer(await pipeline.toBuffer());
}

export async function compressFamilyPhoto(input: Buffer): Promise<{
  buffer: Buffer;
  contentType: "image/webp" | "image/jpeg";
  extension: "webp" | "jpg";
}> {
  const plainInput = toPlainBuffer(input);

  try {
    return {
      buffer: await compressWithSharp(plainInput),
      contentType: "image/webp",
      extension: "webp",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (isSharpLoadError(message) && isJpegBuffer(plainInput)) {
      return {
        buffer: plainInput,
        contentType: "image/jpeg",
        extension: "jpg",
      };
    }

    if (!isHeifError(message) && !isHeifBuffer(plainInput) && !isSharpLoadError(message)) {
      throw error;
    }

    try {
      const jpeg = await convertHeicToJpeg(plainInput);
      try {
        return {
          buffer: await compressWithSharp(jpeg),
          contentType: "image/webp",
          extension: "webp",
        };
      } catch (sharpError) {
        const sharpMessage =
          sharpError instanceof Error ? sharpError.message : "";
        if (isSharpLoadError(sharpMessage)) {
          return {
            buffer: jpeg,
            contentType: "image/jpeg",
            extension: "jpg",
          };
        }
        throw sharpError;
      }
    } catch (fallbackError) {
      if (isJpegBuffer(plainInput)) {
        return {
          buffer: plainInput,
          contentType: "image/jpeg",
          extension: "jpg",
        };
      }
      const fallbackMessage =
        fallbackError instanceof Error ? fallbackError.message : "";
      throw new Error(
        `Could not process this iPhone photo. Save it as JPG and try again. (${fallbackMessage})`
      );
    }
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

export async function storeFamilyPhoto(
  buffer: Buffer,
  options?: { contentType?: string; extension?: string }
): Promise<string> {
  const extension = options?.extension ?? "webp";
  const contentType = options?.contentType ?? "image/webp";
  const filename = `${randomUUID()}.${extension}`;
  const blobKey = familyPhotoBlobKey(filename);
  const plainBuffer = toPlainBuffer(buffer);

  if (useBlobStorage()) {
    await put(blobKey, plainBuffer, {
      access: "private",
      contentType,
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
