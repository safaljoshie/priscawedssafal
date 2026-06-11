"use client";

import { useEffect, useState } from "react";
import { wedding } from "@/lib/wedding";

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

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    getTimeLeft(wedding.date)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(wedding.date));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return (
      <p className="relative mt-10 font-serif text-lg italic text-gold">
        The day has arrived!
      </p>
    );
  }

  return (
    <div className="relative mt-10 grid grid-cols-4 gap-3">
      {units.map(({ key, label }) => (
        <div
          key={key}
          className="flex flex-col items-center rounded-sm border border-gold/20 bg-white/60 px-2 py-3 backdrop-blur-sm"
        >
          <span className="font-serif text-2xl text-green">
            {String(timeLeft[key]).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-wider text-[#1a1a1a]/45">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
