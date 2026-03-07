"use client";

import { useEffect, useState } from "react";

type TimerProps = {
  totalSeconds: number;
  isActive?: boolean;
  onExpire?: () => void;
};

export function Timer({ totalSeconds, isActive = true, onExpire }: TimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (!isActive) return;
    if (remaining <= 0) return;

    const id = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          if (onExpire) setTimeout(() => onExpire(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [isActive, remaining, onExpire]);

  const minutes = Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (remaining % 60).toString().padStart(2, "0");
  const percent =
    totalSeconds > 0 ? Math.max(0, Math.min(100, (remaining / totalSeconds) * 100)) : 0;

  const expired = remaining <= 0;

  return (
    <div className="relative">
      <div
        className="timer-bar overflow-hidden"
        aria-label="Speaker timer"
        aria-valuemin={0}
        aria-valuemax={totalSeconds}
        aria-valuenow={remaining}
        role="progressbar"
      >
        <div
          className={`timer-bar-fill ${expired ? "animate-gavel" : ""}`}
          style={{ width: `${percent}%` }}
        />
        <span className="timer-text">
          {minutes}:{seconds} / {Math.floor(totalSeconds / 60)
            .toString()
            .padStart(2, "0")}
          :
          {(totalSeconds % 60).toString().padStart(2, "0")}
        </span>
      </div>
      {expired && (
        <div className="pointer-events-none absolute -bottom-6 right-0 rounded-full border border-sky-300/60 bg-sky-900/90 px-3 py-0.5 text-xs font-medium text-sky-100 shadow-lg shadow-sky-900/80">
          Gavel — Time elapsed
        </div>
      )}
    </div>
  );
}

