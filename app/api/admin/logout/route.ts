import { NextResponse } from "next/server";
import { clearSessionCookieOptions } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  const opts = clearSessionCookieOptions();
  response.cookies.set(opts.name, opts.value, opts);
  return response;
}
