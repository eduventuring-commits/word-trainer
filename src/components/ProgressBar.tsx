"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  correctCount: number;
}

export default function ProgressBar({
  current,
  total,
  correctCount,
}: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="progress-wrapper" role="region" aria-label="Session progress">
      <div className="progress-label">
        <span>
          Card {Math.min(current + 1, total)} of {total}
        </span>
        <span>
          {correctCount} correct
        </span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${pct}% complete`}
      >
        <div
          className="progress-fill"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
