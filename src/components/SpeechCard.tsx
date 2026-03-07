"use client";

import { DELEGATE_FLAGS } from "@/lib/mockData";

type SpeechCardProps = {
  delegateId?: string;
  country: string;
  flagLabel?: string;
  openingLine: string;
  timestamp: string;
  isActive?: boolean;
  onSpeak?: (text: string) => void;
  isSpeaking?: boolean;
};

export function SpeechCard({
  delegateId,
  country,
  flagLabel,
  openingLine,
  timestamp,
  isActive,
  onSpeak,
  isSpeaking,
}: SpeechCardProps) {
  const flag = delegateId ? DELEGATE_FLAGS[delegateId] : null;
  return (
    <article className="dialogue-bubble-wrapper flex items-end gap-2">
      <div
        className={`dialogue-avatar flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-slate-600 bg-slate-800 text-2xl ${
          isActive ? "border-sky-400 ring-2 ring-sky-400/40" : ""
        }`}
      >
        {flag ?? (flagLabel ?? country.slice(0, 2))}
      </div>
      <div className="dialogue-bubble-group min-w-0 flex-1">
        <div className="mb-0.5 flex items-center justify-between gap-2">
          <span className="speaker-name truncate text-sm font-semibold text-slate-200">
            {country}
          </span>
          <span className="speaker-meta shrink-0 text-xs text-slate-500">{timestamp}</span>
        </div>
        <div
          className={`dialogue-bubble relative rounded-2xl rounded-bl-md border px-4 py-3 ${
            isActive
              ? "border-sky-400/60 bg-slate-800/90 shadow-md shadow-sky-900/30"
              : "border-slate-600/80 bg-slate-800/70"
          }`}
        >
          <p className="speech-body text-sm leading-relaxed text-slate-200">{openingLine}</p>
          <div
            className="dialogue-tail absolute -left-1 bottom-2 h-3 w-3 rotate-45 border-b border-l border-slate-600/80 bg-slate-800/70"
            aria-hidden
          />
          {onSpeak && (
            <button
              type="button"
              onClick={() => onSpeak(openingLine)}
              disabled={isSpeaking}
              className="absolute right-2 top-2 rounded p-1 text-slate-400 hover:bg-slate-700/80 hover:text-sky-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title={isSpeaking ? "Speaking..." : "Read aloud"}
              aria-label={isSpeaking ? "Speaking" : "Read aloud"}
            >
              {isSpeaking ? (
                <span className="text-[10px] font-medium">Stop</span>
              ) : (
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                  <path d="M6.3 2.84A1.5 1.5 0 018 2h4a1.5 1.5 0 011.7 1.84l.83 2.5A1.5 1.5 0 0014.5 7h-9a1.5 1.5 0 00-1.03 2.66l.83-2.5z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

