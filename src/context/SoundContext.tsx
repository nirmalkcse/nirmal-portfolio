"use client";

import React, { createContext, useContext, useState } from "react";

type SoundType = "hover" | "click";

interface SoundContextState {
  muted: boolean;
  toggleMute: () => void;
  playSound: (type: SoundType) => void;
}

const SoundContext = createContext<SoundContextState | undefined>(undefined);

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const [muted, setMuted] = useState(true); // Default muted to respect user preference

  const toggleMute = () => {
    setMuted(prev => !prev);
  };

  const playSound = (type: SoundType) => {
    if (muted) return;

    try {
      if (type === "hover") {
        // We can synthesize a tiny click using Web Audio API for performance
        // instead of loading multiple sound files
        playSynthBeep(400, "sine", 0.05);
      } else if (type === "click") {
        playSynthBeep(600, "triangle", 0.1);
      }
    } catch (e) {
      console.warn("Sound play failed", e);
    }
  };

  return (
    <SoundContext.Provider value={{ muted, toggleMute, playSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};

// Helper for lightweight UI sounds
let audioCtx: AudioContext | null = null;
type WindowWithWebkitAudio = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

function playSynthBeep(freq: number, type: OscillatorType, duration: number) {
  if (typeof window === "undefined") return;
  
  if (!audioCtx) {
    const AudioContextConstructor =
      window.AudioContext ?? (window as WindowWithWebkitAudio).webkitAudioContext;

    if (!AudioContextConstructor) {
      return;
    }

    audioCtx = new AudioContextConstructor();
  }
  
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = freq;
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + duration);
}
