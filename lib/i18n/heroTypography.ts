import type { Locale } from "./messages";

/** +4 Tailwind steps vs default English hero text */
export function heroDateBoxWidthClass(locale: Locale): string {
  return locale === "ne"
    ? "max-w-[340px] md:max-w-[400px]"
    : "max-w-[340px] md:max-w-[400px]";
}

export function heroDateBoxPaddingClass(locale: Locale): string {
  return locale === "ne"
    ? "rounded-2xl px-6 py-4 md:px-10 md:py-7"
    : "rounded-2xl px-6 py-4 md:px-8 md:py-6";
}

export function heroSaveTheDateClass(locale: Locale): string {
  return locale === "ne"
    ? "font-serif text-xl font-extrabold tracking-wide md:text-2xl"
    : "font-serif text-lg font-extrabold uppercase tracking-[0.3em] md:text-xl";
}

export function heroDateClass(locale: Locale): string {
  return locale === "ne"
    ? "font-serif text-xl font-extrabold md:text-2xl"
    : "font-serif text-2xl font-extrabold md:text-3xl";
}

export function heroCityClass(locale: Locale): string {
  return locale === "ne"
    ? "font-serif text-base font-extrabold tracking-wide md:text-lg"
    : "font-serif text-base font-extrabold tracking-wide md:text-lg";
}

export function heroDiscoverClass(locale: Locale): string {
  return locale === "ne"
    ? "font-serif text-xl font-bold tracking-wide md:text-2xl"
    : "text-base font-bold uppercase tracking-[0.25em] md:text-lg";
}

export function heroCountdownGridClass(locale: Locale): string {
  return locale === "ne"
    ? "max-w-2xl md:max-w-3xl"
    : "max-w-lg md:max-w-xl";
}

export function heroCountdownValueClass(locale: Locale): string {
  return locale === "ne"
    ? "font-serif text-4xl font-extrabold md:text-5xl"
    : "font-serif text-2xl font-extrabold md:text-4xl";
}

export function heroCountdownLabelClass(locale: Locale): string {
  return locale === "ne"
    ? "font-serif text-base font-extrabold tracking-normal md:text-lg"
    : "font-serif text-[10px] font-extrabold uppercase tracking-wider md:text-xs";
}

export function heroCountdownArrivedClass(locale: Locale): string {
  return locale === "ne"
    ? "font-serif text-2xl font-extrabold md:text-3xl"
    : "font-serif text-lg font-extrabold md:text-xl";
}

export function heroDiscoverIconSize(locale: Locale): number {
  return locale === "ne" ? 28 : 24;
}
