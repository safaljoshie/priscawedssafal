"use client";

import { useState } from "react";
import type { RsvpSubmission, ScheduleItem, WeddingEvent, WeddingUpdate } from "@/lib/types";

type Tab = "events" | "updates" | "rsvps";

const emptyScheduleRow = (): ScheduleItem => ({
  time: "",
  event: "",
  location: "",
});

const emptyEvent = (): WeddingEvent => ({
  id: "",
  name: "",
  date: "",
  venue: "",
  mapsUrl: "",
  schedule: [emptyScheduleRow()],
});

const emptyUpdate = (): WeddingUpdate => ({
  id: "",
  title: "",
  body: "",
  titleNe: "",
  bodyNe: "",
  publishedAt: new Date().toISOString().slice(0, 10),
});

type Props = {
  initialEvents: WeddingEvent[];
  initialUpdates: WeddingUpdate[];
  initialRsvps: RsvpSubmission[];
};

export function AdminDashboard({
  initialEvents,
  initialUpdates,
  initialRsvps,
}: Props) {
  const [tab, setTab] = useState<Tab>("events");
  const [events, setEvents] = useState(initialEvents);
  const [updates, setUpdates] = useState(initialUpdates);
  const [rsvps, setRsvps] = useState(initialRsvps);
  const [editing, setEditing] = useState<WeddingEvent | null>(null);
  const [editingUpdate, setEditingUpdate] = useState<WeddingUpdate | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isNewUpdate, setIsNewUpdate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  async function refreshRsvps() {
    const res = await fetch("/api/admin/rsvps");
    if (res.ok) {
      const data = await res.json();
      setRsvps(data.rsvps);
    }
  }

  async function refreshUpdates() {
    const res = await fetch("/api/admin/updates");
    if (res.ok) {
      const data = await res.json();
      setUpdates(data.updates);
    }
  }

  function startEdit(event: WeddingEvent) {
    setIsNew(false);
    setEditing({
      ...event,
      schedule:
        event.schedule.length > 0 ? [...event.schedule] : [emptyScheduleRow()],
    });
    setMessage("");
  }

  function startAdd() {
    setIsNew(true);
    setEditing(emptyEvent());
    setMessage("");
  }

  function cancelEdit() {
    setEditing(null);
    setIsNew(false);
    setMessage("");
  }

  function startEditUpdate(update: WeddingUpdate) {
    setIsNewUpdate(false);
    setEditingUpdate({
      ...update,
      publishedAt: update.publishedAt.slice(0, 10),
    });
    setMessage("");
  }

  function startAddUpdate() {
    setIsNewUpdate(true);
    setEditingUpdate(emptyUpdate());
    setMessage("");
  }

  function cancelEditUpdate() {
    setEditingUpdate(null);
    setIsNewUpdate(false);
    setMessage("");
  }

  async function saveUpdate() {
    if (!editingUpdate) return;
    setSaving(true);
    setMessage("");

    const payload = {
      title: editingUpdate.title.trim(),
      body: editingUpdate.body.trim(),
      titleNe: editingUpdate.titleNe?.trim() ?? "",
      bodyNe: editingUpdate.bodyNe?.trim() ?? "",
      publishedAt: new Date(editingUpdate.publishedAt).toISOString(),
    };

    try {
      const res = isNewUpdate
        ? await fetch("/api/admin/updates", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(`/api/admin/updates/${editingUpdate.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to save");
        return;
      }

      if (isNewUpdate) {
        setUpdates((prev) => [data.update, ...prev]);
      } else {
        setUpdates((prev) =>
          prev.map((u) => (u.id === data.update.id ? data.update : u))
        );
      }

      setMessage("Saved successfully");
      setEditingUpdate(null);
      setIsNewUpdate(false);
    } catch {
      setMessage("Failed to save update");
    } finally {
      setSaving(false);
    }
  }

  async function deleteUpdate(id: string) {
    if (!confirm("Delete this update? This cannot be undone.")) return;

    const res = await fetch(`/api/admin/updates/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUpdates((prev) => prev.filter((u) => u.id !== id));
      if (editingUpdate?.id === id) cancelEditUpdate();
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to delete");
    }
  }

  function updateScheduleRow(index: number, field: keyof ScheduleItem, value: string) {
    if (!editing) return;
    const schedule = [...editing.schedule];
    schedule[index] = { ...schedule[index], [field]: value };
    setEditing({ ...editing, schedule });
  }

  function addScheduleRow() {
    if (!editing) return;
    setEditing({ ...editing, schedule: [...editing.schedule, emptyScheduleRow()] });
  }

  function removeScheduleRow(index: number) {
    if (!editing) return;
    const schedule = editing.schedule.filter((_, i) => i !== index);
    setEditing({
      ...editing,
      schedule: schedule.length > 0 ? schedule : [emptyScheduleRow()],
    });
  }

  async function saveEvent() {
    if (!editing) return;
    setSaving(true);
    setMessage("");

    const payload = {
      ...editing,
      schedule: editing.schedule.filter(
        (row) => row.time.trim() || row.event.trim() || row.location.trim()
      ),
    };

    try {
      const res = isNew
        ? await fetch("/api/admin/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(`/api/admin/events/${editing.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to save");
        return;
      }

      if (isNew) {
        setEvents((prev) => [...prev, data.event]);
      } else {
        setEvents((prev) =>
          prev.map((e) => (e.id === data.event.id ? data.event : e))
        );
      }

      setMessage("Saved successfully");
      setEditing(null);
      setIsNew(false);
    } catch {
      setMessage("Failed to save event");
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvent(id: string) {
    if (!confirm("Delete this event? This cannot be undone.")) return;

    const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      if (editing?.id === id) cancelEdit();
    } else {
      const data = await res.json();
      setMessage(data.error || "Failed to delete");
    }
  }

  const eventNameById = Object.fromEntries(events.map((e) => [e.id, e.name]));

  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b border-gold/20 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <div>
            <h1 className="font-serif text-xl text-green md:text-2xl">
              Wedding Admin
            </h1>
            <p className="text-xs text-[#1a1a1a]/50">Events, updates & RSVPs</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="text-xs uppercase tracking-[0.15em] text-[#1a1a1a]/50 transition-colors hover:text-green"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
        <div className="flex gap-2 border-b border-gold/15 pb-4">
          {(["events", "updates", "rsvps"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTab(t);
                if (t === "rsvps") refreshRsvps();
                if (t === "updates") refreshUpdates();
              }}
              className={`rounded-sm px-4 py-2 text-xs uppercase tracking-[0.12em] transition-colors ${
                tab === t
                  ? "bg-green text-ivory"
                  : "bg-white text-green/70 hover:bg-green/10"
              }`}
            >
              {t === "events"
                ? "Events"
                : t === "updates"
                  ? `Updates (${updates.length})`
                  : `RSVPs (${rsvps.length})`}
            </button>
          ))}
        </div>

        {message && (
          <p className="mt-4 rounded-sm border border-gold/30 bg-white px-4 py-3 text-sm text-green">
            {message}
          </p>
        )}

        {tab === "events" && (
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-lg text-green">All events</h2>
                <button
                  type="button"
                  onClick={startAdd}
                  className="rounded-sm bg-gold px-4 py-2 text-xs uppercase tracking-[0.12em] text-green transition-colors hover:bg-gold/90"
                >
                  Add event
                </button>
              </div>

              <ul className="space-y-3">
                {events.map((event) => (
                  <li
                    key={event.id}
                    className="flex items-start justify-between gap-3 rounded-sm border border-gold/20 bg-white p-4"
                  >
                    <div>
                      <p className="font-medium text-green">{event.name}</p>
                      <p className="mt-1 text-sm text-[#1a1a1a]/60">{event.date}</p>
                      <p className="text-sm text-[#1a1a1a]/45">{event.venue}</p>
                      <p className="mt-1 text-xs text-[#1a1a1a]/35">
                        {event.schedule.length} schedule item
                        {event.schedule.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(event)}
                        className="text-xs uppercase tracking-[0.1em] text-gold hover:text-green"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteEvent(event.id)}
                        className="text-xs uppercase tracking-[0.1em] text-red-600/70 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {editing && (
              <div className="rounded-sm border border-gold/25 bg-white p-5 md:p-6">
                <h2 className="font-serif text-lg text-green">
                  {isNew ? "New event" : `Edit: ${editing.name}`}
                </h2>

                <div className="mt-5 space-y-4">
                  {isNew && (
                    <Field label="ID (optional)">
                      <input
                        value={editing.id}
                        onChange={(e) =>
                          setEditing({ ...editing, id: e.target.value })
                        }
                        placeholder="auto-generated from name"
                        className={inputClass}
                      />
                    </Field>
                  )}

                  <Field label="Event name" required>
                    <input
                      required
                      value={editing.name}
                      onChange={(e) =>
                        setEditing({ ...editing, name: e.target.value })
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Date">
                    <input
                      value={editing.date}
                      onChange={(e) =>
                        setEditing({ ...editing, date: e.target.value })
                      }
                      placeholder="Tuesday, January 19, 2027"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Venue / location">
                    <input
                      value={editing.venue}
                      onChange={(e) =>
                        setEditing({ ...editing, venue: e.target.value })
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Map link">
                    <input
                      type="url"
                      value={editing.mapsUrl || ""}
                      onChange={(e) =>
                        setEditing({ ...editing, mapsUrl: e.target.value })
                      }
                      placeholder="https://maps.app.goo.gl/..."
                      className={inputClass}
                    />
                  </Field>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.15em] text-[#1a1a1a]/50">
                        Schedule
                      </span>
                      <button
                        type="button"
                        onClick={addScheduleRow}
                        className="text-xs text-gold hover:text-green"
                      >
                        + Add row
                      </button>
                    </div>

                    <div className="space-y-3">
                      {editing.schedule.map((row, index) => (
                        <div
                          key={index}
                          className="grid gap-2 rounded-sm border border-gold/15 p-3 sm:grid-cols-3"
                        >
                          <input
                            value={row.time}
                            onChange={(e) =>
                              updateScheduleRow(index, "time", e.target.value)
                            }
                            placeholder="Time"
                            className={inputClass}
                          />
                          <input
                            value={row.event}
                            onChange={(e) =>
                              updateScheduleRow(index, "event", e.target.value)
                            }
                            placeholder="Event"
                            className={inputClass}
                          />
                          <div className="flex gap-2">
                            <input
                              value={row.location}
                              onChange={(e) =>
                                updateScheduleRow(index, "location", e.target.value)
                              }
                              placeholder="Location"
                              className={`${inputClass} flex-1`}
                            />
                            <button
                              type="button"
                              onClick={() => removeScheduleRow(index)}
                              className="shrink-0 px-2 text-red-500/70 hover:text-red-600"
                              aria-label="Remove row"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={saveEvent}
                    disabled={saving || !editing.name.trim()}
                    className="rounded-sm bg-green px-5 py-2.5 text-xs uppercase tracking-[0.12em] text-ivory hover:bg-green-dark disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-sm border border-gold/30 px-5 py-2.5 text-xs uppercase tracking-[0.12em] text-green/70 hover:border-gold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "updates" && (
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-lg text-green">All updates</h2>
                <button
                  type="button"
                  onClick={startAddUpdate}
                  className="rounded-sm bg-gold px-4 py-2 text-xs uppercase tracking-[0.12em] text-green transition-colors hover:bg-gold/90"
                >
                  Add update
                </button>
              </div>

              {updates.length === 0 ? (
                <p className="rounded-sm border border-gold/20 bg-white p-8 text-center text-sm text-[#1a1a1a]/50">
                  No updates yet. Add one to show it on the homepage.
                </p>
              ) : (
                <ul className="space-y-3">
                  {updates.map((update) => (
                    <li
                      key={update.id}
                      className="flex items-start justify-between gap-3 rounded-sm border border-gold/20 bg-white p-4"
                    >
                      <div>
                        <p className="font-medium text-green">{update.title}</p>
                        {update.titleNe?.trim() && (
                          <p className="mt-0.5 text-sm font-medium text-green/75">
                            {update.titleNe}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gold">
                          {formatDate(update.publishedAt)}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm text-[#1a1a1a]/60">
                          {update.body}
                        </p>
                        {update.bodyNe?.trim() && (
                          <p className="mt-1 line-clamp-2 text-sm text-[#1a1a1a]/45">
                            {update.bodyNe}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => startEditUpdate(update)}
                          className="text-xs uppercase tracking-[0.1em] text-gold hover:text-green"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteUpdate(update.id)}
                          className="text-xs uppercase tracking-[0.1em] text-red-600/70 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {editingUpdate && (
              <div className="rounded-sm border border-gold/25 bg-white p-5 md:p-6">
                <h2 className="font-serif text-lg text-green">
                  {isNewUpdate ? "New update" : `Edit: ${editingUpdate.title}`}
                </h2>

                <div className="mt-5 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-gold">
                    English
                  </p>

                  <Field label="Title (English)" required>
                    <input
                      required
                      value={editingUpdate.title}
                      onChange={(e) =>
                        setEditingUpdate({
                          ...editingUpdate,
                          title: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Message (English)" required>
                    <textarea
                      required
                      rows={4}
                      value={editingUpdate.body}
                      onChange={(e) =>
                        setEditingUpdate({
                          ...editingUpdate,
                          body: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </Field>

                  <p className="border-t border-gold/15 pt-4 text-xs font-bold uppercase tracking-[0.12em] text-gold">
                    Nepali (नेपाली)
                  </p>

                  <Field label="Title (Nepali)">
                    <input
                      value={editingUpdate.titleNe ?? ""}
                      onChange={(e) =>
                        setEditingUpdate({
                          ...editingUpdate,
                          titleNe: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="शीर्षक नेपालीमा"
                    />
                  </Field>

                  <Field label="Message (Nepali)">
                    <textarea
                      rows={4}
                      value={editingUpdate.bodyNe ?? ""}
                      onChange={(e) =>
                        setEditingUpdate({
                          ...editingUpdate,
                          bodyNe: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="सन्देश नेपालीमा"
                    />
                  </Field>

                  <Field label="Date">
                    <input
                      type="date"
                      value={editingUpdate.publishedAt}
                      onChange={(e) =>
                        setEditingUpdate({
                          ...editingUpdate,
                          publishedAt: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={saveUpdate}
                    disabled={
                      saving ||
                      !editingUpdate.title.trim() ||
                      !editingUpdate.body.trim()
                    }
                    className="rounded-sm bg-green px-5 py-2.5 text-xs uppercase tracking-[0.12em] text-ivory hover:bg-green-dark disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditUpdate}
                    className="rounded-sm border border-gold/30 px-5 py-2.5 text-xs uppercase tracking-[0.12em] text-green/70 hover:border-gold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "rsvps" && (
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-lg text-green">RSVP submissions</h2>
              <button
                type="button"
                onClick={refreshRsvps}
                className="text-xs uppercase tracking-[0.12em] text-gold hover:text-green"
              >
                Refresh
              </button>
            </div>

            {rsvps.length === 0 ? (
              <p className="rounded-sm border border-gold/20 bg-white p-8 text-center text-sm text-[#1a1a1a]/50">
                No RSVPs yet.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-sm border border-gold/20 bg-white">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-gold/15 bg-ivory/40">
                      <Th>Submitted</Th>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Phone</Th>
                      <Th>Attending</Th>
                      <Th>Events</Th>
                      <Th>Guests</Th>
                      <Th>Dietary</Th>
                      <Th>Message</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {rsvps.map((rsvp) => (
                      <tr
                        key={rsvp.id}
                        className="border-b border-gold/10 last:border-b-0"
                      >
                        <Td>{formatDate(rsvp.submittedAt)}</Td>
                        <Td>{rsvp.name}</Td>
                        <Td>{rsvp.email || "—"}</Td>
                        <Td>{rsvp.phone || "—"}</Td>
                        <Td>
                          <span
                            className={
                              rsvp.attending === "yes"
                                ? "text-green"
                                : "text-[#1a1a1a]/45"
                            }
                          >
                            {rsvp.attending === "yes" ? "Yes" : "No"}
                          </span>
                        </Td>
                        <Td>
                          {rsvp.eventsAttending.length > 0
                            ? rsvp.eventsAttending
                                .map((id) => eventNameById[id] || id)
                                .join(", ")
                            : "—"}
                        </Td>
                        <Td>{rsvp.guests}</Td>
                        <Td>{rsvp.dietary || "—"}</Td>
                        <Td className="max-w-[200px] truncate" title={rsvp.message}>
                          {rsvp.message || "—"}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-[0.12em] text-[#1a1a1a]/50">
        {label}
        {required && <span className="text-gold"> *</span>}
      </span>
      {children}
    </label>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-xs uppercase tracking-[0.1em] text-gold">
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <td className={`px-4 py-3 text-[#1a1a1a]/70 ${className}`} title={title}>
      {children}
    </td>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const inputClass =
  "w-full rounded-sm border border-gold/25 px-3 py-2 text-sm outline-none focus:border-gold";
