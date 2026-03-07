"use client";

import { useState } from "react";
import { mockDelegates, DELEGATE_FLAGS } from "@/lib/mockData";

type CountrySelectScreenProps = {
  onSelect: (delegateId: string) => void;
};

export function CountrySelectScreen({ onSelect }: CountrySelectScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 px-4">
      <h1 className="mb-1 text-xl font-semibold tracking-tight text-slate-100">
        The Digital Diplomat
      </h1>
      <p className="mb-8 text-sm text-slate-400">
        Choose the country you will represent
      </p>

      <div className="grid w-full max-w-md grid-cols-2 gap-3 sm:grid-cols-3">
        {mockDelegates.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setSelectedId(d.id)}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-4 transition-all ${
              selectedId === d.id
                ? "border-sky-500 bg-sky-900/40 text-sky-100"
                : "border-slate-700 bg-slate-800/60 text-slate-200 hover:border-slate-600 hover:bg-slate-800"
            }`}
          >
            <span className="text-3xl" aria-hidden>
              {DELEGATE_FLAGS[d.id] ?? "🏳️"}
            </span>
            <span className="text-center text-sm font-medium">{d.name}</span>
          </button>
        ))}
      </div>

      <p className="mt-6 text-xs text-slate-500">
        You can upload a profile photo later in settings.
      </p>

      <button
        type="button"
        onClick={() => selectedId && onSelect(selectedId)}
        disabled={!selectedId}
        className="mt-8 rounded-full bg-sky-600 px-8 py-3 font-medium text-white hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Enter the floor
      </button>
    </div>
  );
}
