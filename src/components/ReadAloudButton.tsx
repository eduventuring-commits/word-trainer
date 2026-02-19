"use client";

import { useRecognition } from "@/hooks/useRecognition";

interface ReadAloudButtonProps {
  word: string;
}

function MicIcon({ active }: { active: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" width="18" height="18"
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" style={{ flexShrink: 0 }}
    >
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="9" y1="22" x2="15" y2="22" />
      {active && (
        <circle cx="12" cy="7" r="2" fill="currentColor" opacity="0.5">
          <animate attributeName="r" values="2;4;2" dur="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
}

export default function ReadAloudButton({ word }: ReadAloudButtonProps) {
  const { state, transcript, supported, start, reset } = useRecognition(word);
  // reset() stops the mic and returns to idle — used for tap-to-stop

  // No auto-start — user taps the button to begin recording

  // Not supported (Firefox, Safari)
  if (!supported) {
    return (
      <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", fontStyle: "italic" }}>
        🎤 Read-aloud works best in Chrome — not available in this browser
      </span>
    );
  }

  // ── Listening — tap again to stop ──
  if (state === "listening") {
    return (
      <button
        onClick={reset}
        aria-label="Stop recording"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
          padding: "var(--space-3) var(--space-4)",
          background: "#fff8e1",
          border: "2px solid #ffcc80",
          borderRadius: "var(--radius-lg)",
          fontSize: "var(--text-sm)",
          fontWeight: 700,
          color: "#e65100",
          cursor: "pointer",
          animation: "pulse 1.2s ease-in-out infinite",
        }}
      >
        <MicIcon active={true} />
        🎤 Recording… tap to stop
      </button>
    );
  }

  // ── Success ──
  if (state === "success") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-2)" }}>
        <div style={{
          padding: "var(--space-3) var(--space-5)",
          background: "#d8f3dc",
          border: "2px solid #52b788",
          borderRadius: "var(--radius-lg)",
          fontSize: "var(--text-sm)",
          fontWeight: 700,
          color: "#1b4332",
          textAlign: "center",
        }}>
          ✅ Great job! You said it!
        </div>
        <button
          onClick={start}
          style={{ background: "none", border: "none", fontSize: "0.72rem", color: "var(--color-text-muted)", cursor: "pointer", textDecoration: "underline" }}
        >
          Try again
        </button>
      </div>
    );
  }

  // ── Retry ──
  if (state === "retry") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-2)" }}>
        <div style={{
          padding: "var(--space-3) var(--space-5)",
          background: "#fff3e0",
          border: "2px solid #ffb74d",
          borderRadius: "var(--radius-lg)",
          fontSize: "var(--text-sm)",
          fontWeight: 700,
          color: "#e65100",
          textAlign: "center",
        }}>
          🔁 Nice try! The word is <em style={{ fontStyle: "normal", color: "var(--color-text-primary)" }}>{word}</em>. Try again!
          {transcript && (
            <div style={{ fontSize: "0.7rem", fontWeight: 400, color: "var(--color-text-muted)", marginTop: "2px" }}>
              (I heard: &ldquo;{transcript}&rdquo;)
            </div>
          )}
        </div>
        <button
          onClick={start}
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "none", border: "1.5px solid var(--color-border)",
            borderRadius: "var(--radius-pill)", padding: "4px 14px",
            fontSize: "0.75rem", color: "var(--color-text-secondary)", cursor: "pointer",
          }}
        >
          <MicIcon active={false} /> Try again
        </button>
      </div>
    );
  }

  // ── Idle — tap to begin ──
  return (
    <button
      onClick={start}
      style={{
        display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
        background: "none", border: "1.5px solid var(--color-border)",
        borderRadius: "var(--radius-pill)", padding: "6px 16px",
        fontSize: "var(--text-sm)", fontWeight: 600,
        color: "var(--color-text-secondary)", cursor: "pointer",
      }}
    >
      <MicIcon active={false} /> 🎤 Tap to read aloud
    </button>
  );
}
