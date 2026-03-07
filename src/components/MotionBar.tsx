"use client";

type MotionBarProps = {
  onMotionCaucus?: () => void;
  onPointOfOrder?: () => void;
  onYieldTime?: () => void;
  onAdjourn?: () => void;
  disabled?: boolean;
};

export function MotionBar({
  onMotionCaucus,
  onPointOfOrder,
  onYieldTime,
  onAdjourn,
  disabled,
}: MotionBarProps) {
  return (
    <section className="floor-controls" aria-label="Motions and points of order">
      <div className="primary-actions">
        <button
          type="button"
          className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onMotionCaucus}
          disabled={disabled}
          title="Request a focused speaking list on a specific sub-topic."
        >
          Motion for Moderated Caucus
        </button>
      </div>
      <div className="secondary-actions">
        <button
          type="button"
          className="btn btn-ghost disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onPointOfOrder}
          disabled={disabled}
          title="Raise a procedural error or violation of the rules."
        >
          Point of Order
        </button>
        <button
          type="button"
          className="btn btn-ghost disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onYieldTime}
          disabled={disabled}
          title="Yield remaining speaking time according to the rules."
        >
          Yield Time
        </button>
        <button
          type="button"
          className="btn btn-ghost disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onAdjourn}
          disabled={disabled}
          title="Move to adjourn the meeting for the session."
        >
          Motion to Adjourn
        </button>
      </div>
    </section>
  );
}

