"use client";

type ChairLineProps = {
  text: string;
  timestamp: string;
};

export function ChairLine({ text, timestamp }: ChairLineProps) {
  return (
    <div className="dialogue-bubble-wrapper flex items-end gap-2">
      <div className="dialogue-avatar flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-sky-600 bg-slate-800 text-lg font-bold text-sky-300">
        SG
      </div>
      <div className="dialogue-bubble-group min-w-0 flex-1">
        <div className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-sky-400">
          AI Chair
        </div>
        <div className="dialogue-bubble relative rounded-2xl rounded-bl-md border border-sky-600/50 bg-slate-800/80 px-4 py-3">
          <p className="text-sm leading-relaxed text-slate-200">{text}</p>
          <p className="mt-1 text-xs text-slate-500">{timestamp}</p>
          <div
            className="dialogue-tail absolute -left-1 bottom-2 h-3 w-3 rotate-45 border-b border-l border-sky-600/50 bg-slate-800/80"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
