"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type {
  GalleryData,
  GalleryEventId,
  GalleryPhoto,
  GalleryReel,
} from "@/lib/types";
import { isGalleryEnabled } from "@/lib/galleryVisibility";
import { isImageUploadFile } from "@/lib/familyPhotoUrl";
import { preparePhotoForUpload } from "@/lib/preparePhotoUpload";

type Props = {
  initialGallery: GalleryData;
  onMessage: (message: string) => void;
};

type CategoryTab =
  | GalleryEventId
  | "reels";

const CATEGORIES: { key: CategoryTab; label: string }[] = [
  { key: "mehendi", label: "Mehendi" },
  { key: "wedding-day", label: "Wedding Day" },
  { key: "ganesh-sagun", label: "Sagun & Ganesh" },
  { key: "reception", label: "Reception" },
  { key: "reels", label: "Reels & Videos" },
];

const REEL_EVENT_OPTIONS: { key: GalleryEventId; label: string }[] = [
  { key: "mehendi", label: "Mehendi" },
  { key: "wedding-day", label: "Wedding Day" },
  { key: "ganesh-sagun", label: "Sagun & Ganesh" },
  { key: "reception", label: "Reception" },
];

export function GalleryAdmin({ initialGallery, onMessage }: Props) {
  const [gallery, setGallery] = useState(initialGallery);
  const [savingVisibility, setSavingVisibility] = useState(false);
  const [category, setCategory] = useState<CategoryTab>("mehendi");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const [reelTitle, setReelTitle] = useState("");
  const [reelTitleNe, setReelTitleNe] = useState("");
  const [reelDuration, setReelDuration] = useState("");
  const [reelVideoUrl, setReelVideoUrl] = useState("");
  const [reelEvent, setReelEvent] = useState<GalleryEventId>("wedding-day");
  const [reelThumb, setReelThumb] = useState("");
  const [savingReel, setSavingReel] = useState(false);

  const enabled = isGalleryEnabled(gallery);
  const isReels = category === "reels";
  const categoryPhotos = isReels
    ? []
    : gallery.photos.filter((photo) => photo.event === category);

  useEffect(() => {
    setGallery(initialGallery);
  }, [initialGallery]);

  async function toggleEnabled() {
    const next = !enabled;
    setSavingVisibility(true);
    onMessage("");

    try {
      const res = await fetch("/api/admin/gallery/visibility", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: next }),
      });
      const data = await res.json();

      if (!res.ok) {
        onMessage(data.error || "Failed to update gallery visibility");
        return;
      }

      setGallery((prev) => ({ ...prev, enabled: data.enabled }));
      onMessage(
        data.enabled
          ? "Gallery is now visible on the site"
          : "Gallery is now hidden from the site"
      );
    } catch {
      onMessage("Failed to update gallery visibility");
    } finally {
      setSavingVisibility(false);
    }
  }

  async function uploadPhotos(files: FileList | File[] | null | undefined) {
    if (isReels) return;

    const images = Array.from(files ?? []).filter((file) =>
      isImageUploadFile(file)
    );
    if (images.length === 0) {
      setUploadMessage("Please choose JPG, PNG, or HEIC images.");
      return;
    }

    setUploading(true);
    onMessage("");
    let added = 0;

    try {
      for (const [index, file] of images.entries()) {
        setUploadMessage(
          `Uploading ${index + 1} of ${images.length}: ${file.name}…`
        );
        const prepared = await preparePhotoForUpload(file);
        const formData = new FormData();
        formData.append("file", prepared);
        formData.append("event", category);
        formData.append("altEn", file.name.replace(/\.[^.]+$/, ""));

        const res = await fetch("/api/admin/gallery/upload", {
          method: "POST",
          body: formData,
          credentials: "same-origin",
        });
        const data = await res.json();

        if (!res.ok) {
          setUploadMessage(data.error || `Failed to upload ${file.name}`);
          onMessage(data.error || `Failed to upload ${file.name}`);
          return;
        }

        if (data.photo) {
          setGallery((prev) => ({
            ...prev,
            photos: [data.photo as GalleryPhoto, ...prev.photos],
          }));
          added += 1;
        }
      }

      setUploadMessage(
        added === 1
          ? "Photo uploaded to gallery"
          : `${added} photos uploaded to gallery`
      );
      onMessage(
        added === 1
          ? "Gallery photo uploaded"
          : `${added} gallery photos uploaded`
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload photos";
      setUploadMessage(message);
      onMessage(message);
    } finally {
      setUploading(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  }

  async function deletePhoto(id: string) {
    if (!confirm("Remove this photo from the gallery?")) return;

    const res = await fetch(`/api/admin/gallery/photos/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      onMessage(data.error || "Failed to delete photo");
      return;
    }

    setGallery((prev) => ({
      ...prev,
      photos: prev.photos.filter((photo) => photo.id !== id),
    }));
    onMessage("Photo removed");
  }

  async function uploadReelThumb(file: File) {
    if (!isImageUploadFile(file)) {
      onMessage("Please choose a JPG, PNG, or HEIC image for the thumbnail.");
      return;
    }

    setUploading(true);
    try {
      const prepared = await preparePhotoForUpload(file);
      const formData = new FormData();
      formData.append("file", prepared);
      formData.append("saveAsPhoto", "false");

      const res = await fetch("/api/admin/gallery/upload", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });
      const data = await res.json();
      if (!res.ok) {
        onMessage(data.error || "Failed to upload thumbnail");
        return;
      }
      setReelThumb(data.url);
      onMessage("Reel thumbnail uploaded");
    } catch {
      onMessage("Failed to upload thumbnail");
    } finally {
      setUploading(false);
      if (thumbInputRef.current) thumbInputRef.current.value = "";
    }
  }

  async function addReel() {
    if (!reelTitle.trim()) {
      onMessage("Reel title is required");
      return;
    }

    setSavingReel(true);
    onMessage("");
    try {
      const res = await fetch("/api/admin/gallery/reels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: reelEvent,
          titleEn: reelTitle.trim(),
          titleNe: reelTitleNe.trim() || reelTitle.trim(),
          duration: reelDuration.trim() || "0:00",
          videoUrl: reelVideoUrl.trim() || undefined,
          thumb: reelThumb || undefined,
          color: "#2c3e2d",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        onMessage(data.error || "Failed to add reel");
        return;
      }

      setGallery((prev) => ({
        ...prev,
        reels: [data.reel as GalleryReel, ...prev.reels],
      }));
      setReelTitle("");
      setReelTitleNe("");
      setReelDuration("");
      setReelVideoUrl("");
      setReelThumb("");
      onMessage("Reel added to gallery");
    } catch {
      onMessage("Failed to add reel");
    } finally {
      setSavingReel(false);
    }
  }

  async function deleteReel(id: string) {
    if (!confirm("Remove this reel from the gallery?")) return;

    const res = await fetch(`/api/admin/gallery/reels/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      onMessage(data.error || "Failed to delete reel");
      return;
    }

    setGallery((prev) => ({
      ...prev,
      reels: prev.reels.filter((reel) => reel.id !== id),
    }));
    onMessage("Reel removed");
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="max-w-lg rounded-sm border border-gold/25 bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-gold">
          Show on website
        </p>
        <p className="mt-2 text-sm text-[#1a1a1a]/65">
          When off, Gallery is removed from navigation and the public page is
          unavailable.
        </p>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          disabled={savingVisibility}
          onClick={() => void toggleEnabled()}
          className={`mt-4 flex min-h-[44px] w-full items-center justify-between gap-2 rounded-sm px-3 py-3 text-left transition-colors disabled:opacity-60 ${
            enabled
              ? "border-2 border-gold bg-gold/10 text-green"
              : "border border-gold/20 bg-white text-[#1a1a1a]/45"
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-[0.08em]">
            Gallery page
          </span>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${
              enabled
                ? "bg-gold text-green"
                : "bg-[#1a1a1a]/10 text-[#1a1a1a]/45"
            }`}
          >
            {enabled ? "On" : "Off"}
          </span>
        </button>
      </div>

      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-gold">
          Upload by category
        </p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setCategory(item.key);
                setUploadMessage("");
              }}
              className={`rounded-sm px-3 py-2 text-xs uppercase tracking-[0.1em] transition-colors ${
                category === item.key
                  ? "bg-green text-ivory"
                  : "border border-green/20 bg-white text-green/70 hover:bg-green/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {!isReels && (
        <div className="rounded-sm border border-gold/25 bg-white p-4">
          <p className="text-sm font-medium text-green">
            {CATEGORIES.find((item) => item.key === category)?.label} photos
          </p>
          <p className="mt-1 text-xs text-[#1a1a1a]/55">
            Upload JPG, PNG, or HEIC. Photos are compressed automatically.
          </p>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*,.heic,.heif"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => void uploadPhotos(e.target.files)}
          />

          <div
            onDragEnter={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              void uploadPhotos(e.dataTransfer.files);
            }}
            className={`mt-4 flex min-h-[140px] flex-col items-center justify-center gap-3 rounded-sm border-2 border-dashed px-4 py-8 text-center transition-colors ${
              dragActive
                ? "border-gold bg-gold/10"
                : "border-gold/30 bg-ivory/40"
            }`}
          >
            <button
              type="button"
              disabled={uploading}
              onClick={() => photoInputRef.current?.click()}
              className="min-h-[44px] rounded-sm bg-green px-5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-ivory disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "Upload from computer"}
            </button>
            <p className="text-xs text-[#1a1a1a]/50">
              Or drag and drop photos here
            </p>
          </div>

          {uploadMessage && (
            <p className="mt-3 text-sm text-green">{uploadMessage}</p>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {categoryPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-sm border border-gold/20 bg-[#f7f7f7]"
              >
                <div className="relative aspect-square">
                  {photo.src || photo.thumb ? (
                    <Image
                      src={photo.thumb || photo.src!}
                      alt={photo.alt.en}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-wider text-white/70"
                      style={{ background: photo.color ?? "#2c3e2d" }}
                    >
                      Placeholder
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => void deletePhoto(photo.id)}
                  className="absolute right-1.5 top-1.5 rounded-sm bg-black/65 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {categoryPhotos.length === 0 && (
            <p className="mt-4 text-sm text-[#1a1a1a]/45">
              No photos in this category yet.
            </p>
          )}
        </div>
      )}

      {isReels && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-sm border border-gold/25 bg-white p-4">
            <p className="text-sm font-medium text-green">Add reel / video</p>
            <p className="mt-1 text-xs text-[#1a1a1a]/55">
              Paste a YouTube or Vimeo link. Optional thumbnail upload.
            </p>

            <div className="mt-4 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-[0.1em] text-green/70">
                Title (English)
                <input
                  value={reelTitle}
                  onChange={(e) => setReelTitle(e.target.value)}
                  className="mt-1 w-full rounded-sm border border-gold/25 px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[#1a1a1a]"
                  placeholder="Wedding Highlights"
                />
              </label>
              <label className="block text-xs font-bold uppercase tracking-[0.1em] text-green/70">
                Title (Nepali)
                <input
                  value={reelTitleNe}
                  onChange={(e) => setReelTitleNe(e.target.value)}
                  className="mt-1 w-full rounded-sm border border-gold/25 px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[#1a1a1a]"
                  placeholder="विवाह हाइलाइट्स"
                />
              </label>
              <label className="block text-xs font-bold uppercase tracking-[0.1em] text-green/70">
                Event
                <select
                  value={reelEvent}
                  onChange={(e) =>
                    setReelEvent(e.target.value as GalleryEventId)
                  }
                  className="mt-1 w-full rounded-sm border border-gold/25 px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[#1a1a1a]"
                >
                  {REEL_EVENT_OPTIONS.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-bold uppercase tracking-[0.1em] text-green/70">
                Duration
                <input
                  value={reelDuration}
                  onChange={(e) => setReelDuration(e.target.value)}
                  className="mt-1 w-full rounded-sm border border-gold/25 px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[#1a1a1a]"
                  placeholder="2:34"
                />
              </label>
              <label className="block text-xs font-bold uppercase tracking-[0.1em] text-green/70">
                Video URL
                <input
                  value={reelVideoUrl}
                  onChange={(e) => setReelVideoUrl(e.target.value)}
                  className="mt-1 w-full rounded-sm border border-gold/25 px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[#1a1a1a]"
                  placeholder="https://youtube.com/…"
                />
              </label>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-green/70">
                  Thumbnail (optional)
                </p>
                <input
                  ref={thumbInputRef}
                  type="file"
                  accept="image/*,.heic,.heif"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void uploadReelThumb(file);
                  }}
                />
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => thumbInputRef.current?.click()}
                    className="min-h-[40px] rounded-sm border border-green/30 px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-green disabled:opacity-60"
                  >
                    {uploading ? "Uploading…" : "Upload thumb"}
                  </button>
                  {reelThumb && (
                    <span className="truncate text-xs text-[#1a1a1a]/50">
                      Thumbnail ready
                    </span>
                  )}
                </div>
                {reelThumb && (
                  <div className="relative mt-3 h-20 w-20 overflow-hidden rounded-sm border border-gold/20">
                    <Image
                      src={reelThumb}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={savingReel}
                onClick={() => void addReel()}
                className="min-h-[44px] w-full rounded-sm bg-green px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-ivory disabled:opacity-60"
              >
                {savingReel ? "Saving…" : "Add reel"}
              </button>
            </div>
          </div>

          <div className="rounded-sm border border-gold/25 bg-white p-4">
            <p className="text-sm font-medium text-green">
              Reels ({gallery.reels.length})
            </p>
            <div className="mt-4 space-y-3">
              {gallery.reels.map((reel) => (
                <div
                  key={reel.id}
                  className="flex items-center gap-3 rounded-sm border border-gold/15 bg-ivory/30 p-3"
                >
                  <div
                    className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm"
                    style={{ background: reel.color ?? "#2c3e2d" }}
                  >
                    {reel.thumb ? (
                      <Image
                        src={reel.thumb}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#1a1a1a]">
                      {reel.title.en}
                    </p>
                    <p className="text-xs text-[#1a1a1a]/50">
                      {reel.duration}
                      {reel.videoUrl ? " · link set" : " · no video URL"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void deleteReel(reel.id)}
                    className="shrink-0 text-xs font-bold uppercase tracking-wider text-wedding"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {gallery.reels.length === 0 && (
                <p className="text-sm text-[#1a1a1a]/45">No reels yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
