"use client";

import { mockDelegates, DELEGATE_FLAGS } from "@/lib/mockData";

type RoundFloorSeatsProps = {
  userCountryId: string | null;
  currentSpeakerId: string | null;
};

const RADIUS = 140;
const SEATS = mockDelegates.length;

export function RoundFloorSeats({ userCountryId, currentSpeakerId }: RoundFloorSeatsProps) {
  return (
    <div className="round-floor relative mx-auto flex h-[320px] w-[320px] items-center justify-center">
      <div
        className="absolute h-full w-full rounded-full border-2 border-slate-600/80 bg-slate-800/30"
        aria-hidden
      />
      <div className="absolute text-sm font-medium uppercase tracking-wider text-slate-500">
        Floor
      </div>
      {mockDelegates.map((d, i) => {
        const angle = (i / SEATS) * 2 * Math.PI - Math.PI / 2;
        const x = Math.cos(angle) * RADIUS;
        const y = Math.sin(angle) * RADIUS;
        const isYou = d.id === userCountryId;
        const isSpeaking = d.id === currentSpeakerId;
        return (
          <div
            key={d.id}
            className="absolute flex flex-col items-center gap-1 transition-transform"
            style={{
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            }}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 text-2xl ${
                isSpeaking
                  ? "border-sky-400 bg-sky-900/60 ring-2 ring-sky-400/50"
                  : isYou
                    ? "border-amber-400 bg-amber-900/40"
                    : "border-slate-600 bg-slate-800/80"
              }`}
            >
              {DELEGATE_FLAGS[d.id] ?? "🏳️"}
            </div>
            <span
              className={`max-w-[72px] truncate text-center text-xs font-medium ${
                isYou ? "text-amber-200" : "text-slate-300"
              }`}
            >
              {d.name}
              {isYou ? " (You)" : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}
