import type { Locale } from "./messages";
import type { WeddingUpdate } from "@/lib/types";

export function getLocalizedUpdate(
  update: WeddingUpdate,
  locale: Locale
): { title: string; body: string } {
  if (locale === "en") {
    return { title: update.title, body: update.body };
  }

  return {
    title: update.titleNe?.trim() || update.title,
    body: update.bodyNe?.trim() || update.body,
  };
}
