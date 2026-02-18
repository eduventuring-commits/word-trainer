"use client";

import { useState, useCallback } from "react";
import { useSpeech } from "@/hooks/useSpeech";
import { getWordData } from "@/lib/wordData";
import type { WordCard } from "@/lib/types";

interface ChunkDisplayProps {
  card: WordCard;
}

// ─── Fallback parsers (used when word isn't in the static dictionary) ─────────

/** Extract teacher-authored pipe-delimited syllables from decoding_notes. */
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
// The Web Speech API reads isolated spelling chunks as standalone words.
// "tion" → "eye-on", "sion" → "see-on", "ble" → "bull" (sometimes), etc.
// We map problematic chunks to a phonetic equivalent BEFORE passing to speak().
// The displayed spelling on the chip is never changed — only what gets spoken.

const SPEECH_OVERRIDES: Record<string, string> = {
  // -tion / -sion endings
  tion:  "shun",
  sion:  "shun",
  ition: "ish-un",
  ation: "ay-shun",
  // -ble / -cle endings
  ble:   "bul",
  cle:   "kul",
  // Reduced/silent chunks
  ence:  "ents",
  ance:  "ants",
  // Vowel team chunks that read oddly in isolation
  ough:  "oh",   // default — context-specific overrides below
};

/**
 * Convert a spelling chunk into the text that should be passed to speechSynthesis.
 * Exact lowercase match → override; otherwise return the original text.
 */
function toSpeechText(chunk: string): string {
  const key = chunk.toLowerCase();
  // Exact match in override table
  if (SPEECH_OVERRIDES[key]) return SPEECH_OVERRIDES[key];

  // Chunks that END with a problematic suffix but have a consonant before it
  // e.g. "tion" inside "ac·tion" when the whole syllable is "tion" is handled above.
  // For a chunk like "shun" or "sion" embedded differently — handled by exact match.

  // -tion / -sion anywhere in chunk (e.g. morpheme chunk "ion")
  if (key === "ion") return "yun";

  return chunk;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function SpeakerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" width="13" height="13"
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

// ─── Chunk chip ───────────────────────────────────────────────────────────────

interface ChipProps {
  text: string;                             // spelling shown on button
  soundCue?: string;                        // e.g. "/tuh/" shown below
  sublabel: string;                         // e.g. "syllable 1" or "prefix"
  colorSet: { bg: string; color: string; border: string };
  onSpeak: (t: string) => void;
  speaking: boolean;
}

function Chip({ text, soundCue, sublabel, colorSet, onSpeak, speaking }: ChipProps) {
  const [active, setActive] = useState(false);

  const handleClick = useCallback(() => {
    setActive(true);
    onSpeak(toSpeechText(text));
    setTimeout(() => setActive(false), 700);
  }, [text, onSpeak]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
      {/* The tappable button — shows spelling + speaker icon */}
      <button
        onClick={handleClick}
        disabled={speaking}
        aria-label={`Hear: ${text}${soundCue ? ` (sounds like ${soundCue})` : ""}`}
        title={`Tap to hear "${text}"`}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "3px",
          padding: "var(--space-2) var(--space-4) 6px",
          background: active ? colorSet.color : colorSet.bg,
          color: active ? "#fff" : colorSet.color,
          border: `2px solid ${colorSet.border}`,
          borderRadius: "var(--radius-md)",
          cursor: speaking ? "not-allowed" : "pointer",
          transition: "background 120ms ease, color 120ms ease, transform 100ms ease",
          transform: active ? "scale(0.95)" : "scale(1)",
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-xl)",
          fontWeight: 700,
          letterSpacing: "0.03em",
          minWidth: "3rem",
        }}
      >
        <span>{text}</span>
        <SpeakerIcon />
      </button>

      {/* Sound cue — the pronunciation anchor */}
      {soundCue && (
        <span
          aria-label={`sounds like ${soundCue}`}
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: colorSet.color,
            letterSpacing: "0.02em",
            background: colorSet.bg,
            border: `1px solid ${colorSet.border}`,
            borderRadius: "var(--radius-pill)",
            padding: "1px 6px",
          }}
        >
          {soundCue}
        </span>
      )}

      {/* Role / position label */}
      <span
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: "0.6rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: colorSet.color,
          opacity: 0.6,
        }}
      >
        {sublabel}
      </span>
    </div>
  );
}

// ─── Separator ────────────────────────────────────────────────────────────────

function Dot() {
  return (
    <span aria-hidden="true" style={{
      color: "var(--color-text-muted)", fontSize: "var(--text-xl)",
      fontWeight: 400, paddingBottom: "var(--space-8)", userSelect: "none",
    }}>·</span>
  );
}

// ─── Sound view ───────────────────────────────────────────────────────────────

function SoundView({ card, speak, speaking }: { card: WordCard; speak: (t: string) => void; speaking: boolean }) {
  const data = getWordData(card.word);

  // Get syllables — prefer static data, fall back to notes parser, then whole word
  let syllables: string[];
  let cues: string[] | null = null;

  if (data) {
    syllables = data.syllables;
    cues = data.soundCues;
  } else {
    syllables = parseSyllablesFromNotes(card.decoding_notes, card.word) ?? [card.word];
  }

  const fromDictionary = !!data;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <p style={{ textAlign: "center", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
        Tap each syllable to hear it — then blend them together
      </p>

      <div
        role="group"
        aria-label={`${card.word} broken into syllables`}
        style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "center", gap: "var(--space-3)" }}
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
            />
          </span>
        ))}
      </div>

      <p style={{ textAlign: "center", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontStyle: "italic" }}>
        Now say the whole word: <strong>{card.word}</strong>
      </p>

      {!fromDictionary && (
        <p style={{ textAlign: "center", fontSize: "0.65rem", color: "var(--color-text-muted)", opacity: 0.7 }}>
          * Sound cues not available for this word
        </p>
      )}
    </div>
  );
}

// ─── Meaning view ─────────────────────────────────────────────────────────────

function MeaningView({ card, speak, speaking }: { card: WordCard; speak: (t: string) => void; speaking: boolean }) {
  const data = getWordData(card.word);

  // Build morpheme list — prefer static data (has role + cues), fall back to card data
  let morphemes: Array<{ text: string; role: string; cue?: string }>;

  if (data) {
    morphemes = data.morphemes.map((m, i) => ({
      text: m,
      role: data.morphRoles[i] ?? "root",
      cue: data.morphCues[i],
    }));
  } else {
    morphemes = getMorphemeFallback(card).map((m) => ({ text: m.text, role: m.role }));
  }

  const hasData = !!(card.prefix || card.root || card.suffix);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <p style={{ textAlign: "center", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
        Tap each word part to hear it
      </p>

      <div
        role="group"
        aria-label={`${card.word} broken into meaningful parts`}
        style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "center", gap: "var(--space-3)" }}
      >
        {morphemes.map((m, i) => {
          const colorSet = ROLE_COLORS[m.role] ?? ROLE_COLORS.root;
          return (
            <span key={i} style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-2)" }}>
              {i > 0 && <Dot />}
              <Chip
                text={m.text}
                soundCue={m.cue}
                sublabel={m.role}
                colorSet={colorSet}
                onSpeak={speak}
                speaking={speaking}
              />
            </span>
          );
        })}
      </div>

      {/* Morpheme label pills */}
      {hasData && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", justifyContent: "center" }}>
          {card.prefix && (
            <span style={{ padding: "2px var(--space-3)", background: "#e8f4fd", color: "#1565c0", border: "1.5px solid #90caf9", borderRadius: "var(--radius-pill)", fontSize: "var(--text-xs)", fontWeight: 600 }}>
              {card.prefix} = prefix
            </span>
          )}
          {card.root && (
            <span style={{ padding: "2px var(--space-3)", background: "#f3e5f5", color: "#6a1b9a", border: "1.5px solid #ce93d8", borderRadius: "var(--radius-pill)", fontSize: "var(--text-xs)", fontWeight: 600 }}>
              {card.root} = root
            </span>
          )}
          {card.suffix && (
            <span style={{ padding: "2px var(--space-3)", background: "#e8f5e9", color: "#2e7d32", border: "1.5px solid #a5d6a7", borderRadius: "var(--radius-pill)", fontSize: "var(--text-xs)", fontWeight: 600 }}>
              {card.suffix} = suffix
            </span>
          )}
        </div>
      )}

      {/* Decoding notes */}
      {card.decoding_notes && (
        <div className="decoding-note">
          {card.decoding_notes}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type ChunkMode = "sound" | "meaning";

export default function ChunkDisplay({ card }: ChunkDisplayProps) {
  const { speak, speaking } = useSpeech();
  const [mode, setMode] = useState<ChunkMode>("sound");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>

      {/* ── Mode toggle ── */}
      <div
        role="tablist"
        aria-label="Chunk mode"
        style={{
          display: "flex",
          background: "#ede9f7",
          borderRadius: "var(--radius-pill)",
          padding: "3px",
          gap: "2px",
          width: "fit-content",
          margin: "0 auto",
        }}
      >
        {(["sound", "meaning"] as ChunkMode[]).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            style={{
              padding: "var(--space-2) var(--space-5)",
              borderRadius: "var(--radius-pill)",
              border: "none",
              fontFamily: "var(--font-ui)",
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              cursor: "pointer",
              transition: "background 140ms ease, color 140ms ease",
              background: mode === m ? "#ffffff" : "transparent",
              color: mode === m ? "#6a1b9a" : "var(--color-text-muted)",
              boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
            }}
          >
            {m === "sound" ? "🔊 By Sound" : "📖 By Meaning"}
          </button>
        ))}
      </div>

      {/* ── Panel ── */}
      {mode === "sound"
        ? <SoundView   card={card} speak={speak} speaking={speaking} />
        : <MeaningView card={card} speak={speak} speaking={speaking} />
      }
    </div>
  );
}
