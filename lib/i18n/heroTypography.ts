import type { Locale } from "./messages";

/** +4 Tailwind steps vs default English hero text */
export function heroDateBoxWidthClass(locale: Locale): string {
  return locale === "ne"
    ? "max-w-[340px] md:max-w-[400px]"
    : "max-w-[340px] md:max-w-[400px]";
}

export function heroDateBoxPaddingClass(locale: Locale): string {
  return locale === "ne"
    ? "rounded-2xl px-6 pb-[0.8rem] pt-[0.58rem] md:px-10 md:pb-[1.4rem] md:pt-[1.13rem]"
    : "rounded-2xl px-6 pb-[0.8rem] pt-[0.58rem] md:px-8 md:pb-[1.2rem] md:pt-[0.97rem]";
}

export function heroSaveTheDateClass(locale: Locale): string {
  return locale === "ne"
    ? "font-serif text-2xl font-extrabold leading-none tracking-wide md:text-3xl"
    : "font-serif text-xl font-extrabold leading-none uppercase tracking-[0.28em] md:text-2xl";
}

export function heroDateClass(locale: Locale): string {
  return locale === "ne"
    ? "font-serif text-2xl font-extrabold leading-none md:text-3xl"
    : "font-serif text-xl font-extrabold leading-none md:text-2xl";
}

export function heroCityClass(locale: Locale): string {
  return locale === "ne"
    ? "font-serif text-lg font-extrabold leading-none tracking-wide md:text-xl"
    : "font-serif text-lg font-extrabold leading-none tracking-wide md:text-xl";
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

/** Hand / feet alignment on hero-couple photo */
export function heroCountdownPositionClass(): string {
  return "absolute inset-x-0 top-[calc(61%+1cm)] z-10 flex -translate-y-1/2 justify-center px-6 md:top-[calc(53%+2cm)]";
}

export function heroDiscoverPositionClass(): string {
  return "absolute inset-x-0 bottom-[3.5%] z-10 flex justify-center px-6 md:bottom-[4.5%]";
}
