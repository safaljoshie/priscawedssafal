import type { Locale } from "./messages";

/** +4 Tailwind steps vs default English hero text */
export function heroDateBoxWidthClass(locale: Locale): string {
  return locale === "ne"
    ? "max-w-[340px] md:max-w-[400px]"
    : "max-w-[340px] md:max-w-[400px]";
}

export function heroDateBoxPositionClass(locale: Locale): string {
  return locale === "ne"
    ? "top-[calc(37%-2cm+2mm)] md:top-[calc(39%-2cm+2mm)]"
    : "top-[calc(37%-2cm)] md:top-[calc(39%-2cm)]";
}

export function heroDateBoxPaddingClass(locale: Locale): string {
  return locale === "ne"
    ? "rounded-2xl px-6 pb-[0.8rem] pt-[0.58rem] md:px-10 md:pb-[1.4rem] md:pt-[1.13rem]"
    : "rounded-2xl px-6 pb-[0.8rem] pt-[0.58rem] md:px-8 md:pb-[1.2rem] md:pt-[0.97rem]";
}

export function heroSaveTheDateClass(locale: Locale): string {
  return locale === "ne"
    ? "font-serif text-base font-extrabold leading-none tracking-wide md:text-lg"
    : "font-serif text-lg font-extrabold leading-none uppercase tracking-[0.28em] md:text-xl";
}

export function heroDateClass(locale: Locale): string {
  return locale === "ne"
    ? "font-serif text-xl font-extrabold leading-none md:text-2xl"
    : "font-serif text-xl font-extrabold leading-none md:text-2xl";
}

export function heroCityClass(locale: Locale): string {
  return locale === "ne"
    ? "font-serif text-base font-extrabold leading-none tracking-wide md:text-lg"
    : "font-serif text-lg font-extrabold leading-none tracking-wide md:text-xl";
}

export function heroDiscoverClass(locale: Locale): string {
  return locale === "ne"
    ? "font-serif text-sm font-bold leading-tight tracking-wide md:text-base"
    : "text-sm font-bold uppercase tracking-[0.22em] md:text-base";
}

export function heroDiscoverPaddingClass(locale: Locale): string {
  return "gap-1.5 rounded-xl px-3.5 py-2 md:px-4 md:py-2.5";
}

export function heroCountdownGridClass(_locale: Locale): string {
  return "max-w-[512px] md:max-w-[576px]";
}

export function heroCountdownGapClass(_locale: Locale): string {
  return "gap-[12px] md:gap-[16px]";
}

export function heroCountdownCellPaddingClass(_locale: Locale): string {
  return "min-h-[72px] px-[10px] py-[9px] md:min-h-[80px] md:px-4 md:py-[12px]";
}

export function heroCountdownValueClass(locale: Locale): string {
  return locale === "ne"
    ? "font-serif text-3xl font-extrabold md:text-4xl"
    : "font-serif text-2xl font-extrabold md:text-4xl";
}

export function heroCountdownLabelClass(locale: Locale): string {
  return locale === "ne"
    ? "font-serif text-sm font-extrabold tracking-normal md:text-base"
    : "font-serif text-[10px] font-extrabold uppercase tracking-wider md:text-xs";
}

export function heroCountdownArrivedClass(locale: Locale): string {
  return locale === "ne"
    ? "font-serif text-xl font-extrabold md:text-2xl"
    : "font-serif text-lg font-extrabold md:text-xl";
}

export function heroDiscoverIconSize(_locale: Locale): number {
  return 19;
}

/** Hand / feet alignment on hero-couple photo */
export function heroCountdownPositionClass(): string {
  return "absolute inset-x-0 top-[calc(61%+1cm)] z-10 flex -translate-y-1/2 justify-center px-6 md:top-[calc(53%+2cm)]";
}

export function heroDiscoverPositionClass(): string {
  return "absolute inset-x-0 z-10 flex -translate-y-1/2 justify-center px-6 top-[calc(78%+1mm)] md:top-auto md:bottom-[calc(4.5%-3mm)] md:translate-y-0";
}
