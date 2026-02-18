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
import ReadAloudButton from "@/components/ReadAloudButton";

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

  // ── Chunk panel open ──
  const [chunkOpen, setChunkOpen] = useState(false);

  // ── Progress ──
  const [progress, setProgress] = useState<SessionProgress>(defaultProgress());

  // ── Has this card been marked practiced yet ──
  const [practicedThisCard, setPracticedThisCard] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const params = new URLSearchParams({ gradeBand, focus });
    fetch(`/api/cards?${params.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load cards");
        return r.json();
      })
      .then((data: { cards: WordCard[]; total: number }) => {
        setAllCards(data.cards);
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

  // Reset chunk panel and practiced flag when card changes
  useEffect(() => {
    setChunkOpen(false);
    setPracticedThisCard(false);
  }, [cardIndex]);

  // ── Handlers ──

  const handleChunkIt = useCallback(() => {
    setChunkOpen((o) => !o);
  }, []);

  const handleMarkTricky = useCallback(() => {
    if (!currentCard) return;
    const updated = toggleTricky(progress, currentCard.id);
    setProgress(updated);
    saveProgress(updated);
  }, [currentCard, progress]);

  // Mark card as practiced (counted as correct) when user moves on
  const handlePracticed = useCallback(() => {
    if (!currentCard || practicedThisCard) return;
    setPracticedThisCard(true);
    const updated = markPracticed(progress, true, currentCard.id);
    setProgress(updated);
    saveProgress(updated);
  }, [currentCard, progress, practicedThisCard]);

  const handleNext = useCallback(() => {
    handlePracticed();
    if (isLastCard) {
      router.push("/");
      return;
    }
    setCardIndex((i) => i + 1);
  }, [isLastCard, router, handlePracticed]);

  const handleBack = useCallback(() => {
    setCardIndex((i) => Math.max(0, i - 1));
  }, []);

  // ─────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <main className="page-wrapper" aria-busy="true" aria-label="Loading">
        <div style={{ textAlign: "center", color: "var(--color-text-secondary)", fontSize: "var(--text-md)", marginTop: "var(--space-16)" }}>
          Loading your cards…
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-wrapper">
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--color-wrong)", fontSize: "var(--text-md)", marginBottom: "var(--space-6)" }} role="alert">
            {error}
          </p>
          <button className="btn btn-primary" onClick={() => router.push("/")}>Back to home</button>
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
          <button className="btn btn-primary" onClick={() => router.push("/")}>Back to home</button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrapper" style={{ gap: "var(--space-4)" }}>

      {/* ── Top bar: exit + progress ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        maxWidth: 680,
        gap: "var(--space-4)",
      }}>
        <button
          className="btn btn-ghost"
          onClick={() => router.push("/")}
          aria-label="Exit session"
          style={{ padding: "var(--space-2) var(--space-3)", fontSize: "var(--text-xs)", minHeight: "unset" }}
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
      <div className="card" style={{ padding: "var(--space-5) var(--space-6)" }}>

        {/* Badges row */}
        <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-4)", flexWrap: "wrap", alignItems: "center" }}>
          <span className="badge">
            {{ "3-4": "Level 1", "5-6": "Level 2", "7-8": "Level 3" }[currentCard.grade_band] ?? currentCard.grade_band}
          </span>
          <span className="badge" style={{ background: "#f3e5f5", color: "#6a1b9a" }}>
            {currentCard.part_of_speech}
          </span>
          {isTricky && (
            <span className="tricky-indicator" aria-label="Marked as tricky">⭐ Tricky</span>
          )}
        </div>

        {/* ── Word + sentence ── */}
        <div style={{ textAlign: "center", marginBottom: "var(--space-4)" }}>
          <p className="word-display" aria-label={`Word: ${currentCard.word}`}>
            {currentCard.word}
          </p>
          <p className="example-sentence" style={{ marginTop: "var(--space-2)" }}>
            &ldquo;{currentCard.example_sentence}&rdquo;
          </p>
        </div>

        {/* ── Read it aloud (mic check) ── */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-3)" }}>
          <ReadAloudButton word={currentCard.word} />
        </div>

        {/* ── Definition (always visible) ── */}
        <div style={{
          background: "#f0faf4",
          border: "1.5px solid #a5d6a7",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-3) var(--space-4)",
          marginBottom: "var(--space-4)",
          textAlign: "center",
        }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#2e7d32", display: "block", marginBottom: "2px" }}>
            What it means
          </span>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-primary)", fontWeight: 600, lineHeight: 1.5 }}>
            {currentCard.student_friendly_meaning}
          </p>
        </div>

        {/* ── Action buttons row ── */}
        <div
          role="group"
          aria-label="Session actions"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-2)",
            justifyContent: "center",
            marginBottom: chunkOpen ? "var(--space-4)" : "0",
          }}
        >
          {/* Listen */}
          <ListenButton word={currentCard.word} />

          {/* Chunk it — toggles chunk panel */}
          <button
            className={`btn ${chunkOpen ? "btn-accent" : "btn-ghost"}`}
            onClick={handleChunkIt}
            aria-expanded={chunkOpen}
            aria-controls="chunk-panel"
            style={{ fontSize: "var(--text-sm)" }}
          >
            🔍 Chunk it
          </button>

          {/* Mark Tricky */}
          <button
            className={`btn ${isTricky ? "btn-tricky-active" : "btn-ghost"}`}
            onClick={handleMarkTricky}
            aria-pressed={isTricky}
            aria-label={isTricky ? "Remove tricky mark" : "Mark as tricky"}
            style={{ fontSize: "var(--text-sm)" }}
          >
            {isTricky ? "⭐ Tricky!" : "☆ Mark Tricky"}
          </button>
        </div>

        {/* ── Chunk panel ── */}
        {chunkOpen && (
          <section
            id="chunk-panel"
            aria-label="Word chunk breakdown"
            style={{
              marginBottom: "var(--space-4)",
              padding: "var(--space-4)",
              background: "#faf9ff",
              borderRadius: "var(--radius-md)",
              border: "1.5px solid #e0d9f5",
            }}
          >
            <ChunkDisplay key={currentCard.id} card={currentCard} />
          </section>
        )}

        <hr className="divider" style={{ margin: "var(--space-4) 0" }} />

        {/* ── Navigation ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            className="btn btn-ghost"
            onClick={handleBack}
            disabled={cardIndex === 0}
            aria-label="Go back to previous word"
            style={{
              opacity: cardIndex === 0 ? 0.35 : 1,
              cursor: cardIndex === 0 ? "default" : "pointer",
              fontSize: "var(--text-sm)",
            }}
          >
            ← Back
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            aria-label={isLastCard ? "Finish session" : "Go to next word"}
            style={{ fontSize: "var(--text-sm)" }}
          >
            {isLastCard ? "Finish ✓" : "Next →"}
          </button>
        </div>
      </div>

      {/* ── Tricky count ── */}
      {progress.trickyIds.length > 0 && (
        <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textAlign: "center" }} aria-live="polite">
          {progress.trickyIds.length} word{progress.trickyIds.length !== 1 ? "s" : ""} marked tricky
        </p>
      )}
    </main>
  );
}

// ─── Page export with Suspense ────────────────────────────────────────────────

export default function SessionPage() {
  return (
    <Suspense
      fallback={
        <main className="page-wrapper" aria-busy="true" aria-label="Loading session">
          <div style={{ textAlign: "center", color: "var(--color-text-secondary)", fontSize: "var(--text-md)", marginTop: "var(--space-16)" }}>
            Loading your session…
          </div>
        </main>
      }
    >
      <SessionInner />
    </Suspense>
  );
}
