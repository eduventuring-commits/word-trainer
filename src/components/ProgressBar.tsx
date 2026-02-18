"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  correctCount: number;
}

// Milestone messages triggered at specific correct-answer counts
const MILESTONES: Array<{ at: number; message: string }> = [
  { at: 1,  message: "🧠 Your brain is getting stronger!" },
  { at: 3,  message: "🌟 You solved 3 words! Keep going!" },
  { at: 5,  message: "🧠 You are training your reading muscles!" },
  { at: 7,  message: "🌟 7 words! You are on fire! 🔥" },
  { at: 10, message: "🏆 10 words! You are a word champion!" },
  { at: 15, message: "🌟 15 words! Super reader in the making! 🧠" },
  { at: 20, message: "🏆 20 words! Your reading superpowers are REAL! 💪" },
];

function getMilestoneMessage(correctCount: number): string | null {
  // Find the highest milestone that has been hit
  const hit = [...MILESTONES].reverse().find((m) => correctCount >= m.at);
  return hit ? hit.message : null;
}

export default function ProgressBar({
  current,
  total,
  correctCount,
}: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  const milestone = getMilestoneMessage(correctCount);

  return (
    <div className="progress-wrapper" role="region" aria-label="Session progress">
      <div className="progress-label">
        <span>
          Word {Math.min(current + 1, total)} of {total}
        </span>
        <span>
          ✅ {correctCount} correct
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

      {/* Milestone message — shown when a threshold is crossed */}
      {milestone && (
        <p
          aria-live="polite"
          style={{
            marginTop: "var(--space-2)",
            textAlign: "center",
            fontSize: "var(--text-xs)",
            fontWeight: 700,
            color: "var(--color-brand-dark)",
            letterSpacing: "0.01em",
          }}
        >
          {milestone}
        </p>
      )}
    </div>
  );
}
