import type { SessionProgress } from "./types";

const STORAGE_KEY = "dyslexia_trainer_progress";

export const defaultProgress = (): SessionProgress => ({
  practiced: 0,
  correctMeaningChecks: 0,
  trickyIds: [],
  sessionTotal: 0,
});

export function loadProgress(): SessionProgress {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return JSON.parse(raw) as SessionProgress;
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress: SessionProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage unavailable — silently ignore
  }
}

export function clearProgress(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable — silently ignore
  }
}

export function markPracticed(
  progress: SessionProgress,
  correct: boolean,
  cardId: string
): SessionProgress {
  return {
    ...progress,
    practiced: progress.practiced + 1,
    correctMeaningChecks: correct
      ? progress.correctMeaningChecks + 1
      : progress.correctMeaningChecks,
  };
}

export function toggleTricky(
  progress: SessionProgress,
  cardId: string
): SessionProgress {
  const isTricky = progress.trickyIds.includes(cardId);
  return {
    ...progress,
    trickyIds: isTricky
      ? progress.trickyIds.filter((id) => id !== cardId)
      : [...progress.trickyIds, cardId],
  };
}
