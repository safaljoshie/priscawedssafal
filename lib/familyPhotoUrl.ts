function isAllowedFamilyPhotoUrl(url: string): boolean {
  if (/^\/api\/family\/photos\/[0-9a-f-]+\.webp$/i.test(url)) return true;
  if (/^\/images\/family\/[0-9a-f-]+\.webp$/i.test(url)) return true;
  if (url.startsWith("/images/")) return true;
  if (url.startsWith("https://")) return true;
  return false;
}

const IMAGE_FILE_PATTERN = /\.(jpe?g|png|gif|webp|heic|heif|bmp|avif)$/i;

export function isImageUploadFile(file: Pick<File, "name" | "type">): boolean {
  if (file.type.startsWith("image/")) return true;
  return IMAGE_FILE_PATTERN.test(file.name);
}

export function sanitizeFamilyPhotoUrl(photo?: string): string | undefined {
  if (!photo?.trim()) return undefined;

  const value = photo.trim();

  if (
    value.includes("/Users/") ||
    value.includes("/home/") ||
    value.includes("\\") ||
    value.startsWith("file://") ||
    /^[A-Za-z]:\\/.test(value)
  ) {
    return undefined;
  }

  for (const candidate of value.split(/\s+/)) {
    if (isAllowedFamilyPhotoUrl(candidate)) return candidate;
  }

  return undefined;
}

export function sanitizeFamilyMemberBio(bio?: string): string {
  const value = bio?.trim() ?? "";
  if (!value) return "";

  const pathMatches = value.match(
    /(?:\/Users\/|\/home\/|[A-Za-z]:\\)[^\s]+\.(?:png|jpe?g|webp|gif)/gi
  );
  if (
    pathMatches &&
    pathMatches.join(" ").length >= Math.min(value.length, 40)
  ) {
    return "";
  }

  return value;
}
