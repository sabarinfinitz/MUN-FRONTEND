"use client";

import { Timer } from "@/components/Timer";
import { PRESET_TOPICS, type Delegate } from "@/lib/mockData";

type HeaderDaisProps = {
  committeeName: string;
  topic: string;
  currentMotion: string;
  delegates: Delegate[];
  recognizedDelegateId: string | null;
  onRecognizeDelegate: (delegateId: string) => void;
  onTimerExpire?: () => void;
  onRandomTopic: () => void;
  customTopicDraft: string;
  onCustomTopicDraftChange: (value: string) => void;
  onProceedWithCustomTopic: () => void;
};

export function HeaderDais({
  committeeName,
  topic,
  currentMotion,
  delegates,
  recognizedDelegateId,
  onRecognizeDelegate,
  onTimerExpire,
  onRandomTopic,
  customTopicDraft,
  onCustomTopicDraftChange,
  onProceedWithCustomTopic,
}: HeaderDaisProps) {
  const recognized = delegates.find((d) => d.id === recognizedDelegateId);
  const chairStatus = recognized
    ? `The Delegate of ${recognized.name} has the floor. Please keep remarks within 60 seconds.`
    : "AI Chair is selecting the next speaker.";

  return (
    <header className="dais sticky top-0 z-20 border-b border-slate-700/80 bg-slate-900/95 backdrop-blur-sm">
      <div className="committee-info">
        <h1 className="committee-title">{committeeName}</h1>
        <p className="committee-subtitle">Agenda: {topic}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRandomTopic}
            className="rounded border border-slate-600 bg-slate-800 px-2 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700"
            title="Chair picks a random preset topic"
          >
            Random topic
          </button>
          <input
            type="text"
            value={customTopicDraft}
            onChange={(e) => onCustomTopicDraftChange(e.target.value)}
            placeholder="Or type your own topic"
            className="max-w-[200px] rounded border border-slate-600 bg-slate-800 px-2 py-1 text-xs text-slate-200 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            aria-label="Custom topic"
          />
          <button
            type="button"
            onClick={onProceedWithCustomTopic}
            disabled={!customTopicDraft.trim()}
            className="rounded border border-sky-600 bg-sky-800 px-2 py-1 text-xs font-medium text-sky-100 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Proceed with this topic as the agenda"
          >
            Proceed with topic
          </button>
        </div>
      </div>

      <div className="committee-status">
        <div className="status-item">
          <span className="status-label">Current Motion</span>
          <span className="status-value">{currentMotion}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Speaker Timer</span>
          <Timer
            key={recognizedDelegateId ?? "floor-open"}
            totalSeconds={60}
            isActive={!!recognizedDelegateId}
            onExpire={onTimerExpire}
          />
        </div>
      </div>

      <div className="chair-block flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-4">
        <div className="chair-controls flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
            AI Chair recognizes
          </span>
          <select
            className="chair-select rounded-md border border-slate-600 bg-slate-800/90 px-3 py-1.5 text-sm text-slate-200 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            value={recognizedDelegateId ?? ""}
            onChange={(e) => {
              const id = e.target.value;
              if (id) onRecognizeDelegate(id);
            }}
            aria-label="AI Chair selects next speaker"
            title="AI Chair selects which delegate has the floor next."
          >
            <option value="">— AI Chair: select next speaker —</option>
            {delegates.map((d) => (
              <option key={d.id} value={d.id}>
                Delegate of {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="chair flex items-center gap-2">
          <div className="chair-avatar flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-sky-400/60 bg-gradient-to-br from-sky-600 to-slate-800 text-sm font-semibold text-white shadow-lg">
            SG
          </div>
          <div className="chair-text min-w-0 max-w-[14rem]">
            <div className="chair-role text-[0.7rem] font-semibold uppercase tracking-widest text-slate-400">
              AI Chair
            </div>
            <div className="chair-line text-sm text-slate-200">{chairStatus}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
