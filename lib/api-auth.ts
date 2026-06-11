import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "./auth";

export async function requireAdminApi() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
