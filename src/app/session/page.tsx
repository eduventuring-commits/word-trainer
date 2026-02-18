"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { WordCard, GradeBand, Focus, SessionProgress } from "@/lib/types";
import {
  loadProgress,
  saveProgress,
  defaultProgress,
  markPracticed,
  toggleTricky,
} from "@/lib/storage";
import ProgressBar from "@/components/ProgressBar";
import ListenButton from "@/components/ListenButton";
import ChunkDisplay from "@/components/ChunkDisplay";
import MeaningCheck from "@/components/MeaningCheck";

// ─── Types ────────────────────────────────────────────────────────────────────

type PanelMode = "idle" | "chunk" | "meaning";

// ─── Session inner (uses hooks that require Suspense boundary) ───────────────

function SessionInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const gradeBand = (searchParams.get("gradeBand") ?? "All") as GradeBand | "All";
  const focus = (searchParams.get("focus") ?? "Mixed") as Focus;

  // ── Data ──
  const [allCards, setAllCards] = useState<WordCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Navigation ──
  const [cardIndex, setCardIndex] = useState(0);

  // ── Panel ──
  const [panelMode, setPanelMode] = useState<PanelMode>("idle");

  // ── Meaning check state ──
  const [meaningAnswered, setMeaningAnswered] = useState(false);

  // ── Progress ──
  const [progress, setProgress] = useState<SessionProgress>(defaultProgress());

  // ─────────────────────────────────────────────────────────────────────────

  // Fetch filtered cards from the API
  useEffect(() => {
    const params = new URLSearchParams({ gradeBand, focus });
    fetch(`/api/cards?${params.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load cards");
        return r.json();
      })
      .then((data: { cards: WordCard[]; total: number }) => {
        setAllCards(data.cards);
        // Initialise progress with session total
        const saved = loadProgress();
        setProgress({ ...saved, sessionTotal: data.total });
        setLoading(false);
      })
      .catch(() => {
        setError("Sorry, we couldn't load the word cards. Please try again.");
        setLoading(false);
      });
  }, [gradeBand, focus]);

  const currentCard = allCards[cardIndex] ?? null;
  const isLastCard = cardIndex >= allCards.length - 1;
  const isTricky = progress.trickyIds.includes(currentCard?.id ?? "");

  // Reset panel when card changes
  useEffect(() => {
    setPanelMode("idle");
    setMeaningAnswered(false);
  }, [cardIndex]);

  // ── Handlers ──

  const handleChunkIt = useCallback(() => {
    setPanelMode((m) => (m === "chunk" ? "idle" : "chunk"));
    if (panelMode === "meaning") setMeaningAnswered(false);
  }, [panelMode]);

  const handleMeaningCheck = useCallback(() => {
    setPanelMode((m) => (m === "meaning" ? "idle" : "meaning"));
  }, []);

  const handleMeaningResult = useCallback(
    (correct: boolean) => {
      if (!currentCard) return;
      setMeaningAnswered(true);
      const updated = markPracticed(progress, correct, currentCard.id);
      setProgress(updated);
      saveProgress(updated);
    },
    [currentCard, progress]
  );

  const handleMarkTricky = useCallback(() => {
    if (!currentCard) return;
    const updated = toggleTricky(progress, currentCard.id);
    setProgress(updated);
    saveProgress(updated);
  }, [currentCard, progress]);

  const handleNext = useCallback(() => {
    if (isLastCard) {
      // Session complete — go to home
      router.push("/");
      return;
    }
    setCardIndex((i) => i + 1);
  }, [isLastCard, router]);

  const handleBack = useCallback(() => {
    setCardIndex((i) => Math.max(0, i - 1));
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Render states
  // ─────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <main className="page-wrapper" aria-busy="true" aria-label="Loading">
        <div
          style={{
            textAlign: "center",
            color: "var(--color-text-secondary)",
            fontSize: "var(--text-md)",
            marginTop: "var(--space-16)",
          }}
        >
          Loading your cards…
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-wrapper">
        <div className="card" style={{ textAlign: "center" }}>
          <p
            style={{
              color: "var(--color-wrong)",
              fontSize: "var(--text-md)",
              marginBottom: "var(--space-6)",
            }}
            role="alert"
          >
            {error}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => router.push("/")}
          >
            Back to home
          </button>
        </div>
      </main>
    );
  }

  if (!currentCard) {
    return (
      <main className="page-wrapper">
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "var(--text-md)", marginBottom: "var(--space-6)" }}>
            No word cards matched your selection. Try a different filter.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => router.push("/")}
          >
            Back to home
          </button>
        </div>
      </main>
    );
  }

  // ── Complete screen ──
  if (isLastCard && meaningAnswered && panelMode === "meaning") {
    // Handled naturally — user presses Next
  }

  return (
    <main
      className="page-wrapper"
      style={{ gap: "var(--space-6)" }}
    >
      {/* ── Top bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: 680,
          gap: "var(--space-4)",
        }}
      >
        <button
          className="btn btn-ghost"
          onClick={() => router.push("/")}
          aria-label="Exit session and return to home"
          style={{ padding: "var(--space-2) var(--space-4)", fontSize: "var(--text-xs)" }}
        >
          ← Exit
        </button>

        <div style={{ flex: 1 }}>
          <ProgressBar
            current={cardIndex}
            total={allCards.length}
            correctCount={progress.correctMeaningChecks}
          />
        </div>
      </div>

      {/* ── Main card ── */}
      <div className="card" style={{ position: "relative" }}>

        {/* Grade + part of speech badges */}
        <div
          style={{
            display: "flex",
            gap: "var(--space-2)",
            marginBottom: "var(--space-6)",
            flexWrap: "wrap",
          }}
        >
          <span className="badge">{currentCard.grade_band}</span>
          <span
            className="badge"
            style={{ background: "#f3e5f5", color: "#6a1b9a" }}
          >
            {currentCard.part_of_speech}
          </span>
          {isTricky && (
            <span
              className="tricky-indicator"
              aria-label="Marked as tricky"
            >
              ⭐ Tricky
            </span>
          )}
        </div>

        {/* ── Large word display ── */}
        <div
          style={{ textAlign: "center", marginBottom: "var(--space-8)" }}
        >
          <p
            className="word-display"
            aria-label={`Word: ${currentCard.word}`}
          >
            {currentCard.word}
          </p>
          <p
            className="example-sentence"
            style={{ marginTop: "var(--space-4)" }}
          >
            "{currentCard.example_sentence}"
          </p>
        </div>

        {/* ── Action buttons ── */}
        <div
          role="group"
          aria-label="Session actions"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-3)",
            justifyContent: "center",
            marginBottom: "var(--space-6)",
          }}
        >
          {/* Listen */}
          <ListenButton word={currentCard.word} />

          {/* Chunk it */}
          <button
            className={`btn ${
              panelMode === "chunk" ? "btn-accent" : "btn-ghost"
            }`}
            onClick={handleChunkIt}
            aria-expanded={panelMode === "chunk"}
            aria-controls="chunk-panel"
          >
            🔍 Chunk it
          </button>

          {/* Meaning Check */}
          <button
            className={`btn ${
              panelMode === "meaning" ? "btn-accent" : "btn-ghost"
            }`}
            onClick={handleMeaningCheck}
            aria-expanded={panelMode === "meaning"}
            aria-controls="meaning-panel"
          >
            ✅ Meaning Check
          </button>

          {/* Mark Tricky */}
          <button
            className={`btn ${isTricky ? "btn-tricky-active" : "btn-ghost"}`}
            onClick={handleMarkTricky}
            aria-pressed={isTricky}
            aria-label={isTricky ? "Remove tricky mark" : "Mark this word as tricky"}
          >
            {isTricky ? "⭐ Marked Tricky" : "☆ Mark Tricky"}
          </button>
        </div>

        {/* ── Chunk panel ── */}
        {panelMode === "chunk" && (
          <section
            id="chunk-panel"
            aria-label="Word chunk breakdown"
            style={{
              marginBottom: "var(--space-6)",
              padding: "var(--space-6)",
              background: "#faf9ff",
              borderRadius: "var(--radius-md)",
              border: "1.5px solid #e0d9f5",
            }}
          >
            {/* key resets the tab state (sound/meaning) on every new card */}
            <ChunkDisplay key={currentCard.id} card={currentCard} />
          </section>
        )}

        {/* ── Meaning Check panel ── */}
        {panelMode === "meaning" && (
          <section
            id="meaning-panel"
            aria-label="Meaning check quiz"
            style={{
              marginBottom: "var(--space-6)",
              padding: "var(--space-6)",
              background: "#f9fcf9",
              borderRadius: "var(--radius-md)",
              border: "1.5px solid #c8e6c9",
            }}
          >
            <MeaningCheck
              card={currentCard}
              allCards={allCards}
              onResult={handleMeaningResult}
            />
          </section>
        )}

        <hr className="divider" />

        {/* ── Navigation buttons ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            className="btn btn-ghost"
            onClick={handleBack}
            disabled={cardIndex === 0}
            aria-label="Go back to previous word"
            style={{
              opacity: cardIndex === 0 ? 0.35 : 1,
              cursor: cardIndex === 0 ? "default" : "pointer",
            }}
          >
            ← Back
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            aria-label={isLastCard ? "Finish session" : "Go to next word"}
          >
            {isLastCard ? "Finish Session ✓" : "Next →"}
          </button>
        </div>
      </div>

      {/* ── Tricky count note ── */}
      {progress.trickyIds.length > 0 && (
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            textAlign: "center",
          }}
          aria-live="polite"
        >
          {progress.trickyIds.length} word
          {progress.trickyIds.length !== 1 ? "s" : ""} marked tricky
        </p>
      )}
    </main>
  );
}

// ─── Page export with Suspense (required for useSearchParams) ────────────────

export default function SessionPage() {
  return (
    <Suspense
      fallback={
        <main
          className="page-wrapper"
          aria-busy="true"
          aria-label="Loading session"
        >
          <div
            style={{
              textAlign: "center",
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-md)",
              marginTop: "var(--space-16)",
            }}
          >
            Loading your session…
          </div>
        </main>
      }
    >
      <SessionInner />
    </Suspense>
  );
}
