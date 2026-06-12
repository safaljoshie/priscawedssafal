"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-white/25 bg-white/20 p-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md md:text-xs"
      role="group"
      aria-label="Language"
    >
      {(["en", "ne"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLocale(lang)}
          className={`rounded-full px-2.5 py-1 transition-colors md:px-3 md:py-1.5 ${
            locale === lang
              ? "bg-wedding/90 text-white shadow-sm"
              : "text-black hover:bg-white/15 hover:text-wedding"
          }`}
          aria-pressed={locale === lang}
        >
          {lang === "en" ? "EN" : "ने"}
        </button>
      ))}
    </div>
  );
}
