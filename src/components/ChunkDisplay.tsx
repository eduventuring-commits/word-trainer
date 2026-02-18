"use client";

import { useState, useCallback } from "react";
import { useSpeech } from "@/hooks/useSpeech";
import { getWordData } from "@/lib/wordData";
import type { WordCard } from "@/lib/types";

export type ChunkMode = "sound" | "morpheme";

interface ChunkDisplayProps {
  card: WordCard;
  mode: ChunkMode;   // controlled externally by session page
}

// ─── Morpheme meaning lookup ──────────────────────────────────────────────────
// Keyed by the bare morpheme text (lowercase, no dashes).
// Covers all roots, prefixes, and suffixes in the dataset.

const MORPHEME_MEANINGS: Record<string, string> = {
  // roots
  port:   "carry",
  vis:    "see",
  vid:    "see",
  rupt:   "break",
  scrib:  "write",
  script: "write",
  dict:   "say / tell",
  struct: "build",
  act:    "do",
  form:   "shape",
  mit:    "send",
  miss:   "send",
  aud:    "hear",
  spec:   "look",
  spect:  "look",
  fer:    "carry",
  // prefixes
  trans:  "across",
  re:     "again",
  un:     "not",
  pre:    "before",
  dis:    "not / apart",
  im:     "not",
  "in":   "not / into",
  sub:    "under",
  inter:  "between",
  ex:     "out",
  con:    "together",
  com:    "together",
  de:     "down / away",
  pro:    "forward",
  // suffixes
  tion:   "act of",
  sion:   "act of",
  ment:   "result of",
  ness:   "state of",
  ful:    "full of",
  less:   "without",
  able:   "able to be",
  ible:   "able to be",
  er:     "one who",
  or:     "one who",
  ly:     "in a ___ way",
  ist:    "person who",
  ous:    "full of",
  ion:    "act of",
  ation:  "act of",
  ition:  "act of",
  ive:    "tending to",
  ity:    "state of",
  al:     "relating to",
  ic:     "relating to",
  ize:    "to make",
  ise:    "to make",
};

function getMorphemeMeaning(text: string): string | null {
  const key = text.toLowerCase().replace(/^[-\s]+|[-\s]+$/g, "");
  return MORPHEME_MEANINGS[key] ?? null;
}

// ─── Fallback parsers ─────────────────────────────────────────────────────────

function parseSyllablesFromNotes(notes: string, word: string): string[] | null {
  if (!notes) return null;
  const match = notes.match(/(?:syllables?:\s+)?([a-z]+(?:\s*\|\s*[a-z]+)+)/i);
  if (!match) return null;
  const parts = match[1].split("|").map((s) => s.trim()).filter(Boolean);
  if (parts.length < 2) return null;
  if (parts.join("").toLowerCase() !== word.toLowerCase()) return null;
  let pos = 0;
  return parts.map((p) => {
    const chunk = word.slice(pos, pos + p.length);
    pos += p.length;
    return chunk;
  });
}

function stripDashes(s: string): string {
  return s.replace(/^[-\s]+|[-\s]+$/g, "").toLowerCase();
}

function getMorphemeFallback(card: WordCard): Array<{ text: string; role: string }> {
  const word = card.word;
  const w = word.toLowerCase();
  const morphemes: Array<{ key: string; role: string }> = [];
  if (card.prefix) morphemes.push({ key: stripDashes(card.prefix), role: "prefix" });
  if (card.root)   morphemes.push({ key: stripDashes(card.root).split(/[/\\]/)[0].trim(), role: "root" });
  if (card.suffix) morphemes.push({ key: stripDashes(card.suffix), role: "suffix" });
  if (morphemes.length === 0) return [{ text: word, role: "root" }];
  const pieces: Array<{ text: string; role: string }> = [];
  let remaining = word, rLow = w;
  for (const { key, role } of morphemes) {
    const idx = rLow.indexOf(key);
    if (idx === -1) return [{ text: word, role: "root" }];
    if (idx > 0) pieces.push({ text: remaining.slice(0, idx), role: "root" });
    pieces.push({ text: remaining.slice(idx, idx + key.length), role });
    remaining = remaining.slice(idx + key.length);
    rLow = rLow.slice(idx + key.length);
  }
  if (remaining.length > 0) pieces.push({ text: remaining, role: "suffix" });
  return pieces;
}

// ─── Speech text normaliser ───────────────────────────────────────────────────

const SPEECH_OVERRIDES: Record<string, string> = {
  tion:  "shun",
  sion:  "shun",
  ition: "ish-un",
  ation: "ay-shun",
  ble:   "bul",
  cle:   "kul",
  ence:  "ents",
  ance:  "ants",
  ough:  "oh",
};

function toSpeechText(chunk: string): string {
  const key = chunk.toLowerCase();
  if (SPEECH_OVERRIDES[key]) return SPEECH_OVERRIDES[key];
  if (key === "ion") return "yun";
  return chunk;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function SpeakerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" width="12" height="12"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" style={{ flexShrink: 0 }}
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

// ─── Color palettes ───────────────────────────────────────────────────────────

const SOUND_COLORS = [
  { bg: "#e8f4fd", color: "#1565c0", border: "#90caf9" },
  { bg: "#f3e5f5", color: "#6a1b9a", border: "#ce93d8" },
  { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
  { bg: "#fff8e1", color: "#e65100", border: "#ffcc80" },
  { bg: "#fce4ec", color: "#ad1457", border: "#f48fb1" },
];

const ROLE_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  prefix: { bg: "#e8f4fd", color: "#1565c0", border: "#90caf9" },
  root:   { bg: "#f3e5f5", color: "#6a1b9a", border: "#ce93d8" },
  suffix: { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
};

// ─── Compact Chip ─────────────────────────────────────────────────────────────

interface ChipProps {
  text: string;
  soundCue?: string;
  meaning?: string | null;   // for morpheme view — shown below chip
  sublabel: string;
  colorSet: { bg: string; color: string; border: string };
  onSpeak: (t: string) => void;
  speaking: boolean;
  showMeaning?: boolean;
}

function Chip({ text, soundCue, meaning, sublabel, colorSet, onSpeak, speaking, showMeaning }: ChipProps) {
  const [active, setActive] = useState(false);

  const handleClick = useCallback(() => {
    setActive(true);
    onSpeak(toSpeechText(text));
    setTimeout(() => setActive(false), 600);
  }, [text, onSpeak]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
      {/* Tappable chip */}
      <button
        onClick={handleClick}
        disabled={speaking}
        aria-label={`Hear: ${text}`}
        title={`Tap to hear "${text}"`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "6px 14px",
          background: active ? colorSet.color : colorSet.bg,
          color: active ? "#fff" : colorSet.color,
          border: `2px solid ${colorSet.border}`,
          borderRadius: "var(--radius-lg)",
          cursor: speaking ? "not-allowed" : "pointer",
          transition: "background 120ms ease, color 120ms ease, transform 100ms ease",
          transform: active ? "scale(0.95)" : "scale(1)",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-lg)",
          fontWeight: 700,
          letterSpacing: "0.03em",
          minWidth: "2.5rem",
          whiteSpace: "nowrap",
        }}
      >
        {text}
        <SpeakerIcon />
      </button>

      {/* Sound cue badge (syllable mode) */}
      {soundCue && !showMeaning && (
        <span style={{
          fontFamily: "var(--font-ui)",
          fontSize: "0.68rem",
          fontWeight: 700,
          color: colorSet.color,
          background: colorSet.bg,
          border: `1px solid ${colorSet.border}`,
          borderRadius: "var(--radius-pill)",
          padding: "1px 6px",
        }}>
          {soundCue}
        </span>
      )}

      {/* Morpheme meaning (morpheme mode) */}
      {showMeaning && meaning && (
        <span style={{
          fontFamily: "var(--font-ui)",
          fontSize: "0.72rem",
          fontWeight: 700,
          color: colorSet.color,
          textAlign: "center",
          letterSpacing: "0.01em",
        }}>
          {meaning}
        </span>
      )}

      {/* Role label (small, muted) */}
      <span style={{
        fontFamily: "var(--font-ui)",
        fontSize: "0.58rem",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: colorSet.color,
        opacity: 0.5,
      }}>
        {sublabel}
      </span>
    </div>
  );
}

// ─── Dot separator ────────────────────────────────────────────────────────────

function Dot() {
  return (
    <span aria-hidden="true" style={{
      color: "var(--color-text-muted)",
      fontSize: "var(--text-lg)",
      fontWeight: 400,
      paddingBottom: "20px",
      userSelect: "none",
    }}>·</span>
  );
}

// ─── Sound view ───────────────────────────────────────────────────────────────

function SoundView({ card, speak, speaking }: { card: WordCard; speak: (t: string) => void; speaking: boolean }) {
  const data = getWordData(card.word);
  let syllables: string[];
  let cues: string[] | null = null;

  if (data) {
    syllables = data.syllables;
    cues = data.soundCues;
  } else {
    syllables = parseSyllablesFromNotes(card.decoding_notes, card.word) ?? [card.word];
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
        Tap each syllable to hear it, then blend together
      </p>
      <div
        role="group"
        aria-label={`${card.word} broken into syllables`}
        style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "center", gap: "var(--space-2)" }}
      >
        {syllables.map((syl, i) => (
          <span key={i} style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-2)" }}>
            {i > 0 && <Dot />}
            <Chip
              text={syl}
              soundCue={cues ? cues[i] : undefined}
              sublabel={`syllable ${i + 1}`}
              colorSet={SOUND_COLORS[i % SOUND_COLORS.length]}
              onSpeak={speak}
              speaking={speaking}
              showMeaning={false}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Morpheme view ────────────────────────────────────────────────────────────

function MorphemeView({ card, speak, speaking }: { card: WordCard; speak: (t: string) => void; speaking: boolean }) {
  const data = getWordData(card.word);

  let morphemes: Array<{ text: string; role: string; cue?: string; meaning: string | null }>;

  if (data) {
    morphemes = data.morphemes.map((m, i) => ({
      text: m,
      role: data.morphRoles[i] ?? "root",
      cue: data.morphCues[i],
      meaning: getMorphemeMeaning(m),
    }));
  } else {
    morphemes = getMorphemeFallback(card).map((m) => ({
      text: m.text,
      role: m.role,
      meaning: getMorphemeMeaning(m.text),
    }));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
        Tap each word part — the meaning is shown below
      </p>
      <div
        role="group"
        aria-label={`${card.word} broken into word parts`}
        style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "center", gap: "var(--space-2)" }}
      >
        {morphemes.map((m, i) => {
          const colorSet = ROLE_COLORS[m.role] ?? ROLE_COLORS.root;
          return (
            <span key={i} style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-2)" }}>
              {i > 0 && <Dot />}
              <Chip
                text={m.text}
                soundCue={m.cue}
                meaning={m.meaning}
                sublabel={m.role}
                colorSet={colorSet}
                onSpeak={speak}
                speaking={speaking}
                showMeaning={true}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
// Mode is controlled by the parent (session page) via the `mode` prop.
// This component only renders the panel content — no buttons inside.

export default function ChunkDisplay({ card, mode }: ChunkDisplayProps) {
  const { speak, speaking } = useSpeech();

  if (mode === "sound") {
    return (
      <div style={{
        padding: "var(--space-4)",
        background: "#f0f7ff",
        borderRadius: "var(--radius-md)",
        border: "1.5px solid #90caf9",
      }}>
        <SoundView card={card} speak={speak} speaking={speaking} />
      </div>
    );
  }

  if (mode === "morpheme") {
    return (
      <div style={{
        padding: "var(--space-4)",
        background: "#faf0ff",
        borderRadius: "var(--radius-md)",
        border: "1.5px solid #ce93d8",
      }}>
        <MorphemeView card={card} speak={speak} speaking={speaking} />
      </div>
    );
  }

  return null;
}
