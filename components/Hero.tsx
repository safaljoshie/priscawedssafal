"use client";

import type { WeddingData } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import {
  heroCityClass,
  heroDateBoxPaddingClass,
  heroDateBoxWidthClass,
  heroDateClass,
  heroCountdownPositionClass,
  heroDiscoverClass,
  heroDiscoverIconSize,
  heroDiscoverPositionClass,
  heroSaveTheDateClass,
} from "@/lib/i18n/heroTypography";
import { formatWeddingDateDisplay } from "@/lib/i18n/nepaliDate";
import { Countdown } from "./Countdown";

export function Hero({ wedding }: { wedding: WeddingData }) {
  const { couple, dateDisplay, dateRange, location, countdownDate } = wedding;
  const { locale, t } = useLanguage();

  const displayDate = formatWeddingDateDisplay(locale, dateDisplay, dateRange);
  const displayCity = locale === "ne" ? t.location.city : location.city;
  const isNepali = locale === "ne";

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      <div
        className="hero-bg absolute inset-0 bg-cover bg-center bg-no-repeat"
        role="img"
        aria-label={`${couple.bride} and ${couple.groom}`}
      />
      <div className="absolute inset-0 bg-black/20" aria-hidden />

      <div className="relative z-10 min-h-screen">
        <div
          className={`absolute left-1/2 top-[calc(37%-2cm+5mm)] w-full -translate-x-1/2 -translate-y-full px-6 text-center md:top-[calc(39%-2cm+5mm)] ${heroDateBoxWidthClass(locale)}`}
        >
          <div
            className={`glass flex flex-col gap-0 ${heroDateBoxPaddingClass(locale)}`}
          >
            <p className={`text-wedding ${heroSaveTheDateClass(locale)}`}>
              {t.hero.saveTheDate}
            </p>
            <p className={`text-wedding ${heroDateClass(locale)}`}>
              {displayDate}
            </p>
            <p className={`text-wedding ${heroCityClass(locale)}`}>
              {displayCity}
            </p>
          </div>
        </div>

        <div className={heroCountdownPositionClass()}>
          <Countdown countdownDate={countdownDate} />
        </div>

        <div className={heroDiscoverPositionClass()}>
          <a
            href="#details"
            className={`glass flex flex-col items-center gap-2 rounded-2xl px-4 py-2 text-wedding transition-colors hover:bg-white/40 hover:text-wedding/80 ${heroDiscoverClass(locale)} ${isNepali ? "px-6 py-3 md:px-8 md:py-4" : "px-5 py-3 md:px-6 md:py-3.5"}`}
          >
            <span>{t.hero.discoverMore}</span>
            <svg
              width={heroDiscoverIconSize(locale)}
              height={heroDiscoverIconSize(locale)}
              viewBox="0 0 20 20"
              fill="none"
              className="animate-bounce"
              aria-hidden
            >
              <path
                d="M10 4v12M5 11l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
