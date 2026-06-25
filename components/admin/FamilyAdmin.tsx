"use client";

import { useEffect, useRef, useState } from "react";
import type {
  FamilyCategory,
  FamilyData,
  FamilyMember,
  FamilySide,
} from "@/lib/types";
import { sanitizeFamilyPhotoUrl } from "@/lib/familyPhotoUrl";

const categories: FamilyCategory[] = [
  "parents",
  "siblings",
  "grandparents",
  "extended",
];

const categoryLabels: Record<FamilyCategory, string> = {
  parents: "Parents",
  siblings: "Siblings",
  grandparents: "Grandparents",
  extended: "Extended Family",
};

const emptyMember = (): FamilyMember => ({
  id: "",
  name: "",
  nameNe: "",
  relation: "",
  relationNe: "",
  photo: "",
  bio: "",
  bioNe: "",
});

type Props = {
  initialFamily: FamilyData;
  onMessage: (message: string) => void;
};

export function FamilyAdmin({ initialFamily, onMessage }: Props) {
  const listRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [family, setFamily] = useState(initialFamily);
  const [side, setSide] = useState<FamilySide>("prisca");
  const [category, setCategory] = useState<FamilyCategory>("parents");
  const [editing, setEditing] = useState<FamilyMember | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoMessage, setPhotoMessage] = useState("");
  const [photoDragActive, setPhotoDragActive] = useState(false);

  useEffect(() => {
    setFamily(initialFamily);
  }, [initialFamily]);

  const members = family[side]?.[category] ?? [];

  function scrollToForm() {
    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function scrollToList() {
    window.requestAnimationFrame(() => {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function startEdit(member: FamilyMember) {
    setIsNew(false);
    setEditing({
      ...member,
      nameNe: member.nameNe ?? "",
      relationNe: member.relationNe ?? "",
      photo: sanitizeFamilyPhotoUrl(member.photo) ?? "",
      bioNe: member.bioNe ?? "",
    });
    onMessage("");
    scrollToForm();
  }

  function startAdd() {
    setIsNew(true);
    setEditing(emptyMember());
    onMessage("");
    scrollToForm();
  }

  function cancelEdit() {
    setEditing(null);
    setIsNew(false);
    setPhotoMessage("");
    onMessage("");
  }

  async function uploadPhoto(file: File) {
    if (!editing) return;
    if (!file.type.startsWith("image/")) {
      setPhotoMessage("Please choose an image file.");
      return;
    }

    setUploadingPhoto(true);
    setPhotoMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/family/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setPhotoMessage(data.error || "Failed to upload photo");
        return;
      }

      setEditing({ ...editing, photo: data.url });
      setPhotoMessage(`Uploaded (${data.sizeKb} KB, compressed)`);
    } catch {
      setPhotoMessage("Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  }

  function handlePhotoFiles(files: FileList | File[] | null | undefined) {
    const file = Array.from(files ?? []).find((item) =>
      item.type.startsWith("image/")
    );
    if (!file) {
      setPhotoMessage("Please drop or choose an image file.");
      return;
    }
    void uploadPhoto(file);
  }

  function updateMemberList(nextMember: FamilyMember) {
    setFamily((prev) => {
      const next = structuredClone(prev);
      const list = next[side][category];
      const index = list.findIndex((member) => member.id === nextMember.id);
      if (index === -1) {
        list.push(nextMember);
      } else {
        list[index] = nextMember;
      }
      return next;
    });
  }

  function removeMemberFromList(id: string) {
    setFamily((prev) => {
      const next = structuredClone(prev);
      next[side][category] = next[side][category].filter(
        (member) => member.id !== id
      );
      return next;
    });
  }

  async function saveMember() {
    if (!editing) return;
    setSaving(true);
    onMessage("");

    const payload = {
      name: editing.name.trim(),
      nameNe: editing.nameNe?.trim() ?? "",
      relation: editing.relation.trim(),
      relationNe: editing.relationNe?.trim() ?? "",
      photo: sanitizeFamilyPhotoUrl(editing.photo) ?? "",
      bio: editing.bio.trim(),
      bioNe: editing.bioNe?.trim() ?? "",
    };

    try {
      const res = isNew
        ? await fetch("/api/admin/family/members", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ side, category, member: payload }),
          })
        : await fetch(`/api/admin/family/members/${editing.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      const data = await res.json();
      if (!res.ok) {
        onMessage(data.error || "Failed to save family member");
        return;
      }

      updateMemberList(data.member);
      onMessage("Saved successfully");
      cancelEdit();
      scrollToList();
    } catch {
      onMessage("Failed to save family member");
    } finally {
      setSaving(false);
    }
  }

  async function deleteMember(id: string) {
    if (!confirm("Delete this family member? This cannot be undone.")) return;

    const res = await fetch(`/api/admin/family/members/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      removeMemberFromList(id);
      if (editing?.id === id) cancelEdit();
      onMessage("Deleted successfully");
    } else {
      const data = await res.json();
      onMessage(data.error || "Failed to delete");
    }
  }

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-2">
      <div ref={listRef} className={editing ? "max-lg:order-2" : undefined}>
        <div className="mb-4 flex flex-wrap gap-2">
          {(["prisca", "safal"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setSide(value);
                cancelEdit();
              }}
              className={`rounded-sm px-4 py-2 text-xs uppercase tracking-[0.12em] transition-colors ${
                side === value
                  ? value === "prisca"
                    ? "border-2 border-gold bg-gold/10 text-green"
                    : "border-2 border-green bg-green/10 text-green"
                  : "border border-gold/20 bg-white text-green/70 hover:bg-green/5"
              }`}
            >
              {value === "prisca" ? "Prisca's side" : "Safal's side"}
            </button>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap gap-2 border-b border-gold/15 pb-3">
          {categories.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setCategory(key);
                cancelEdit();
              }}
              className={`px-3 py-2 text-xs uppercase tracking-[0.1em] transition-colors ${
                category === key
                  ? "border-b-2 border-gold text-green"
                  : "text-[#1a1a1a]/50 hover:text-green"
              }`}
            >
              {categoryLabels[key]}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg text-green">
            {side === "prisca" ? "Bride's side" : "Groom's side"} ·{" "}
            {categoryLabels[category]}
          </h2>
          <button
            type="button"
            onClick={startAdd}
            className="rounded-sm bg-gold px-4 py-2 text-xs uppercase tracking-[0.12em] text-green transition-colors hover:bg-gold/90"
          >
            Add member
          </button>
        </div>

        <ul className="space-y-3">
          {members.length === 0 ? (
            <li className="rounded-sm border border-dashed border-gold/25 bg-white p-4 text-sm text-[#1a1a1a]/55">
              No members in this category yet.
            </li>
          ) : (
            members.map((member) => {
              const photoUrl = sanitizeFamilyPhotoUrl(member.photo);

              return (
              <li
                key={member.id}
                className="rounded-sm border border-gold/20 bg-white p-4"
              >
                <button
                  type="button"
                  onClick={() => startEdit(member)}
                  className="flex w-full items-start gap-3 text-left"
                >
                  {photoUrl ? (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gold/25 bg-green/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-dashed border-gold/25 bg-green/5 text-[10px] uppercase tracking-[0.08em] text-[#1a1a1a]/35">
                      Photo
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-green">
                      {member.name.trim() || member.relation}
                    </p>
                    {member.name.trim() && (
                      <p className="mt-0.5 text-sm text-[#1a1a1a]/60">
                        {member.relation}
                      </p>
                    )}
                    {member.nameNe?.trim() && (
                      <p className="mt-1 text-sm text-green/75">{member.nameNe}</p>
                    )}
                    {member.relationNe?.trim() && (
                      <p className="text-sm text-[#1a1a1a]/45">
                        {member.relationNe}
                      </p>
                    )}
                    {member.bio?.trim() && (
                      <p className="mt-1 line-clamp-2 text-xs text-[#1a1a1a]/45">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </button>

                <div className="mt-3 flex gap-2 border-t border-gold/10 pt-3">
                  <button
                    type="button"
                    onClick={() => startEdit(member)}
                    className="min-h-[44px] flex-1 rounded-sm border border-gold/30 bg-gold/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-green transition-colors hover:bg-gold/20"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMember(member.id)}
                    className="min-h-[44px] flex-1 rounded-sm border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-red-600/80 transition-colors hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
            })
          )}
        </ul>
      </div>

      {editing && (
        <div
          ref={formRef}
          className="max-lg:order-1 rounded-sm border border-gold/25 bg-white p-5 md:p-6 lg:sticky lg:top-6 lg:self-start"
        >
          <h2 className="font-serif text-lg text-green">
            {isNew ? "New family member" : `Edit: ${editing.name || editing.relation}`}
          </h2>

          <div className="mt-5 space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-gold">
              English
            </p>

            <Field label="Name (English)">
              <input
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
                placeholder="Optional if relation is enough"
                className={inputClass}
              />
            </Field>

            <Field label="Relationship (English)" required>
              <input
                required
                value={editing.relation}
                onChange={(e) =>
                  setEditing({ ...editing, relation: e.target.value })
                }
                placeholder="Father, Mother, Cousin…"
                className={inputClass}
              />
            </Field>

            <Field label="Bio (English)">
              <textarea
                value={editing.bio}
                onChange={(e) =>
                  setEditing({ ...editing, bio: e.target.value })
                }
                rows={4}
                className={inputClass}
              />
            </Field>

            <p className="pt-2 text-xs font-bold uppercase tracking-[0.12em] text-gold">
              Nepali
            </p>

            <Field label="Name (Nepali)">
              <input
                value={editing.nameNe ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, nameNe: e.target.value })
                }
                className={inputClass}
              />
            </Field>

            <Field label="Relationship (Nepali)">
              <input
                value={editing.relationNe ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, relationNe: e.target.value })
                }
                className={inputClass}
              />
            </Field>

            <Field label="Bio (Nepali)">
              <textarea
                value={editing.bioNe ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, bioNe: e.target.value })
                }
                rows={4}
                className={inputClass}
              />
            </Field>

            <Field label="Photo">
              <div className="flex items-start gap-4">
                {sanitizeFamilyPhotoUrl(editing.photo) ? (
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-gold/25 bg-green/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sanitizeFamilyPhotoUrl(editing.photo)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-dashed border-gold/30 bg-green/5 text-center text-[10px] uppercase tracking-[0.08em] text-[#1a1a1a]/40">
                    No photo
                  </div>
                )}

                <div className="min-w-0 flex-1 space-y-2">
                  <div
                    onDragEnter={(e) => {
                      e.preventDefault();
                      setPhotoDragActive(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setPhotoDragActive(false);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      setPhotoDragActive(false);
                      handlePhotoFiles(e.dataTransfer.files);
                    }}
                    className={`rounded-sm border border-dashed px-4 py-5 text-center transition-colors ${
                      photoDragActive
                        ? "border-gold bg-gold/10"
                        : "border-gold/30 bg-green/5"
                    }`}
                  >
                    <label className="inline-block cursor-pointer rounded-sm border border-gold/30 bg-gold/10 px-4 py-2 text-xs uppercase tracking-[0.12em] text-green transition-colors hover:bg-gold/20">
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        disabled={uploadingPhoto}
                        onChange={(e) => {
                          handlePhotoFiles(e.target.files);
                          e.target.value = "";
                        }}
                      />
                      {uploadingPhoto ? "Compressing…" : "Choose photo"}
                    </label>
                    <p className="mt-2 text-xs text-[#1a1a1a]/45">
                      or drag and drop an image here
                    </p>
                  </div>

                  {sanitizeFamilyPhotoUrl(editing.photo) && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditing({ ...editing, photo: "" });
                        setPhotoMessage("");
                      }}
                      className="block text-xs uppercase tracking-[0.1em] text-red-600/70 hover:text-red-600"
                    >
                      Remove photo
                    </button>
                  )}

                  {photoMessage && (
                    <p
                      className={`text-xs ${
                        photoMessage.includes("Failed")
                          ? "text-red-600"
                          : "text-green/60"
                      }`}
                    >
                      {photoMessage}
                    </p>
                  )}

                  <p className="text-xs text-[#1a1a1a]/40">
                    Use upload only — desktop file paths will not work on the
                    website. Photos are resized to 512×512 and saved as WebP.
                  </p>
                </div>
              </div>
            </Field>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={saveMember}
              disabled={saving}
              className="rounded-sm bg-green px-5 py-2.5 text-xs uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-green/90 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-sm border border-gold/30 px-5 py-2.5 text-xs uppercase tracking-[0.12em] text-green/70 transition-colors hover:border-gold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
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

const inputClass =
  "w-full rounded-sm border border-gold/25 px-3 py-2 text-sm outline-none focus:border-gold";
