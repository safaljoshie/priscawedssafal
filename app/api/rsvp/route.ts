import { NextResponse } from "next/server";
import { submitRsvpToGoogleScript } from "@/lib/google-script";
import { addRsvp, getWeddingData } from "@/lib/storage";

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

    const wedding = await getWeddingData();
    const eventNameById = Object.fromEntries(
      wedding.events.map((e) => [e.id, e.name])
    );
    const selectedEvents =
      attending === "yes"
        ? (eventsAttending as string[]).map((id) => eventNameById[id] || id)
        : [];

    const submittedAt = new Date().toISOString();
    const rsvpData = {
      name: name.trim(),
      email: email?.trim() || "",
      phone: phone?.trim() || "",
      attending: attending as "yes" | "no",
      eventsAttending: attending === "yes" ? eventsAttending : [],
      events: selectedEvents.join(", "),
      guests: guests || "1",
      dietary: dietary?.trim() || "",
      message: message?.trim() || "",
      submittedAt,
    };

    await submitRsvpToGoogleScript(rsvpData);

    try {
      await addRsvp({
        name: rsvpData.name,
        email: rsvpData.email,
        phone: rsvpData.phone,
        attending: rsvpData.attending,
        eventsAttending: rsvpData.eventsAttending,
        guests: rsvpData.guests,
        dietary: rsvpData.dietary,
        message: rsvpData.message,
      });
    } catch {
      // Local file storage may fail on Vercel; Google Script is the source of truth.
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save RSVP" }, { status: 500 });
  }
}
