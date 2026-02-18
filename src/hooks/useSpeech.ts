"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { isSpeechAvailable } from "@/lib/speech";

export function useSpeech() {
  const [available, setAvailable] = useState(false);
  const [slow, setSlow] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  // Track whether voices have been loaded at least once
  const voicesLoadedRef = useRef(false);

  useEffect(() => {
    if (!isSpeechAvailable()) return;

    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesLoadedRef.current = true;
        setAvailable(true);
      }
    };

    // Check immediately (Firefox/Safari have voices synchronously)
    checkVoices();

    // Chrome loads voices async — listen for the event
    window.speechSynthesis.addEventListener("voiceschanged", checkVoices);

    // Fallback: mark available after a short delay even if voices list is empty
    // (some browsers report 0 voices but still speak fine)
    const fallback = setTimeout(() => setAvailable(true), 500);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", checkVoices);
      clearTimeout(fallback);
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!isSpeechAvailable()) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = slow ? 0.75 : 1.0;

      // Pick best available voice
      const voices = window.speechSynthesis.getVoices();
      const enUS =
        voices.find((v) => v.lang === "en-US") ||
        voices.find((v) => v.lang.startsWith("en"));
      if (enUS) utterance.voice = enUS;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      // Chrome workaround: cancel + speak in a microtask prevents silent failures
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 0);
    },
    [slow]
  );

  const toggleSlow = useCallback(() => setSlow((s) => !s), []);

  return { available, slow, speaking, speak, toggleSlow };
}
