"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// ─── Browser type shim ────────────────────────────────────────────────────────
// SpeechRecognition is not in the standard TS lib — declare minimal types here.

interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
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
 * to the target (within ~25% edit distance, minimum 1 error allowed).
 */
function isCloseEnough(target: string, transcript: string): boolean {
  const t = target.toLowerCase().trim();
  const spoken = transcript.toLowerCase().trim().split(/\s+/);
  const threshold = Math.max(1, Math.floor(t.length * 0.25));
  return spoken.some((w) => levenshtein(t, w) <= threshold);
}

export function useRecognition(targetWord: string) {
  const [state, setState] = useState<RecognitionState>("idle");
  const [transcript, setTranscript] = useState<string>("");
  const [supported, setSupported] = useState<boolean>(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  // Prevent double-firing after stop() is called on match
  const matchedRef = useRef(false);

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
    matchedRef.current = false;
    setState("listening");
    setTranscript("");

    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;   // fire on every word as it's heard
    rec.continuous = true;       // keep listening until we stop it
    rec.maxAlternatives = 3;
    recognitionRef.current = rec;

    rec.onresult = (event) => {
      if (matchedRef.current) return; // already matched, ignore further results

      const e = event as SpeechRecognitionEvent;

      // Scan all results (interim + final) for a match
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        const alternatives: string[] = [];
        for (let j = 0; j < result.length; j++) {
          alternatives.push(result[j].transcript);
        }
        const best = alternatives[0] ?? "";
        setTranscript(best);

        const matched = alternatives.some((r) => isCloseEnough(targetWord, r));
        if (matched) {
          // Stop immediately on correct word — no waiting for silence
          matchedRef.current = true;
          recognitionRef.current?.stop();
          recognitionRef.current = null;
          setState("success");
          return;
        }

        // Only show retry on a final (non-interim) result that didn't match
        if (result.isFinal) {
          setState("retry");
        }
      }
    };

    rec.onerror = () => {
      setState("idle");
    };

    rec.onend = () => {
      recognitionRef.current = null;
      // If we ended without a match and were still listening, go to retry
      setState((prev) => (prev === "listening" ? "retry" : prev));
    };

    rec.start();
  }, [supported, targetWord, stop]);

  const reset = useCallback(() => {
    stop();
    matchedRef.current = false;
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
