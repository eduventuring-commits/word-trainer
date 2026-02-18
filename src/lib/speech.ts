/**
 * Utilities for browser SpeechSynthesis.
 * All functions check for availability and handle missing API gracefully.
 */

export function isSpeechAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/**
 * Speak a word using the Web Speech API.
 * @param word   The text to speak
 * @param slow   If true, uses rate 0.8 ("phoneme-friendly" mode)
 */
export function speakWord(word: string, slow = false): void {
  if (!isSpeechAvailable()) return;

  // Cancel any in-progress speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  utterance.rate = slow ? 0.8 : 1.0;

  // Prefer an en-US voice if one is available
  const voices = window.speechSynthesis.getVoices();
  const enUS = voices.find(
    (v) => v.lang === "en-US" || v.lang.startsWith("en-US")
  );
  if (enUS) utterance.voice = enUS;

  window.speechSynthesis.speak(utterance);
}

/**
 * Some browsers (notably Chrome) load voices asynchronously.
 * Call this to wait for voices to be ready, then resolve.
 */
export function waitForVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!isSpeechAvailable()) {
      resolve([]);
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
    } else {
      window.speechSynthesis.addEventListener("voiceschanged", () => {
        resolve(window.speechSynthesis.getVoices());
      });
    }
  });
}
