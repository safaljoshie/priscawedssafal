type RsvpPayload = {
  name: string;
  email: string;
  phone: string;
  attending: "yes" | "no";
  eventsAttending: string[];
  events: string;
  guests: string;
  dietary: string;
  message: string;
  submittedAt: string;
};

export function getGoogleScriptUrl(): string | undefined {
  return (
    process.env.GOOGLE_SCRIPT_URL?.trim() ||
    process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL?.trim() ||
    undefined
  );
}

export async function submitRsvpToGoogleScript(
  payload: RsvpPayload
): Promise<void> {
  const url = getGoogleScriptUrl();
  if (!url) return;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`Google Script responded with ${res.status}`);
  }
}
