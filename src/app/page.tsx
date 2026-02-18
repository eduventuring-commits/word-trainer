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
      {/* ── Header ── */}
      <header
        style={{
          textAlign: "center",
          marginBottom: "var(--space-10)",
          maxWidth: 680,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-3)",
            marginBottom: "var(--space-4)",
          }}
        >
          {/* Book icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-brand)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <h1
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 800,
              color: "var(--color-brand-dark)",
            }}
          >
            Morphology and Multisyllable Words
          </h1>
        </div>
        <p
          style={{
            fontSize: "var(--text-md)",
            color: "var(--color-text-secondary)",
            lineHeight: "var(--leading-relaxed)",
          }}
        >
          Build your reading skills one morpheme at a time.
          <br />
          Choose your level and focus, then start practicing.
        </p>
      </header>

      {/* ── How it works ── */}
      <section
        style={{
          maxWidth: 680,
          width: "100%",
          marginBottom: "var(--space-8)",
        }}
        aria-label="How to use this app"
      >
        <h2
          style={{
            fontSize: "var(--text-md)",
            fontWeight: 700,
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-4)",
          }}
        >
          How it works
        </h2>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          {[
            ["👂", "Listen", "Hear the word spoken aloud."],
            ["🔍", "Chunk it", "Break the word into syllables by sound, or by meaning using roots and affixes."],
            ["✅", "Meaning Check", "Choose the right definition from 4 options."],
            ["⭐", "Mark Tricky", "Flag words you want to revisit."],
          ].map(([icon, title, desc]) => (
            <li
              key={title}
              style={{
                display: "flex",
                gap: "var(--space-4)",
                alignItems: "flex-start",
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
              }}
            >
              <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>{icon}</span>
              <span>
                <strong style={{ color: "var(--color-text-primary)" }}>
                  {title}
                </strong>{" "}
                — {desc}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Setup card ── */}
      <div className="card">
        <h2
          style={{
            fontSize: "var(--text-lg)",
            marginBottom: "var(--space-8)",
            color: "var(--color-text-primary)",
          }}
        >
          Set up your session
        </h2>

        {/* Grade band selector */}
        <div className="form-group" style={{ marginBottom: "var(--space-6)" }}>
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
        <div className="form-group" style={{ marginBottom: "var(--space-6)" }}>
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
            Start Session
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
