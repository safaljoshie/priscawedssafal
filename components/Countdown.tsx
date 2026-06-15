"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import {
  heroCountdownArrivedClass,
  heroCountdownCellPaddingClass,
  heroCountdownGapClass,
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
  className = "",
}: {
  timeLeft: TimeLeft;
  labels: { key: keyof TimeLeft; label: string }[];
  locale: Locale;
  className?: string;
}) {
  return (
    <div
      className={`relative grid w-full grid-cols-4 ${heroCountdownGapClass(locale)} ${heroCountdownGridClass(locale)} ${className}`}
    >
      {labels.map(({ key, label }) => (
        <div
          key={key}
          className={`glass flex flex-col items-center justify-center rounded-2xl ${heroCountdownCellPaddingClass(locale)}`}
        >
          <span className={`text-wedding ${heroCountdownValueClass(locale)}`}>
            {formatCountdownValue(timeLeft[key], locale)}
          </span>
          <span className={`text-wedding ${heroCountdownLabelClass(locale)}`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Countdown({
  countdownDate,
  className = "",
}: {
  countdownDate: string;
  className?: string;
}) {
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
        className={className}
      />
    );
  }

  if (!timeLeft) {
    return (
      <p
        className={`glass relative rounded-2xl px-6 py-4 text-wedding ${heroCountdownArrivedClass(locale)} ${className}`}
      >
        {t.countdown.arrived}
      </p>
    );
  }

  return (
    <CountdownGrid
      timeLeft={timeLeft}
      labels={labels}
      locale={locale}
      className={className}
    />
  );
}
