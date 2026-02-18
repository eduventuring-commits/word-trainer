"use client";

import { useSpeech } from "@/hooks/useSpeech";

interface ListenButtonProps {
  word: string;
}

export default function ListenButton({ word }: ListenButtonProps) {
  const { available, speaking, speak } = useSpeech();

  if (!available) {
    return (
      <p className="no-speech-notice" role="status">
        Audio not available in this browser. Try Chrome or Edge.
      </p>
    );
  }

  return (
    <button
      className={`btn btn-secondary ${speaking ? "btn-ghost" : ""}`}
      onClick={() => speak(word)}
      disabled={speaking}
      aria-label={`Listen to the word "${word}"`}
      style={{ fontSize: "var(--text-sm)" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18" height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
      {speaking ? "Playing…" : "🔊 Listen"}
    </button>
  );
}
