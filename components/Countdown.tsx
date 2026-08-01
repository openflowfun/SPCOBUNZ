"use client";

import { useEffect, useState } from "react";

function diff(target: number) {
  const d = Math.max(0, target - Date.now());
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d / 3600000) % 24),
    minutes: Math.floor((d / 60000) % 60),
    seconds: Math.floor((d / 1000) % 60),
  };
}

export default function Countdown({ targetISO, dark = false }: { targetISO: string; dark?: boolean }) {
  const target = new Date(targetISO).getTime();
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { label: "Days", value: t?.days },
    { label: "Hours", value: t?.hours },
    { label: "Minutes", value: t?.minutes },
    { label: "Seconds", value: t?.seconds },
  ];

  return (
    <div className="flex gap-3 sm:gap-5" role="timer" aria-label="Countdown to the Gala Dinner Dance">
      {units.map((u) => (
        <div
          key={u.label}
          className={`flex min-w-[70px] flex-col items-center rounded-2xl border px-3 py-4 backdrop-blur-sm sm:min-w-[90px] sm:px-5 sm:py-5 ${
            dark
              ? "border-gold/25 bg-white/[0.04]"
              : "border-navy-800/10 bg-white shadow-card"
          }`}
        >
          <span
            className={`font-serif text-3xl tabular-nums sm:text-4xl ${
              dark ? "gold-text" : "text-navy-800"
            }`}
          >
            {t ? String(u.value).padStart(2, "0") : "--"}
          </span>
          <span
            className={`mt-1 text-[10px] uppercase tracking-widest2 ${
              dark ? "text-white/50" : "text-navy-800/50"
            }`}
          >
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
