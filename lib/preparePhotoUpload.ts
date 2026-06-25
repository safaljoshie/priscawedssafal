const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.88;
const FALLBACK_MAX_BYTES = 4 * 1024 * 1024;

export async function preparePhotoForUpload(file: File): Promise<File> {
  if (file.type === "image/gif") {
    throw new Error("GIF photos are not supported. Please use JPG or PNG.");
  }

  try {
    const bitmap = await createImageBitmap(file);
    const longest = Math.max(bitmap.width, bitmap.height);
    const scale = longest > MAX_EDGE ? MAX_EDGE / longest : 1;
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      throw new Error("Could not prepare image");
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) =>
          result
            ? resolve(result)
            : reject(new Error("Could not compress image")),
        "image/jpeg",
        JPEG_QUALITY
      );
    });

    const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
    return new File([blob], `${baseName}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    if (file.size <= FALLBACK_MAX_BYTES) {
      return file;
    }

    throw new Error(
      "This photo is too large or could not be read. Try a JPG or PNG under 4MB."
    );
  }
}
