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

function CountdownGrid({ timeLeft }: { timeLeft: TimeLeft }) {
  return (
    <div className="relative mt-10 grid w-full max-w-md grid-cols-4 gap-3 md:mt-12 md:max-w-lg md:gap-4">
      {units.map(({ key, label }) => (
        <div
          key={key}
          className="glass flex flex-col items-center rounded-2xl px-2 py-3 md:px-4 md:py-5"
        >
          <span className="font-serif text-2xl font-bold text-black md:text-4xl">
            {String(timeLeft[key]).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-black md:text-xs">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Countdown({ countdownDate }: { countdownDate: string }) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

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
      />
    );
  }

  if (!timeLeft) {
    return (
      <p className="glass relative mt-10 rounded-2xl px-6 py-4 font-serif text-lg font-bold text-black md:text-xl">
        The day has arrived!
      </p>
    );
  }

  return <CountdownGrid timeLeft={timeLeft} />;
}
