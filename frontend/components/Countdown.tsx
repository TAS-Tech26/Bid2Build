"use client";

import { useEffect, useState } from "react";

export default function Countdown() {
  const targetDate = new Date("2026-08-29T09:00:00+05:30");

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, "0"),
        hours: String(
          Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        ).padStart(2, "0"),
        minutes: String(
          Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        ).padStart(2, "0"),
        seconds: String(
          Math.floor((distance % (1000 * 60)) / 1000)
        ).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const Item = ({
    value,
    label,
  }: {
    value: string;
    label: string;
  }) => (
    <div className="flex flex-col items-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
        <span className="text-4xl font-bold">{value}</span>
      </div>

      <span className="mt-3 text-sm uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
    </div>
  );

  return (
    <div className="mt-8 flex justify-center gap-6">
      <Item value={timeLeft.days} label="Days" />
      <Item value={timeLeft.hours} label="Hours" />
      <Item value={timeLeft.minutes} label="Mins" />
      <Item value={timeLeft.seconds} label="Secs" />
    </div>
  );
}