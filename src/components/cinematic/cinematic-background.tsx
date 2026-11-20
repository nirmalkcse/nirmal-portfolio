"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useHeroReveal } from "@/context/hero-reveal-context";
import styles from "./cinematic-background.module.css";

const SPOTLIGHT_RADIUS = 400; // half of the 800px spotlight, to centre it on the cursor

export function CinematicBackground() {
  const { isRevealed } = useHeroReveal();

  // Motion values rather than component state: the spotlight used to re-render
  // this whole subtree on every mousemove event, which is pointer-rate React
  // work for something that only ever needed a transform.
  const mouseX = useMotionValue(-SPOTLIGHT_RADIUS);
  const mouseY = useMotionValue(-SPOTLIGHT_RADIUS);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20, mass: 0.5 });

  useEffect(() => {
    if (!isRevealed) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - SPOTLIGHT_RADIUS);
      mouseY.set(e.clientY - SPOTLIGHT_RADIUS);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isRevealed, mouseX, mouseY]);

  return (
    <AnimatePresence>
      {isRevealed && (
        <motion.div
          className={styles.revealedBg}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
        >
          {/* Dynamic mesh gradients for lively background */}
          <div className={styles.meshGradients}>
            <div className={styles.gradient1} />
            <div className={styles.gradient2} />
            <div className={styles.gradient3} />
          </div>

          {/* Silk warp and weft — the satin sheen that replaced the film grain */}
          <div className={styles.livelyElement} />
          <div className={styles.silkCross} />

          {/* Mouse tracking spotlight / microinteraction */}
          <motion.div
            className={styles.spotlight}
            style={{ x: springX, y: springY, willChange: "transform" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
