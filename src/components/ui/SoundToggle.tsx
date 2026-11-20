"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/context/SoundContext";
import { motion } from "framer-motion";
import styles from "./SoundToggle.module.css";

export function SoundToggle() {
  const { muted, toggleMute, playSound } = useSound();

  return (
    <motion.button
      onClick={() => {
        toggleMute();
        // Play click sound if we just unmuted
        if (muted) {
          // small timeout to ensure state update if needed, though context is sync, audio ctx might need time
          setTimeout(() => playSound("click"), 50);
        }
      }}
      onMouseEnter={() => playSound("hover")}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={styles.button}
      aria-label={muted ? "Unmute sound" : "Mute sound"}
    >
      {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </motion.button>
  );
}
