"use client";

export type VoteOption = "supporting" | "neutral" | "opposing";

type VotingPanelProps = {
  visible: boolean;
  motionLabel: string;
  onVote: (vote: VoteOption) => void;
};

export function VotingPanel({ visible, motionLabel, onVote }: VotingPanelProps) {
  if (!visible) return null;

  return (
    <section
      className="rounded-xl border border-slate-600 bg-slate-800/95 p-4"
      aria-label="Vote on motion"
    >
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-300">
        Vote: {motionLabel}
      </h3>
      <p className="mb-3 text-xs text-slate-500">
        Select your vote. Supporting = For, Neutral = Abstain, Opposition = Against.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onVote("supporting")}
          className="rounded-lg border-2 border-green-600/80 bg-green-900/50 px-4 py-2 text-sm font-medium text-green-200 hover:bg-green-800/60"
          aria-label="Vote For (Supporting)"
        >
          Supporting (For)
        </button>
        <button
          type="button"
          onClick={() => onVote("neutral")}
          className="rounded-lg border-2 border-amber-600/80 bg-amber-900/40 px-4 py-2 text-sm font-medium text-amber-200 hover:bg-amber-800/50"
          aria-label="Vote Abstain (Neutral)"
        >
          Neutral (Abstain)
        </button>
        <button
          type="button"
          onClick={() => onVote("opposing")}
          className="rounded-lg border-2 border-red-600/80 bg-red-900/40 px-4 py-2 text-sm font-medium text-red-200 hover:bg-red-800/50"
          aria-label="Vote Against (Opposition)"
        >
          Opposition (Against)
        </button>
      </div>
    </section>
  );
}
