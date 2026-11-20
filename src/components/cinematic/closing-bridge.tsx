"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from "framer-motion";
import { useRef } from "react";
import styles from "./closing-bridge.module.css";

const decisionPath = ["Source", "Logic", "Evidence", "Decision"] as const;

export function ClosingBridge() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 82,
    damping: 24,
    mass: 0.68,
    restDelta: 0.001
  });
  const copyY = useTransform(progress, [0.08, 0.45, 0.88], [34, 0, -16]);
  const copyOpacity = useTransform(progress, [0.04, 0.28, 0.92], [0.32, 1, 0.8]);
  const lineScale = useTransform(progress, [0.14, 0.72], [0, 1]);
  const travelerX = useTransform(progress, [0.14, 0.72], ["0%", "100%"]);

  return (
    <section className={styles.bridge} ref={sectionRef}>
      <span aria-hidden="true" className={styles.atmosphere} />

      <motion.div
        className={styles.inner}
        style={
          prefersReducedMotion
            ? { opacity: 1, y: 0 }
            : { opacity: copyOpacity, y: copyY }
        }
      >
        <div className={styles.intro}>
          <p className={styles.eyebrow}>
            <span>Closing principle</span>
            <span aria-hidden="true">04</span>
          </p>
          <p className={styles.supportingCopy}>
            The work is complete when its logic can be followed, challenged,
            and trusted.
          </p>
        </div>

        <h2 className={styles.statement}>
          Data only matters
          <em>when the next decision can be trusted.</em>
        </h2>

        <div className={styles.decisionRail} aria-label="Path from source to decision">
          <div aria-hidden="true" className={styles.track}>
            <motion.span
              className={styles.trackProgress}
              style={prefersReducedMotion ? { scaleX: 1 } : { scaleX: lineScale }}
            />
            <motion.span
              className={styles.traveler}
              style={prefersReducedMotion ? { left: "100%" } : { left: travelerX }}
            />
          </div>

          <ol>
            {decisionPath.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
        </div>
      </motion.div>
    </section>
  );
}
