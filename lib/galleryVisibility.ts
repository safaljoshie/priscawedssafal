import type { GalleryData } from "./types";

export function isGalleryEnabled(gallery: GalleryData): boolean {
  return gallery.enabled !== false;
}

export function normalizeGalleryEnabled(enabled?: boolean): boolean {
  return enabled !== false;
}
