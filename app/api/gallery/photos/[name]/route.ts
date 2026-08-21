import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { galleryPhotoBlobKey } from "@/lib/galleryPhoto";

type RouteContext = { params: Promise<{ name: string }> };

const FILENAME_PATTERN = /^[0-9a-f-]+\.(webp|jpe?g|png)$/i;

function contentTypeForName(name: string): string {
  if (/\.png$/i.test(name)) return "image/png";
  if (/\.jpe?g$/i.test(name)) return "image/jpeg";
  return "image/webp";
}

export async function GET(_request: Request, context: RouteContext) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { name } = await context.params;
  if (!FILENAME_PATTERN.test(name)) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  try {
    const result = await get(galleryPhotoBlobKey(name), {
      access: "private",
      useCache: true,
    });

    if (!result || result.statusCode !== 200 || !result.stream) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const bytes = Buffer.from(
      new Uint8Array(await new Response(result.stream).arrayBuffer())
    );

    return new NextResponse(bytes, {
      headers: {
        "Content-Type": contentTypeForName(name),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
