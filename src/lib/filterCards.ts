import type { WordCard, GradeBand, Focus } from "./types";

const MIN_CARDS = 10;

/**
 * Filter word cards by grade band and focus.
 * Falls back to Mixed (all cards) if the filtered set has fewer than MIN_CARDS.
 */
export function filterCards(
  allCards: WordCard[],
  gradeBand: GradeBand | "All",
  focus: Focus
): WordCard[] {
  // Step 1: filter by grade band
  const byGrade =
    gradeBand === "All"
      ? allCards
      : allCards.filter((c) => c.grade_band === gradeBand);

  // Step 2: filter by focus
  const byFocus = applyFocusFilter(byGrade, focus);

  // Step 3: fall back if too few
  if (byFocus.length >= MIN_CARDS) return byFocus;

  // Fall back: try just the focus filter on ALL grades
  const focusFallback = applyFocusFilter(allCards, focus);
  if (focusFallback.length >= MIN_CARDS) return focusFallback;

  // Final fall back: return all cards (Mixed)
  return allCards;
}

function applyFocusFilter(cards: WordCard[], focus: Focus): WordCard[] {
  switch (focus) {
    case "Roots":
      return cards.filter((c) => c.root !== null);
    case "Prefixes":
      return cards.filter((c) => c.prefix !== null);
    case "Suffixes":
      return cards.filter((c) => c.suffix !== null);
    case "Mixed":
    default:
      return cards;
  }
}

/**
 * Build a randomised 4-option quiz for a given card.
 * Fills missing distractors from other cards' meanings to prevent duplicates.
 */
export function buildQuizOptions(
  card: WordCard,
  allCards: WordCard[]
): { text: string; isCorrect: boolean }[] {
  const correct = card.student_friendly_meaning;

  // Collect distractor pool — de-duplicate and exclude the correct answer
  const pool: string[] = [];
  const seen = new Set<string>([correct]);

  // Card's own distractors first
  for (const d of card.distractor_meanings) {
    if (!seen.has(d)) {
      pool.push(d);
      seen.add(d);
    }
  }

  // Fill from other cards if needed
  if (pool.length < 3) {
    for (const other of allCards) {
      if (other.id === card.id) continue;
      for (const d of other.distractor_meanings) {
        if (!seen.has(d)) {
          pool.push(d);
          seen.add(d);
          if (pool.length >= 3) break;
        }
      }
      if (pool.length >= 3) break;
    }
  }

  // Use up to 3 distractors
  const distractors = pool.slice(0, 3);

  const options = [
    { text: correct, isCorrect: true },
    ...distractors.map((d) => ({ text: d, isCorrect: false })),
  ];

  // Shuffle
  return shuffleArray(options);
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Shuffle and return word cards in a random order */
export function shuffleCards(cards: WordCard[]): WordCard[] {
  return shuffleArray(cards);
}
