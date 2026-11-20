"use client";

import { useEffect, useRef } from "react";
import { useScroll } from "framer-motion";

// C-major pentatonic, C4 → E5. No semitone clashes, so any two neighbouring
// chimes heard in quick succession still sound consonant. Each scroll
// milestone down the page plays the next note up, so a full scroll reads as
// one slow rising phrase.
const PENTATONIC = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99];

function playSoftChime(audioCtx: AudioContext, step: number) {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;
  const freq = PENTATONIC[Math.max(0, step) % PENTATONIC.length];

  // A gentle low-pass takes all the glassy edge off the sine partials —
  // what's left is closer to a felt-hammer music box than a UI beep.
  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1600;
  filter.Q.value = 0.3;

  // Very quiet, soft 30ms attack (no click), then a long ~0.9s exhale.
  const master = audioCtx.createGain();
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(0.02, now + 0.03);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

  filter.connect(master);
  master.connect(audioCtx.destination);

  // Fundamental plus a whisper of the octave for a little shimmer.
  const partials: Array<[number, number]> = [
    [freq, 1],
    [freq * 2, 0.25],
  ];
  for (const [frequency, amplitude] of partials) {
    const osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, now);
    const gain = audioCtx.createGain();
    gain.gain.value = amplitude;
    osc.connect(gain);
    gain.connect(filter);
    osc.start(now);
    osc.stop(now + 0.95);
  }
}

// The arrival cadence for the very bottom of the page. The milestone chimes
// climb the scale on the way down; this resolves the phrase home to the tonic
// (C5 → G5 → C6), same voice as the chimes, just a slightly longer exhale.
function playArrivalCadence(audioCtx: AudioContext) {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;
  const notes: Array<[number, number, number]> = [
    // [frequency, start offset, peak gain]
    [523.25, 0, 0.016],
    [783.99, 0.14, 0.016],
    [1046.5, 0.3, 0.02],
  ];

  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 2000;
  filter.Q.value = 0.3;
  filter.connect(audioCtx.destination);

  for (const [freq, offset, peak] of notes) {
    const start = now + offset;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(peak, start + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.6);
    gain.connect(filter);

    const partials: Array<[number, number]> = [
      [freq, 1],
      [freq * 2, 0.2],
    ];
    for (const [frequency, amplitude] of partials) {
      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, start);
      const partialGain = audioCtx.createGain();
      partialGain.gain.value = amplitude;
      osc.connect(partialGain);
      partialGain.connect(gain);
      osc.start(start);
      osc.stop(start + 1.7);
    }
  }
}

export function useScrollSFX(thresholds: number[] = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]) {
  const { scrollYProgress } = useScroll();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastPlayedRef = useRef<number>(-1);
  const lastPlayedAtRef = useRef<number>(0);
  const arrivalPlayedRef = useRef<boolean>(false);

  useEffect(() => {
    // Initialize audio context on first interaction
    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('keydown', initAudio, { once: true });

    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      if (!audioCtxRef.current) return;

      // Arrival at the footer resolves the rising phrase — once per visit,
      // re-armed only after scrolling meaningfully back up.
      if (latest > 0.985 && !arrivalPlayedRef.current) {
        arrivalPlayedRef.current = true;
        playArrivalCadence(audioCtxRef.current);
        lastPlayedAtRef.current = performance.now();
        return;
      }
      if (latest < 0.9 && arrivalPlayedRef.current) {
        arrivalPlayedRef.current = false;
      }

      // Check if we crossed a threshold
      for (let i = 0; i < thresholds.length; i++) {
        const threshold = thresholds[i];
        if (Math.abs(latest - threshold) < 0.015 && lastPlayedRef.current !== i) {
          // A fast flick crosses several milestones in a blink — playing them
          // all stacks into a jangle. One chime per 300ms keeps it calm.
          const nowMs = performance.now();
          if (nowMs - lastPlayedAtRef.current >= 300) {
            playSoftChime(audioCtxRef.current, i);
            lastPlayedAtRef.current = nowMs;
          }
          lastPlayedRef.current = i;
          break;
        }
      }

      // Reset if we move away from thresholds
      const isFarFromAny = thresholds.every(t => Math.abs(latest - t) > 0.05);
      if (isFarFromAny) {
        lastPlayedRef.current = -1;
      }
    });
  }, [scrollYProgress, thresholds]);
}
