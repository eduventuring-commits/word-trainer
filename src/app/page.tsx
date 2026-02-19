"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { GradeBand, Focus } from "@/lib/types";

const GRADE_BANDS: { value: GradeBand | "All"; label: string }[] = [
  { value: "All", label: "All Levels" },
  { value: "3-4", label: "Level 1 Words" },
  { value: "5-6", label: "Level 2 Words" },
  { value: "7-8", label: "Level 3 Words" },
];

const FOCUS_OPTIONS: { value: Focus; label: string; description: string }[] = [
  {
    value: "Mixed",
    label: "Mixed",
    description: "All word types — great for review",
  },
  {
    value: "Roots",
    label: "Roots",
    description: "Words with Latin/Greek roots (port, vis, rupt…)",
  },
  {
    value: "Prefixes",
    label: "Prefixes",
    description: "Words with common prefixes (re-, un-, dis-…)",
  },
  {
    value: "Suffixes",
    label: "Suffixes",
    description: "Words with common suffixes (-tion, -ful, -ly…)",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [gradeBand, setGradeBand] = useState<GradeBand | "All">("All");
  const [focus, setFocus] = useState<Focus>("Mixed");

  function handleStart() {
    const params = new URLSearchParams({ gradeBand, focus });
    router.push(`/session?${params.toString()}`);
  }

  const selectedFocusInfo = FOCUS_OPTIONS.find((f) => f.value === focus);

  return (
    <main className="page-wrapper">

      {/* ── Hero ── */}
      <header
        style={{
          maxWidth: 680,
          width: "100%",
          marginBottom: "var(--space-4)",
          background: "linear-gradient(135deg, #f0faf4 0%, #FFFDF7 100%)",
          border: "2px solid var(--color-brand-light)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-4) var(--space-6)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-4)",
        }}
      >
        {/* Sloth mascot */}
        <img
          src="/sloth-mascot.png"
          alt="PhiloSLOTHical Sloth mascot"
          style={{
            width: 110,
            height: 110,
            objectFit: "contain",
            flexShrink: 0,
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.10))",
          }}
        />

        {/* Title text */}
        <div style={{ textAlign: "left" }}>
          <h1
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 800,
              color: "var(--color-brand-dark)",
              lineHeight: 1.2,
              marginBottom: "var(--space-1)",
            }}
          >
            Morphology &amp; Multisyllable Words
          </h1>
          <p
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              color: "var(--color-brand)",
              marginBottom: "var(--space-2)",
            }}
          >
            🦥 with the PhiloSLOTHical Sloth
          </p>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--color-text-secondary)",
              lineHeight: "var(--leading-normal)",
            }}
          >
            Build your reading skills one morpheme at a time.
          </p>
        </div>
      </header>

      {/* ── How it works ── */}
      <section
        style={{
          maxWidth: 680,
          width: "100%",
          marginBottom: "var(--space-4)",
          background: "#f0faf4",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-4) var(--space-6)",
          border: "2px solid var(--color-brand-light)",
        }}
        aria-label="How to use this app"
      >
        <h2
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: 800,
            color: "var(--color-brand-dark)",
            marginBottom: "var(--space-3)",
          }}
        >
          Here&apos;s how to play! 🎉
        </h2>
        <ol
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          {[
            ["👂", "Read & Listen", "Read the word aloud. Press Listen if you need help!"],
            ["🔍", "Chunk it!", "Break it by Sound (syllables) or Morphemes (word parts + meanings)."],
            ["✅", "Find the Meaning", "Pick the right definition for bonus points!"],
            ["⭐", "Mark Tricky", "Flag hard words to practice again."],
          ].map(([icon, title, desc]) => (
            <li
              key={title as string}
              style={{
                display: "flex",
                gap: "var(--space-3)",
                alignItems: "center",
                fontSize: "var(--text-xs)",
                color: "var(--color-text-secondary)",
              }}
            >
              <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{icon}</span>
              <span>
                <strong style={{ color: "var(--color-text-primary)" }}>{title}</strong>
                {" — "}
                {desc}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Setup card ── */}
      <div
        className="card"
        style={{
          padding: "var(--space-5) var(--space-6)",
          borderTop: "4px solid var(--color-brand)",
        }}
      >
        <h2
          style={{
            fontSize: "var(--text-md)",
            marginBottom: "var(--space-4)",
            color: "var(--color-text-primary)",
          }}
        >
          Set up your session
        </h2>

        {/* Grade band selector */}
        <div className="form-group" style={{ marginBottom: "var(--space-4)" }}>
          <label htmlFor="grade-select" className="form-label">
            Grade band
          </label>
          <select
            id="grade-select"
            className="form-select"
            value={gradeBand}
            onChange={(e) => setGradeBand(e.target.value as GradeBand | "All")}
          >
            {GRADE_BANDS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {/* Focus selector */}
        <div className="form-group" style={{ marginBottom: "var(--space-4)" }}>
          <label htmlFor="focus-select" className="form-label">
            Focus area
          </label>
          <select
            id="focus-select"
            className="form-select"
            value={focus}
            onChange={(e) => setFocus(e.target.value as Focus)}
          >
            {FOCUS_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          {selectedFocusInfo && (
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
                marginTop: "var(--space-2)",
              }}
              aria-live="polite"
            >
              {selectedFocusInfo.description}
            </p>
          )}
        </div>

        <hr className="divider" />

        {/* Start button */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleStart}
            aria-label={`Start a ${focus} session`}
          >
            Start Session 🦥
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

    </main>
  );
}
