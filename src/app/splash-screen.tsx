"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate, animate } from "framer-motion";
import styles from "./splash.module.css";

type WebAudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

// Ultra-premium magnetic cinematic text reveal
const TextReveal = ({ text }: { text: string }) => {
  return (
    <h1 className={styles.title}>
      {text.split(" ").map((word, wordIndex, array) => (
        <span key={wordIndex} style={{ whiteSpace: "nowrap" }}>
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className={styles.charWrapper}
              initial={{ opacity: 0, y: 40, rotateX: -90, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, rotateZ: 0, scale: 1 }}
              transition={{
                duration: 3.6,
                ease: [0.12, 0.97, 0.16, 1],
                delay: 0.2 + (wordIndex * 5 + charIndex) * 0.05,
              }}
              style={{ display: "inline-block" }}
            >
              {char}
            </motion.span>
          ))}
          {wordIndex !== array.length - 1 && (
            <span
              className={styles.charWrapper}
              style={{ display: "inline-block", whiteSpace: "pre" }}
            >
              {" "}
            </span>
          )}
        </span>
      ))}
    </h1>
  );
};

export function SplashScreen({
  onExitStart,
  onComplete,
  splashState
}: {
  onExitStart?: () => void;
  onComplete?: () => void;
  splashState?: "active" | "exiting" | "complete";
} = {}) {
  const [isExiting, setIsExiting] = useState(false);

  // Mouse Spotlight effect for ultra-premium depth
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 40, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 40, stiffness: 150 });

  // Magnetic button effects
  const btnMouseX = useMotionValue(0);
  const btnMouseY = useMotionValue(0);

  useEffect(() => {
    // Set initial mouse position to center
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (splashState === "active") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; }
  }, [splashState]);

  const spotlightTransform = useMotionTemplate`radial-gradient(circle 800px at ${springX}px ${springY}px, rgba(255, 255, 255, 0.5), transparent 60%)`;

  if (splashState === "complete") return null;

  const handleButtonMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btnMouseX.set(x);
    btnMouseY.set(y);

    // Set CSS variables for the glow
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const playHeavyClick = () => {
    try {
      const AudioContextClass =
        window.AudioContext || (window as WebAudioWindow).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      // A single, pure sine wave for a deep, bassy, and incredibly soft thud
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';

      // Bassy pitch envelope: starts low (150Hz) and drops into sub-bass (40Hz)
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);

      // Volume envelope: soft attack, smooth decay
      // Reduced peak volume (0.3) for a very subtle, soft sound
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Ignore audio errors
    }
  };

  const handleEnter = () => {
    playHeavyClick();
    setIsExiting(true);
    onExitStart?.();

    // Imperatively drive the SVG displacement scale for the WebGL-style dissolve
    const filterElement = document.querySelector('#displacement-map');
    if (filterElement) {
      animate(0, 200, {
        duration: 1.4,
        ease: [0.76, 0, 0.24, 1],
        onUpdate: (latest) => {
          filterElement.setAttribute("scale", latest.toString());
        }
      });
    }

    setTimeout(() => {
      onComplete?.();
    }, 1400); // Wait for the transition to finish before unmounting the splash background
  };

  return (
    <>
      {/* Hidden SVG Filter for Disproportionate Dissolution */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <filter id="dissolve-filter" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
          <feDisplacementMap id="displacement-map" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <AnimatePresence>
        <motion.div
          className={styles.splashContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 1.04 : 1 }}
            transition={{ duration: isExiting ? 2.2 : 1.5, ease: [0.4, 0, 0, 1] }}
            style={{
              pointerEvents: isExiting ? "none" : "auto"
            }}
          >
          {/* Live Creamy Gradient Background */}
          <div className={styles.meshGradient} />

          {/* Interactive Mouse Spotlight */}
          <motion.div className={styles.spotlight} style={{ background: spotlightTransform }} />

          {/* Satin sheen — the silk highlight that replaced the grain */}
          <div className={styles.silkSheen} />

          <div className={styles.contentWrapper}>
            {!isExiting && (
              <>
                <motion.div
                  className={styles.titleArea}
                  layoutId="hero-title-main"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 2, ease: [0.16, 1, 0.3, 1], layout: { type: "spring", bounce: 0, duration: 2.2 } }}
                >
                  <div className={styles.titleWrapper}>
                    <TextReveal text="Nirmal Kumar" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30, rotateX: -45, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  transition={{ delay: 0.8, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  className={styles.buttonContainer}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.div
                    onClick={handleEnter}
                    onMouseMove={handleButtonMouseMove}
                    className={styles.premiumButton}
                    layoutId="hero-primary-cta"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30, layout: { type: "spring", bounce: 0, duration: 2.2 } }}
                    style={{ cursor: "pointer", display: "inline-flex" }}
                  >
                    <div className={styles.buttonGlow} />
                    <span className={styles.buttonText}>View Portfolio</span>
                    <motion.svg
                      className={styles.buttonArrow}
                      width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                  </motion.div>
                </motion.div>
              </>
            )}
          </div>
          </motion.div>
      </AnimatePresence>
    </>
  );
}
