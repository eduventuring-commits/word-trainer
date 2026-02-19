"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// ─── Browser type shim ────────────────────────────────────────────────────────
// SpeechRecognition is not in the standard TS lib — declare minimal types here.

interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

export type RecognitionState = "idle" | "listening" | "success" | "retry";

/**
 * Simple Levenshtein distance — used for fuzzy word matching.
 * Returns the number of single-character edits needed.
 */
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/**
 * Returns true if the spoken transcript contains a word close enough
 * to the target (within ~20% edit distance, minimum 1 error allowed).
 */
function isCloseEnough(target: string, transcript: string): boolean {
  const t = target.toLowerCase().trim();
  // Check each spoken word against the target
  const spoken = transcript.toLowerCase().trim().split(/\s+/);
  const threshold = Math.max(1, Math.floor(t.length * 0.25));
  return spoken.some((w) => levenshtein(t, w) <= threshold);
}

export function useRecognition(targetWord: string) {
  const [state, setState] = useState<RecognitionState>("idle");
  const [transcript, setTranscript] = useState<string>("");
  const [supported, setSupported] = useState<boolean>(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // Check support on mount
  useEffect(() => {
    const available = !!(
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition)
    );
    setSupported(available);
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  }, []);

  const start = useCallback(() => {
    if (!supported) return;
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) return;

    stop(); // cancel any existing session
    setState("listening");
    setTranscript("");

    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    recognitionRef.current = rec;

    rec.onresult = (event) => {
      const e = event as SpeechRecognitionEvent;
      // Collect all alternatives
      const results: string[] = [];
      for (let i = 0; i < e.results[0].length; i++) {
        results.push(e.results[0][i].transcript);
      }
      const best = results[0] ?? "";
      setTranscript(best);

      // Check any alternative for a close match
      const matched = results.some((r) => isCloseEnough(targetWord, r));
      setState(matched ? "success" : "retry");
    };

    rec.onerror = () => {
      setState("idle");
    };

    rec.onend = () => {
      recognitionRef.current = null;
    };

    rec.start();
  }, [supported, targetWord, stop]);

  const reset = useCallback(() => {
    stop();
    setState("idle");
    setTranscript("");
  }, [stop]);

  // Auto-reset when the target word changes (new card)
  useEffect(() => {
    reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetWord]);

  return { state, transcript, supported, start, stop, reset };
}
