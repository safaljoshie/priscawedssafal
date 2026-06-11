import { NextResponse } from "next/server";
import { addRsvp } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, attending, eventsAttending, guests, dietary, message } =
      body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const hasEmail = Boolean(email?.trim());
    const hasPhone = Boolean(phone?.trim());
    if (!hasEmail && !hasPhone) {
      return NextResponse.json(
        { error: "Email or phone is required" },
        { status: 400 }
      );
    }

    if (!attending || !["yes", "no"].includes(attending)) {
      return NextResponse.json({ error: "Invalid attendance" }, { status: 400 });
    }

    if (attending === "yes" && (!eventsAttending || eventsAttending.length === 0)) {
      return NextResponse.json(
        { error: "Select at least one event" },
        { status: 400 }
      );
    }

    const entry = await addRsvp({
      name: name.trim(),
      email: email?.trim() || "",
      phone: phone?.trim() || "",
      attending,
      eventsAttending: attending === "yes" ? eventsAttending : [],
      guests: guests || "1",
      dietary: dietary?.trim() || "",
      message: message?.trim() || "",
    });

    return NextResponse.json({ ok: true, id: entry.id });
  } catch {
    return NextResponse.json({ error: "Failed to save RSVP" }, { status: 500 });
  }
}
