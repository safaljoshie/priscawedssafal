import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

const MAX_EDGE = 512;
const WEBP_QUALITY = 82;

export const MAX_FAMILY_PHOTO_BYTES = 4 * 1024 * 1024;

function useBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function compressFamilyPhoto(input: Buffer): Promise<Buffer> {
  return sharp(input)
    .rotate()
    .resize(MAX_EDGE, MAX_EDGE, { fit: "cover", position: "centre" })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
}

export async function storeFamilyPhoto(buffer: Buffer): Promise<string> {
  const id = randomUUID();
  const blobKey = `images/family/${id}.webp`;

  if (useBlobStorage()) {
    const blob = await put(blobKey, buffer, {
      access: "public",
      contentType: "image/webp",
    });
    return blob.url;
  }

  const dir = path.join(process.cwd(), "public/images/family");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${id}.webp`), buffer);
  return `/images/family/${id}.webp`;
}
