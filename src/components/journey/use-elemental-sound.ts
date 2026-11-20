"use client";

import { useEffect, useRef } from "react";
import type { ElementKey } from "./journey-model";

/* ─── Five signatures in one voice ──────────────────────────────────────
   The site speaks in a felt-hammer music box on the C-major pentatonic.
   Each element gets a short phrase in that voice, coloured by its nature:
   earth is low and dull, water drips, fire crackles, air breathes, ether
   shimmers. All of it stays very quiet and only ever plays after the
   visitor has clicked or typed, like the rest of the site. */

type WindowWithWebkitAudio = Window &
  typeof globalThis & { webkitAudioContext?: typeof AudioContext };

function note(
  ctx: AudioContext,
  destination: AudioNode,
  frequency: number,
  start: number,
  peak: number,
  decay: number,
  partials: ReadonlyArray<readonly [number, number]> = [
    [1, 1],
    [2, 0.2]
  ]
) {
  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0, start);
  envelope.gain.linearRampToValueAtTime(peak, start + 0.035);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + decay);
  envelope.connect(destination);

  for (const [ratio, amplitude] of partials) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency * ratio, start);
    const gain = ctx.createGain();
    gain.gain.value = amplitude;
    osc.connect(gain);
    gain.connect(envelope);
    osc.start(start);
    osc.stop(start + decay + 0.1);
  }
}

function breath(
  ctx: AudioContext,
  destination: AudioNode,
  start: number,
  duration: number,
  peak: number,
  filterType: BiquadFilterType,
  frequency: number,
  q: number,
  attack = 0.05
) {
  const length = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = frequency;
  filter.Q.value = q;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(peak, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start(start);
  source.stop(start + duration);
}

function lowpass(ctx: AudioContext, frequency: number) {
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = frequency;
  filter.Q.value = 0.3;
  filter.connect(ctx.destination);
  return filter;
}

const signatures: Record<ElementKey, (ctx: AudioContext) => void> = {
  earth(ctx) {
    const now = ctx.currentTime;
    const out = lowpass(ctx, 900);
    // A low C, felt rather than heard, with a soft thud of ground beneath it.
    note(ctx, out, 130.81, now, 0.02, 1.5, [
      [1, 1],
      [2, 0.12]
    ]);
    note(ctx, out, 65.41, now, 0.012, 0.5, [[1, 1]]);
  },
  water(ctx) {
    const now = ctx.currentTime;
    const out = lowpass(ctx, 2200);
    // Two drops, E then G, the second landing a touch higher.
    note(ctx, out, 659.25, now, 0.014, 0.7);
    note(ctx, out, 783.99, now + 0.16, 0.014, 0.9);
    breath(ctx, out, now + 0.05, 0.5, 0.004, "bandpass", 1800, 1.2, 0.15);
  },
  fire(ctx) {
    const now = ctx.currentTime;
    const out = lowpass(ctx, 2600);
    // A crackle of high noise over a warm D.
    breath(ctx, out, now, 0.32, 0.012, "highpass", 1400, 0.5, 0.01);
    breath(ctx, out, now + 0.12, 0.22, 0.008, "highpass", 2200, 0.6, 0.01);
    note(ctx, out, 293.66, now + 0.02, 0.014, 1.1, [
      [1, 1],
      [3, 0.08]
    ]);
  },
  air(ctx) {
    const now = ctx.currentTime;
    const out = lowpass(ctx, 3000);
    // A long breath with a high A riding on it.
    breath(ctx, out, now, 1.1, 0.012, "bandpass", 650, 0.7, 0.45);
    note(ctx, out, 880, now + 0.25, 0.009, 1.2, [[1, 1]]);
  },
  ether(ctx) {
    const now = ctx.currentTime;
    const out = lowpass(ctx, 4000);
    // A high C with a slow shimmer: two voices a hair apart.
    note(ctx, out, 1046.5, now, 0.012, 2.4, [[1, 1]]);
    note(ctx, out, 1049.2, now + 0.03, 0.009, 2.4, [[1, 1]]);
    note(ctx, out, 1567.98, now + 0.4, 0.006, 1.8, [[1, 1]]);
  }
};

/**
 * Plays an element's signature each time the active element changes.
 * Silent until the visitor's first click or key press.
 */
export function useElementalSound(active: ElementKey | null, enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const lastRef = useRef<ElementKey | null>(null);
  const lastAtRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const arm = () => {
      if (ctxRef.current) return;
      const Ctor =
        window.AudioContext ?? (window as WindowWithWebkitAudio).webkitAudioContext;
      if (!Ctor) return;
      ctxRef.current = new Ctor();
    };
    window.addEventListener("click", arm, { once: true });
    window.addEventListener("keydown", arm, { once: true });
    return () => {
      window.removeEventListener("click", arm);
      window.removeEventListener("keydown", arm);
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !active) return;
    if (lastRef.current === null) {
      // First element on the page: no chime for simply arriving.
      lastRef.current = active;
      return;
    }
    if (lastRef.current === active) return;
    lastRef.current = active;

    const ctx = ctxRef.current;
    if (!ctx) return;
    const now = performance.now();
    if (now - lastAtRef.current < 450) return;
    lastAtRef.current = now;

    try {
      if (ctx.state === "suspended") ctx.resume();
      signatures[active](ctx);
    } catch {
      // Audio is a grace note; never let it break the page.
    }
  }, [active, enabled]);
}
