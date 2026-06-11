import { NextResponse } from "next/server";
import {
  createSessionToken,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!password || !verifyPassword(password)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = createSessionToken();
    const response = NextResponse.json({ ok: true });
    const opts = sessionCookieOptions(token);
    response.cookies.set(opts.name, opts.value, opts);
    return response;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
