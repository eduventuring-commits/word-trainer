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
import ChunkDisplay, { type ChunkMode } from "@/components/ChunkDisplay";
import MeaningCheck from "@/components/MeaningCheck";
import ReadAloudButton from "@/components/ReadAloudButton";

// ─── Session inner ────────────────────────────────────────────────────────────

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

  // ── Chunk mode: null = hidden, "sound" or "morpheme" = panel open ──
  const [chunkMode, setChunkMode] = useState<ChunkMode | null>(null);

  // ── Meaning panel ──
  const [meaningOpen, setMeaningOpen] = useState(false);
  const [meaningAnswered, setMeaningAnswered] = useState(false);

  // ── Progress ──
  const [progress, setProgress] = useState<SessionProgress>(defaultProgress());
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

  // Reset all panel state when card changes
  useEffect(() => {
    setChunkMode(null);
    setMeaningOpen(false);
    setMeaningAnswered(false);
    setPracticedThisCard(false);
  }, [cardIndex]);

  // ── Handlers ──

  const handleChunkSound = useCallback(() => {
    setChunkMode((m) => (m === "sound" ? null : "sound"));
    setMeaningOpen(false);
  }, []);

  const handleChunkMorpheme = useCallback(() => {
    setChunkMode((m) => (m === "morpheme" ? null : "morpheme"));
    setMeaningOpen(false);
  }, []);

  const handleMeaning = useCallback(() => {
    setMeaningOpen((o) => !o);
    setChunkMode(null);
  }, []);

  const handleMarkTricky = useCallback(() => {
    if (!currentCard) return;
    const updated = toggleTricky(progress, currentCard.id);
    setProgress(updated);
    saveProgress(updated);
  }, [currentCard, progress]);

  const handleMeaningResult = useCallback(
    (correct: boolean) => {
      if (!currentCard || practicedThisCard) return;
      setMeaningAnswered(true);
      setPracticedThisCard(true);
      const updated = markPracticed(progress, correct, currentCard.id);
      setProgress(updated);
      saveProgress(updated);
    },
    [currentCard, progress, practicedThisCard]
  );

  const handleNext = useCallback(() => {
    if (isLastCard) {
      router.push("/");
      return;
    }
    setCardIndex((i) => i + 1);
  }, [isLastCard, router]);

  const handleBack = useCallback(() => {
    setCardIndex((i) => Math.max(0, i - 1));
  }, []);

  // ─────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <main className="page-wrapper" aria-busy="true">
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
          <p style={{ color: "var(--color-wrong)", fontSize: "var(--text-md)", marginBottom: "var(--space-6)" }} role="alert">{error}</p>
          <button className="btn btn-primary" onClick={() => router.push("/")}>Back to home</button>
        </div>
      </main>
    );
  }

  if (!currentCard) {
    return (
      <main className="page-wrapper">
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "var(--text-md)", marginBottom: "var(--space-6)" }}>No cards matched. Try a different filter.</p>
          <button className="btn btn-primary" onClick={() => router.push("/")}>Back to home</button>
        </div>
      </main>
    );
  }

  const chunkOpen = chunkMode !== null;

  return (
    <main className="page-wrapper" style={{ gap: "var(--space-4)" }}>

      {/* ── Top bar ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: 680, gap: "var(--space-4)" }}>
        <button
          className="btn btn-ghost"
          onClick={() => router.push("/")}
          aria-label="Exit session"
          style={{ padding: "var(--space-2) var(--space-3)", fontSize: "var(--text-xs)", minHeight: "unset" }}
        >
          ← Exit
        </button>
        <div style={{ flex: 1 }}>
          <ProgressBar current={cardIndex} total={allCards.length} correctCount={progress.correctMeaningChecks} />
        </div>
      </div>

      {/* ── Main card ── */}
      <div className="card" style={{ padding: "var(--space-5) var(--space-6)" }}>

        {/* Badges */}
        <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-3)", flexWrap: "wrap", alignItems: "center" }}>
          <span className="badge">
            {{ "3-4": "Level 1", "5-6": "Level 2", "7-8": "Level 3" }[currentCard.grade_band] ?? currentCard.grade_band}
          </span>
          <span className="badge" style={{ background: "#f3e5f5", color: "#6a1b9a" }}>
            {currentCard.part_of_speech}
          </span>
          {isTricky && <span className="tricky-indicator" aria-label="Marked as tricky">⭐ Tricky</span>}
        </div>

        {/* ── Word + sentence ── */}
        <div style={{ textAlign: "center", marginBottom: "var(--space-3)" }}>
          <p className="word-display" aria-label={`Word: ${currentCard.word}`}>
            {currentCard.word}
          </p>
          <p className="example-sentence" style={{ marginTop: "var(--space-2)" }}>
            &ldquo;{currentCard.example_sentence}&rdquo;
          </p>
        </div>

        {/* ── Definition (always visible) ── */}
        <div style={{
          background: "#f0faf4",
          border: "1.5px solid #a5d6a7",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-3) var(--space-4)",
          marginBottom: "var(--space-3)",
          textAlign: "center",
        }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#2e7d32", display: "block", marginBottom: "2px" }}>
            What it means
          </span>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-primary)", fontWeight: 600, lineHeight: 1.4 }}>
            {currentCard.student_friendly_meaning}
          </p>
        </div>

        {/* ── Read aloud mic ── */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-3)" }}>
          <ReadAloudButton word={currentCard.word} />
        </div>

        {/* ── Primary action buttons: Listen · Chunk by Sound · Chunk by Morphemes · Mark Tricky ── */}
        <div
          role="group"
          aria-label="Word actions"
          style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", justifyContent: "center", marginBottom: (chunkOpen || meaningOpen) ? "var(--space-3)" : "0" }}
        >
          {/* Listen */}
          <ListenButton word={currentCard.word} />

          {/* Mark Tricky — moved up before chunk buttons */}
          <button
            className={`btn ${isTricky ? "btn-tricky-active" : "btn-ghost"}`}
            onClick={handleMarkTricky}
            aria-pressed={isTricky}
            aria-label={isTricky ? "Remove tricky mark" : "Mark as tricky"}
            style={{ fontSize: "var(--text-sm)" }}
          >
            {isTricky ? "⭐ Tricky!" : "☆ Mark Tricky"}
          </button>

          {/* Chunk by Sound */}
          <button
            className="btn btn-ghost"
            onClick={handleChunkSound}
            aria-pressed={chunkMode === "sound"}
            style={{
              fontSize: "var(--text-sm)",
              background: chunkMode === "sound" ? "#1565c0" : undefined,
              color: chunkMode === "sound" ? "#fff" : undefined,
              borderColor: chunkMode === "sound" ? "#1565c0" : undefined,
            }}
          >
            🔊 Chunk by Sound
          </button>

          {/* Chunk by Morphemes */}
          <button
            className="btn btn-ghost"
            onClick={handleChunkMorpheme}
            aria-pressed={chunkMode === "morpheme"}
            style={{
              fontSize: "var(--text-sm)",
              background: chunkMode === "morpheme" ? "#6a1b9a" : undefined,
              color: chunkMode === "morpheme" ? "#fff" : undefined,
              borderColor: chunkMode === "morpheme" ? "#6a1b9a" : undefined,
            }}
          >
            📖 Chunk by Morphemes
          </button>
        </div>

        {/* ── Chunk panel ── */}
        {chunkOpen && (
          <div style={{ marginBottom: "var(--space-3)" }}>
            <ChunkDisplay key={`${currentCard.id}-${chunkMode}`} card={currentCard} mode={chunkMode!} />
          </div>
        )}

        {/* ── BONUS: Find the Meaning ── */}
        <div style={{
          marginTop: chunkOpen || meaningOpen ? "var(--space-3)" : "var(--space-2)",
          borderTop: "2px dashed #f0c060",
          paddingTop: "var(--space-3)",
        }}>
          {!meaningOpen ? (
            <div style={{ textAlign: "center" }}>
              <button
                onClick={handleMeaning}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  padding: "10px 22px",
                  background: "linear-gradient(135deg, #f9c74f, #f8961e)",
                  color: "#7b3f00",
                  border: "2.5px solid #f8961e",
                  borderRadius: "var(--radius-pill)",
                  fontFamily: "var(--font-ui)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 3px 10px rgba(248,150,30,0.35)",
                  transition: "transform 120ms ease, box-shadow 120ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                ⭐ BONUS: Find the Meaning!
              </button>
              <p style={{ marginTop: "var(--space-2)", fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
                Earn bonus points by choosing the right definition!
              </p>
            </div>
          ) : (
            <section aria-label="Meaning check quiz" style={{
              padding: "var(--space-4)",
              background: "#fffbf0",
              borderRadius: "var(--radius-md)",
              border: "2px solid #f8961e",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
                <span style={{ fontSize: "1.1rem" }}>⭐</span>
                <span style={{ fontWeight: 800, fontSize: "var(--text-sm)", color: "#7b3f00" }}>
                  BONUS: Find the Meaning!
                </span>
                {!meaningAnswered && (
                  <button
                    onClick={() => setMeaningOpen(false)}
                    style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}
                    aria-label="Close meaning check"
                  >
                    ✕
                  </button>
                )}
              </div>
              <MeaningCheck
                card={currentCard}
                allCards={allCards}
                onResult={handleMeaningResult}
              />
            </section>
          )}
        </div>

        <hr className="divider" style={{ margin: "var(--space-4) 0" }} />

        {/* ── Navigation ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            className="btn btn-ghost"
            onClick={handleBack}
            disabled={cardIndex === 0}
            style={{ opacity: cardIndex === 0 ? 0.35 : 1, cursor: cardIndex === 0 ? "default" : "pointer", fontSize: "var(--text-sm)" }}
          >
            ← Back
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            style={{ fontSize: "var(--text-sm)" }}
          >
            {isLastCard ? "Finish ✓" : "Next →"}
          </button>
        </div>
      </div>

      {progress.trickyIds.length > 0 && (
        <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textAlign: "center" }} aria-live="polite">
          {progress.trickyIds.length} word{progress.trickyIds.length !== 1 ? "s" : ""} marked tricky
        </p>
      )}
    </main>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function SessionPage() {
  return (
    <Suspense
      fallback={
        <main className="page-wrapper" aria-busy="true">
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
