"use client";

import { useEffect, useState } from "react";

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

const units: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
];

export function Countdown({ countdownDate }: { countdownDate: string }) {
  const target = new Date(countdownDate);

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    getTimeLeft(target)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdownDate]);

  if (!timeLeft) {
    return (
      <p className="relative mt-10 font-serif text-lg italic text-gold md:text-xl">
        The day has arrived!
      </p>
    );
  }

  return (
    <div className="relative mt-10 grid w-full max-w-md grid-cols-4 gap-3 md:mt-12 md:max-w-lg md:gap-4">
      {units.map(({ key, label }) => (
        <div
          key={key}
          className="flex flex-col items-center rounded-sm border border-gold/20 bg-white/60 px-2 py-3 backdrop-blur-sm md:px-4 md:py-5"
        >
          <span className="font-serif text-2xl text-green md:text-4xl">
            {String(timeLeft[key]).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-wider text-[#1a1a1a]/45 md:text-xs">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
