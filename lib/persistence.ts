import { get, put } from "@vercel/blob";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function useBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function assertWritable(): void {
  if (process.env.VERCEL && !useBlobStorage()) {
    throw new Error(
      "Saving requires Vercel Blob. In the Vercel dashboard, open Storage → Create Blob → connect it to this project, then redeploy."
    );
  }
}

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

async function readBlobJson<T>(blobKey: string): Promise<T | null> {
  try {
    const result = await get(blobKey, {
      access: "private",
      useCache: false,
    });

    if (!result || result.statusCode !== 200 || !result.stream) {
      return null;
    }

    const text = await new Response(result.stream).text();
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function readJson<T>(blobKey: string, localFile: string): Promise<T> {
  if (useBlobStorage()) {
    const fromBlob = await readBlobJson<T>(blobKey);
    if (fromBlob) return fromBlob;
  }

  const localPath = path.join(DATA_DIR, localFile);
  const raw = await readFile(localPath, "utf-8");
  return JSON.parse(raw) as T;
}

export async function writeJson(
  blobKey: string,
  localFile: string,
  data: unknown
): Promise<void> {
  assertWritable();

  const content = JSON.stringify(data, null, 2);

  if (useBlobStorage()) {
    await put(blobKey, content, {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }

  await ensureDataDir();
  await writeFile(path.join(DATA_DIR, localFile), content, "utf-8");
}

export async function readJsonArray<T>(blobKey: string, localFile: string): Promise<T[]> {
  if (useBlobStorage()) {
    const fromBlob = await readBlobJson<T[]>(blobKey);
    if (fromBlob) return fromBlob;
    return [];
  }

  try {
    const localPath = path.join(DATA_DIR, localFile);
    const raw = await readFile(localPath, "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}
