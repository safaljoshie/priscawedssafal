"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import {
  heroCountdownArrivedClass,
  heroCountdownGridClass,
  heroCountdownLabelClass,
  heroCountdownValueClass,
} from "@/lib/i18n/heroTypography";
import { toDevanagariDigits } from "@/lib/i18n/nepaliDate";
import type { Locale } from "@/lib/i18n/messages";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function formatCountdownValue(value: number, locale: Locale): string {
  if (locale === "ne") return toDevanagariDigits(value, 2);
  return String(value).padStart(2, "0");
}

function CountdownGrid({
  timeLeft,
  labels,
  locale,
}: {
  timeLeft: TimeLeft;
  labels: { key: keyof TimeLeft; label: string }[];
  locale: Locale;
}) {
  const isNepali = locale === "ne";

  return (
    <div
      className={`relative mt-10 grid w-full grid-cols-4 gap-3 md:mt-12 md:gap-4 ${heroCountdownGridClass(locale)}`}
    >
      {labels.map(({ key, label }) => (
        <div
          key={key}
          className={`glass flex flex-col items-center rounded-2xl ${isNepali ? "px-3 py-4 md:px-5 md:py-6" : "px-3 py-4 md:px-5 md:py-5"}`}
        >
          <span className={`text-wedding ${heroCountdownValueClass(locale)}`}>
            {formatCountdownValue(timeLeft[key], locale)}
          </span>
          <span className={`mt-1 text-wedding ${heroCountdownLabelClass(locale)}`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Countdown({ countdownDate }: { countdownDate: string }) {
  const { locale, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  const labels: { key: keyof TimeLeft; label: string }[] = [
    { key: "days", label: t.countdown.days },
    { key: "hours", label: t.countdown.hours },
    { key: "minutes", label: t.countdown.minutes },
    { key: "seconds", label: t.countdown.seconds },
  ];

  useEffect(() => {
    const target = new Date(countdownDate);
    setMounted(true);

    const update = () => setTimeLeft(getTimeLeft(target));
    update();

    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [countdownDate]);

  if (!mounted) {
    return (
      <CountdownGrid
        timeLeft={{ days: 0, hours: 0, minutes: 0, seconds: 0 }}
        labels={labels}
        locale={locale}
      />
    );
  }

  if (!timeLeft) {
    return (
      <p
        className={`glass relative mt-10 rounded-2xl px-6 py-4 text-wedding ${heroCountdownArrivedClass(locale)}`}
      >
        {t.countdown.arrived}
      </p>
    );
  }

  return (
    <CountdownGrid timeLeft={timeLeft} labels={labels} locale={locale} />
  );
}
