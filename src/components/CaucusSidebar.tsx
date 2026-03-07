"use client";

import { useState } from "react";

type Mood = "supporting" | "neutral" | "opposing";

export type Country = {
  name: string;
  mood: Mood;
};

type CaucusSidebarProps = {
  countries: Country[];
};

const moodLabel: Record<Mood, string> = {
  supporting: "Supporting",
  neutral: "Neutral",
  opposing: "Opposing",
};

const moodClass: Record<Mood, string> = {
  supporting: "mood-dot mood-agree",
  neutral: "mood-dot mood-neutral",
  opposing: "mood-dot mood-hostile",
};

export function CaucusSidebar({ countries }: CaucusSidebarProps) {
  const [openSections, setOpenSections] = useState<Record<Mood, boolean>>({
    supporting: true,
    neutral: true,
    opposing: true,
  });

  const byMood: Record<Mood, Country[]> = {
    supporting: countries.filter((c) => c.mood === "supporting"),
    neutral: countries.filter((c) => c.mood === "neutral"),
    opposing: countries.filter((c) => c.mood === "opposing"),
  };

  const toggle = (mood: Mood) =>
    setOpenSections((prev) => ({ ...prev, [mood]: !prev[mood] }));

  return (
    <aside className="sidebar sidebar-left" aria-label="Caucus map">
      <h2 className="panel-title">Caucus Map</h2>

      <div className="space-y-3">
        {(Object.keys(byMood) as Mood[]).map((mood) => (
          <section key={mood} className="border-b border-slate-800/70 pb-2 last:border-b-0">
            <button
              type="button"
              onClick={() => toggle(mood)}
              className="flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
            >
              <span>
                {mood === "supporting"
                  ? "Supporting Bloc"
                  : mood === "neutral"
                  ? "Neutral Bloc"
                  : "Opposition Bloc"}
              </span>
              <span className="text-[0.65rem] text-slate-500">
                {openSections[mood] ? "Hide" : "Show"} · {byMood[mood].length}
              </span>
            </button>
            {openSections[mood] && (
              <div className="mt-2 space-y-1">
                {byMood[mood].map((c) => (
                  <div key={c.name} className="state-row">
                    <div className={moodClass[mood]} aria-hidden />
                    <div className="state-meta">
                      <div className="state-name">{c.name}</div>
                      <div className="state-block">{moodLabel[mood]}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="coalitions mt-3">
        <h3 className="subheading">World View</h3>
        <div className="heatmap-card">
          <div className="heatmap-placeholder">
            <span className="heatmap-label">World Map (placeholder)</span>
            <span className="heatmap-sub">
              Regions will glow based on support once AI logic is connected.
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

