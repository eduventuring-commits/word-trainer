"use client";

import { useState, useCallback, useEffect } from "react";
import type { WordCard, QuizOption } from "@/lib/types";
import { buildQuizOptions } from "@/lib/filterCards";

interface MeaningCheckProps {
  card: WordCard;
  allCards: WordCard[];
  onResult: (correct: boolean) => void;
}

export default function MeaningCheck({
  card,
  allCards,
  onResult,
}: MeaningCheckProps) {
  const [options, setOptions] = useState<QuizOption[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  // Rebuild options whenever the card changes
  useEffect(() => {
    setOptions(buildQuizOptions(card, allCards));
    setSelected(null);
    setAnswered(false);
  }, [card, allCards]);

  const handleSelect = useCallback(
    (index: number) => {
      if (answered) return;
      setSelected(index);
      setAnswered(true);
      onResult(options[index].isCorrect);
    },
    [answered, options, onResult]
  );

  if (options.length === 0) return null;

  return (
    <div>
      <p
        style={{
          fontWeight: 700,
          fontSize: "var(--text-sm)",
          color: "var(--color-text-secondary)",
          marginBottom: "var(--space-4)",
        }}
        id="meaning-check-label"
      >
        What does <strong style={{ color: "var(--color-text-primary)" }}>"{card.word}"</strong> mean?
      </p>

      <div
        className="quiz-options"
        role="group"
        aria-labelledby="meaning-check-label"
      >
        {options.map((opt, i) => {
          let cls = "quiz-option";
          if (answered) {
            if (opt.isCorrect) cls += " correct";
            else if (i === selected && !opt.isCorrect) cls += " wrong";
          }

          return (
            <button
              key={i}
              className={cls}
              onClick={() => handleSelect(i)}
              disabled={answered}
              aria-pressed={selected === i}
              aria-label={`Option ${i + 1}: ${opt.text}${
                answered
                  ? opt.isCorrect
                    ? " — Correct"
                    : i === selected
                    ? " — Incorrect"
                    : ""
                  : ""
              }`}
            >
              <span
                style={{
                  fontWeight: 700,
                  marginRight: "var(--space-2)",
                  opacity: 0.55,
                }}
                aria-hidden="true"
              >
                {String.fromCharCode(65 + i)}.
              </span>
              {opt.text}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={`feedback ${
            options[selected!]?.isCorrect ? "feedback-correct" : "feedback-wrong"
          }`}
          role="status"
          aria-live="polite"
          style={{ marginTop: "var(--space-4)" }}
        >
          {options[selected!]?.isCorrect ? (
            <>
              <span aria-hidden="true">✓</span> Correct!
            </>
          ) : (
            <>
              <span aria-hidden="true">✗</span> Not yet — the answer is:{" "}
              <em>{card.student_friendly_meaning}</em>
            </>
          )}
        </div>
      )}
    </div>
  );
}
