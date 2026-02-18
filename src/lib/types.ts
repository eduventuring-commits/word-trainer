// ─── Dataset types ────────────────────────────────────────────────────────────

export type GradeBand = "3-4" | "5-6" | "7-8";
export type Focus = "Roots" | "Prefixes" | "Suffixes" | "Mixed";

export interface RootEntry {
  root: string;
  meaning: string;
  examples: string[];
  notes: string;
}

export interface PrefixEntry {
  prefix: string;
  meaning: string;
  examples: string[];
  notes: string;
}

export interface SuffixEntry {
  suffix: string;
  meaning: string;
  part_of_speech_effect: string;
  examples: string[];
  notes: string;
}

export interface WordCard {
  id: string;
  word: string;
  prefix: string | null;
  root: string | null;
  suffix: string | null;
  student_friendly_meaning: string;
  part_of_speech: string;
  grade_band: GradeBand;
  decoding_notes: string;
  example_sentence: string;
  distractor_meanings: string[];
}

export interface MorphologyDataset {
  roots: RootEntry[];
  prefixes: PrefixEntry[];
  suffixes: SuffixEntry[];
  wordCards: WordCard[];
}

// ─── Session / progress types ─────────────────────────────────────────────────

export interface SessionConfig {
  gradeBand: GradeBand | "All";
  focus: Focus;
}

export interface SessionProgress {
  practiced: number;
  correctMeaningChecks: number;
  trickyIds: string[];
  sessionTotal: number;
}

// ─── Quiz types ───────────────────────────────────────────────────────────────

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}
