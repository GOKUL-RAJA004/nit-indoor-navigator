/**
 * Voice Assistance Module
 * – Text-to-Speech (TTS) for reading navigation directions aloud
 * – Speech Recognition for voice search
 * – Multi-language support via Web Speech API
 */

// ==================== TEXT-TO-SPEECH ====================

let currentUtterance = null;

/**
 * Speak the given text in the given language
 * @param {string} text
 * @param {string} lang  BCP-47 lang code, e.g. 'en-US', 'ta-IN'
 * @param {function} onEnd
 */
export function speak(text, lang = 'en-US', onEnd) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = 0.95;
  utter.pitch = 1;
  utter.volume = 1;

  // Try to pick a matching voice
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
  if (match) utter.voice = match;

  if (onEnd) utter.onend = onEnd;
  currentUtterance = utter;
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

export function isSpeaking() {
  return 'speechSynthesis' in window && window.speechSynthesis.speaking;
}

// Pre-load voices (some browsers need this)
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

// ==================== SPEECH RECOGNITION ====================

let recognition = null;

/**
 * Start listening for voice input
 * @param {string} lang  e.g. 'en-US'
 * @param {function} onResult  called with transcript string
 * @param {function} onEnd     called when recognition ends
 * @param {function} onError   called on error
 */
export function startListening(lang = 'en-US', onResult, onEnd, onError) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    onError?.('Speech recognition not supported in this browser.');
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = lang;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult?.(transcript);
  };
  recognition.onend = () => onEnd?.();
  recognition.onerror = (e) => onError?.(e.error);

  recognition.start();
}

export function stopListening() {
  if (recognition) {
    try { recognition.stop(); } catch (_) {}
    recognition = null;
  }
}

/**
 * Parse a voice command into a destination name
 * Strips common prefixes like "take me to", "navigate to", "show route to"
 */
export function parseVoiceCommand(transcript) {
  let dest = transcript.trim().toLowerCase();
  const prefixes = [
    'take me to', 'navigate to', 'show route to', 'go to',
    'find route to', 'directions to', 'where is', 'how to reach',
    'route to', 'path to',
  ];
  for (const p of prefixes) {
    if (dest.startsWith(p)) {
      dest = dest.slice(p.length).trim();
      break;
    }
  }
  return dest;
}

/**
 * Speak full route instructions one step at a time
 * @param {Array} instructions
 * @param {string} lang
 */
export function speakInstructions(instructions, lang = 'en-US') {
  if (!instructions?.length) return;
  let idx = 0;
  function next() {
    if (idx >= instructions.length) return;
    speak(instructions[idx].text, lang, () => {
      idx++;
      next();
    });
  }
  next();
}

export const isVoiceSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
export const isRecognitionSupported = typeof window !== 'undefined' &&
  !!(window.SpeechRecognition || window.webkitSpeechRecognition);
