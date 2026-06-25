import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { familyPhotoBlobKey } from "@/lib/familyPhoto";

type RouteContext = { params: Promise<{ name: string }> };

const FILENAME_PATTERN = /^[0-9a-f-]+\.webp$/i;

export async function GET(_request: Request, context: RouteContext) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { name } = await context.params;
  if (!FILENAME_PATTERN.test(name)) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  try {
    const result = await get(familyPhotoBlobKey(name), {
      access: "private",
      useCache: true,
    });

    if (!result || result.statusCode !== 200 || !result.stream) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
